# Blog

This project is a backend application built with Express.js and MongoDB using Mongoose. It provides endpoints for managing users and posts through a RESTful API, with JWT authentication.

## Features

- User Management:
  - Create, Read, Update, and Delete (CRUD) operations for users.
  - User authentication using bcrypt for password hashing and JWT for token-based authentication.

- Post Management:
  - CRUD operations for posts.
  - Posts are associated with users through MongoDB references.

- Soft Deletion:
  - Soft deletion implemented for both users and posts using a `deletedAt` field.

## Requirements

- Node.js
- MongoDB
- pnpm

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/l0cass/blog-crud.git
   cd blog-crud
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up environment variables:
   - Create a `.env` file based on `.env.example` and provide values for `PORT` and `MONGO_URI`.

## Running the Application

```bash
pnpm start
```

The server will start running on `http://localhost:3000` by default. You can change the port in the `.env` file.

## API Endpoints

### Users

- `GET /users`: Get all users.
- `GET /users/:id`: Get user by ID.
- `POST /users/auth/create`: Create a new user (requires `email`, `username`, `password`).
- `POST /users/access-user`: Authenticate and generate JWT token (requires `email`, `password`).
- `DELETE /users/auth/delete`: Delete a user (requires `email`, `password`).

### Posts

- `GET /posts`: Get all posts.
- `GET /posts/:id`: Get posts by user ID.
- `POST /posts/create`: Create a new post (requires `title`, `article`).
- `DELETE /posts/delete`: Delete a post (requires `id`).

## License

This project is licensed under the MIT License - see the LICENSE file for details.

Feel free to adjust the content as per your specific project details. This template should suit your project structure using `pnpm` for dependency management.
