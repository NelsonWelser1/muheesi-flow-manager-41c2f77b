
import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from './supabase.js';
import { useQueryClient } from '@tanstack/react-query';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';

const SupabaseAuthContext = createContext();

export const SupabaseAuthProvider = ({ children }) => {
  return (
    <SupabaseAuthProviderInner>
      {children}
    </SupabaseAuthProviderInner>
  );
}

export const SupabaseAuthProviderInner = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    let isMounted = true;
    
    const getSession = async () => {
      try {
        if (!isMounted) return;
        setLoading(true);
        
        const { data, error } = await supabase.auth.getSession();
        
        if (error && isMounted) {
          console.error("Auth session error:", error);
          setError(error);
          return;
        }
        
        if (isMounted) {
          setSession(data.session);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Auth session error:", err);
          setError(err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // Setup auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (isMounted) {
        console.log("Auth state changed:", event);
        setSession(newSession);
        queryClient.invalidateQueries('user');
      }
    });

    // Get initial session
    getSession();

    // Cleanup function
    return () => {
      isMounted = false;
      if (authListener?.subscription?.unsubscribe) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [queryClient]);

  const logout = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setSession(null);
      queryClient.invalidateQueries('user');
    } catch (err) {
      console.error("Logout error:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SupabaseAuthContext.Provider 
      value={{ 
        session, 
        loading, 
        error,
        logout,
        isLoggedIn: !!session 
      }}
    >
      {children}
    </SupabaseAuthContext.Provider>
  );
};

export const useSupabaseAuth = () => {
  const context = useContext(SupabaseAuthContext);
  if (!context) {
    throw new Error('useSupabaseAuth must be used within a SupabaseAuthProvider');
  }
  return context;
};

export const SupabaseAuthUI = () => (
  <Auth
    supabaseClient={supabase}
    appearance={{ theme: ThemeSupa }}
    theme="default"
    providers={[]}
  />
);
