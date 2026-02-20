# Quick Start Guide

## One-Time Setup

### Step 1: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 2: Install Frontend Dependencies  
```bash
cd frontend
npm install
```

## Running the Application

### Step 1: Start Backend (Terminal 1)
```bash
cd backend
npm start
```

Output should show:
```
Server running on http://localhost:5000
```

### Step 2: Start Frontend (Terminal 2)
```bash
cd frontend
npm start
```

Output should show:
```
Compiled successfully!
```

Your default browser should open to `http://localhost:3000`

## First-Time Usage

1. **Add Members First**
   - Go to "Members" tab
   - Enter names and click "Add Member"
   - Need at least 2 members to add expenses

2. **Add Expenses**
   - Go to "Add Expense" tab
   - Select who paid
   - Enter amount and description
   - Click "Add Expense"

3. **View Debts**
   - Go to "Dashboard" to see all debts
   - Go to "Member View" to see specific member's debts
   - Red badges = owes, Green badges = receives

4. **Check History**
   - Go to "Transaction History" to see all expenses
   - Can delete expenses (recalculates debts automatically)

## Common Workflows

### Scenario: 3 Friends Split Dinner
1. Add members: Alice, Bob, Charlie
2. Alice pays $90 for dinner
3. System calculates: Bob owes Alice $30, Charlie owes Alice $30
4. Everyone is even!

### Scenario: Multiple Expenses
1. Alice pays $30 (owes: Bob $10, Charlie $10 to Alice)
2. Bob pays $20 (owes: Charlie $20 to Bob)
3. Charlie pays $5 (owes: Alice $5 to Charlie)

After simplification:
- Alice receives: $30 - $5 = $25 from Bob+Charlie combined
- Result: Bob owes Alice $15, Charlie owes Alice $10

## Troubleshooting

### "Cannot get /members"
- Backend is not running on port 5000
- Start backend with: `cd backend && npm start`

### Frontend shows "No members"
- Refresh the page (Ctrl+R or Cmd+R)
- Check backend is running

### Port 3000 already in use
- Kill process: `npx kill-port 3000`
- Or change React port with: `PORT=3001 npm start`

### Port 5000 already in use
- Kill process: `npx kill-port 5000`
- Or change Express port in server.js line 10

## Data Files

All data is stored in JSON files:
- `backend/data/members.json` - Member list
- `backend/data/expenses.json` - All transactions

You can delete these files to reset the app:
```bash
rm backend/data/*.json
npm start  # Backend will recreate empty files
```

## Stopping the Application

Press `Ctrl+C` in each terminal to stop the servers.

## Tips & Tricks

1. **Real-time Updates**: All data loads automatically when switching tabs
2. **No Refresh Needed**: UI updates immediately after adding expense
3. **Delete Expenses**: Removes expense and recalculates all debts
4. **Offline Mode**: Frontend and backend can run in separate windows/devices on same network
5. **Browser DevTools**: Open DevTools (F12) to see API calls in Network tab

## Need Help?

1. Check [README.md](README.md) for detailed documentation
2. Review API endpoints section in README
3. Check browser console for error messages
4. Look at terminal output for server errors
