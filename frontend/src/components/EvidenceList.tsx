'use client';

import { useState, useEffect } from 'react';
import { Lock, FileText, QrCode, ExternalLink, Calendar, Mic, Monitor, Pencil, Check, X } from 'lucide-react';
import axios from 'axios';

export default function EvidenceList() {
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [password, setPassword] = useState('');

    const [evidences, setEvidences] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Edit state
    const [editingHash, setEditingHash] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState('');

    const fetchEvidences = () => {
        setIsLoading(true);
        axios.get('http://localhost:3001/api/evidence/list')
            .then(res => setEvidences(res.data))
            .catch(err => console.error("Error fetching evidences:", err))
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        if (isUnlocked) {
            fetchEvidences();
        }
    }, [isUnlocked]);

    const handleRenameSubmit = async (hash: string) => {
        if (!editTitle.trim()) return;
        try {
            await axios.put(`http://localhost:3001/api/evidence/rename/${hash}`, { title: editTitle });
            setEditingHash(null);
            fetchEvidences(); // Refresh list to get new title
        } catch (error) {
            console.error("Error renaming evidence:", error);
            alert("No se pudo renombrar la evidencia.");
        }
    };

    const handleUnlock = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === '1234') { // Mock authentication
            setIsUnlocked(true);
        } else {
            alert("Contraseña incorrecta. Intente con '1234'");
        }
    };

    const handleDownloadPDF = (hash: string) => {
        // Apunta al endpoint de NestJS para descargar el documento PDF
        window.open(`http://localhost:3001/api/evidence/pdf/${hash}`, '_blank');
    };

    if (!isUnlocked) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in zoom-in-95 duration-500">
                <div className="bg-white/80 backdrop-blur-md border border-slate-300/50 p-10 rounded-3xl w-full max-w-md flex flex-col items-center text-center shadow-[0_0_50px_rgba(0,0,0,0.4)]">
                    <div className="w-20 h-20 rounded-full bg-teal-600/10 flex items-center justify-center mb-6 border border-teal-500/20">
                        <Lock className="w-10 h-10 text-teal-700 drop-shadow-[0_0_10px_rgba(111,255,233,0.5)]" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Bóveda Cifrada</h2>
                    <p className="text-zinc-400 text-sm mb-8">
                        Sus evidencias están protegidas de extremo a extremo (E2E). Ingrese su PIN de seguridad para acceder.
                    </p>

                    <form onSubmit={handleUnlock} className="w-full relative">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••"
                            className="w-full bg-slate-100 border border-slate-300 rounded-xl px-4 py-3 text-center text-2xl tracking-[0.5em] focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-teal-500/50 transition-colors text-slate-900 placeholder-navy-700"
                        />
                        <p className="text-xs mt-2 text-center text-slate-500">
                            *Para fines de demostración, el PIN es: <span className="font-bold text-teal-600">1234</span>
                        </p>
                        <button
                            type="submit"
                            className="mt-6 w-full bg-teal-600 text-white font-bold py-3 rounded-xl hover:bg-cyan-300 transition-colors shadow-[0_0_15px_rgba(111,255,233,0.3)]"
                        >
                            Desbloquear Bóveda
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between mb-2 px-2">
                <div>
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-teal-400">
                        Historial de Denuncias
                    </h2>
                    <p className="text-slate-500">Archivos y evidencias protegidas</p>
                </div>
                <button
                    onClick={() => setIsUnlocked(false)}
                    className="text-sm text-slate-500 hover:text-teal-700 flex items-center gap-1 transition-colors bg-white/50 px-3 py-1.5 rounded-lg border border-slate-300/50"
                >
                    <Lock className="w-4 h-4" /> Bloquear
                </button>
            </div>

            <div className="grid gap-4">
                {isLoading ? (
                    <div className="text-center py-10 text-teal-700 animate-pulse">Descifrando historial...</div>
                ) : evidences.length === 0 ? (
                    <div className="text-center py-10 text-slate-500 bg-white/50 rounded-2xl border border-slate-300/50">
                        No hay denuncias selladas en tu bóveda.
                    </div>
                ) : (
                    evidences.map((evidence) => (
                        <div key={evidence.id} className="bg-white/80 backdrop-blur-md p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 hover:bg-white transition-colors border border-slate-300/50 hover:border-teal-500/30 group shadow-lg">

                            <div className="flex items-start gap-4 w-full md:w-auto">
                                <div className="p-3 bg-slate-100 rounded-xl border border-teal-500/20">
                                    {evidence.fileType?.includes('audio') ? (
                                        <Mic className="w-6 h-6 text-teal-700" />
                                    ) : (
                                        <Monitor className="w-6 h-6 text-teal-700" />
                                    )}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        {editingHash === evidence.sha256Hash ? (
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="text"
                                                    value={editTitle}
                                                    onChange={(e) => setEditTitle(e.target.value)}
                                                    className="px-2 py-1 text-sm border border-teal-500/50 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 bg-white"
                                                    autoFocus
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') handleRenameSubmit(evidence.sha256Hash);
                                                        if (e.key === 'Escape') setEditingHash(null);
                                                    }}
                                                />
                                                <button onClick={() => handleRenameSubmit(evidence.sha256Hash)} className="p-1 bg-teal-600/10 text-teal-700 rounded hover:bg-teal-600/20"><Check className="w-4 h-4" /></button>
                                                <button onClick={() => setEditingHash(null)} className="p-1 bg-red-500/10 text-red-500 rounded hover:bg-red-500/20"><X className="w-4 h-4" /></button>
                                            </div>
                                        ) : (
                                            <>
                                                <h3 className="font-semibold text-lg text-slate-900 flex items-center gap-2 group/title cursor-pointer"
                                                    onClick={() => {
                                                        setEditingHash(evidence.sha256Hash);
                                                        setEditTitle(evidence.title || 'Evidencia Multimedia');
                                                    }}>
                                                    {evidence.title || 'Evidencia Multimedia'}
                                                    <Pencil className="w-3 h-3 text-slate-400 opacity-0 group-hover/title:opacity-100 transition-opacity" />
                                                </h3>
                                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-600/20 text-teal-700 uppercase tracking-wider border border-teal-500/30">
                                                    {evidence.status || 'SEALED'}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-slate-500 font-mono mt-1.5">
                                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-teal-600" /> {new Date(evidence.timestampCert).toLocaleDateString()}</span>
                                        <span className="truncate max-w-[200px]">SHA: {evidence.sha256Hash?.substring(0, 16)}...</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 w-full md:w-auto">
                                <button
                                    onClick={() => handleDownloadPDF(evidence.sha256Hash)}
                                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-100/50 text-teal-600 font-medium transition-colors border border-slate-300/50 hover:border-teal-500/50"
                                >
                                    <QrCode className="w-4 h-4" />
                                    <span>Generar Certificado</span>
                                </button>

                                <button
                                    onClick={() => window.open(`http://localhost:3000/verify/${evidence.sha256Hash}`, '_blank')}
                                    className="flex-1 md:flex-none flex items-center justify-center px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-teal-400 hover:to-cyan-300 text-white font-bold transition-all shadow-[0_0_15px_rgba(111,255,233,0.3)]"
                                >
                                    Verificar <ExternalLink className="w-4 h-4 ml-1" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
