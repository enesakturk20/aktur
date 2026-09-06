import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  dictionary: any;
  menuItems: MenuItem[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  lang: string;
}

export default function Sidebar({ dictionary, menuItems, activeTab, setActiveTab, lang }: SidebarProps) {
  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen sticky top-0 border-r border-slate-800">
      {/* Logo Area */}
      <div className="h-20 flex items-center justify-center border-b border-slate-800 bg-slate-950 px-4">
        <Link href={`/${lang}`} className="relative w-full h-12 hover:opacity-90 transition-opacity">
          <Image 
            src="/logo-dark.svg" 
            alt="Aktur Portal" 
            fill 
            style={{ objectFit: "contain" }} 
            priority
          />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-3">
          Menü
        </div>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 ${
              activeTab === item.id
                ? "bg-primary text-white shadow-md shadow-primary/20"
                : "hover:bg-slate-800 hover:text-white"
            }`}
          >
            <span className={activeTab === item.id ? "text-white" : "text-slate-400"}>
              {item.icon}
            </span>
            <span className="font-medium text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Footer / Logout in TopHeader normally, but we can put a bottom section here */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/50">
        <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">© 2026 Aktur Portal</span>
        </div>
      </div>
    </aside>
  );
}
