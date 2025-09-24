import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown } from "lucide-react";
import { cn } from "./utils";

export interface DropdownOption {
  value: string;
  label: string;
  icon?: any;
  disabled?: boolean;
}

interface DropdownProps {
  options: DropdownOption[];
  value?: string;
  placeholder?: string;
  onSelect: (value: string) => void;
  disabled?: boolean;
  className?: string;
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

const dropdownVariants = {
  primary: "bg-blue-500/20 border-blue-400/40 text-blue-300 hover:bg-blue-500/30",
  secondary: "bg-white/10 border-white/20 text-white hover:bg-white/20",
  ghost: "bg-transparent border-transparent text-white hover:bg-white/10",
  outline: "bg-transparent border-white/20 text-white hover:bg-white/10"
};

const dropdownSizes = {
  sm: "px-3 h-10 text-xs",
  md: "px-3 h-12 text-sm",
  lg: "px-4 h-14 text-sm sm:text-base"
};

export const Dropdown = ({
  options,
  value,
  placeholder = "Select an option...",
  onSelect,
  disabled = false,
  className,
  variant = "secondary",
  size = "md",
  fullWidth = false
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const selectedOption = options.find(option => option.value === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleSelect = (optionValue: string) => {
    onSelect(optionValue);
    setIsOpen(false);
  };

  return (
    <div 
      ref={dropdownRef}
      className={cn(
        "relative",
        fullWidth ? "w-full" : "inline-block"
      )}
    >
      <motion.button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={cn(
          "flex items-center justify-between gap-3 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 border hover:brightness-110",
          dropdownVariants[variant],
          dropdownSizes[size],
          disabled && "opacity-50 cursor-not-allowed hover:brightness-100",
          fullWidth && "w-full",
          className
        )}
        disabled={disabled}
        whileTap={disabled ? {} : { scale: 0.98 }}
        transition={{ duration: 0.1 }}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {selectedOption?.icon && (
            <span className="flex-shrink-0">{selectedOption.icon}</span>
          )}
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          <ChevronDown className="w-4 h-4 opacity-70" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-10 md:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown menu */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "absolute top-full left-0 mt-2 bg-black/80 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden shadow-xl z-20 max-h-60 overflow-y-auto",
                fullWidth ? "w-full" : "min-w-[200px]"
              )}
              role="listbox"
            >
              {options.map((option, index) => (
                <motion.button
                  key={option.value}
                  type="button"
                  onClick={() => !option.disabled && handleSelect(option.value)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors",
                    option.disabled 
                      ? "opacity-50 cursor-not-allowed text-white/40" 
                      : "hover:bg-white/10 text-white/80 hover:text-white",
                    selectedOption?.value === option.value && "bg-white/5 text-white"
                  )}
                  whileHover={option.disabled ? {} : { x: 4 }}
                  transition={{ duration: 0.1 }}
                  disabled={option.disabled}
                  role="option"
                  aria-selected={selectedOption?.value === option.value}
                >
                  {option.icon && (
                    <span className="flex-shrink-0">{option.icon}</span>
                  )}
                  <span className="truncate">{option.label}</span>
                </motion.button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

Dropdown.displayName = "Dropdown";

// Export specific dropdown variants for convenience
export const PrimaryDropdown = (props: Omit<DropdownProps, 'variant'>) => 
  <Dropdown variant="primary" {...props} />;
export const SecondaryDropdown = (props: Omit<DropdownProps, 'variant'>) => 
  <Dropdown variant="secondary" {...props} />;
export const GhostDropdown = (props: Omit<DropdownProps, 'variant'>) => 
  <Dropdown variant="ghost" {...props} />;
export const OutlineDropdown = (props: Omit<DropdownProps, 'variant'>) => 
  <Dropdown variant="outline" {...props} />;
