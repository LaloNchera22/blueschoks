'use client';

import Link from 'next/link';
import { Lock, Star } from 'lucide-react';

export default function UpgradeBanner() {
  return (
    <div className="w-full h-full flex items-center justify-center p-4 bg-gray-50">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md text-center border border-slate-100 animate-in fade-in zoom-in duration-300">
         <div className="w-16 h-16 bg-slate-900 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-slate-900/20">
            <Lock className="w-7 h-7" />
         </div>
         <h2 className="text-2xl font-black text-slate-900 mb-2">Personalización PRO</h2>
         <p className="text-slate-500 mb-8 leading-relaxed">
           Desbloquea el editor de diseño completo.
         </p>
         <Link href="/dashboard/pricing" className="block w-full">
            <button className="w-full py-4 bg-slate-900 hover:bg-black text-white font-bold rounded-xl text-lg shadow-xl shadow-slate-900/10 transition-all active:scale-95 flex items-center justify-center gap-2">
               <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
               Desbloquear PRO
            </button>
         </Link>
      </div>
    </div>
  );
}
