import React from 'react';
import { render, screen } from '@testing-library/react';
import UserCard from './UserCard';

describe('UserCard', () => {
  it('displays the user name', () => {
    const user = { name: 'Jane Doe' };
    render(<UserCard user={user} />);
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
  });

  it('displays a different name', () => {
    const user = { name: 'John Smith' };
    render(<UserCard user={user} />);
    expect(screen.getByText('John Smith')).toBeInTheDocument();
  });
});
