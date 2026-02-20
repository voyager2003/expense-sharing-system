import React, { useState } from 'react';
import './MembersSection.css';

function MembersSection({ members, onAddMember }) {
  const [newMemberName, setNewMemberName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newMemberName.trim()) {
      onAddMember(newMemberName);
      setNewMemberName('');
    }
  };

  return (
    <div className="members-section">
      <h2>👥 Group Members</h2>

      <form onSubmit={handleSubmit} className="add-member-form">
        <input
          type="text"
          placeholder="Enter member name"
          value={newMemberName}
          onChange={(e) => setNewMemberName(e.target.value)}
          className="member-input"
        />
        <button type="submit" className="btn-add-member">
          Add Member
        </button>
      </form>

      <div className="members-list">
        {members.length === 0 ? (
          <p className="empty-message">No members yet. Add one to get started!</p>
        ) : (
          <div className="member-cards">
            {members.map((member, index) => (
              <div key={index} className="member-card">
                <span className="member-number">{index + 1}</span>
                <span className="member-name">{member}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MembersSection;
