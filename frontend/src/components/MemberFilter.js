import React from 'react';
import './MemberFilter.css';

function MemberFilter({ members, selectedMember, onSelectMember, debts }) {
  const getMemberDebts = (member) => {
    return {
      owes: debts.filter(d => d.debtor === member),
      receives: debts.filter(d => d.creditor === member)
    };
  };

  const calculateBalance = (member) => {
    const memberDebts = getMemberDebts(member);
    const totalOwes = memberDebts.owes.reduce((sum, d) => sum + d.amount, 0);
    const totalReceives = memberDebts.receives.reduce((sum, d) => sum + d.amount, 0);
    return totalReceives - totalOwes;
  };

  const memberDebts = selectedMember ? getMemberDebts(selectedMember) : null;
  const balance = selectedMember ? calculateBalance(selectedMember) : 0;

  return (
    <div className="member-filter">
      <h2>👤 Member View</h2>

      {members.length === 0 ? (
        <p className="empty-message">No members yet.</p>
      ) : (
        <>
          <div className="member-selector">
            <label htmlFor="member-select">Select a member:</label>
            <select
              id="member-select"
              value={selectedMember || ''}
              onChange={(e) => onSelectMember(e.target.value || null)}
              className="member-select"
            >
              <option value="">-- Choose a member --</option>
              {members.map((member, idx) => (
                <option key={idx} value={member}>
                  {member}
                </option>
              ))}
            </select>
          </div>

          {selectedMember && (
            <div className="member-details">
              <h3 className="member-title">📊 {selectedMember}'s Financial Summary</h3>

              <div className={`balance-card ${balance >= 0 ? 'positive' : 'negative'}`}>
                <h4>Net Balance</h4>
                <p className="balance-amount">
                  {balance >= 0 ? '+' : ''} ${Math.abs(balance).toFixed(2)}
                </p>
                <p className="balance-description">
                  {balance > 0
                    ? `${selectedMember} will receive this amount`
                    : balance < 0
                    ? `${selectedMember} will need to pay this amount`
                    : `${selectedMember} is all settled up`}
                </p>
              </div>

              <div className="debts-breakdown">
                <div className="breakdown-section">
                  <h4 className="owes-title">💸 Owes To Others</h4>
                  {memberDebts.owes.length === 0 ? (
                    <p className="no-debts">No debts owed</p>
                  ) : (
                    <div className="debts-list">
                      {memberDebts.owes.map((debt, idx) => (
                        <div key={idx} className="debt-item owes-item">
                          <span className="debt-person">→ {debt.creditor}</span>
                          <span className="debt-amount-red">
                            ${debt.amount.toFixed(2)}
                          </span>
                        </div>
                      ))}
                      <div className="debt-total">
                        <span>Total Owes:</span>
                        <span className="total-red">
                          $
                          {memberDebts.owes
                            .reduce((sum, d) => sum + d.amount, 0)
                            .toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="breakdown-section">
                  <h4 className="receives-title">💰 Receives From Others</h4>
                  {memberDebts.receives.length === 0 ? (
                    <p className="no-debts">No debts owed to them</p>
                  ) : (
                    <div className="debts-list">
                      {memberDebts.receives.map((debt, idx) => (
                        <div key={idx} className="debt-item receives-item">
                          <span className="debt-person">← {debt.debtor}</span>
                          <span className="debt-amount-green">
                            ${debt.amount.toFixed(2)}
                          </span>
                        </div>
                      ))}
                      <div className="debt-total">
                        <span>Total Receives:</span>
                        <span className="total-green">
                          $
                          {memberDebts.receives
                            .reduce((sum, d) => sum + d.amount, 0)
                            .toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default MemberFilter;
