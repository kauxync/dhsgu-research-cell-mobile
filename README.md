# 🏛️ University Research Cell Mobile App & AI Assistant
### *CodeCraft Challenge — Problem 5 (Research Cell Application)*

A unified **React Native (Expo)** mobile application and **Node.js Express + Hostinger MySQL** backend designed for university research intelligence, faculty profile management, patent/publication indexing, grant tracking, and AI conversational assistance.

---

## 🚀 Unified Monorepo Architecture (Frontend + Backend at Same Place)

```
d:\coding-craft-challange\
├── App.js                         # React Native Expo Entry Point
├── package.json                   # Monorepo Scripts (runs both client & API)
├── app.json                       # Expo Configuration
├── babel.config.js                # Babel Preset
├── .env                           # Database & Network Environment Config
│
├── src/                           # 📱 React Native Mobile App (Expo)
│   ├── api/client.js              # Centralized API fetcher with resilient fallback
│   ├── theme/colors.js            # University academic color palette
│   ├── components/                # Reusable UI (Header, StatCard, Badge)
│   ├── navigation/AppNavigator.js # Bottom Tab Navigator & Modal Stacks
│   └── screens/
│       ├── HomeScreen.js          # Research Hub, KPIs & stats
│       ├── ResearchersScreen.js   # Faculty directory with H-index & department filters
│       ├── ResearcherDetailScreen.js # Full profile, Scopus/ORCID, publications, patents
│       ├── PublicationsScreen.js  # Journal papers, conference papers, patents, books
│       ├── AddPublicationModal.js # Form to log new papers / patent disclosures
│       ├── ProposalsScreen.js     # Grant proposal approval lifecycle tracker
│       ├── SubmitProposalModal.js # Proposal submission form for faculty
│       ├── FundingScreen.js       # Live grants (SERB, BIRAC, DRDO) & conferences
│       ├── ChatbotScreen.js       # Conversational AI Research Cell Assistant
│       └── NotificationsScreen.js # R&D alert broadcasts
│
└── server/                        # 🗄️ Node.js API & Hostinger MySQL Service
    ├── database/
    │   ├── schema.sql             # Relational MySQL Schema (8 tables)
    │   └── seed.sql               # Realistic university research dataset
    └── src/
        ├── config/db.js           # Hostinger MySQL connection pool + offline fallback
        ├── controllers/           # Researchers, Pubs, Proposals, Grants, Stats, Chatbot
        ├── routes/api.js          # REST endpoints
        ├── setupDb.js             # Automated one-step migration script
        └── server.js              # Express HTTP Server
```

---

## 🛠️ Step 1: Connecting Hostinger MySQL Database

1. Log into your **Hostinger hPanel** (`hpanel.hostinger.com`).
2. Navigate to **Databases** ➔ **MySQL Databases**:
   - Create a database: e.g. `u123456789_research_cell_db`
   - Create a user & password: e.g. `u123456789_research_user`
3. In **Databases** ➔ **Remote MySQL**:
   - Under **IP (IPv4 or IPv6)**, enter `%` (to allow access from any IP) or your current public IP.
   - Select your database and click **Create**.
4. Open the root `.env` file in this project and fill in your Hostinger credentials:

```env
PORT=5000

# Hostinger MySQL Database Configuration
DB_HOST=srv123.main-hosting.eu
DB_USER=u123456789_research_user
DB_PASSWORD=YourHostingerPassword123!
DB_NAME=u123456789_research_cell_db
DB_PORT=3306

ENABLE_MOCK_FALLBACK=true
EXPO_PUBLIC_API_URL=http://localhost:5000/api
```

5. Run the automated database setup script to create all tables and seed sample data:
```bash
npm run setup:db
```

---

## ⚡ Step 2: Running Frontend & Backend Concurrently

You can run **both the Node.js Hostinger MySQL backend and the Expo React Native app together** with one command:

```bash
# Install root dependencies
npm install

# Run backend + Expo mobile app simultaneously
npm run dev
```

- **Backend API**: `http://localhost:5000/api`
- **Expo Mobile App**: Opens Expo developer server with QR code for Expo Go, Web (`w`), Android (`a`), or iOS (`i`).

---

## 🌟 Implemented Features (Objectives from PDF)

| PDF Objective | Implementation Details |
| :--- | :--- |
| **Centralize university research info** | Executive dashboard with total papers, patents, active grants, approved funding, and recent updates. |
| **Maintain researcher & faculty profiles** | Faculty directory with department filtering (CSE, ECE, BT, ME), H-index, Scopus/ORCID IDs, and bio. |
| **Manage research projects & publications** | Multi-category repository for Journal papers, Conference papers, Patents, and Books + Add Entry modal. |
| **Notify users about funding & conferences** | Live listings of SERB, BIRAC, and DRDO grants, eligibility rules, conference deadlines + alerts. |
| **Track project proposals & approval status** | Lifecycle tracker (Draft ➔ Under Review ➔ Research Cell Approved ➔ Agency Approved). |
| **Maintain records of patents & conferences** | Dedicated patent registry with IPO/USPTO filing numbers, status badges, and conference schedules. |
| **AI Research Chatbot Assistant** | Conversational agent answering queries on faculty expertise, grant eligibility, patents, and proposal tracking. |

