import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { getJSON, removeItem, setJSON } from '../utils/storage';
import { normalizeEmail } from '../utils/validation';
import type { AuthContextValue, User } from '../types';

const USERS_KEY = '@auth_app/users';
const SESSION_KEY = '@auth_app/session';

// Passwords live next to the user record in plain text. That's acceptable for a
// local demo with no backend; in production the app would only ever hand the
// password to a server that hashes it and never store it on the device.
type StoredUser = User & { password: string };

// Enough delay for the loading states to actually be visible, standing in for
// the network round-trip a real login would make.
const FAKE_LATENCY_MS = 600;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isRestoring, setIsRestoring] = useState(true);

  useEffect(() => {
    getJSON<User>(SESSION_KEY)
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setIsRestoring(false));
  }, []);

  async function signup(name: string, email: string, password: string) {
    await delay(FAKE_LATENCY_MS);

    const address = normalizeEmail(email);
    const users = (await getJSON<StoredUser[]>(USERS_KEY)) ?? [];

    if (users.some((existing) => existing.email === address)) {
      throw new Error('An account with this email already exists.');
    }

    const created: StoredUser = { name: name.trim(), email: address, password };
    await setJSON(USERS_KEY, [...users, created]);

    await startSession({ name: created.name, email: created.email });
  }

  async function login(email: string, password: string) {
    await delay(FAKE_LATENCY_MS);

    const address = normalizeEmail(email);
    const users = (await getJSON<StoredUser[]>(USERS_KEY)) ?? [];
    const match = users.find(
      (existing) => existing.email === address && existing.password === password
    );

    // One message for both "no such email" and "wrong password" on purpose —
    // separate messages would let someone probe which addresses are registered.
    if (!match) {
      throw new Error('Incorrect email or password.');
    }

    await startSession({ name: match.name, email: match.email });
  }

  async function logout() {
    await removeItem(SESSION_KEY);
    setUser(null);
  }

  async function startSession(session: User) {
    await setJSON(SESSION_KEY, session);
    setUser(session);
  }

  // Nothing below closes over state, so user/isRestoring are the only real deps.
  const value = useMemo<AuthContextValue>(
    () => ({ user, isRestoring, login, signup, logout }),
    [user, isRestoring]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be called inside an <AuthProvider>.');
  }
  return context;
}
