import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white shadow">
      <div className="container p-4 flex justify-between items-center">
        <Link href="/dashboard" className="font-semibold">Algo Practice</Link>
        <nav className="space-x-4 text-sm text-gray-600">
          <Link href="/dashboard">Dashboard</Link>
        </nav>
      </div>
    </header>
  );
}
