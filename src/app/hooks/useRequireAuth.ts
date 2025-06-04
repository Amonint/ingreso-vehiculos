import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../../firebase/config';

export function useRequireAuth() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.replace('/'); // Redirect to login if not authenticated
      }
    });
    return () => unsubscribe();
  }, [router]);
} 