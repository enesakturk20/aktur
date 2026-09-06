import LanguageSwitcher from "@/app/[lang]/LanguageSwitcher";
import { useRouter, usePathname } from "next/navigation";

interface TopHeaderProps {
  dictionary: any;
  user: any;
  title: string;
}

export default function TopHeader({ dictionary, user, title }: TopHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const lang = pathname.split("/")[1] || "tr";

  const handleLogout = () => {
    localStorage.removeItem("aktur_token");
    localStorage.removeItem("aktur_user");
    router.replace(`/${lang}/portal`);
  };

  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-30 shadow-sm">
      <div className="flex items-center">
        <h1 className="text-xl font-bold text-slate-800">{title}</h1>
      </div>

      <div className="flex items-center space-x-6">
        <LanguageSwitcher />

        {/* User Profile & Logout */}
        <div className="flex items-center space-x-4 border-l border-slate-200 pl-6">
          <div className="flex flex-col items-end">
            <span className="text-sm font-bold text-slate-800 leading-tight">{user?.name || "Kullanıcı"}</span>
            <span className="text-xs text-slate-500 font-medium capitalize">{dictionary.rolePrefix || user?.role}</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 text-primary font-bold">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          
          <button 
            onClick={handleLogout}
            className="ml-4 p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors flex items-center"
            title={dictionary.menuLogout}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
