# Settle 💸 — Frictionless Group Expense Engine & Instant UPI Payments

A minimalist, high-contrast fintech web application built for instant group expense splitting and direct UPI settlements. Designed with an authentic Apple-style liquid glass aesthetic, zero-friction guest onboarding, and intelligent debt simplification.

---

## ✨ Features

- **⚡ Zero-Login Guest Onboarding**: Trip creators generate a tokenized URL (`/trip/:accessToken`). Friends join instantly from WhatsApp without downloading an app or creating a password.
- **🔄 Greedy Min-Cash-Flow Algorithm**: Backend graph optimization collapses complex multi-party debts down to at most $N-1$ direct transfers.
- **📱 Two-Tier UPI Settlement Pathway**:
  - **Mobile Browsers**: 1-tap `upi://pay` deep link triggers Google Pay, PhonePe, Paytm, or Cred with pre-filled NPCI parameters.
  - **Desktop Browsers**: Dynamic high-contrast QR code modal with clipboard fallback.
- **🛡️ 12-Digit Bank Reference (UTR) Logging**: Payees log their bank transaction reference, allowing recipients to verify incoming transfers before signing off.
- **📊 Minimalist Liquid Glass Dashboard**: Track lifetime group spending, net position across circles, and active trips.
- **💬 1-Click WhatsApp Broadcast**: Formats all balances and settlement summaries into a structured WhatsApp message.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS v4, Lucide Icons, Sonner, QRCode.react, Canvas Confetti
- **Backend**: Node.js, Express, MongoDB Atlas, Mongoose, JSON Web Tokens (JWT), bcryptjs
- **Architecture**: REST API with JWT authentication & tokenized trip session routing

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas cluster or local MongoDB instance

### 2. Clone the Repository
```bash

