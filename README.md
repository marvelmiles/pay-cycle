<div align="center">

<img src="https://img.shields.io/badge/PayCycle-Payment%20Platform-2563EB?style=for-the-badge&logo=lightning&logoColor=white" alt="PayCycle" />

# PayCycle

**The fastest way for Nigerian businesses to create checkout links, collect payments, and manage billing — all in one place.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-pay--cycle.netlify.app-2563EB?style=flat-square&logo=netlify)](https://pay-cycle.netlify.app/)
[![Backend API](https://img.shields.io/badge/Backend%20API-Render-00C7B7?style=flat-square&logo=render)](https://pay-cycle-backend.onrender.com)
[![Frontend Repo](https://img.shields.io/badge/Frontend-GitHub-181717?style=flat-square&logo=github)](https://github.com/marvelmiles/pay-cycle)
[![Backend Repo](https://img.shields.io/badge/Backend-GitHub-181717?style=flat-square&logo=github)](https://github.com/marvelmiles/pay-cycle-backend)
[![Built with Interswitch](https://img.shields.io/badge/Payments-Interswitch-003B71?style=flat-square)](https://developer.interswitchgroup.com)

</div>

---

## 📖 Overview

PayCycle is a business billing and payment management platform built for the Nigerian market. It allows business owners to create shareable checkout payment links for their products and collect one-time payments — without writing a single line of code. Developers can also integrate via API and SDK for full-code experiences.

Built on top of **Interswitch** as the payment gateway, PayCycle handles the full payment lifecycle: from creating a product, generating a checkout link, collecting card details with OTP verification, recording transactions, and managing payouts — all within a single, branded dashboard.

---

## ✨ Features

| Feature                     | Description                                                                   |
| --------------------------- | ----------------------------------------------------------------------------- |
| 🔗 **Payment Links**        | Generate shareable checkout URLs tied to a product — no code required         |
| 💳 **Checkout Page**        | Branded 3-step payment flow: customer details → card entry → OTP verification |
| 📦 **Product Management**   | Create one-time and recurring billing plans with features and trial days      |
| 👥 **Customer Management**  | Auto-creates customer profiles on payment; track lifetime value               |
| 📊 **Transaction Tracking** | Full transaction history with status, gateway ref, and detail view            |
| 💰 **Wallet & Payouts**     | Available balance, withdrawal requests, payout account management             |
| 📈 **Analytics Dashboard**  | Revenue charts, MRR, churn rate, payment success rate                         |
| 🔑 **API Tokens**           | Generate live/test API tokens for SDK integration                             |
| 🔐 **JWT Authentication**   | Secure login, registration, and refresh token support                         |
| 🏦 **Nigerian Banks**       | Full list of Nigerian banks for payout account setup                          |

---

## ⚠️ Limitations & Blockers

**NOTE**: Issues and blocker was escalated on the slack group. The issues below are issues the support team couldn't attend to before submittion.

**Card Payment APi**

- Card api endpoint (https://qa.interswitchng.com/api/v3/purchases) isn't stable as of 3PM deadline day. The endpoint returns 500 server error which will cause the checkout payment flow to show an error message. My team can't refactor or pivot from what we have implemented and hope the support team fix this error before judges review.

**Subscription management UI was not shipped** due to the following blockers encountered during development:

- The Interswitch API did not expose endpoints for **pausing**, **resuming**, and **cancelling** subscriptions at the time of development.
- The recurring charges feature was implemented and tested on the **backend**, but could not be integrated end-to-end on the frontend without those gateway endpoints.
- endpint to charge recurring payment throws **server error** https://qa.interswitchng.com/api/v3/purchases/recurrents
- As a result, all subscription-related UI (subscription list, cancel/pause/resume actions) was removed from the shipped version to avoid presenting broken features.

**The following is fully functional:**

- One-time payment checkout via payment links ✅
- Recurring product creation (backend) ✅
- Transaction recording and tracking ✅
- Wallet and payout management ✅

---

## 🖥️ Tech Stack

### Frontend

| Technology                                                                   | Purpose                             |
| ---------------------------------------------------------------------------- | ----------------------------------- |
| [React 18](https://react.dev) + [TypeScript](https://www.typescriptlang.org) | UI framework                        |
| [Vite](https://vitejs.dev)                                                   | Build tool & dev server             |
| [Zustand](https://github.com/pmndrs/zustand)                                 | Client state management             |
| [TanStack React Query](https://tanstack.com/query)                           | Server state & data fetching        |
| [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev)      | Form handling & validation          |
| [Axios](https://axios-http.com)                                              | HTTP client with auto token refresh |
| [TailwindCSS](https://tailwindcss.com)                                       | Utility-first styling               |
| [Recharts](https://recharts.org)                                             | Analytics charts                    |
| [Lucide React](https://lucide.dev)                                           | Icon library                        |
| [Interswitch Inline SDK](https://developer.interswitchgroup.com)             | Payment gateway                     |

### Backend

| Technology           | Purpose                 |
| -------------------- | ----------------------- |
| Node.js + TypeScript | Runtime & type safety   |
| Express              | HTTP server & routing   |
| MongoDB + Mongoose   | Database & ODM          |
| Redis                | Caching & rate limiting |
| JWT                  | Authentication          |

---

## 🚀 Live Links

| Resource           | URL                                                                                          |
| ------------------ | -------------------------------------------------------------------------------------------- |
| 🌐 Frontend (Live) | [https://pay-cycle.netlify.app](https://pay-cycle.netlify.app/)                              |
| ⚙️ Backend API     | [https://pay-cycle-backend.onrender.com](https://pay-cycle-backend.onrender.com)             |
| 📁 Frontend Repo   | [github.com/marvelmiles/pay-cycle](https://github.com/marvelmiles/pay-cycle)                 |
| 📁 Backend Repo    | [github.com/marvelmiles/pay-cycle-backend](https://github.com/marvelmiles/pay-cycle-backend) |

---

## ⚙️ Installation & Setup

### Prerequisites

- [Node.js](https://nodejs.org/) >= 18
- [pnpm](https://pnpm.io/) >= 8 — install globally if you haven't:

```bash
npm install -g pnpm
```

---

### 1. Clone the Repository

```bash
# Clone the frontend
git clone https://github.com/marvelmiles/pay-cycle.git
cd pay-cycle

# Clone the backend (separate repo)
git clone https://github.com/marvelmiles/pay-cycle-backend.git
cd pay-cycle-backend
```

---

### 2. Frontend Setup

```bash
cd pay-cycle

# Install dependencies
pnpm install

# Copy the environment file
cp .env.example .env
```

Open `.env` and fill in your values:

```env
# Interswitch Payment Gateway
VITE_INTERSWITCH_CLIENT_ID=""
VITE_INTERSWITCH_CLIENT_SECRET=""
VITE_INTERSWITCH_BASE_URL=https://sandbox.interswitchng.com
VITE_INTERSWITCH_PASSPORT_URL=https://passport.interswitchng.com
VITE_INTERSWITCH_PAYABLE_CODE=Default_Payable_{{MERCHANT_CODE}}
VITE_INTERSWITCH_MERCHANT_CODE={{MERCHANT_CODE}}

# Backend API
VITE_API_URL="http://localhost:5000/api/v1"
```

> **Note:** `VITE_INTERSWITCH_CLIENT_ID` and `VITE_INTERSWITCH_CLIENT_SECRET` are obtained from the [Interswitch Developer Portal](https://developer.interswitchgroup.com). Use sandbox credentials for development.

Start the development server:

```bash
pnpm dev
```

The app will be available at **http://localhost:3000**

Build for production:

```bash
pnpm build
```

Preview the production build:

```bash
pnpm preview
```

## 🔑 Environment Variables Reference

| Variable                         | Description                   | Example                              |
| -------------------------------- | ----------------------------- | ------------------------------------ |
| `VITE_INTERSWITCH_CLIENT_ID`     | Interswitch app Client ID     | From dev portal                      |
| `VITE_INTERSWITCH_CLIENT_SECRET` | Interswitch app Client Secret | From dev portal                      |
| `VITE_INTERSWITCH_BASE_URL`      | Interswitch API base URL      | `https://sandbox.interswitchng.com`  |
| `VITE_INTERSWITCH_PASSPORT_URL`  | Interswitch OAuth URL         | `https://passport.interswitchng.com` |
| `VITE_INTERSWITCH_PAYABLE_CODE`  | Interswitch payable item code | `Default_Payable_{{MERCHANT_CODE}}`  |
| `VITE_INTERSWITCH_MERCHANT_CODE` | Interswitch merchant code     | `{{MERCHANT_CODE}}`                  |
| `VITE_API_URL`                   | Backend API base URL          | `http://localhost:5000/api/v1`       |

---

## 💳 How the Payment Flow Works

```
Business creates product
        ↓
Business generates payment link (tied to product)
        ↓
Customer opens /pay/:id
        ↓
Step 1 — Enters name, email, phone
        ↓
Step 2 — Enters card details (Visa / Mastercard / Verve)
        ↓
Step 3 — OTP verification (6-digit, auto-advance, resend support)
        ↓
Interswitch processes payment
        ↓
Transaction recorded → Customer created/updated
        ↓
Business sees revenue in Dashboard, Transactions, Wallet
```

---

## 👥 Team

| Name                       | Role                                          |
| -------------------------- | --------------------------------------------- |
| **Marvellous Akinrinmola** | Fullstack Developer — Chief Technical Officer |
| **Olamilekan Muhammed**    | Product Designer / Project Manager            |
| **Hassan Saidu**           | Backend Developer                             |
| **Oketola Samuel**         | Fullstack Developer                           |

---

## 📄 License

This project was built for a hackathon competition. All rights reserved by the PayCycle team.

---

<div align="center">
  <sub>Built with ❤️ for Nigeria · Powered by <a href="https://developer.interswitchgroup.com">Interswitch</a></sub>
</div>
