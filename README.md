# Expo

## Overview

Expo is a platform that makes sending money simple.

Instead of sharing bank details, wallet addresses, or app names, users share **one simple payment name**:

username@expo


The system automatically routes the payment to the correct destination.

Expo focuses on **making payments easy to understand and easy to use**, even across different systems.

---

## The Problem

Sending money today is complicated.

To pay someone, you often need to know:
- Which app they use
- Their bank details or wallet address
- Their country and currency
- The correct payment network

This creates confusion, delays, and mistakes.

There is **no simple, universal way to identify where money should go**.

---

## The Solution

Expo solves this by introducing a **universal payment name**.

With Expo:
- Each user gets one payment name (`username@expo`)
- Senders only need this name to send money
- The system figures out where the money should go
- Sensitive details are never shared

Users only think about **sending and receiving**, not technical details.

---

## How Expo Works (Simple Flow)

1. User signs up on Expo
2. User creates a payment name (`username@expo`)
3. Another user enters this name and sends money
4. Expo resolves the name to a real destination
5. The payment is sent and confirmed

That’s it.

---

## Current Implementation (MVP)

This repository contains a **working MVP** with the following features:

### Authentication
- Email-based sign up and login
- Secure session handling
- Logout support

### Universal Payment Name
- One payment name per user (`username@expo`)
- Name registration stored on-chain
- Publicly verifiable registration transaction

### Payments
- Send payments using a payment name
- Real blockchain transactions on Stellar Testnet
- Fast settlement (a few seconds)
- Public transaction explorer links

### QR Code Support
- QR code for receiving payments
- QR code scanning to auto-fill recipient
- Mobile-friendly payment flow

### Dashboard
- View payment name
- Send and receive payments
- View recent transaction history

---

## Blockchain & Transactions

- Transactions run on the **Stellar Testnet**
- All transactions are real and on-chain
- Transactions can be verified on public explorers
- Testnet is used to safely demonstrate real payment flows

> Note: Testnet uses test funds only. No real money is involved.

---

## Why Stellar Is Used

Stellar is used because it is built for payments:

- Fast transaction confirmation
- Very low transaction cost
- Global and borderless
- Public and transparent transactions

Expo uses the official Stellar SDK to submit transactions.

---

## Project Architecture

The system is divided into three parts:

### Frontend
- User interface
- Login, dashboard, and payment screens
- QR code scanning and display

### Backend
- Authentication logic
- Payment routing
- Blockchain interaction
- Transaction signing and submission

### Blockchain
- On-chain name registry (smart contract)
- Payment settlement layer

---

## Tech Stack

### Frontend
- React / Next.js
- TypeScript
- Tailwind CSS

### Backend
- Node.js
- Express / Fastify
- Stellar SDK

### Blockchain
- Stellar Testnet
- Soroban Smart Contract

---

## Smart Contract Purpose

The smart contract is used to:
- Store `username → wallet address` mappings
- Resolve a payment name to a real destination
- Prevent name tampering
- Provide public proof of registration

---

## What Expo Is NOT

- Not a bank
- Not a wallet replacement
- Not a trading app
- Not limited to one country or app

Expo is focused on **payment identity and routing**, not holding funds.

---

## Future Scope (After Mainnet)

Planned improvements include:
- Mainnet deployment
- Wallet connection (non-custodial)
- Bank and off-ramp integrations
- Multi-currency support
- User-defined receiving preferences
- Business and developer APIs

---

## How to Run Locally

1. Clone the repository
2. Install dependencies
3. Configure environment variables (`.env.example`)
4. Start the backend server
5. Start the frontend application

Detailed setup steps are provided in the project folders.

---

## How to Verify the System

To verify that Expo works:

1. Create a payment name
2. Send a payment using that name
3. Open the transaction hash
4. View the transaction on a public explorer

This confirms that the transaction is real and on-chain.

---

## License

This project is provided for educational and demonstration purposes.

---

## Final Note

Expo demonstrates how a **simple payment name** can remove complexity from sending money.

The MVP proves that identity-based payments are possible and scalable.
