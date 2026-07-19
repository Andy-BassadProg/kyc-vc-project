interface ToastProps {
  type?: "success" | "error" | "info";
  message: string;
}

const styles: Record<string, string> = {
  success: "bg-green-50 text-green-700 border-green-200",
  error: "bg-red-50 text-red-700 border-red-200",
  info: "bg-blue-50 text-blue-700 border-blue-200",
};

export default function Toast({ type = "info", message }: ToastProps) {
  return <div className={`border rounded px-4 py-2 text-sm ${styles[type]}`}>{message}</div>;
}
