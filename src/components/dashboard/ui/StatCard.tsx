interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
}

export default function StatCard({ title, value, icon, trend, trendUp }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
        <div className="w-24 h-24">{icon}</div>
      </div>
      
      <div className="relative z-10 flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-primary">
          {icon}
        </div>
        {trend && (
          <div className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center space-x-1 ${trendUp ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
            {trendUp ? (
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m0 0l-5 5m5-5l5 5" /></svg>
            ) : (
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m0 0l-5-5m5 5l5-5" /></svg>
            )}
            <span>{trend}</span>
          </div>
        )}
      </div>
      
      <div className="relative z-10">
        <h3 className="text-3xl font-extrabold text-slate-800 tracking-tight">{value}</h3>
        <p className="text-sm font-medium text-slate-500 mt-1">{title}</p>
      </div>
    </div>
  );
}
