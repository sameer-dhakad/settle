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
git clone https://github.com/your-username/settle.git
cd settle
```

### 3. Install Dependencies
```bash
# Install root, client, and server dependencies
npm install
cd client && npm install
cd ../server && npm install
cd ..
```

### 4. Configure Environment Variables
Copy the example environment configuration:
```bash
# In the server directory:
cp server/.env.example server/.env
```

Update `server/.env` with your MongoDB connection string and JWT secret:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/settle?retryWrites=true&w=majority
PORT=5001
JWT_SECRET=your_super_secure_jwt_secret_key
CLIENT_URL=http://localhost:3000
```

### 5. Run Locally in Development
```bash
# From the root directory:
npm run dev
```
- **Client**: `http://localhost:3000`
- **Server**: `http://localhost:5001`

---

## 🔒 Security & Privacy

- **No Secrets in Source Control**: All sensitive database credentials, JWT secrets, and environment tokens are managed via `.env` and excluded via `.gitignore`.
- **Password Security**: Salted hashing with `bcryptjs`.
- **Bank-Grade References**: Optional 12-digit UTR logging protects participants from spoofed payments.

---

## 📄 License
MIT License © Settle Team

