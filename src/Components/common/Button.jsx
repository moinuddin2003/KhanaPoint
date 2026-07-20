import { Loader2 } from "lucide-react";

/**
 * Reusable Button.
 *
 * Usage:
 *   <Button onClick={handleSave}>Save</Button>
 *   <Button variant="outline">Cancel</Button>
 *   <Button variant="danger" loading={deleting}>Delete</Button>
 *   <Button variant="ghost" size="sm">Edit</Button>
 *
 * Props:
 *   variant: "primary" | "outline" | "danger" | "ghost"  (default "primary")
 *   size:    "sm" | "md" | "lg"                            (default "md")
 *   loading: boolean - shows a spinner and disables the button
 *   full:    boolean - makes the button w-full
 *   All other props (onClick, type, disabled...) pass straight through to <button>.
 */
const VARIANT_CLASSES = {
  primary:
    "bg-brand-orange text-white hover:bg-brand-orange-dark disabled:bg-gray-300",
  outline:
    "bg-white border border-gray-300 text-brand-dark hover:border-brand-orange hover:text-brand-orange disabled:text-gray-300 disabled:border-gray-200",
  danger:
    "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-200",
  ghost:
    "bg-transparent text-brand-dark hover:bg-gray-100 disabled:text-gray-300",
};

const SIZE_CLASSES = {
  sm: "h-9 px-4 text-xs",
  md: "h-11 px-6 text-sm",
  lg: "h-14 px-8 text-base",
};

const Button = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  full = false,
  disabled = false,
  className = "",
  ...rest
}) => {
  return (
    <button
      disabled={disabled || loading}
      className={[
        "inline-flex items-center justify-center gap-2 rounded-full font-semibold",
        "transition-colors duration-200 cursor-pointer disabled:cursor-not-allowed",
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        full ? "w-full" : "",
        className,
      ].join(" ")}
      {...rest}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
};

export default Button;
