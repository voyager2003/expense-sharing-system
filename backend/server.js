const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Data file paths
const dataDir = path.join(__dirname, 'data');
const membersFile = path.join(dataDir, 'members.json');
const expensesFile = path.join(dataDir, 'expenses.json');

// Initialize data files if they don't exist
function initializeDataFiles() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  if (!fs.existsSync(membersFile)) {
    fs.writeFileSync(membersFile, JSON.stringify([], null, 2));
  }
  
  if (!fs.existsSync(expensesFile)) {
    fs.writeFileSync(expensesFile, JSON.stringify([], null, 2));
  }
}

// Helper functions to read/write data
function readMembers() {
  try {
    const data = fs.readFileSync(membersFile, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function writeMembers(members) {
  fs.writeFileSync(membersFile, JSON.stringify(members, null, 2));
}

function readExpenses() {
  try {
    const data = fs.readFileSync(expensesFile, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function writeExpenses(expenses) {
  fs.writeFileSync(expensesFile, JSON.stringify(expenses, null, 2));
}

// Calculate pair-wise debts
function calculateDebts() {
  const members = readMembers();
  const expenses = readExpenses();
  
  // Initialize debt map: { "personA": { "personB": amount } }
  const debts = {};
  members.forEach(member => {
    debts[member] = {};
    members.forEach(other => {
      if (member !== other) {
        debts[member][other] = 0;
      }
    });
  });
  
  // Add up debts from all expenses
  expenses.forEach(expense => {
    const amountPerPerson = expense.amount / members.length;
    
    members.forEach(member => {
      if (member !== expense.paidBy) {
        // This member owes the person who paid
        debts[member][expense.paidBy] += amountPerPerson;
      }
    });
  });
  
  // Simplify debts (cancel mutual debts)
  members.forEach(person1 => {
    members.forEach(person2 => {
      if (person1 !== person2) {
        const debt1to2 = debts[person1][person2];
        const debt2to1 = debts[person2][person1];
        
        if (debt1to2 > 0 && debt2to1 > 0) {
          const diff = debt1to2 - debt2to1;
          if (diff > 0) {
            debts[person1][person2] = diff;
            debts[person2][person1] = 0;
          } else if (diff < 0) {
            debts[person1][person2] = 0;
            debts[person2][person1] = -diff;
          } else {
            debts[person1][person2] = 0;
            debts[person2][person1] = 0;
          }
        }
      }
    });
  });
  
  return debts;
}

// Format debts for display
function formatDebts() {
  const debts = calculateDebts();
  const result = [];
  
  const processed = new Set();
  const members = readMembers();
  
  members.forEach(debtor => {
    Object.entries(debts[debtor] || {}).forEach(([creditor, amount]) => {
      const key = [debtor, creditor].sort().join('|');
      if (!processed.has(key) && amount > 0) {
        result.push({
          debtor,
          creditor,
          amount: Math.round(amount * 100) / 100
        });
        processed.add(key);
      }
    });
  });
  
  return result;
}

// API Routes

// POST /members - Add a new member
app.post('/members', (req, res) => {
  const { name } = req.body;
  
  if (!name || name.trim() === '') {
    return res.status(400).json({ error: 'Member name is required' });
  }
  
  const members = readMembers();
  const nameExists = members.some(m => m.toLowerCase() === name.toLowerCase());
  
  if (nameExists) {
    return res.status(400).json({ error: 'Member already exists' });
  }
  
  members.push(name);
  writeMembers(members);
  
  res.status(201).json({ message: 'Member added', members });
});

// GET /members - Get all members
app.get('/members', (req, res) => {
  const members = readMembers();
  res.json({ members });
});

// POST /expenses - Add a new expense
app.post('/expenses', (req, res) => {
  const { paidBy, amount, description } = req.body;
  
  if (!paidBy || !amount || amount <= 0 || !description) {
    return res.status(400).json({ error: 'Invalid expense data' });
  }
  
  const members = readMembers();
  if (!members.includes(paidBy)) {
    return res.status(400).json({ error: 'Member not found' });
  }
  
  const expenses = readExpenses();
  const expense = {
    id: Date.now(),
    paidBy,
    amount: parseFloat(amount),
    description,
    date: new Date().toISOString()
  };
  
  expenses.push(expense);
  writeExpenses(expenses);
  
  res.status(201).json({ message: 'Expense added', expense, expenses });
});

// GET /expenses - Get all expenses
app.get('/expenses', (req, res) => {
  const expenses = readExpenses();
  res.json({ expenses });
});

// GET /debts - Get all pair-wise debts
app.get('/debts', (req, res) => {
  const debts = formatDebts();
  res.json({ debts });
});

// GET /transactions - Get all transactions (expenses in transaction history format)
app.get('/transactions', (req, res) => {
  const expenses = readExpenses();
  const transactions = expenses.map((expense, index) => ({
    id: expense.id,
    number: index + 1,
    paidBy: expense.paidBy,
    amount: expense.amount,
    description: expense.description,
    date: expense.date
  }));
  res.json({ transactions });
});

// Optional: GET /debts/:member - Get debts for a specific member
app.get('/debts/:member', (req, res) => {
  const { member } = req.params;
  const debts = formatDebts();
  
  const memberDebts = {
    owes: debts.filter(d => d.debtor === member),
    receives: debts.filter(d => d.creditor === member)
  };
  
  res.json(memberDebts);
});

// Optional: DELETE /expenses/:id - Delete an expense
app.delete('/expenses/:id', (req, res) => {
  const { id } = req.params;
  let expenses = readExpenses();
  
  const originalLength = expenses.length;
  expenses = expenses.filter(e => e.id !== parseInt(id));
  
  if (expenses.length === originalLength) {
    return res.status(404).json({ error: 'Expense not found' });
  }
  
  writeExpenses(expenses);
  res.json({ message: 'Expense deleted', expenses });
});

// Optional: DELETE /members/:name - Delete a member (if no expenses made/received)
app.delete('/members/:name', (req, res) => {
  const { name } = req.params;
  const expenses = readExpenses();
  
  const hasMemberExpenses = expenses.some(e => e.paidBy === name);
  if (hasMemberExpenses) {
    return res.status(400).json({ error: 'Cannot delete member with recorded expenses' });
  }
  
  let members = readMembers();
  members = members.filter(m => m !== name);
  writeMembers(members);
  
  res.json({ message: 'Member deleted', members });
});

// Initialize data files and start server
initializeDataFiles();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
