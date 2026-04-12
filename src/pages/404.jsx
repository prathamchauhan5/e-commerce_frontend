import { Link } from "react-router-dom";
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
      <h1 className="text-3xl font-semibold">404</h1>
      <p className="text-gray-500 mt-2">Page not found</p>

      <Link to="/" className="mt-4 text-blue-600 underline">
        Go back home
      </Link>
    </div>
  );
}
