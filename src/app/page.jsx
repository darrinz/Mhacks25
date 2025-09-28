'use client';

import { useUser } from '@auth0/nextjs-auth0';

export default function Index() {
  const { user, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;

  if (user) {
    return (
      <div>
        <p>Hello, {user.name}!</p>
        <a href="/auth/logout">Logout</a>
      </div>
    );
  }

  return <a href="/auth/login">Login</a>;
}
