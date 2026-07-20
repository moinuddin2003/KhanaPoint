/**
 * Reusable Input, styled the same way as the email/password fields in
 * Components/auth/LoginForm.jsx (floating label, rounded-xl border, orange
 * focus border). Works for text/number/email/etc, and for <select> and
 * <textarea> via the `as` prop.
 *
 * Usage:
 *   <Input label="Restaurant Name" name="name" value={form.name} onChange={handleChange} />
 *   <Input label="Price" name="price" type="number" value={form.price} onChange={handleChange} icon={<FiDollarSign />} />
 *   <Input label="Description" name="description" as="textarea" value={form.description} onChange={handleChange} />
 *   <Input label="Category" name="category" as="select" value={form.category} onChange={handleChange}>
 *     <option value="">Select category</option>
 *     {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
 *   </Input>
 *
 * Props:
 *   label:  string   - floating label text
 *   error:  string   - shows red text below the field + red border
 *   icon:   node     - optional icon rendered on the left
 *   as:     "input" | "select" | "textarea"  (default "input")
 *   All other props (name, value, onChange, type, placeholder, required...) pass through.
 */
const Input = ({ label, error, icon, as = "input", className = "", children, ...rest }) => {
  const Tag = as;

  const baseClasses = [
    "w-full rounded-xl border bg-white outline-none transition",
    icon ? "pl-12" : "pl-4",
    "pr-4",
    as === "textarea" ? "py-3 min-h-[100px]" : "h-14",
    error
      ? "border-red-400 focus:border-red-500"
      : "border-gray-300 focus:border-brand-orange",
    className,
  ].join(" ");

  return (
    <div className="relative">
      {label && (
        <label className="absolute -top-2 left-4 bg-white px-2 text-xs font-medium text-brand-orange z-10">
          {label}
        </label>
      )}

      {icon && (
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          {icon}
        </span>
      )}

      <Tag className={baseClasses} {...rest}>
        {children}
      </Tag>

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default Input;
