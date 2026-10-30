
# 💬 DocuChat – AI-Powered Document Q&A System

**Ask questions. Understand documents. Get answers.**

DocuChat is an AI-powered document question-and-answer system designed to help users interact with their documents through natural language conversations.

The project is being developed with a modern backend architecture using Node.js, Express.js, TypeScript, and PostgreSQL. It is designed to evolve into an intelligent document assistant with document processing, Retrieval-Augmented Generation (RAG), and AI-powered conversational capabilities.

---

## 🚀 Project Overview

Managing and understanding large documents can be time-consuming. DocuChat aims to simplify this process by allowing users to upload documents, ask questions, and receive relevant answers through an interactive conversational interface.

The goal is to build a scalable backend system that combines document management, secure authentication, conversational APIs, and AI integration.

## ✨ Key Features

### Implemented
- 🔐 **User Authentication:** Secure registration and login using JWT.
- 👤 **User Management:** User-based authentication and access control.
- 💬 **Conversation API:** Create and retrieve conversations.
- 🛡️ **Request Validation:** Input validation using Zod.
- ⚠️ **Centralized Error Handling:** Consistent API error responses.
- 📚 **API Documentation:** Interactive Swagger/OpenAPI documentation.
- 🗄️ **Database Management:** PostgreSQL integration using Prisma ORM.

### Planned
- 📄 Document upload and management.
- 🧠 AI-powered document question answering.
- 🔍 Retrieval-Augmented Generation (RAG).
- 💡 Context-aware conversational responses.
- 📊 Usage tracking and monitoring.
- 🔄 Conversation history and document-based chat.

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| Node.js | Backend runtime |
| Express.js | REST API framework |
| TypeScript | Type-safe development |
| PostgreSQL | Relational database |
| Prisma ORM | Database access and management |
| JWT | Authentication |
| Zod | Request validation |
| Multer | File upload handling |
| Swagger / OpenAPI | API documentation |
| bcryptjs | Password hashing |

## 🏗️ Project Architecture

The application follows a modular backend architecture that separates routing, business logic, validation, and database operations.

```text
docuchart/
│
├── src/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── documents.ts
│   │   └── conversations.ts
│   │
│   ├── services/
│   │   └── conversation.service.ts
│   │
│   ├── lib/
│   │   └── prisma.ts
│   │
│   ├── app.ts
│   └── ...
│
├── prisma/
│   └── schema.prisma
│
├── server.ts
├── package.json
└── README.md
```

## ⚙️ Getting Started

Follow these instructions to run DocuChat locally.

### 1. Clone the repository

```bash
git clone https://github.com/08063322110/docuchart.git
```

### 2. Navigate into the project

```bash
cd docuchart
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file in the project root.

```env
PORT=3000
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/docuchat"
JWT_SECRET="your_secure_secret"
```

Replace the database credentials with your local PostgreSQL credentials and configure any additional environment variables required by the application.

### 5. Run database migrations

```bash
npx prisma migrate dev
```

### 6. Start the development server

```bash
npm run dev
```

The API should be available at:

```text
http://localhost:3000
```

## 📖 API Documentation

DocuChat uses Swagger UI to provide interactive API documentation.

Once the development server is running, visit:

**http://localhost:3000/api-docs**

The documentation allows developers to explore available endpoints, inspect request and response structures, and test API operations.

## 🔌 API Endpoints

The API is organized into versioned REST endpoints.

Base URL:

```text
/api/v1
```

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Authenticate a user |
| GET | `/conversations` | Retrieve conversations |
| POST | `/conversations` | Create a conversation |
| GET | `/documents` | Document endpoint |

See Swagger documentation for the available request parameters, authentication requirements, and response formats.

## 🧠 What I'm Building

DocuChat is also a practical learning project focused on backend engineering and AI integration.

Through this project, I'm exploring and implementing:

- RESTful API development.
- Backend architecture and separation of concerns.
- Authentication and authorization.
- Database design and relationships.
- Request validation and error handling.
- AI integration and LLM-powered applications.
- Retrieval-Augmented Generation (RAG).
- Scalable backend services.

## 🗺️ Development Roadmap

- [x] Project initialization and backend configuration.
- [x] Database setup with Prisma and PostgreSQL.
- [x] User authentication.
- [x] Request validation and centralized error handling.
- [x] Swagger API documentation.
- [x] Initial conversation API and service layer.
- [ ] Complete conversation management.
- [ ] Document upload and processing.
- [ ] Document text extraction and chunking.
- [ ] Vector database integration.
- [ ] RAG pipeline implementation.
- [ ] AI-powered question answering.
- [ ] Testing and deployment.

## 👨‍💻 Developer

**Michael Ettah**

Backend Developer | AI Engineering Enthusiast

Interested in building scalable backend systems, intelligent applications, AI-powered APIs, and automation solutions.

- GitHub: [@08063322110](https://github.com/08063322110)
- LinkedIn: [Michael Ettah](https://www.linkedin.com/in/michael-ettah-928b80255/)

---

⭐ If you find this project interesting, feel free to explore the repository and follow its development.

**DocuChat – Making documents easier to understand through AI.**