/**
 * Toast Notification System
 * Uses react-hot-toast for notifications
 */

import { Toaster } from 'react-hot-toast';

export const ToastProvider = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#1a1a1a',
          color: '#ffffff',
          border: '1px solid rgba(230, 200, 115, 0.2)',
          borderRadius: '8px',
        },
        success: {
          iconTheme: {
            primary: '#E6C873',
            secondary: '#1a1a1a',
          },
        },
        error: {
          iconTheme: {
            primary: '#E5005A',
            secondary: '#1a1a1a',
          },
        },
      }}
    />
  );
};

// Export toast utilities for convenience
export { toast } from 'react-hot-toast';
