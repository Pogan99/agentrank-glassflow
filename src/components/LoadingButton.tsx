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
    primary: "bg-[#2D5BFF] text-white hover:brightness-110 focus:ring-2 focus:ring-[#2D5BFF] focus:ring-offset-2",
    secondary: "border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
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
