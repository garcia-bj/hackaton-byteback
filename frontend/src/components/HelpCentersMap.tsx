'use client';

import { MapPin, PhoneCall, ChevronRight } from 'lucide-react';

export default function HelpCentersMap() {
    const centers = [
        { name: 'FELCV Cochabamba Central', addr: 'Eulogio Rojas y Calama', phone: '800-14-0348' },
        { name: 'Oficina de la Mujer Cocha', addr: 'Av. Aroma frente Plaza San Sebastián', phone: '425-4567' },
        { name: 'Centro de Apoyo Psicológico', addr: 'C. Jordán esq. Oquendo', phone: '445-6789' }
    ];

    return (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-teal-400 mb-2">Centros de Denuncia</h2>
                <p className="text-slate-500">Encuentre apoyo legal y policial cercano en Cochabamba, Bolivia.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Mapa Interactivo de Cochabamba */}
                <div className="bg-white/80 backdrop-blur-md rounded-3xl p-2 relative h-[400px] overflow-hidden group shadow-[0_0_30px_rgba(0,0,0,0.3)] border border-slate-300/50">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d122467.43632906804!2d-66.237516885341!3d-17.38949969199341!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x93e373f1d431baad%3A0xe5479be8cbe61546!2sCochabamba%2C%20Bolivia!5e0!3m2!1ses!2sus!4v1711200000000!5m2!1ses!2sus"
                        className="w-full h-full rounded-[22px] border-none grayscale contrast-125 opacity-70 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-700"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>

                    <div className="absolute inset-0 pointer-events-none rounded-[22px] shadow-[inset_0_0_40px_rgba(24,24,27,0.8)]" />
                </div>

                <div className="flex flex-col gap-4">
                    {centers.map((c, i) => (
                        <div key={i} className="bg-white/80 backdrop-blur-md p-5 rounded-2xl hover:bg-white transition-colors border border-slate-300/50 hover:border-teal-500/30 cursor-pointer flex items-center justify-between group shadow-lg">
                            <div>
                                <h3 className="font-bold text-lg mb-1 text-slate-900">{c.name}</h3>
                                <p className="text-slate-500 text-sm mb-3 flex items-center gap-1 group-hover:text-teal-700/80 transition-colors"><MapPin className="w-3 h-3" /> {c.addr}</p>
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-teal-600/10 text-teal-700 text-xs font-medium border border-teal-500/20 shadow-[0_0_10px_rgba(91,192,190,0.1)]">
                                    <PhoneCall className="w-3 h-3" /> {c.phone}
                                </span>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-300/50 flex items-center justify-center group-hover:border-teal-500/50 transition-colors">
                                <ChevronRight className="w-5 h-5 text-teal-600 group-hover:text-teal-700 transition-colors" />
                            </div>
                        </div>
                    ))}

                    <div className="mt-auto p-5 rounded-2xl bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30">
                        <h4 className="font-bold text-red-400 mb-1">¿Emergencia? Llame al 110</h4>
                        <p className="text-sm text-red-200/70">Asistencia Policial Inmediata las 24 hrs.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
