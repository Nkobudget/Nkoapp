import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

const listeners = new Set();

export const showToast = (toastInput) => {
  const item = typeof toastInput === 'string'
    ? { title: toastInput, type: 'success' }
    : { ...toastInput };
  if (!item.id) {
    item.id = `toast_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  }
  if (!item.type) item.type = 'success';
  if (item.duration === undefined) item.duration = 5000;

  listeners.forEach((listener) => {
    try {
      listener(item);
    } catch (err) {
      console.warn('Toast dispatch error:', err);
    }
  });
  return item.id;
};

export const dismissToast = (id) => {
  listeners.forEach((listener) => {
    try {
      if (listener.dismiss) listener.dismiss(id);
    } catch {}
  });
};

export const toast = {
  success: (title, message, options = {}) =>
    showToast({ type: 'success', title, message, ...options }),
  error: (title, message, options = {}) =>
    showToast({ type: 'error', title, message, ...options }),
  info: (title, message, options = {}) =>
    showToast({ type: 'info', title, message, ...options }),
  dismiss: dismissToast,
};

export function useToast() {
  const context = useContext(ToastContext);
  if (context) return context;
  return {
    toasts: [],
    addToast: showToast,
    removeToast: dismissToast,
    toast,
  };
}

function ToastItem({ toast: t, onDismiss }) {
  const isSuccess = t.type === 'success';
  const isError = t.type === 'error';
  const isInfo = t.type === 'info';

  const tone = isSuccess
    ? {
        bg: 'linear-gradient(135deg, rgba(6, 78, 59, 0.96) 0%, rgba(4, 47, 46, 0.98) 100%)',
        border: 'rgba(52, 211, 153, 0.65)',
        shadow: '0 16px 48px rgba(0, 0, 0, 0.75), 0 0 28px rgba(16, 185, 129, 0.35)',
        iconColor: '#34D399',
        titleColor: '#F0FDF4',
        msgColor: '#A7F3D0',
        progressBar: '#10B981',
      }
    : isError
    ? {
        bg: 'linear-gradient(135deg, rgba(127, 29, 29, 0.96) 0%, rgba(69, 10, 10, 0.98) 100%)',
        border: 'rgba(239, 68, 68, 0.65)',
        shadow: '0 16px 48px rgba(0, 0, 0, 0.75), 0 0 28px rgba(239, 68, 68, 0.35)',
        iconColor: '#F87171',
        titleColor: '#FEF2F2',
        msgColor: '#FECACA',
        progressBar: '#EF4444',
      }
    : {
        bg: 'linear-gradient(135deg, rgba(30, 41, 59, 0.96) 0%, rgba(15, 23, 42, 0.98) 100%)',
        border: 'rgba(96, 165, 250, 0.65)',
        shadow: '0 16px 48px rgba(0, 0, 0, 0.75), 0 0 28px rgba(59, 130, 246, 0.35)',
        iconColor: '#60A5FA',
        titleColor: '#EFF6FF',
        msgColor: '#BFDBFE',
        progressBar: '#3B82F6',
      };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.92, filter: 'blur(3px)' }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -16, scale: 0.92, filter: 'blur(3px)' }}
      transition={{ type: 'spring', stiffness: 450, damping: 32, mass: 0.8 }}
      style={{
        pointerEvents: 'auto',
        background: tone.bg,
        border: `1px solid ${tone.border}`,
        borderRadius: 14,
        padding: '14px 16px',
        boxShadow: tone.shadow,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'Inter, Manrope, sans-serif',
        zIndex: 999999,
      }}
    >
      <div style={{ flexShrink: 0, marginTop: 1 }}>
        {isSuccess && <CheckCircle2 size={20} style={{ color: tone.iconColor }} strokeWidth={2.4} />}
        {isError && <AlertCircle size={20} style={{ color: tone.iconColor }} strokeWidth={2.4} />}
        {isInfo && <Info size={20} style={{ color: tone.iconColor }} strokeWidth={2.4} />}
      </div>

      <div style={{ flex: 1, minWidth: 0, paddingRight: 6 }}>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: tone.titleColor, letterSpacing: '-0.01em', lineHeight: 1.35 }}>
          {t.title}
        </div>
        {t.message && (
          <div style={{ fontSize: 12, color: tone.msgColor, marginTop: 3, lineHeight: 1.45, wordBreak: 'break-word' }}>
            {t.message}
          </div>
        )}
      </div>

      <button
        type="button"
        aria-label="Dismiss notification"
        onClick={() => onDismiss(t.id)}
        style={{
          background: 'none',
          border: 'none',
          color: tone.msgColor,
          opacity: 0.7,
          cursor: 'pointer',
          padding: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 6,
          flexShrink: 0,
          transition: 'opacity 0.15s ease',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; }}
        onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.7'; }}
      >
        <X size={15} />
      </button>

      {/* Auto-dismiss duration bar */}
      {t.duration > 0 && t.duration !== Infinity && (
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: t.duration / 1000, ease: 'linear' }}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            height: 2.5,
            background: tone.progressBar,
            opacity: 0.85,
          }}
        />
      )}
    </motion.div>
  );
}

export function ToastContainer({ toasts = [], onDismiss }) {
  const isBrowser = typeof document !== 'undefined';
  if (!isBrowser) return null;

  const content = (
    <div
      id="nko-toast-portal"
      aria-live="polite"
      aria-atomic="true"
      style={{
        position: 'fixed',
        top: 20,
        right: 20,
        zIndex: 999999, // Unconditionally higher than modal backdrop and overlay (1050)
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        width: 'calc(100vw - 40px)',
        maxWidth: 420,
        pointerEvents: 'none',
      }}
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  );

  return createPortal(content, document.body);
}

export default function ToastProvider({ children }) {
  const parentContext = useContext(ToastContext);
  if (parentContext) {
    return children;
  }

  const [toasts, setToasts] = useState([]);
  const timersRef = useRef(new Map());

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    if (timersRef.current.has(id)) {
      clearTimeout(timersRef.current.get(id));
      timersRef.current.delete(id);
    }
  }, []);

  const addToast = useCallback((toastItem) => {
    setToasts((prev) => {
      if (prev.some((t) => t.id === toastItem.id)) return prev;
      return [toastItem, ...prev];
    });

    if (toastItem.duration > 0 && toastItem.duration !== Infinity) {
      const timer = setTimeout(() => {
        removeToast(toastItem.id);
      }, toastItem.duration);
      timersRef.current.set(toastItem.id, timer);
    }
  }, [removeToast]);

  useEffect(() => {
    const handler = (item) => addToast(item);
    handler.dismiss = (id) => removeToast(id);
    listeners.add(handler);
    return () => {
      listeners.delete(handler);
      timersRef.current.forEach((t) => clearTimeout(t));
      timersRef.current.clear();
    };
  }, [addToast, removeToast]);

  const contextValue = {
    toasts,
    addToast,
    removeToast,
    toast,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  );
}
