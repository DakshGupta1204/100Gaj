import React, { createContext, useContext, useState } from 'react';

interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  toast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = ({ title, description, variant = 'default', duration = 5000 }: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, description, variant, duration }]);

    // Auto remove toast after duration
    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, toast, removeToast }}>
      {children}
      
      {/* Toast container */}
      <div className="fixed bottom-0 right-0 p-4 w-full sm:max-w-xs z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`rounded-lg shadow-lg p-4 flex items-start gap-3 transition-all duration-300 animate-slide-up ${
              toast.variant === 'destructive' ? 'bg-red-500' : 'bg-white'
            }`}
          >
            <div className={`flex-1 ${toast.variant === 'destructive' ? 'text-white' : 'text-black'}`}>
              <h4 className="font-medium">{toast.title}</h4>
              {toast.description && <p className="text-sm mt-1 opacity-90">{toast.description}</p>}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className={`text-sm font-medium ${toast.variant === 'destructive' ? 'text-white' : 'text-gray-500'}`}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export const toast = (toast: Omit<Toast, 'id'>) => {
  // This is a direct method to use in files where the hook can't be used
  // It will only work in browser context, so we check for window
  if (typeof window !== 'undefined') {
    const event = new CustomEvent('toast', { detail: toast });
    window.dispatchEvent(event);
  }
}; 