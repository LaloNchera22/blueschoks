import { MessageCircle } from "lucide-react"

export function AppPreviewSection() {
  return (
    <section className="px-4 pb-24 w-full">
        <div className="rounded-2xl border border-white/10 bg-surface-dark/50 p-2 overflow-hidden shadow-2xl relative max-w-lg mx-auto">
            <div className="aspect-[4/3] rounded-xl bg-slate-800 relative overflow-hidden group">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB2zik4Jo1YBSlzzwQQN-shlybiYzP_JaQ1iYSdCjEbGqAQ4DEf_GFsv0G0U8D15Fp39av-sb98quFM1PyfyojGKERzbhomMmhNznPjtAglsBir96YLW_2T49bDuViPyftv7qs5F07JpCSEpmnZaT6anNu-bcUtiZOA0ujQxem6WfokN-DK3DgsePKEifloMqi86LYX67xzktQsjFeTspYmqia-g2dkFGnwIBXSfvVTjIKntgYhwrzc19Gqc3Es0HgpZIRfuYLy2516")' }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-background-dark/90 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 backdrop-blur-md mb-2">
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-xs font-bold">Nuevo Pedido: $45.00</span>
                    </div>
                    <h3 className="text-white font-bold text-lg font-display">Gestiona pedidos desde cualquier lugar</h3>
                </div>
            </div>
        </div>
    </section>
  )
}
