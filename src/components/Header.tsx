import MonarcaLogo from "./MonarcaLogo";
import Image from 'next/image';

export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-[#18181b] border-b border-[#232323]">
      <div className="flex items-center gap-2">
        <MonarcaLogo />
      </div>
      <nav className="flex gap-8 text-sm">
        <a href="#" className="hover:underline">Dashboard</a>
        <a href="#" className="hover:underline">Transactions</a>
        <a href="#" className="hover:underline">Budgets</a>
        <a href="#" className="font-semibold underline">Reports</a>
      </nav>
      <div>
        <div className="w-8 h-8 rounded-full bg-gray-400 overflow-hidden">
          <Image src="/arc_favicon.png" alt="User" width={32} height={32} />
        </div>
      </div>
    </header>
  );
}
