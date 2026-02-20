import React, { useState } from 'react';
import './ExpenseForm.css';

function ExpenseForm({ members, onAddExpense }) {
  const [paidBy, setPaidBy] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (paidBy && amount && description.trim()) {
      onAddExpense(paidBy, amount, description);
      setPaidBy('');
      setAmount('');
      setDescription('');
    }
  };

  return (
    <div className="expense-form-section">
      <h2>💸 Add New Expense</h2>
      
      {members.length === 0 ? (
        <p className="warning-message">⚠️ Add members first before adding expenses</p>
      ) : (
        <form onSubmit={handleSubmit} className="expense-form">
          <div className="form-group">
            <label htmlFor="paidBy">Paid By:</label>
            <select
              id="paidBy"
              value={paidBy}
              onChange={(e) => setPaidBy(e.target.value)}
              required
            >
              <option value="">Select a member</option>
              {members.map((member, idx) => (
                <option key={idx} value={member}>
                  {member}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="amount">Amount ($):</label>
            <input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <input
              id="description"
              type="text"
              placeholder="e.g., Dinner at restaurant"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-submit-expense">
            Add Expense
          </button>
        </form>
      )}
    </div>
  );
}

export default ExpenseForm;
