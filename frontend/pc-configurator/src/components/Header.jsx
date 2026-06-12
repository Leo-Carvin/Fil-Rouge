export default function Header({ children, logged, userRole }) {
  return (
    <header className="mb-6 rounded-lg border border-slate-700/50 bg-slate-800/50">
      <div className="flex items-center gap-3 px-4 py-3 lg:px-5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-slate-700 text-sm font-bold text-white">
          PC
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h1 className="truncate text-base font-semibold text-white">PCStore</h1>
            {logged && (
              <span className="inline-flex items-center rounded-full bg-slate-700/80 px-2 py-0.5 text-[10px] font-medium text-slate-300">
                {userRole === "admin" ? "Admin" : "Connecté"}
              </span>
            )}
          </div>
          <p className="truncate text-xs text-slate-400">
            Configurateur PC et boutique
          </p>
        </div>

        {children}
      </div>
    </header>
  )
}
