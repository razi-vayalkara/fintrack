# Personal Finance Tracker

A full-stack personal finance tracker built with React, Redux Toolkit, Tailwind CSS, Express, Mongoose, and MongoDB.

## Features

- JWT authentication with register, login, logout, change password, and delete account.
- User-scoped transactions, suggestions, lockers, and settings.
- Add, edit, delete, filter, and autocomplete transactions.
- Dashboard with summary cards, recent transactions, spending insights, saving rate, and daily average.
- Reports with income/expense charts, expense trend, category pie chart, month-over-month comparison, and locker reports.
- Lockers for simple saved amounts with credit/debit movement history.
- Persistent settings for currency, density, default category, financial month start day, and notifications.
- Responsive mobile-first UI with desktop sidebar and mobile bottom navigation.

## Tech Stack

- Client: Vite, React, JSX, Redux Toolkit, Axios, Tailwind CSS v3, Recharts, react-hot-toast, Lucide React
- Server: Express.js, Mongoose, JWT, bcryptjs
- Database: MongoDB Atlas or local MongoDB

## Project Structure

```text
client/
  src/
    components/
    hooks/
    pages/
    store/
    utils/
server/
  controllers/
  middleware/
  models/
  routes/
```

## Environment Variables

Create or update `.env` in the project root:

```env
MONGO_URI=your_mongodb_uri
PORT=5000
CLIENT_URL=http://localhost:5173
JWT_SECRET=your_long_random_secret
```

## Install

```bash
npm install
npm run install:all
```

## Run Development

```bash
npm run dev
```

Client: `http://localhost:5173`

Server: `http://localhost:5000`

## Individual Scripts

Run only the server:

```bash
npm run dev --prefix server
```

Run only the client:

```bash
npm run dev --prefix client
```

Build the client:

```bash
npm run build --prefix client
```

## API Overview

Auth:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `PATCH /api/auth/settings`
- `PATCH /api/auth/password`
- `DELETE /api/auth/account`

Transactions:

- `POST /api/transactions`
- `GET /api/transactions`
- `PATCH /api/transactions/:id`
- `DELETE /api/transactions/:id`
- `GET /api/transactions/summary`

Suggestions:

- `GET /api/suggestions?q=query`
- `POST /api/suggestions`

Lockers:

- `GET /api/lockers`
- `POST /api/lockers`
- `PATCH /api/lockers/:id`
- `DELETE /api/lockers/:id`
- `POST /api/lockers/:id/move`
- `GET /api/lockers/summary`

## Notes

- Locker amounts are independent saved balances. They do not affect income, expenses, transaction totals, or net balance.
- Deleting an account removes all user-owned finance data.
- The Vite build may show a chunk-size warning because of charting and routing dependencies. It is not a build failure.
