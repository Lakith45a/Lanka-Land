# Lanka Land Connect — Microservices Backend
### IT4020 Modern Topics in IT | SLIIT | 2026

A fully functional microservices backend for a Sri Lankan land-selling platform, built with **Node.js**, **Express**, **MongoDB (Mongoose)**, and **Swagger (OpenAPI 3)**.

---

## Architecture Overview

```
Client
  │
  ▼
┌─────────────────────────────┐
│   API Gateway  :3000        │  ← Single entry point
└──────┬──────────────────────┘
       │  routes by /api/<resource>
  ┌────┴──────────────────────────────────────────────┐
  │                                                   │
  ▼         ▼          ▼          ▼        ▼        ▼
:3001     :3002      :3003      :3004    :3005    :3006
User    Property   Inquiry   Valuation Appoint  Document
Service  Service   Service    Service  Service   Service
  │         │          │          │        │        │
 MongoDB  MongoDB   MongoDB    MongoDB  MongoDB  MongoDB
(userdb)(propertydb)(inquirydb)(valuationdb)(apptdb)(docdb)
```

---

## Services & Ports

| Service              | Port | Database            | Swagger UI                        |
|----------------------|------|---------------------|-----------------------------------|
| **API Gateway**      | 3000 | —                   | —                                 |
| User Service         | 3001 | llc_userdb          | http://localhost:3001/api-docs    |
| Property Service     | 3002 | llc_propertydb      | http://localhost:3002/api-docs    |
| Inquiry Service      | 3003 | llc_inquirydb       | http://localhost:3003/api-docs    |
| Valuation Service    | 3004 | llc_valuationdb     | http://localhost:3004/api-docs    |
| Appointment Service  | 3005 | llc_appointmentdb   | http://localhost:3005/api-docs    |
| Document Service     | 3006 | llc_documentdb      | http://localhost:3006/api-docs    |

---

## Prerequisites

- **Node.js** v18+
- **MongoDB** running locally on default port `27017`
  - Install: https://www.mongodb.com/try/download/community
  - Start: `mongod` (Linux/Mac) or start via MongoDB Compass / Windows Service

---

## Quick Start

### Step 1 — Install dependencies for all services

Open **7 terminals** (one per service + gateway), or run:

```bash
cd api-gateway        && npm install && cd ..
cd user-service       && npm install && cd ..
cd property-service   && npm install && cd ..
cd inquiry-service    && npm install && cd ..
cd valuation-service  && npm install && cd ..
cd appointment-service && npm install && cd ..
cd document-service   && npm install && cd ..
```

### Step 2 — Start all services (start Gateway last)

```bash
# Terminal 1
cd user-service && npm start

# Terminal 2
cd property-service && npm start

# Terminal 3
cd inquiry-service && npm start

# Terminal 4
cd valuation-service && npm start

# Terminal 5
cd appointment-service && npm start

# Terminal 6
cd document-service && npm start

# Terminal 7 (start LAST)
cd api-gateway && npm start
```

---

## API Gateway Routes

All routes accessible via **http://localhost:3000**:

| Path                      | Proxies To              |
|---------------------------|-------------------------|
| `/api/users`              | User Service :3001      |
| `/api/properties`         | Property Service :3002  |
| `/api/inquiries`          | Inquiry Service :3003   |
| `/api/valuations`         | Valuation Service :3004 |
| `/api/appointments`       | Appointment Service :3005 |
| `/api/documents`          | Document Service :3006  |

---

## Sample API Calls

### Register a User (direct or via gateway)
```
POST http://localhost:3001/api/users/register
POST http://localhost:3000/api/users/register

{
  "fullName": "Kamal Perera",
  "email": "kamal@example.com",
  "password": "password123",
  "role": "seller",
  "phone": "+94771234567",
  "district": "Colombo"
}
```

### List a Property
```
POST http://localhost:3000/api/properties

{
  "title": "Prime Land in Colombo 7",
  "description": "Excellent bare land in a prime location with road access",
  "propertyType": "bare-land",
  "extentPerches": 20,
  "pricePerPerch": 1500000,
  "district": "Colombo",
  "address": "No. 45, Flower Road, Colombo 07",
  "sellerUserId": "<userId from register>"
}
```

### Submit an Inquiry
```
POST http://localhost:3000/api/inquiries

{
  "propertyId": "<propertyId>",
  "buyerUserId": "<buyerUserId>",
  "sellerUserId": "<sellerUserId>",
  "inquiryType": "purchase_offer",
  "message": "I am interested in this property. Is the price negotiable?",
  "offeredPriceLKR": 25000000,
  "contactPhone": "+94771234567"
}
```

### Schedule an Appointment
```
POST http://localhost:3000/api/appointments

{
  "propertyId": "<propertyId>",
  "buyerUserId": "<buyerUserId>",
  "sellerUserId": "<sellerUserId>",
  "appointmentType": "site_visit",
  "scheduledDate": "2026-04-15",
  "scheduledTime": "10:00",
  "location": "No. 45, Flower Road, Colombo 07"
}
```

---

## Health Checks

```
GET http://localhost:3000/health   → API Gateway health
GET http://localhost:3001/health   → User Service health
GET http://localhost:3002/health   → Property Service health
GET http://localhost:3003/health   → Inquiry Service health
GET http://localhost:3004/health   → Valuation Service health
GET http://localhost:3005/health   → Appointment Service health
GET http://localhost:3006/health   → Document Service health
```

---

## Folder Structure

```
lanka-land-connect/
├── api-gateway/
│   ├── src/gateway.js
│   ├── .env
│   ├── .env.example
│   └── package.json
├── user-service/
│   ├── src/
│   │   ├── server.js
│   │   ├── swagger.js
│   │   ├── models/User.js
│   │   ├── controllers/userController.js
│   │   └── routes/userRoutes.js
│   ├── .env
│   ├── .env.example
│   └── package.json
├── property-service/   (same structure)
├── inquiry-service/    (same structure)
├── valuation-service/  (same structure)
├── appointment-service/(same structure)
├── document-service/   (same structure)
└── README.md
```

---

## Environment Variables

Each service has a `.env` file (copied from `.env.example`). Update MongoDB URIs if your setup differs:

| Variable      | Default                              |
|---------------|--------------------------------------|
| PORT          | Per service (3001–3006, Gateway 3000)|
| MONGO_URI     | mongodb://localhost:27017/llc_<name>db |

---

## Assignment Details

- **Module**: IT4020 — Modern Topics in IT
- **Assignment**: Assignment 2 — Microservices Architecture
- **Platform**: Lanka Land Connect (Sri Lankan Land Selling Platform)
- **Tech Stack**: Node.js, Express, MongoDB, Mongoose, Swagger (OpenAPI 3)
- **Domain**: Real estate / land selling in Sri Lanka
