'use client';

import { useState } from 'react';
import { UserCircle, Shield, Mail, Settings, LogOut, CheckCircle2, History, ChevronLeft, Edit2, Check } from 'lucide-react';
import EvidenceList from './EvidenceList';

export default function UserProfile() {
    const [showHistory, setShowHistory] = useState(false);
    const [isEditingName, setIsEditingName] = useState(false);
    const [userName, setUserName] = useState('Usuario Victima Uno');

    if (showHistory) {
        return (
            <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-300 max-w-2xl mx-auto w-full">
                <button
                    onClick={() => setShowHistory(false)}
                    className="flex items-center gap-1 text-slate-500 font-semibold hover:text-teal-700 w-fit transition-colors mb-2 bg-white/50 px-3 py-1.5 rounded-lg border border-slate-300/50"
                >
                    <ChevronLeft className="w-5 h-5 -ml-1" /> Volver al Perfil
                </button>
                <EvidenceList />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto w-full px-2">
            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-[0_0_30px_rgba(0,0,0,0.3)] border border-slate-300/50 flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-slate-100 flex items-center justify-center mb-4 rounded-3xl border border-teal-500/30 shadow-[0_0_15px_rgba(91,192,190,0.2)] relative rotate-3 hover:rotate-0 transition-transform">
                    <UserCircle className="w-14 h-14 text-teal-700" strokeWidth={1.5} />
                    <div className="absolute -bottom-2 -right-2 bg-slate-100 rounded-full p-1 border border-teal-500/50 shadow-[0_0_10px_rgba(111,255,233,0.5)]">
                        <CheckCircle2 className="w-4 h-4 text-teal-700" />
                    </div>
                </div>

                <div className="flex items-center gap-2 justify-center w-full mt-2">
                    {isEditingName ? (
                        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-teal-500/50 w-full max-w-[250px]">
                            <input
                                type="text"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                className="text-xl font-bold text-slate-900 text-center bg-transparent focus:outline-none w-full"
                                autoFocus
                            />
                            <button onClick={() => setIsEditingName(false)} className="p-1.5 bg-teal-600/20 text-teal-700 rounded-lg hover:bg-teal-600/30 transition">
                                <Check className="w-5 h-5" />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 group">
                            <h2 className="text-2xl font-bold text-slate-900">{userName}</h2>
                            <button onClick={() => setIsEditingName(true)} className="p-1.5 text-slate-500 hover:text-teal-700 hover:bg-slate-200/50 rounded-full transition opacity-0 group-hover:opacity-100">
                                <Edit2 className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>

                <p className="text-slate-500 flex items-center gap-1 mt-1 justify-center font-mono text-sm">
                    <Mail className="w-3.5 h-3.5" /> victim_mock_1@safeguard.test
                </p>

                <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-600/10 text-teal-700 font-semibold text-sm border border-teal-500/30 shadow-[0_0_15px_rgba(91,192,190,0.1)]">
                    <Shield className="w-4 h-4" />
                    Identidad Verificada (Nivel 3)
                </div>
            </div>

            <div className="bg-white/80 backdrop-blur-md rounded-3xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.3)] border border-slate-300/50">
                <div className="p-4 border-b border-slate-300/50 font-semibold text-teal-700 bg-slate-100/50 flex items-center gap-2 tracking-wide uppercase text-xs">
                    <Settings className="w-4 h-4 text-teal-600" /> Configuración de Seguridad
                </div>
                <div className="flex flex-col">
                    <button onClick={() => setShowHistory(true)} className="px-6 py-4 flex items-center justify-between hover:bg-white transition-colors border-b border-slate-300/50 cursor-pointer group">
                        <div className="flex items-center gap-3">
                            <div className="bg-teal-600/10 p-2 rounded-lg text-teal-700 border border-teal-500/20 group-hover:bg-teal-600/20"><History className="w-4 h-4" /></div>
                            <span className="text-slate-900 font-medium group-hover:text-teal-700 transition-colors">Historial de Denuncias</span>
                        </div>
                        <span className="text-sm text-slate-500 font-mono group-hover:text-teal-600">Abrir &rarr;</span>
                    </button>
                    <button className="px-6 py-4 flex items-center justify-between hover:bg-white transition-colors border-b border-slate-300/50">
                        <span className="text-slate-300 font-medium">Gestionar PIN de Bóveda</span>
                        <span className="text-sm text-slate-500 font-mono">Modificar</span>
                    </button>
                    <button className="px-6 py-4 flex items-center justify-between hover:bg-white transition-colors border-b border-slate-300/50">
                        <span className="text-slate-300 font-medium">Contactos de Emergencia</span>
                        <span className="text-sm text-teal-600 font-mono bg-teal-600/10 px-2 py-0.5 rounded border border-teal-500/20">2 Configurados</span>
                    </button>
                    <button className="px-6 py-4 flex items-center justify-between hover:bg-white transition-colors border-b border-slate-300/50">
                        <span className="text-slate-300 font-medium">Idioma</span>
                        <span className="text-sm text-slate-500 font-mono">Español</span>
                    </button>
                </div>
            </div>

            <button className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-colors border border-red-500/30 mt-4 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                <LogOut className="w-5 h-5" />
                Desconexión Autónoma Remota
            </button>

            <p className="text-center text-slate-500 font-mono text-xs mt-2 opacity-50">SafeGuard Biometric System v1.0.0</p>
        </div>
    );
}
