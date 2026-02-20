import React from 'react';
import './TransactionHistory.css';

function TransactionHistory({ expenses, onDeleteExpense }) {
  const sortedExpenses = [...expenses].reverse();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="transaction-history">
      <h2>📜 Transaction History</h2>

      {expenses.length === 0 ? (
        <p className="empty-message">No transactions yet.</p>
      ) : (
        <>
          <div className="transactions-list">
            {sortedExpenses.map((expense, index) => (
              <div key={expense.id} className="transaction-item">
                <div className="transaction-number">#{sortedExpenses.length - index}</div>
                <div className="transaction-content">
                  <div className="transaction-header">
                    <h3 className="transaction-description">{expense.description}</h3>
                    <span className="transaction-amount">
                      ${expense.amount.toFixed(2)}
                    </span>
                  </div>
                  <div className="transaction-details">
                    <span className="paid-by">
                      💳 Paid by <strong>{expense.paidBy}</strong>
                    </span>
                    <span className="transaction-date">
                      📅 {formatDate(expense.date)}
                    </span>
                  </div>
                </div>
                <button
                  className="btn-delete-transaction"
                  onClick={() => onDeleteExpense(expense.id)}
                  title="Delete this transaction"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="summary-stats">
            <p>Total transactions: <strong>{expenses.length}</strong></p>
            <p>
              Total spent: <strong>${expenses.reduce((sum, e) => sum + e.amount, 0).toFixed(2)}</strong>
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export default TransactionHistory;
