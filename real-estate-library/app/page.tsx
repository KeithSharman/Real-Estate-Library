'use client';

import { auth } from '../_utils/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function Home() {
  const [user, loading, error] = useAuthState(auth);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    <div>
      <h1>Test Page</h1>
      <p>User: {user ? user.email : 'Not signed in'}</p>
    </div>
  );
}