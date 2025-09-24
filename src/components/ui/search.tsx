import React, { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { Search, X } from "lucide-react";
import { cn } from "./utils";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  showClearButton?: boolean;
  icon?: any;
  onFocus?: () => void;
  onBlur?: () => void;
  onKeyDown?: (e: any) => void;
}

const searchVariants = {
  primary: "bg-blue-500/20 border-blue-400/40 text-blue-300 placeholder-blue-300/60 focus:border-blue-400/60 focus:ring-blue-400/30",
  secondary: "bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-white/40 focus:ring-white/10",
  ghost: "bg-transparent border-transparent text-white placeholder-white/50 focus:border-white/20 focus:ring-white/10",
  outline: "bg-transparent border-white/20 text-white placeholder-white/50 focus:border-white/40 focus:ring-white/10"
};

const searchSizes = {
  sm: "px-3 h-10 text-xs",
  md: "px-3 h-12 text-sm",
  lg: "px-4 h-14 text-sm sm:text-base"
};

export const SearchInput = ({
  value,
  onChange,
  placeholder = "Search...",
  disabled = false,
  className,
  variant = "secondary",
  size = "md",
  fullWidth = false,
  showClearButton = true,
  icon,
  onFocus,
  onBlur,
  onKeyDown,
  ...props
}: SearchInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  const handleClear = () => {
    onChange("");
    inputRef.current?.focus();
  };

  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.();
  };

  const handleKeyDown = (e: any) => {
    // Clear on Escape key
    if (e.key === 'Escape' && value) {
      handleClear();
      e.preventDefault();
    }
    onKeyDown?.(e);
  };

  return (
    <div className={cn("relative", fullWidth ? "w-full" : "inline-block")}>
      <motion.div
        className={cn(
          "relative flex items-center rounded-xl border transition-all duration-200 focus-within:ring-2 hover:brightness-110",
          searchVariants[variant],
          searchSizes[size],
          disabled && "opacity-50 cursor-not-allowed hover:brightness-100",
          fullWidth && "w-full",
          className
        )}
      >
        {/* Search Icon */}
        <div className="flex-shrink-0 mr-2 sm:mr-3">
          {icon || <Search className="w-4 h-4 opacity-70" />}
        </div>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "flex-1 bg-transparent border-none outline-none text-inherit placeholder-inherit",
            "disabled:cursor-not-allowed"
          )}
          {...props}
        />

        {/* Clear Button */}
        {showClearButton && value && !disabled && (
          <motion.button
            type="button"
            onClick={handleClear}
            className="flex-shrink-0 ml-2 sm:ml-3 w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.1 }}
            aria-label="Clear search"
          >
            <X className="w-3 h-3 sm:w-4 sm:h-4 opacity-70" />
          </motion.button>
        )}
      </motion.div>
    </div>
  );
};

SearchInput.displayName = "SearchInput";

// Export specific search variants for convenience
export const PrimarySearchInput = (props: Omit<SearchInputProps, 'variant'>) => 
  <SearchInput variant="primary" {...props} />;
export const SecondarySearchInput = (props: Omit<SearchInputProps, 'variant'>) => 
  <SearchInput variant="secondary" {...props} />;
export const GhostSearchInput = (props: Omit<SearchInputProps, 'variant'>) => 
  <SearchInput variant="ghost" {...props} />;
export const OutlineSearchInput = (props: Omit<SearchInputProps, 'variant'>) => 
  <SearchInput variant="outline" {...props} />;
