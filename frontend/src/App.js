import React, { useState, useEffect } from 'react';
import './App.css';
import MembersSection from './components/MembersSection';
import ExpenseForm from './components/ExpenseForm';
import DebtsDashboard from './components/DebtsDashboard';
import TransactionHistory from './components/TransactionHistory';
import MemberFilter from './components/MemberFilter';

const API_URL = 'http://localhost:5000';

function App() {
  const [members, setMembers] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [debts, setDebts] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedMember, setSelectedMember] = useState(null);

  // Fetch members on component mount
  useEffect(() => {
    fetchMembers();
  }, []);

  // Fetch debts and expenses whenever needed
  useEffect(() => {
    fetchDebts();
    fetchExpenses();
  }, [members]);

  const fetchMembers = async () => {
    try {
      const response = await fetch(`${API_URL}/members`);
      const data = await response.json();
      setMembers(data.members);
      setSelectedMember(null);
    } catch (error) {
      console.error('Failed to fetch members:', error);
    }
  };

  const fetchExpenses = async () => {
    try {
      const response = await fetch(`${API_URL}/expenses`);
      const data = await response.json();
      setExpenses(data.expenses);
    } catch (error) {
      console.error('Failed to fetch expenses:', error);
    }
  };

  const fetchDebts = async () => {
    try {
      const response = await fetch(`${API_URL}/debts`);
      const data = await response.json();
      setDebts(data.debts);
    } catch (error) {
      console.error('Failed to fetch debts:', error);
    }
  };

  const handleAddMember = async (name) => {
    try {
      const response = await fetch(`${API_URL}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });

      if (response.ok) {
        fetchMembers();
      } else {
        const error = await response.json();
        alert(error.error);
      }
    } catch (error) {
      alert('Failed to add member');
    }
  };

  const handleAddExpense = async (paidBy, amount, description) => {
    try {
      const response = await fetch(`${API_URL}/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paidBy, amount: parseFloat(amount), description })
      });

      if (response.ok) {
        fetchExpenses();
        fetchDebts();
      } else {
        const error = await response.json();
        alert(error.error);
      }
    } catch (error) {
      alert('Failed to add expense');
    }
  };

  const handleDeleteExpense = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/expenses/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchExpenses();
        fetchDebts();
      }
    } catch (error) {
      alert('Failed to delete expense');
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>💰 Expense Sharing System</h1>
        <p>Track shared expenses and calculate who owes whom</p>
      </header>

      <nav className="nav-tabs">
        <button
          className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button
          className={`nav-tab ${activeTab === 'members' ? 'active' : ''}`}
          onClick={() => setActiveTab('members')}
        >
          Members
        </button>
        <button
          className={`nav-tab ${activeTab === 'expense' ? 'active' : ''}`}
          onClick={() => setActiveTab('expense')}
        >
          Add Expense
        </button>
        <button
          className={`nav-tab ${activeTab === 'filter' ? 'active' : ''}`}
          onClick={() => setActiveTab('filter')}
        >
          Member View
        </button>
        <button
          className={`nav-tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          Transaction History
        </button>
      </nav>

      <main className="app-main">
        {activeTab === 'dashboard' && (
          <DebtsDashboard debts={debts} members={members} />
        )}

        {activeTab === 'members' && (
          <MembersSection members={members} onAddMember={handleAddMember} />
        )}

        {activeTab === 'expense' && (
          <ExpenseForm members={members} onAddExpense={handleAddExpense} />
        )}

        {activeTab === 'filter' && (
          <MemberFilter
            members={members}
            selectedMember={selectedMember}
            onSelectMember={setSelectedMember}
            debts={debts}
          />
        )}

        {activeTab === 'history' && (
          <TransactionHistory
            expenses={expenses}
            onDeleteExpense={handleDeleteExpense}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>© 2026 Expense Sharing System</p>
      </footer>
    </div>
  );
}

export default App;
