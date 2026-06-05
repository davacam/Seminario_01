export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
        <div className="absolute inset-0 border-4 border-gray-700 rounded-full"></div>
      </div>
    </div>
  );
}
