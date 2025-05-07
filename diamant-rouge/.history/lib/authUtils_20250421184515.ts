import { useRouter,  } from 'next/router';
import { useSession } from 'next-auth/react';

/**
 * Redirects to authentication page with proper action parameters
 * @param action The action to perform after authentication (favorite, cart, checkout)
 * @param productId Optional product ID for product-related actions
 * @param returnUrl URL to return to after authentication (defaults to current URL)
 */
export const redirectToAuth = (action: string, productId?: string | number, returnUrl?: string) => {
  const router = useRouter();
  const currentUrl = typeof window !== 'undefined' ? window.location.pathname + window.location.search : '/';
  
  const params = new URLSearchParams();
  params.append('action', action);
  if (productId) params.append('productId', productId.toString());
  params.append('returnUrl', returnUrl || currentUrl);
  
  router.push(`/auth?${params.toString()}`);
};

/**
 * Custom hook to check if user is authenticated and redirect if not
 * @param action The action to perform after authentication
 * @param productId Optional product ID for product-related actions
 * @returns Authentication state: {isAuthenticated, isLoading}
 */
export const useAuthGuard = (action: string, productId?: string | number) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isLoading = status === "loading";
  const isAuthenticated = !!session;
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      redirectToAuth(action, productId);
    }
  }, [isAuthenticated, isLoading, action, productId]);
  
  return { isAuthenticated, isLoading };
};