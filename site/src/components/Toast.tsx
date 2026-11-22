/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { m, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastProps {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
  onClose: (id: string) => void;
}

const TOAST_CONFIG: Record<ToastType, { icon: typeof Info; color: string }> = {
  success: { icon: CheckCircle2, color: 'var(--ok)' },
  error: { icon: XCircle, color: 'var(--danger)' },
  info: { icon: Info, color: 'var(--accent)' },
  warning: { icon: AlertTriangle, color: 'var(--warn)' },
};

export function Toast({ id, type, message, duration = 3200, onClose }: ToastProps) {
  const { icon: Icon, color } = TOAST_CONFIG[type];

  useEffect(() => {
    const timer = setTimeout(() => onClose(id), duration);
    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  return (
    <m.div
      role={type === 'error' ? 'alert' : undefined}
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 24, scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 480, damping: 36 }}
      className="popover relative flex w-[min(360px,calc(100vw-2rem))] items-start gap-3 overflow-hidden px-3.5 py-3"
      style={{ ['--c' as string]: color }}
    >
      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-[6px]" style={{ background: 'color-mix(in srgb, var(--c) 14%, transparent)', color }}>
        <Icon className="h-3.5 w-3.5" />
      </span>
      <p className="flex-1 pt-0.5 text-[13.5px] leading-snug text-[var(--fg)]">{message}</p>
      <button
        type="button"
        onClick={() => onClose(id)}
        aria-label="Dismiss"
        className="icon-btn -mr-1.5 -mt-1 h-7 w-7"
      >
        <X className="h-3.5 w-3.5" />
      </button>
      <m.span
        aria-hidden="true"
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: duration / 1000, ease: 'linear' }}
        className="absolute bottom-0 left-0 h-[2px] w-full origin-left"
        style={{ background: color, opacity: 0.7 }}
      />
    </m.div>
  );
}

export interface ToastContainerProps {
  toasts: ToastProps[];
  onClose: (id: string) => void;
}

/**
 * One live region that is always mounted, so a screen reader is already listening when a
 * toast is added (a region created with its message is often missed). Portalled to <body>:
 * #root is inert while a dialog is open, and a toast must still be read then.
 */
export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  return createPortal(
    <div aria-live="polite" className="pointer-events-none fixed bottom-5 right-5 z-[130] flex flex-col items-end gap-2">
      <AnimatePresence>
        {toasts.map(toast => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast {...toast} onClose={onClose} />
          </div>
        ))}
      </AnimatePresence>
    </div>,
    document.body,
  );
}
