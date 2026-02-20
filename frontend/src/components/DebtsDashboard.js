import React from 'react';
import './DebtsDashboard.css';

function DebtsDashboard({ debts, members }) {
  const getTotalAmount = () => {
    return debts.reduce((sum, debt) => sum + debt.amount, 0);
  };

  const sortedDebts = [...debts].sort((a, b) => b.amount - a.amount);

  return (
    <div className="debts-dashboard">
      <h2>📊 Debts Dashboard</h2>

      {members.length === 0 ? (
        <p className="empty-message">No members yet.</p>
      ) : debts.length === 0 ? (
        <p className="settled-message">✅ All debts settled! Everyone is even.</p>
      ) : (
        <>
          <div className="summary-card">
            <h3>Total Outstanding</h3>
            <p className="total-amount">${getTotalAmount().toFixed(2)}</p>
          </div>

          <div className="debts-table-container">
            <table className="debts-table">
              <thead>
                <tr>
                  <th>From (Debtor)</th>
                  <th>To (Creditor)</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {sortedDebts.map((debt, index) => (
                  <tr key={index} className="debt-row">
                    <td className="debtor-cell">
                      <span className="owe-badge">Owes</span>
                      <span className="person-name">{debt.debtor}</span>
                    </td>
                    <td className="creditor-cell">
                      <span className="receives-badge">Receives</span>
                      <span className="person-name">{debt.creditor}</span>
                    </td>
                    <td className="amount-cell">
                      <span className="amount-badge">
                        ${debt.amount.toFixed(2)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="summary-info">
            <p>Total debts: <strong>{debts.length}</strong></p>
            <p>💡 Tip: The system automatically cancels mutual debts between members.</p>
          </div>
        </>
      )}
    </div>
  );
}

export default DebtsDashboard;
