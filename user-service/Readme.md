# 🧩 Node.js Clean Architecture Template

A simple and powerful Node.js project template with a clean folder structure and Docker support. Ideal for building scalable and maintainable REST APIs with MongoDB.

---

## 🚀 Why Use This Template?

- Clean and scalable folder architecture
- Easy to understand and extend
- Real-world examples: User ↔ Posts (1-to-many)
- Docker-ready for fast deployment
- Includes pagination, search, and MongoDB indexing
- Great for learning or starting a new project

---

## 📁 Folder Structure

- `/src` – Main source directory
  - `/api` – API routes and logic
    - `/auth`
      - `auth.route.js` – Route definitions
      - `auth.controller.js` – Request/response logic
      - `auth.model.js` – Mongoose schema
      - `auth.service.js` – Business logic
  - `/jobs` – Background jobs or cron tasks
  - `/services` – External service helpers (e.g., email, storage)
  - `/utils` – Utility/helper functions
  - `/validators` – Input validation schemas
- `app.js` – Express app configuration
- `index.js` – Entry point of the server
- `package.json` – Project metadata and dependencies
- `Dockerfile` – Docker configuration for containerization



---

## 🔐 Features

- ✅ User Registration
- ✅ User Login (JWT Auth)
- ✅ Create Post (1-to-many with User)
- ✅ Get User with Posts using MongoDB Aggregation
- ✅ Get Post with User using Mongoose Populate
- ✅ Pagination and Search on APIs
- ✅ Docker Support for Easy Deployment

---

## 🧪 Available APIs

### 🔸 Auth Routes
- `POST /api/auth/register` → Register a user
- `POST /api/auth/login` → Login and receive JWT token

### 🔸 Post Routes
- `POST /api/posts` → Create new post
- `GET /api/users` → Get users with their posts
- `GET /api/posts` → Get posts with user data (populate)
- Supports: `?page=1&limit=10&search=keyword`

---

## 🐳 Docker Setup

### 📄 Dockerfile

```dockerfile
# Use an official Node.js image as the base image
FROM node:20

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install npm dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port on which the Node.js application will run
EXPOSE 8000

# Command to start the Node.js application
CMD ["npm", "start"]
```

## 🚀 Docker Commands

### 🔧 Step 1: Build the Docker image
```bash
docker build -t my-node-app . 
```

### 🏃 Step 2: Run the container

```bash
docker run -p 8000:8000 my-node-app
```


## 💡 Use Cases

- 🚀 Learning Node.js API development  
- 🛠️ Building production-ready REST APIs  
- 📊 Practicing MongoDB aggregation and population  
- 🧱 Understanding MVC pattern and modular folder structure  
- 🐳 Deploying apps using Docker  

---

## 🙌 Contributing

Feel free to **fork**, **use**, and **improve** this project.  
Pull requests are always welcome!


## 🔎 Keywords
`nodejs-template` &nbsp;&nbsp; `nodejs-best-practices` &nbsp;&nbsp; `clean-architecture` &nbsp;&nbsp; `docker-node-app` &nbsp;&nbsp; `mongodb-aggregation` &nbsp;&nbsp; `user-post-api` &nbsp;&nbsp; `rest-api-template`
