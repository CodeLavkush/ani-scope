# 🎬 AniScope Backend

A production-ready backend system for an anime-inspired movie platform featuring secure authentication, asynchronous image processing, and CDN-based media delivery.

---

## 📌 Overview

AniScope backend is designed with scalability and performance in mind. It provides:

* OTP-based user authentication with secure session handling
* Full CRUD operations for movie resources
* Asynchronous image processing using background workers
* Optimized media delivery via CDN
* Clean separation of concerns using microservice architecture

---

## 🏗️ Architecture

```
Client (Browser)
    ↓
Node.js API (Express)
    ↓
Auth Layer (JWT via HTTP-only Cookies)
    ↓
Validation + NSFW Filtering
    ↓
Google Cloud Storage (Master Image)
    ↓
Queue (BullMQ + Redis)
    ↓
Worker Service
    ↓
Python Image Processing Service
    ↓
Google Cloud Storage (Variants)
    ↓
Database (CDN URLs)
    ↓
Google Cloud CDN
    ↓
Client
```

---

## 🧠 Tech Stack

* **Runtime:** Node.js (Express)
* **Worker Queue:** BullMQ + Redis
* **Image Processing:** Python (Pillow / OpenCV)
* **Storage & CDN:** Google Cloud Storage + Cloud CDN
* **Authentication:** JWT (HTTP-only cookies)
* **Database:** PostgreSQL / MongoDB (configurable)

---

## 🔐 Authentication

Authentication is implemented using **JWT stored in HTTP-only cookies**.

### Token Strategy

| Token         | Expiry | Storage               |
| ------------- | ------ | --------------------- |
| Access Token  | 15 min | HTTP-only cookie      |
| Refresh Token | 7 days | HTTP-only cookie + DB |

### Flow

1. User registers and receives OTP
2. OTP verification activates account
3. Login issues access + refresh tokens
4. Tokens are automatically sent via cookies
5. Protected routes validate access token
6. Refresh endpoint rotates access tokens

---

## 📡 API Reference

### 🔐 Auth Endpoints

#### Register

`POST /auth/register`

#### Verify OTP

`POST /auth/verify-otp`

#### Login

`POST /auth/login`

#### Refresh Token

`POST /auth/refresh`

#### Logout

`POST /auth/logout`

---

### 🎬 Movie Endpoints

#### Create Movie (Protected)

`POST /movies`

#### Get Movie

`GET /movies/:id`

#### Get All Movies

`GET /movies`

#### Update Movie (Protected)

`PUT /movies/:id`

#### Delete Movie (Protected)

`DELETE /movies/:id`

---

## 🖼️ Image Processing Pipeline

The system uses an asynchronous pipeline to ensure low API latency and efficient processing.

### Flow

1. User uploads image
2. Backend validates file (type, size, dimensions)
3. NSFW detection is performed
4. Original image is stored in Google Cloud Storage
5. Processing job is pushed to queue
6. Worker consumes job and calls Python service
7. Image variants are generated (multiple sizes)
8. Variants are stored in cloud storage
9. CDN URLs are saved in the database

---

## 🌍 CDN Delivery

Images are delivered via Google Cloud CDN.

### Behavior

* First request → CDN fetches from origin (GCS)
* Subsequent requests → served from cache
* Reduces latency and origin load

---

## 🗃️ Data Models

### User

* username
* email
* password (hashed)
* isVerified
* refreshToken
* otp
* otpExpiry

---

### Movie

* title
* description
* releaseYear
* genre
* tags[]
* poster (image variants)
* user (owner reference)

---

## 🔄 Background Jobs

* Image processing handled via BullMQ
* Retry strategy: 3 attempts with backoff
* Jobs are removed after completion

---

## 🔒 Security Considerations

* Passwords hashed using bcrypt
* Tokens stored in HTTP-only cookies
* OTP expiration enforced
* Input validation on all endpoints
* NSFW filtering for uploaded content

---

## ⚡ Performance Considerations

* Non-blocking image processing via queue
* CDN caching for global delivery
* Optimized image formats (WebP/AVIF)
* Minimal DB reads using precomputed URLs

---

## ⚠️ Edge Cases

* Expired or invalid OTP
* Token expiration / invalid refresh token
* Image processing failures
* Duplicate uploads
* NSFW false positives

---

## 🧩 Future Improvements

* OAuth (Google, GitHub)
* Rate limiting and abuse protection
* Image versioning and cache invalidation
* Video support
* AI-based tagging and recommendations

---
