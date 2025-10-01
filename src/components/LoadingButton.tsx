import { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";

interface LoadingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  children: ReactNode;
  variant?: "primary" | "secondary";
}

export const LoadingButton = ({
  isLoading = false,
  children,
  variant = "primary",
  className = "",
  disabled,
  ...props
}: LoadingButtonProps) => {
  const baseStyles = "w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantStyles = {
    primary: "bg-accent text-accent-foreground hover:bg-accent/90 focus:ring-2 focus:ring-accent focus:ring-offset-2 shadow-lg shadow-accent/20",
    secondary: "bg-background/50 border border-border text-foreground hover:bg-accent/10 hover:border-accent/50 focus:ring-2 focus:ring-accent focus:ring-offset-2 backdrop-blur-sm"
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
      {children}
    </button>
  );
};
