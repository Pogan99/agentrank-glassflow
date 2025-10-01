import { useState, InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  error?: string;
  showStrength?: boolean;
}

export const PasswordInput = ({
  label,
  error,
  showStrength = false,
  value,
  ...props
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const getPasswordStrength = (password: string): { label: string; color: string; width: string } => {
    const length = password.length;
    if (length === 0) return { label: "", color: "", width: "0%" };
    if (length < 8) return { label: "Too short", color: "bg-red-500", width: "33%" };
    if (length < 12) return { label: "Weak", color: "bg-yellow-500", width: "33%" };
    if (length < 16) return { label: "Medium", color: "bg-blue-500", width: "66%" };
    return { label: "Strong", color: "bg-green-500", width: "100%" };
  };

  const strength = showStrength && value ? getPasswordStrength(String(value)) : null;

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
            error
              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
              : "border-gray-300 focus:ring-[#2D5BFF] focus:border-[#2D5BFF]"
          }`}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>

      {/* Password Strength Indicator */}
      {showStrength && value && (
        <div className="mt-2">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full ${strength?.color} transition-all duration-300`}
              style={{ width: strength?.width }}
            />
          </div>
          <p className="text-xs text-gray-600 mt-1">{strength?.label}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-500 mt-1.5">{error}</p>
      )}
    </div>
  );
};
