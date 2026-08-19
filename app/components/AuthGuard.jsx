'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { useAuthStore } from '@/store/authStore';

const PUBLIC_PATHS = ['/login', '/verify-2fa', '/'];

export default function AuthGuard({ children, allowedRoles = [] }) {
  const router = useRouter();
  const pathname = usePathname();
  const { accessToken, user } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);
  const redirectAttemptedRef = useRef(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted) {
      return;
    }

    if (PUBLIC_PATHS.includes(pathname)) {
      redirectAttemptedRef.current = false;
      setIsChecking(false);
      return;
    }

    const roleId = Number(user?.roleId);

    if (!accessToken || !user) {
      if (!redirectAttemptedRef.current) {
        redirectAttemptedRef.current = true;
        useAuthStore.getState().logoutUser();
        router.replace('/login');
      }

      setIsChecking(false);
      return;
    }

    redirectAttemptedRef.current = false;

    if (allowedRoles.length > 0 && !allowedRoles.includes(roleId)) {
      setIsChecking(false);
      return;
    }

    if (pathname?.startsWith('/super-admin') && roleId !== 1) {
      setIsChecking(false);
      return;
    }

    if (pathname?.startsWith('/pmo') && roleId !== 2) {
      setIsChecking(false);
      return;
    }

    if (pathname?.startsWith('/dmo') && roleId !== 3) {
      setIsChecking(false);
      return;
    }

    if (pathname?.startsWith('/hospital')) {
      if (roleId === 1) {
        setIsChecking(false);
        return;
      }

      if (roleId === 2) {
        setIsChecking(false);
        return;
      }

      if (roleId === 3) {
        setIsChecking(false);
        return;
      }

      if (roleId !== 4 && roleId !== 5) {
        setIsChecking(false);
        return;
      }
    }

    setIsChecking(false);
  }, [accessToken, hasMounted, pathname, router, user, allowedRoles]);

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 shadow-sm">
          Checking access...
        </div>
      </div>
    );
  }

  return children;
}
