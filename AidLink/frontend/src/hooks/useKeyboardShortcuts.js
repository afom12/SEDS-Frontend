import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const useKeyboardShortcuts = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl/Cmd + K for search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        // Focus search input if available
        const searchInput = document.querySelector('input[type="search"], input[placeholder*="Search"]');
        if (searchInput) {
          searchInput.focus();
        }
      }

      // Escape to close modals/dialogs
      if (e.key === 'Escape') {
        const modals = document.querySelectorAll('[role="dialog"]');
        modals.forEach((modal) => {
          if (modal.style.display !== 'none') {
            const closeButton = modal.querySelector('[aria-label*="close"], [aria-label*="Close"]');
            if (closeButton) {
              closeButton.click();
            }
          }
        });
      }

      // Ctrl/Cmd + / for help
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        // Could open help modal or documentation
        console.log('Help shortcut pressed');
      }

      // Alt + D for dashboard (when logged in)
      if (e.altKey && e.key === 'd' && user) {
        e.preventDefault();
        const role = user.role.toLowerCase();
        navigate(`/${role}/dashboard`);
      }

      // Alt + L for logout (when logged in)
      if (e.altKey && e.key === 'l' && user) {
        e.preventDefault();
        logout();
        navigate('/');
      }

      // Alt + H for home
      if (e.altKey && e.key === 'h') {
        e.preventDefault();
        navigate('/');
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigate, user, logout]);
};

export default useKeyboardShortcuts;

