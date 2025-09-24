import React from "react";
import { motion } from "motion/react";
import { cn } from "./utils";

interface ButtonProps {
  variant?: "primary" | "secondary" | "destructive" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  loadingText?: string;
  icon?: any;
  children?: any;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
}

const buttonVariants = {
  primary: "bg-blue-500/20 border border-blue-400/40 text-blue-300 hover:bg-blue-500/30 active:bg-blue-500/40 focus:ring-blue-400/30",
  secondary: "bg-white/10 border border-white/20 text-white hover:bg-white/20 active:bg-white/30 focus:ring-white/30",
  destructive: "bg-red-500/20 border border-red-400/40 text-red-300 hover:bg-red-500/30 active:bg-red-500/40 focus:ring-red-400/30",
  ghost: "bg-transparent border border-transparent text-white hover:bg-white/10 active:bg-white/20 focus:ring-white/30",
  outline: "bg-transparent border border-white/20 text-white hover:bg-white/10 active:bg-white/20 focus:ring-white/30"
};

const buttonSizes = {
  sm: "px-3 h-10 text-xs",
  md: "px-3 h-12 text-sm",
  lg: "px-4 h-14 text-sm sm:text-base"
};

const LoadingSpinner = () => (
  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" className="opacity-25"/>
    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
  </svg>
);

export const Button = ({ 
  className, 
  variant = "primary", 
  size = "md", 
  isLoading = false, 
  loadingText,
  icon,
  children, 
  disabled,
  onClick,
  type = "button",
  ...props 
}: ButtonProps) => {
  const isDisabled = disabled || isLoading;
  
  return (
    <motion.button
      type={type}
      className={cn(
        "flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent",
        buttonVariants[variant],
        buttonSizes[size],
        className
      )}
      disabled={isDisabled}
      onClick={onClick}
      whileHover={{ scale: isDisabled ? 1 : 1.02 }}
      whileTap={{ scale: isDisabled ? 1 : 0.98 }}
      transition={{ duration: 0.1 }}
      {...props}
    >
      {isLoading ? (
        <>
          <LoadingSpinner />
          {loadingText || children}
        </>
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
    </motion.button>
  );
};

Button.displayName = "Button";

// Export specific button variants for convenience
export const PrimaryButton = (props: Omit<ButtonProps, 'variant'>) => <Button variant="primary" {...props} />;
export const SecondaryButton = (props: Omit<ButtonProps, 'variant'>) => <Button variant="secondary" {...props} />;
export const DestructiveButton = (props: Omit<ButtonProps, 'variant'>) => <Button variant="destructive" {...props} />;
export const GhostButton = (props: Omit<ButtonProps, 'variant'>) => <Button variant="ghost" {...props} />;
export const OutlineButton = (props: Omit<ButtonProps, 'variant'>) => <Button variant="outline" {...props} />;