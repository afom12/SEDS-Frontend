import { useState, useCallback } from 'react';

let toastId = 0;

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((type, message, duration = 5000) => {
    const id = ++toastId;
    const newToast = { id, type, message, duration };
    
    setToasts((prev) => [...prev, newToast]);
    
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback((message, duration) => {
    return showToast('success', message, duration);
  }, [showToast]);

  const error = useCallback((message, duration) => {
    return showToast('error', message, duration);
  }, [showToast]);

  const warning = useCallback((message, duration) => {
    return showToast('warning', message, duration);
  }, [showToast]);

  const info = useCallback((message, duration) => {
    return showToast('info', message, duration);
  }, [showToast]);

  return {
    toasts,
    success,
    error,
    warning,
    info,
    removeToast,
  };
};

