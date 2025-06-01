import { forwardRef } from 'react';

interface LineInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  darkMode: boolean;
}

export const LineInput = forwardRef<HTMLInputElement, LineInputProps>(
  ({ darkMode, className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`w-full py-2 px-1 bg-transparent border-b ${
          darkMode 
            ? 'border-white text-white placeholder-gray-300' 
            : 'border-black text-black placeholder-gray-500'
        } focus:outline-none focus:border-black-500 transition-colors ${className}`}
        {...props}
      />
    );
  }
);