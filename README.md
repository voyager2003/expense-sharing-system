# Expense Sharing System

A full-stack web application for tracking shared expenses and calculating who owes whom in a group.

## Project Structure

```
expense-sharing-system/
├── backend/
│   ├── server.js              # Express server with all APIs
│   ├── package.json           # Backend dependencies
│   └── data/                  # JSON data storage
│       ├── members.json
│       └── expenses.json
└── frontend/
    ├── public/
    │   └── index.html         # HTML entry point
    ├── src/
    │   ├── App.js             # Main React component
    │   ├── App.css             # Main styles
    │   ├── index.js           # React entry point
    │   ├── index.css          # Global styles
    │   └── components/
    │       ├── MembersSection.js/css
    │       ├── ExpenseForm.js/css
    │       ├── DebtsDashboard.js/css
    │       ├── TransactionHistory.js/css
    │       └── MemberFilter.js/css
    └── package.json           # Frontend dependencies
```

## Setup Instructions

### Prerequisites
- Node.js and npm installed
- Two terminal windows (one for backend, one for frontend)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```
   
   The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```
   
   The frontend will automatically open at `http://localhost:3000`

## Features

### 1. **Members Management**
   - Add group members (no duplicate names)
   - View all members in a grid layout

### 2. **Expense Tracking**
   - Add expenses with paid-by person, amount, and description
   - Expenses are automatically split equally among all members
   - View transaction history with timestamps

### 3. **Debt Calculation**
   - Automatic pair-wise debt calculation after each expense
   - Mutual debt cancellation (if A owes B $10 and B owes A $5, only $5 is shown)
   - Real-time updates to all debt figures

### 4. **Dashboard View**
   - Visual representation of all outstanding debts
   - Color-coded display (red for owes, green for receives)
   - Total outstanding amount summary
   - Sorted by amount (highest first)

### 5. **Member Filter View**
   - Select individual members to see their financial summary
   - Shows net balance (positive = will receive, negative = needs to pay)
   - Breakdown of who they owe and who owes them
   - Amount details for each transaction

### 6. **Transaction History**
   - Chronological view of all expenses (newest first)
   - Shows who paid and description for each transaction
   - Delete transactions with confirmation
   - Total spent calculation

## API Documentation

### Backend Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/members` | Add a new member |
| GET | `/members` | Get all members |
| POST | `/expenses` | Add a new expense |
| GET | `/expenses` | Get all expenses |
| GET | `/debts` | Get all pair-wise debts |
| GET | `/debts/:member` | Get debts for a specific member |
| GET | `/transactions` | Get transaction history |
| DELETE | `/expenses/:id` | Delete an expense |
| DELETE | `/members/:name` | Delete a member (if no expenses) |

### Request/Response Examples

#### Add Member
```bash
POST /members
Content-Type: application/json

{"name": "Alice"}
```

#### Add Expense
```bash
POST /expenses
Content-Type: application/json

{
  "paidBy": "Alice",
  "amount": 30.00,
  "description": "Lunch"
}
```

#### Get Debts
```bash
GET /debts
```

Response:
```json
{
  "debts": [
    {
      "debtor": "Bob",
      "creditor": "Alice",
      "amount": 15.00
    }
  ]
}
```

## Key Algorithm: Debt Calculation

1. For each expense, calculate equal split: `amountPerPerson = expense.amount / totalMembers`
2. Each person who didn't pay owes: `debts[person][paidBy] += amountPerPerson`
3. Simplify debts by canceling mutual debts:
   - If A owes B $20 and B owes A $5
   - Result: A owes B $15 (difference)

## Technologies Used

### Frontend
- React 18.2.0
- JavaScript ES6+
- CSS3 with flexbox and grid

### Backend
- Node.js
- Express.js 4.18.2
- CORS middleware
- File System (fs) for JSON persistence

## Data Persistence

All data is stored as JSON files in the `backend/data` directory:
- `members.json` - List of group members
- `expenses.json` - All recorded expenses with metadata

Data is read/written synchronously for simplicity in this educational project.

## Features to Note

1. **No Duplicates** - Member names are checked for duplicates before adding
2. **Auto-simplification** - Mutual debts are automatically canceled
3. **Equal Split** - All expenses are split equally among ALL members
4. **Stateless API** - No user authentication; single group system
5. **Real-time Updates** - Frontend fetches fresh data after each operation

## Troubleshooting

### Backend not starting?
- Ensure port 5000 is not in use
- Check that Node.js is installed: `node -v`

### Frontend won't connect to backend?
- Ensure backend is running on port 5000
- Check browser console for CORS errors
- Clear browser cache and restart

### Data not persisting?
- Ensure `backend/data/` directory has write permissions
- Check JSON files are valid format

## Future Enhancements

- Add database (MongoDB/PostgreSQL) for scalability
- User authentication and multiple groups
- Settlement suggestions (optimal payment paths)
- CSV export for transaction history
- Push notifications for payment reminders
- Mobile app version

## Author Notes

This is a learning project demonstrating:
- Building REST APIs with Express.js
- Reading/writing JSON with fs module
- React component architecture
- Financial calculation logic
- State management in React
- CSS styling and responsive design
