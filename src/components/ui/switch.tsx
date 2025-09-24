import React from "react";
import { motion } from "motion/react";
import { cn } from "./utils";

interface SwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "success" | "warning" | "destructive";
  className?: string;
  id?: string;
  name?: string;
  label?: string;
  description?: string;
  icon?: React.ReactNode;
}

const switchVariants = {
  primary: {
    track: "bg-blue-500/20 border-blue-400/40",
    checked: "bg-blue-500/30 border-blue-400/60",
    thumb: "bg-blue-400"
  },
  secondary: {
    track: "bg-white/15 border-white/20",
    checked: "bg-white/30 border-white/40",
    thumb: "bg-white"
  },
  success: {
    track: "bg-green-500/20 border-green-400/40",
    checked: "bg-green-500/30 border-green-400/60",
    thumb: "bg-green-400"
  },
  warning: {
    track: "bg-yellow-500/20 border-yellow-400/40",
    checked: "bg-yellow-500/30 border-yellow-400/60",
    thumb: "bg-yellow-400"
  },
  destructive: {
    track: "bg-red-500/20 border-red-400/40",
    checked: "bg-red-500/30 border-red-400/60",
    thumb: "bg-red-400"
  }
};

const switchSizes = {
  sm: {
    track: "w-8 h-4",
    thumb: "w-3 h-3",
    translate: "translate-x-4"
  },
  md: {
    track: "w-11 h-6",
    thumb: "w-5 h-5",
    translate: "translate-x-5"
  },
  lg: {
    track: "w-14 h-7",
    thumb: "w-6 h-6",
    translate: "translate-x-7"
  }
};

export const Switch = ({
  checked = false,
  onChange,
  disabled = false,
  size = "md",
  variant = "secondary",
  className,
  id,
  name,
  label,
  description,
  icon,
  ...props
}: SwitchProps) => {
  const handleToggle = () => {
    if (!disabled && onChange) {
      onChange(!checked);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      handleToggle();
    }
  };

  const variantStyles = switchVariants[variant];
  const sizeStyles = switchSizes[size];

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {icon && (
        <div className="text-white/70 text-lg">
          {icon}
        </div>
      )}
      
      <div className="flex-1">
        {label && (
          <label
            htmlFor={id}
            className={cn(
              "block text-sm font-medium cursor-pointer select-none",
              disabled ? "text-white/40" : "text-white/90"
            )}
          >
            {label}
          </label>
        )}
        {description && (
          <p className={cn(
            "text-xs mt-1",
            disabled ? "text-white/30" : "text-white/60"
          )}>
            {description}
          </p>
        )}
      </div>

      <motion.button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={label ? `${id}-label` : undefined}
        aria-describedby={description ? `${id}-description` : undefined}
        disabled={disabled}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        className={cn(
          "relative inline-flex items-center rounded-full border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/20",
          sizeStyles.track,
          checked ? variantStyles.checked : variantStyles.track,
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:scale-105 active:scale-95"
        )}
        whileHover={!disabled ? { scale: 1.05 } : {}}
        whileTap={!disabled ? { scale: 0.95 } : {}}
        {...props}
      >
        <motion.span
          className={cn(
            "inline-block rounded-full transition-all duration-200 shadow-sm",
            sizeStyles.thumb,
            checked ? variantStyles.thumb : "bg-white/70"
          )}
          animate={{
            x: checked ? 0 : -sizeStyles.translate.replace("translate-x-", "").replace("px", "px"),
          }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30
          }}
        />
      </motion.button>
    </div>
  );
};

// Preset components for common use cases
export const PrimarySwitch = (props: Omit<SwitchProps, "variant">) => (
  <Switch variant="primary" {...props} />
);

export const SecondarySwitch = (props: Omit<SwitchProps, "variant">) => (
  <Switch variant="secondary" {...props} />
);

export const SuccessSwitch = (props: Omit<SwitchProps, "variant">) => (
  <Switch variant="success" {...props} />
);

export const WarningSwitch = (props: Omit<SwitchProps, "variant">) => (
  <Switch variant="warning" {...props} />
);

export const DestructiveSwitch = (props: Omit<SwitchProps, "variant">) => (
  <Switch variant="destructive" {...props} />
);
