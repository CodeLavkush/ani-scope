# 🎬 Movie Showcase App

A modern full-stack movie showcase platform featuring smooth animations, OTP-based authentication, and scalable backend services.

---

## 🚀 Features

* 🔐 OTP-based authentication (email)
* 🎞️ Browse and submit movies
* ♾️ Animated infinite movie scroll (GSAP)
* 🧵 Background job processing with **BullMQ**
* ⚡ Redis-powered queues (Redis Cloud supported)
* ☁️ Image storage using **Supabase Object Storage**
* 📩 Email delivery via **Mailtrap**
* 🖼️ Image upload with validation
* 📱 Fully responsive design

---

## 🧰 Tech Stack

![React](https://img.shields.io/badge/Frontend-React-blue?logo=react)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green?logo=node.js)
![Express](https://img.shields.io/badge/API-Express-black?logo=express)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-darkgreen?logo=mongodb)
![Redis](https://img.shields.io/badge/Queue-Redis-red?logo=redis)
![BullMQ](https://img.shields.io/badge/Jobs-BullMQ-orange)
![Supabase](https://img.shields.io/badge/Storage-Supabase-3ecf8e?logo=supabase)
![Docker](https://img.shields.io/badge/DevOps-Docker-blue?logo=docker)

---

## ⚙️ Environment Setup

An example environment file is provided:

```
.env.sample
```

Create your own `.env` file based on it and configure:

* Redis (use **Redis Cloud URL**)
* Supabase credentials
* Mailtrap SMTP credentials

---

## 🐳 Run the Project

The project already includes a Docker Compose configuration.

### ▶️ Start the application

```bash
docker-compose up --build
```

---

### ▶️ Run in background

```bash
docker-compose up -d --build
```

---

### 🛑 Stop the application

```bash
docker-compose down
```

---

## 🔴 Redis Setup

This project uses **Redis Cloud** for queue processing.

* Create a free Redis instance
* Copy the connection URL
* Add it to your `.env`

---

## ☁️ Supabase Storage

Used for storing movie images.

* Create a Supabase project
* Configure a storage bucket
* Add credentials in `.env`

---

## 📩 Mailtrap

Used for OTP email testing.

* Add Mailtrap SMTP credentials in `.env`
* All authentication emails are routed through Mailtrap

---

## 📝 Movie Submission Guidelines

When submitting a movie:

* 🖼️ Image resolution must be **1920 × 1080**
* 📦 Image size must be **under 2MB**
* 🏷️ Add relevant tags (e.g., Action, Drama, Sci-Fi)
* 📝 Provide a clear and meaningful description in 200 words

---

## ⚙️ Background Jobs

* Powered by **BullMQ**
* Uses Redis for:

  * OTP email queue
  * Async processing

---

## 📱 Responsiveness

* Fully responsive across:

  * Mobile
  * Tablet
  * Desktop

---

## 📌 Notes

* Ensure `.env` is correctly configured before running
* Redis connection is required for authentication and queues
* Supabase bucket must allow proper access
* Mailtrap is used for development/testing emails only

---

## 🚀 Future Improvements

* 🔍 Advanced search & filters
* ❤️ Favorites / watchlist
* 🌐 Public movie sharing
* ⚡ Performance optimizations

---

## 👨‍💻 Author

Built with ❤️ using modern web technologies.
