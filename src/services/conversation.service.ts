import { prisma } from '../lib/prisma';

export async function listConversations(userId: string) {
  return prisma.conversation.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
  });
}

export async function createConversation(input: {
  userId: string;
  title?: string;
}) {
  const title = input.title?.trim() || 'New conversation';

  return prisma.conversation.create({
    data: {
      userId: input.userId,
      title,
    },
  });
}