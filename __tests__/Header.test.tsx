// Mock Firebase to avoid needing real credentials in tests
jest.mock('@/lib/firebase', () => ({
  app: {},
  db: {},
  auth: {},
}));

// Mock AuthProvider to control auth state in tests
jest.mock('@/components/AuthProvider', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useAuth: () => ({ user: null, loading: false, signInWithGoogle: jest.fn(), signOut: jest.fn() }),
}));

import { render, screen, fireEvent } from '@testing-library/react';
import Header from '@/components/Header';

describe('Header', () => {
  it('renders the site name', () => {
    render(<Header />);
    expect(screen.getByText(/Electo/i)).toBeInTheDocument();
  });

  it('renders all main navigation links', () => {
    render(<Header />);
    expect(screen.getAllByText(/AI Assistant/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Timeline/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Guides/i).length).toBeGreaterThan(0);
  });

  it('has a logo link that points to the homepage', () => {
    render(<Header />);
    const logoLink = screen.getByRole('link', { name: /ElectoAI Home/i });
    expect(logoLink).toHaveAttribute('href', '/');
  });

  it('mobile menu button has accessible aria-label and aria-expanded', () => {
    render(<Header />);
    const menuButton = screen.getByRole('button', { name: /Open navigation menu/i });
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('opens the mobile menu when the toggle button is clicked', () => {
    render(<Header />);
    const menuButton = screen.getByRole('button', { name: /Open navigation menu/i });
    fireEvent.click(menuButton);
    expect(menuButton).toHaveAttribute('aria-expanded', 'true');
    // Mobile nav should appear
    expect(screen.getByRole('navigation', { name: /Mobile navigation/i })).toBeInTheDocument();
  });

  it('closes the mobile menu when the toggle button is clicked again', () => {
    render(<Header />);
    const menuButton = screen.getByRole('button', { name: /Open navigation menu/i });
    fireEvent.click(menuButton); // open
    fireEvent.click(screen.getByRole('button', { name: /Close navigation menu/i })); // close
    expect(
      screen.queryByRole('navigation', { name: /Mobile navigation/i })
    ).not.toBeInTheDocument();
  });
});
