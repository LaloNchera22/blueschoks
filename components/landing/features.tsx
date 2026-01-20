export function Features() {
  return (
    <section className="w-full px-4 pb-20">
      <div className="grid md:grid-cols-3 gap-4 w-full text-left max-w-5xl mx-auto">
          {/* Card 1 */}
          <div className="group border border-slate-100 rounded-xl p-4 bg-white shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                  </div>
                  <h3 className="font-bold text-base text-slate-900">Súper Rápido</h3>
              </div>
              <p className="text-sm text-slate-500 leading-snug">Sube productos desde tu celular en segundos. Optimizado para velocidad.</p>
          </div>

          {/* Card 2 */}
          <div className="group border border-slate-100 rounded-xl p-4 bg-white shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600 shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                  </div>
                  <h3 className="font-bold text-base text-slate-900">Sin Comisiones</h3>
              </div>
              <p className="text-sm text-slate-500 leading-snug">Tus ganancias son 100% tuyas. No cobramos comisiones ocultas.</p>
          </div>

          {/* Card 3 */}
          <div className="group border border-slate-100 rounded-xl p-4 bg-white shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center text-green-600 shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                  </div>
                  <h3 className="font-bold text-base text-slate-900">Pagos Flexibles</h3>
              </div>
              <p className="text-sm text-slate-500 leading-snug">Acuerda el pago directo con tu cliente vía WhatsApp o efectivo.</p>
          </div>
      </div>
    </section>
  )
}
