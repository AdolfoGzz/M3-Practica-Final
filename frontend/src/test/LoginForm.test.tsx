import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import type { FormEvent } from 'react';
import LoginForm from '../components/custom/LoginForm';
import { render, screen } from './test-utils';

describe('LoginForm', () => {
  it('renders login form', () => {
    const mockSubmit = vi.fn((e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
    });
    render(<LoginForm onSubmit={mockSubmit} loading={false} />);
    
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('shows validation error for empty fields', async () => {
    const mockSubmit = vi.fn((e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
    });
    render(<LoginForm onSubmit={mockSubmit} loading={false} />);
    
    const loginButton = screen.getByRole('button', { name: /login/i });
    await userEvent.click(loginButton);

    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
  });

  it('submits form with valid data', async () => {
    const mockSubmit = vi.fn((e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
    });
    render(<LoginForm onSubmit={mockSubmit} loading={false} />);
    
    await userEvent.type(screen.getByPlaceholderText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByPlaceholderText(/password/i), 'password123');
    
    const loginButton = screen.getByRole('button', { name: /login/i });
    await userEvent.click(loginButton);

    expect(mockSubmit).toHaveBeenCalled();
  });

  it('shows loading state', () => {
    const mockSubmit = vi.fn((e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
    });
    render(<LoginForm onSubmit={mockSubmit} loading={true} />);
    
    expect(screen.getByRole('button', { name: /logging in/i })).toBeInTheDocument();
  });
}); 