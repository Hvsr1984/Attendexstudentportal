"use client";

import React, { InputHTMLAttributes, ButtonHTMLAttributes } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideIcon, X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';

// ==========================================
// CARD COMPONENT
// ==========================================
interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = "", 
  onClick, 
  hoverEffect = false 
}) => {
  return (
    <motion.div
      onClick={onClick}
      whileHover={hoverEffect && !onClick ? {} : hoverEffect ? { y: -4, boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.1)" } : {}}
      transition={{ duration: 0.2 }}
      className={`bg-card text-card-foreground border border-border rounded-md p-6 shadow-sm overflow-hidden relative ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </motion.div>
  );
};

// ==========================================
// BUTTON COMPONENT
// ==========================================
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  isLoading = false,
  className = "",
  disabled,
  ...props
}) => {
  const baseStyle = "inline-flex items-center justify-center font-medium rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";
  
  const variants = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/95 shadow-sm",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border",
    success: "bg-accent text-accent-foreground hover:bg-accent/90 shadow-sm",
    danger: "bg-rose-600 text-white hover:bg-rose-500 shadow-sm",
    ghost: "hover:bg-muted text-foreground"
  };

  const sizes = {
    sm: "h-9 px-3 text-sm gap-1.5",
    md: "h-10 px-4 py-2 gap-2",
    lg: "h-11 px-8 text-base gap-2.5"
  };

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...(props as any)}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : Icon ? (
        <Icon className="h-4.5 w-4.5" />
      ) : null}
      {children}
    </motion.button>
  );
};

// ==========================================
// INPUT COMPONENT
// ==========================================
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: LucideIcon;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon: Icon,
  className = "",
  type = "text",
  ...props
}) => {
  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-foreground/80">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3 text-muted-foreground">
            <Icon className="h-4 w-4" />
          </div>
        )}
        <input
          type={type}
          className={`flex h-10 w-full rounded-sm border border-border bg-card px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50 ${
            Icon ? 'pl-10' : ''
          } ${error ? 'border-rose-500 focus-visible:ring-rose-500' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && (
        <span className="text-xs text-rose-500 font-medium">
          {error}
        </span>
      )}
    </div>
  );
};

// ==========================================
// BADGE COMPONENT
// ==========================================
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  className = ""
}) => {
  const styles = {
    success: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/50",
    warning: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/50",
    danger: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/50",
    info: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/50",
    neutral: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
};

// ==========================================
// DIALOG COMPONENT
// ==========================================
interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  children
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm"
          />

          {/* Dialog Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="bg-card border border-border w-full max-w-lg rounded-md p-6 shadow-xl relative z-10 overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                {title}
              </h3>
              <button 
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground p-1.5 hover:bg-muted rounded-full transition-colors"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>
            <div>
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// ==========================================
// SKELETON LOADERS
// ==========================================
export const Skeleton: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`animate-pulse bg-muted rounded-sm ${className}`} />
  );
};

// ==========================================
// TOAST NOTIFICATIONS SYSTEM
// ==========================================
export type ToastType = 'success' | 'warning' | 'error' | 'info';

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

export const Toast: React.FC<{
  message: string;
  type: ToastType;
  onClose: () => void;
}> = ({ message, type, onClose }) => {
  const icons = {
    success: <CheckCircle className="h-5 w-5 text-emerald-500" />,
    warning: <AlertTriangle className="h-5 w-5 text-amber-500" />,
    error: <AlertCircle className="h-5 w-5 text-rose-500" />,
    info: <Info className="h-5 w-5 text-blue-500" />
  };

  const borders = {
    success: "border-l-4 border-l-emerald-500",
    warning: "border-l-4 border-l-amber-500",
    error: "border-l-4 border-l-rose-500",
    info: "border-l-4 border-l-blue-500"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      className={`bg-card text-card-foreground border border-border shadow-lg rounded-sm p-4 flex items-center justify-between gap-3 max-w-sm w-full ${borders[type]}`}
    >
      <div className="flex items-center gap-3">
        {icons[type]}
        <span className="text-sm font-medium">{message}</span>
      </div>
      <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  );
};
