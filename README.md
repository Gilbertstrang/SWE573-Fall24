# SWE573-Fall24
# What's This? A website for identifying mysterious objects!

### A web application repository for the **Software Development Practise** course at Boğaziçi University.

Welcome to **What's This?** ! It is a community platform for identifying mysterious, antique, or unknown objects! Users can share items with detailed descriptions, images, and tags. The community works together to comment, analyze, and "solve" these objects by suggesting what they could be.

---

## 📝 Overview

This project aims to create a forum-like website where users can:

1. **Post unidentified items** with detailed descriptions and images.
2. **Collaborate** with others by commenting on posts.
3. **Solve** the mystery behind an item.
4. **Database** the items.
5. **Wikidata integration** for better descriptive.


This project uses **Spring Boot** and **PostgreSQL** for the backend and **React** and **Next.Js** for the frontend.

---

## 😳 Tech Stack

###  Backend
- **Spring Boot**
- **PostgreSQL**
- **JWT Authentication**
- **Maven**

### Frontend
- **React**
- **Next.JS**
- **Node**
- **Axios** for API calls

### Deployment & Tools
- **Docker**
- **Docker Compose**
- **Google Cloud Platform**
- **Shell Scripting**

---

## 📦 Installation and Deployment

To deploy the project locally or on a VM, follow the steps below.

### Prerequisites
- **Java** for backend, **Javascript** frontend.
- **Docker** and **Docker Compose** installed.
- **Git** installed.
- **Bash** compatible environment (for deployment script).
- **Python** if using Google Cloud.

---

### 💻 Local Deployment

Clone the repository:
```bash
git clone https://github.com/Gilbertstrang/SWE573-Fall24.git
cd SWE573-Fall24
```

1. Create an **environment file**:
   - Copy the `env.properties.template` and update values (database, server settings, etc.).
   ```bash
   cp env.properties.template env.properties
   ```

2. Start the application using Docker Compose:
   ```bash
   docker-compose -f docker-compose.yml up -d --build
   ```

3. Visit the following URLs:
   - Backend: `http://localhost:8080`
   - Frontend: `http://localhost:3000`

---

### ☁️ Cloud Deployment (Google Cloud)

I used  **Google Cloud VM** deployment, so a ready-to-use script is provided to automate setup:

#### **Deployment Script**: `deploy.sh`

The script handles:
- Installing dependencies (Docker, Docker Compose).
- Cleaning old containers and images.
- Fetching and setting the external IP of cloud. (VM_IP)
- Creates env.properties from env.properties.template.
- Starting services with Docker Compose.
- Health checks for backend and frontend services.

---

#### Run the Deployment Script
1. Upload the project folder to your VM.
2. Connect to your VM using SSH.
3. Run the deployment script:
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```
4. If everything is successful, access the services:
   - Backend: `http://<VM_IP>:8080`
   - Frontend: `http://<VM_IP>:3000`

---

## 📂 Directory Structure
```
SWE573-Fall24/
|-- src /                 # Spring Boot backend
|   |-- java/             # Backend source code
|   
|
|-- whatsthis-frontend/    # React.js frontend
|     |-- src/             # Frontend source code
|     |-- dockerfile       # Frontend dockerfile
|
|-- uploads/              # Uploaded files directory (auto-created if its not there)
|
|-- docker-compose.yml    # Base Docker Compose file
|-- docker-compose.prod.yml # Production overrides for Docker Compose
|-- deploy.sh             # Deployment script for cloud
|-- env.properties.template # Template for environment variables
|-- pom.xml               # Maven configuration
|-- Dockerfile            # Dockerfile for backend
|
|-- README.md             # Project documentation
```

---

## 😎Key Features

- **Detailed Item Descriptions**: Users can provide comprehensive details including material, size, brand, weight, color, and more.
- **Image Upload**: Uploaded images are stored and served via `/uploads` endpoint.
- **Collaborative Community**: Users can comment on and solve item mysteries.
- **Wikidata Tags**: Enrich posts with structured tags from Wikidata.
- **Health Monitoring**: Automated health checks for backend and frontend.
- **Dockerized Application**: Simplified setup and deployment with Docker.
- **Cloud Ready**: Easily deployable on Google Cloud Platform.

---

## 🛠 Some notes on backend

### Backend
- **API Endpoints**:
   - `POST /api/uploads/images`: Upload images and return URLs.
   - `GET /api/uploads/{filename}`: Serve uploaded images.
   - `GET /api/posts`: Fetch paginated posts.
   - `POST /api/posts`: Create a new post.
   - `GET /api/posts/{id}`: Fetch post with id.
   - `GET /api/posts/user/{userId}`: Fetch posts of user.
   - `POST /api/users/login`: User login.
   - `POST /api/users/signup`: User signup.
   - `GET /api/users/{id}`: Fetch user with id.
   - `POST /api/comments`: Create new comment.
   - `GET /api/comments/{id}`: Fetch comment with id.
   - `GET /api/posts/{id}/comments`: Fetch post comments.
   - `GET /api/comments/user/ {userId}`: Fetch comments of user.
     

### Environment Variables
The application uses an `env.properties` file for environment-specific configuration. Make sure to create this file using the provided template.

Example:
```properties
NEXT_PUBLIC_API_URL=http://${VM_IP}:8080/api
VM_IP=${VM_IP}
DB_DATABASE= db
DB_USER= username
DB_PASSWORD= 1234

jwt.secret= 1234
```

---

## 🔗 Useful Commands

**Build and run the project**:
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

**View logs**:
```bash
docker-compose logs -f backend frontend
```

**Stop containers**:
```bash
docker-compose down
```

---

## 💀 Known Issues

- Sometimes env.properties does not copy from template or script skips the step.
- Script can give blank VM_IP. (If that happense please export it on your own)
- Refreshing the website logs out the user.
- Too many replies will result with tiny comment boxes.
- Cannot upvote comment or upload images to comments. Although the base code there. (Discontinued feature)
- Wikidata API tag suggestions sometimes throw random suggestions.
- Script checks for api/health, but this is not implemented.




