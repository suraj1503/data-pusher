# 🚀 Webhook Delivery System

A secure, rate-limited webhook system built with **Node.js** and **Express**, featuring custom error handling and secure token management. Ideal for testing webhook delivery logic via `webhook.site`.

---

## 🎯 Objective

The goal of this project is to simulate a webhook system that allows:
- Users to register and securely receive a token
- Add destinations (URLs) where events will be delivered
- Trigger events to these destinations
- Implement rate-limiting, hide tokens, and ensure error safety

---

## 🛠️ Tech Stack

- **Node.js** + **Express.js**
- **express-rate-limit**
- **Postman** (API testing)
- **webhook.site** (test endpoint)
- **Custom middleware** for token validation and error handling

---

## ✨ Features

- ✅ Secure token generation (hidden from all responses)
- 🚫 Rate-limited requests (max 5 requests/minute per IP)
- 🧩 Centralized custom error handling
- 📤 Sends POST events to registered destinations
- 📦 Sample Postman collection for quick testing

---

## 📦 Setup Instructions

```bash
git clone https://github.com/surajpal1503/data-pusher.git
cd server
npm install
npm start
