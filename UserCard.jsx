import React from 'react';

function UserCard({ user }) {
  return (
    <div className="user-card">
      <p>{user.name}</p>
    </div>
  );
}

export default UserCard;
