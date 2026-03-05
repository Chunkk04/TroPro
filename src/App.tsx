import React, { useState, useEffect } from 'react';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ManagePage } from './pages/ManagePage';
import { StorePage } from './pages/StorePage';
import { AnimatePresence, motion } from 'motion/react';
import { supabase } from './lib/supabase';
import { Session } from '@supabase/supabase-js';

type Page = 'home' | 'login' | 'register' | 'forgot-password' | 'manage' | 'store';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentPage('home');
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentPage}
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -10 }}
        transition={{ duration: 0.3 }}
        className="min-h-screen"
      >
        {currentPage === 'home' && (
          <HomePage 
            onNavigate={handleNavigate} 
            user={session?.user || null} 
            onLogout={handleLogout} 
          />
        )}
        {currentPage === 'login' && <LoginPage onNavigate={handleNavigate} />}
        {currentPage === 'register' && <RegisterPage onNavigate={handleNavigate} />}
        {currentPage === 'forgot-password' && <ForgotPasswordPage onNavigate={handleNavigate} />}
        {currentPage === 'store' && (
          <StorePage 
            onNavigate={handleNavigate} 
            user={session?.user || null} 
            onLogout={handleLogout} 
          />
        )}
        {currentPage === 'manage' && (
          <ManagePage 
            onNavigate={handleNavigate} 
            user={session?.user || null} 
            onLogout={handleLogout} 
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
}
