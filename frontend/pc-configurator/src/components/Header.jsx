export default function Header({ children, logged, userRole }) {
  return (
    <header className="mb-6 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/85 shadow-2xl shadow-slate-950/40">
      <div className="h-1 bg-gradient-to-r from-primary-light via-indigo-400 to-primary-dark" />

      <div className="flex flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:justify-between lg:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-primary-light/25 bg-gradient-to-br from-slate-800 to-slate-950 shadow-inner shadow-white/5">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary-light text-sm font-black text-slate-950">
              PC
            </div>
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="truncate text-xl font-black tracking-tight text-white sm:text-2xl">PCStore</h1>
              <span className="hidden rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-200 sm:inline-flex">
                {logged ? "Connecté" : "Invité"}
              </span>
              {logged && userRole === "admin" && (
                <span className="rounded-full border border-indigo-400/25 bg-indigo-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-indigo-200">
                  Admin
                </span>
              )}
            </div>
            <p className="truncate text-xs font-medium text-slate-400">
              Configurateur PC, boutique et commandes au même endroit
            </p>
          </div>
        </div>

        {children}
      </div>
    </header>
  )
}
