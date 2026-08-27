'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { useAuthStore } from '@/store/authStore';

const PUBLIC_PATHS = ['/login', '/verify-2fa', '/'];
const subscribeToHydration = () => () => {};

export default function AuthGuard({ children, allowedRoles = [] }) {
  const router = useRouter();
  const pathname = usePathname();
  const { accessToken, user } = useAuthStore();
  const hasMounted = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  );
  const [sessionExpired, setSessionExpired] = useState(false);
  const redirectAttemptedRef = useRef(false);

  useEffect(() => {
    const handleSessionExpired = () => {
      useAuthStore.getState().logoutUser();
      setSessionExpired(true);
    };

    window.addEventListener('auth:session-expired', handleSessionExpired);

    return () => {
      window.removeEventListener('auth:session-expired', handleSessionExpired);
    };
  }, []);

  useEffect(() => {
    if (!hasMounted) {
      return;
    }

    if (PUBLIC_PATHS.includes(pathname)) {
      redirectAttemptedRef.current = false;
      return;
    }

    const roleId = Number(user?.roleId);

    if (!accessToken || !user) {
      if (!redirectAttemptedRef.current) {
        redirectAttemptedRef.current = true;
        useAuthStore.getState().logoutUser();
        router.replace('/login');
      }

      return;
    }

    redirectAttemptedRef.current = false;

    if (allowedRoles.length > 0 && !allowedRoles.includes(roleId)) {
      return;
    }

    if (pathname?.startsWith('/super-admin') && roleId !== 1) {
      return;
    }

    if (pathname?.startsWith('/pmo') && roleId !== 2) {
      return;
    }

    if (pathname?.startsWith('/dmo') && roleId !== 3) {
      return;
    }

    if (pathname?.startsWith('/hospital')) {
      if (roleId === 1) {
        return;
      }

      if (roleId === 2) {
        return;
      }

      if (roleId === 3) {
        return;
      }

      if (roleId !== 4 && roleId !== 5) {
        return;
      }
    }

  }, [accessToken, hasMounted, pathname, router, user, allowedRoles]);

  if (!hasMounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 shadow-sm">
          Checking access...
        </div>
      </div>
    );
  }

  return children;
  return (
    <>
      {children}
      {sessionExpired && !PUBLIC_PATHS.includes(pathname) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="session-expired-title"
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
          >
            <h2 id="session-expired-title" className="text-lg font-semibold text-slate-900">
              Session expired
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Your session has expired. Please log in again to continue.
            </p>
            <button
              type="button"
              onClick={() => router.replace('/login')}
              className="mt-6 w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Log in again
            </button>
          </div>
        </div>
      )}
    </>
  );
}
