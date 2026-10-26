
 // src/services/auth.service.ts
import { prisma } from '../lib/prisma';
import { hashPassword, verifyPassword } from '../lib/password';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../lib/tokens';
import { appEvents } from '../lib/events';
import { AUTH_EVENTS } from '../events/auth.events';
import crypto from 'node:crypto';

// ── Register ────────────────────────────────────────────────

export async function register(data: {
  name: string;
  email: string;
  password: string;
}) {
  const email = data.email.toLowerCase().trim();

  // Check whether the user already exists.
  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    throw new Error('Email already registered');
  }

  const passwordHash = await hashPassword(data.password);

  const user = await prisma.user.create({
  data: {
    name: data.name,
    email: data.email,
    passwordHash,
  },
});

  // Notify listeners that a user has registered.
  appEvents.emit(AUTH_EVENTS.USER_REGISTERED, {
    id: user.id,
    email: user.email,
    tier: user.tier,
  });

  // Never return the password hash.
  return {
    id: user.id,
    email: user.email,
    tier: user.tier,
  };
}

// ── Login ───────────────────────────────────────────────────

export async function login(data: {
  email: string;
  password: string;
  deviceInfo?: string;
}) {
  const email = data.email.toLowerCase().trim();

  const user = await prisma.user.findUnique({
    where: { email },
  });

  // Use the same error for missing and inactive users.
  if (!user || !user.isActive) {
    appEvents.emit(AUTH_EVENTS.LOGIN_FAILED, {
      email,
      deviceInfo: data.deviceInfo,
      reason: 'user_not_found_or_inactive',
    });

    throw new Error('Invalid credentials');
  }

  const valid = await verifyPassword(
    data.password,
    user.passwordHash,
  );

  if (!valid) {
    appEvents.emit(AUTH_EVENTS.LOGIN_FAILED, {
      email: user.email,
      deviceInfo: data.deviceInfo,
      reason: 'wrong_password',
    });

    throw new Error('Invalid credentials');
  }

  // Generate access and refresh tokens.
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // Store only a hash of the refresh token.
  const tokenHash = crypto
    .createHash('sha256')
    .update(refreshToken)
    .digest('hex');

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      token: tokenHash,
      expiresAt: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000,
      ),
    },
  });

  // Notify listeners after token storage succeeds.
  appEvents.emit(AUTH_EVENTS.USER_LOGGED_IN, {
    userId: user.id,
    deviceInfo: data.deviceInfo,
  });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      tier: user.tier,
    },
  };
}

// ── Refresh ─────────────────────────────────────────────────

export async function refresh(rawRefreshToken: string) {
  // Verify the JWT signature and expiration.
  let payload;

  try {
    payload = verifyRefreshToken(rawRefreshToken);
  } catch {
    throw new Error('Invalid refresh token');
  }

  if (payload.type !== 'refresh') {
    throw new Error('Invalid token type');
  }

  // Hash the supplied token to look it up in the database.
  const tokenHash = crypto
    .createHash('sha256')
    .update(rawRefreshToken)
    .digest('hex');

  const stored = await prisma.refreshToken.findUnique({
    where: { token: tokenHash },
  });

  if (!stored || stored.expiresAt < new Date()) {
    throw new Error('Refresh token expired or revoked');
  }

  // Confirm that the associated user still exists and is active.
  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
  });

  if (!user || !user.isActive) {
    throw new Error('User not found or inactive');
  }

  // Rotate: remove the old token.
  await prisma.refreshToken.delete({
    where: { token: tokenHash },
  });

  // Generate replacement tokens.
  const newAccessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user);

  const newHash = crypto
    .createHash('sha256')
    .update(newRefreshToken)
    .digest('hex');

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      token: newHash,
      expiresAt: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000,
      ),
    },
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
}

// ── Logout ──────────────────────────────────────────────────

export async function logout(rawRefreshToken: string) {
  const tokenHash = crypto
    .createHash('sha256')
    .update(rawRefreshToken)
    .digest('hex');

  // If the token is already absent, logout still succeeds.
  await prisma.refreshToken.deleteMany({
    where: { token: tokenHash },
  });
}
