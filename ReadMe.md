# Chatbot Project

This repository contains the code for a chatbot application, including a **frontend** (mobile app) and a **backend** (Laravel API). Follow the steps below to set up and run the project locally.

---

## Prerequisites

Ensure you have the following installed on your system:

- **Node.js** (v18 or later)
- **npm** or **yarn**
- **PHP** (v8.2 or later)
- **Composer**
- **PostgreSQL**
- **Expo CLI** (for the mobile app)

---

## Backend Setup (Laravel API)

1. **Navigate to the backend directory**:
   ```bash
   cd chatbot-backend
   ```
2. **Install PHP dependencies**:
   ```bash
   composer install
   ```
3. **Add your database configurations to .env**

4. **Run Database Migration**:
   ```bash
   php artisan migrate
   ```
5. **Change the localhost APP_URL value in .env to your IP address**
6. **Link your storage to the public folder**:
   ```bash
   php artisan storage:link
   ```
7. **Populate the chunks table with the traffic law**:
   ```bash
   php artisan app:chunk-data
   ```
8. **Start the server**:
   ```bash
   php artisan solo
   ```

---

## Frontend Setup (React Native)

1. **Navigate to the mobile app directory**:
   ```bash
   cd chatbot-mobile
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Change the value of apiUrl inside app.json to be the same as the APP_URL in your backend**
4. **Start the mobile app**:
   ```bash
   npm run dev
   ```
