'use client';

import Image from 'next/image';
import { useAuth } from './AuthProvider';
import { LogIn, LogOut, Loader2 } from 'lucide-react';

/**
 * Displays a Google Sign-In button when logged out,
 * or a user avatar with a sign-out option when logged in.
 */
export default function AuthButton() {
  const { user, loading, signInWithGoogle, signOut } = useAuth();

  if (loading) {
    return (
      <div className="w-8 h-8 flex items-center justify-center" aria-label="Loading auth state">
        <Loader2 className="h-4 w-4 animate-spin text-secondary" aria-hidden="true" />
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        {user.photoURL && (
          <Image
            src={user.photoURL}
            alt={`${user.displayName ?? 'User'} avatar`}
            width={32}
            height={32}
            className="rounded-full border-2 border-primary/20"
          />
        )}
        <button
          onClick={signOut}
          className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-secondary hover:text-primary transition-colors"
          aria-label="Sign out"
        >
          <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
          Sign out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={signInWithGoogle}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 transition-all shadow-md shadow-primary/20"
      aria-label="Sign in with Google"
    >
      <LogIn className="h-3.5 w-3.5" aria-hidden="true" />
      Sign in
    </button>
  );
}
