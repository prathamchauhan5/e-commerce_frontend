export default function Footer() {
  return (
    <footer className="border-t bg-white mt-10">
      <div className="max-w-7xl mx-auto p-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Shop. All rights reserved.
      </div>
    </footer>
  );
}