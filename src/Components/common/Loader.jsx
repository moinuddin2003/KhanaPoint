/**
 * Reusable Loader / spinner.
 *
 * Usage:
 *   <Loader />                     -> small inline spinner
 *   <Loader size="lg" />           -> bigger spinner
 *   <Loader fullPage label="Loading orders..." />  -> centered in a full page/section
 */
const SIZE_CLASSES = {
  sm: "h-5 w-5 border-2",
  md: "h-10 w-10 border-2",
  lg: "h-14 w-14 border-4",
};

const Loader = ({ size = "md", fullPage = false, label }) => {
  const spinner = (
    <div
      className={`animate-spin rounded-full border-brand-orange border-t-transparent ${SIZE_CLASSES[size]}`}
    />
  );

  if (fullPage) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 h-[60vh] w-full">
        {spinner}
        {label && <p className="text-sm text-gray-500">{label}</p>}
      </div>
    );
  }

  return spinner;
};

export default Loader;
