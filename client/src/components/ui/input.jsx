export function Input({ type = "text", ...props }) {
  return (
    <input
      type={type}
      className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      {...props}
    />
  );
}
