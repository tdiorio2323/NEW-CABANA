import React from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'default' | 'lg';
}

const Button: React.FC<ButtonProps> = ({
  className,
  variant = 'primary',
  size = 'default',
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center rounded-xl font-semibold tracking-wide transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A] focus-visible:ring-[var(--brand-red)] disabled:pointer-events-none disabled:opacity-50';

  const variantClasses = {
    primary: 'bg-[var(--brand-red)] text-white hover:opacity-90 shadow-[var(--glow-shadow)]',
    outline: 'border border-white/20 bg-transparent hover:bg-white/10 text-white',
    ghost: 'hover:bg-white/10 text-white',
  };

  const sizeClasses = {
    default: 'h-11 px-6 py-2 text-sm',
    lg: 'h-12 px-8 text-base',
  };

  return (
    <button
      className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
      {...props}
    />
  );
};

export default Button;