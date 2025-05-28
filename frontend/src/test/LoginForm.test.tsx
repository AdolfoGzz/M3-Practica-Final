import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import type { FormEvent } from 'react';
import LoginForm from '../components/custom/LoginForm';

describe('LoginForm', () => {
  it('renders login form', () => {
    const mockSubmit = vi.fn((e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
    });
    render(
      <BrowserRouter>
        <LoginForm onSubmit={mockSubmit} loading={false} />
      </BrowserRouter>
    );
    
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('shows validation error for empty fields', async () => {
    const mockSubmit = vi.fn((e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
    });
    render(
      <BrowserRouter>
        <LoginForm onSubmit={mockSubmit} loading={false} />
      </BrowserRouter>
    );
    
    const loginButton = screen.getByRole('button', { name: /login/i });
    await userEvent.click(loginButton);

    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
  });

  it('submits form with valid data', async () => {
    const mockSubmit = vi.fn((e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
    });
    render(
      <BrowserRouter>
        <LoginForm onSubmit={mockSubmit} loading={false} />
      </BrowserRouter>
    );
    
    await userEvent.type(screen.getByPlaceholderText(/email/i), 'string');
    await userEvent.type(screen.getByPlaceholderText(/password/i), 'string');
    
    const loginButton = screen.getByRole('button', { name: /login/i });
    await userEvent.click(loginButton);

    expect(mockSubmit).toHaveBeenCalled();
  });

  it('handles form submission', async () => {
    const mockSubmit = vi.fn((e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
    });
    render(
      <BrowserRouter>
        <LoginForm onSubmit={mockSubmit} loading={false} />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: 'string' }
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'string' }
    });
    fireEvent.submit(screen.getByRole('button', { name: /login/i }));

    expect(mockSubmit).toHaveBeenCalled();
  });

  it('shows loading state', () => {
    const mockSubmit = vi.fn((e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
    });
    render(
      <BrowserRouter>
        <LoginForm onSubmit={mockSubmit} loading={true} />
      </BrowserRouter>
    );
    
    expect(screen.getByRole('button', { name: /logging in/i })).toBeInTheDocument();
  });
}); 