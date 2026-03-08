import { ShieldCheck, ShieldAlert, BadgeCheck, FileText, Database } from 'lucide-react';
import Image from 'next/image';

async function verifyEvidence(hash: string) {
    try {
        const res = await fetch(`http://localhost:3001/api/evidence/verify/${hash}`, { cache: 'no-store' });
        if (!res.ok) return { verified: false };
        return res.json();
    } catch (error) {
        return { verified: false, error: true };
    }
}

export default async function VerifyPage({ params }: { params: Promise<{ hash: string }> }) {
    const { hash } = await params;
    const data = await verifyEvidence(hash);

    return (
        <div className="min-h-screen bg-slate-100 text-slate-900 selection:bg-teal-600/30 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Dynamic Background Elements */}
            <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-teal-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-teal-600/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-2xl w-full relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">

                {/* Header Oficial */}
                <div className="flex flex-col items-center justify-center mb-10 text-center">
                    <div className="flex items-center justify-center gap-3 mb-4 p-3 bg-teal-600/10 rounded-2xl border border-teal-500/20 shadow-[0_0_20px_rgba(91,192,190,0.15)]">
                        <div className="relative w-12 h-12 rounded-xl border border-teal-500/30 overflow-hidden shadow-sm bg-white">
                            <Image src="/logo.jpeg" alt="ProtegeT Logo" fill className="object-contain" />
                        </div>
                        <span className="font-bold text-3xl tracking-tight text-slate-900">Prote<span className="text-teal-700">geT</span></span>
                    </div>
                    <h1 className="text-xl text-teal-600 font-medium tracking-wide">Portal Forense de Verificación</h1>
                </div>

                {data.verified ? (
                    <div className="bg-white/80 backdrop-blur-xl p-8 md:p-12 rounded-[2rem] border border-teal-500/30 relative overflow-hidden shadow-[0_0_50px_rgba(91,192,190,0.2)]">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-teal-600 to-teal-400" />

                        <div className="flex flex-col items-center text-center border-b border-slate-300 pb-8 mb-8">
                            <div className="w-20 h-20 bg-teal-600/10 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(111,255,233,0.3)] border border-cyan-400/30">
                                <BadgeCheck className="w-10 h-10 text-teal-700" />
                            </div>
                            <h2 className="text-3xl font-bold text-slate-900 mb-2 tracking-wide">Prueba Verificada con Éxito</h2>
                            <p className="text-teal-600 font-medium flex items-center gap-2 justify-center bg-teal-600/10 px-4 py-1.5 rounded-full border border-teal-500/20">
                                <ShieldCheck className="w-5 h-5" /> Integridad de Archivo: {data.integrity || 'INTACT'}
                            </p>
                            <p className="text-sm text-slate-500 font-medium mt-4 max-w-md">
                                El archivo coincide exactamente con el registro original almacenado en la base de datos inmutable. Ningún byte ha sido alterado.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <h3 className="font-semibold text-lg flex items-center gap-2 text-slate-900">
                                <Database className="w-5 h-5 text-teal-700" /> Registro Inmutable (Ledger)
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div className="bg-slate-100 border border-slate-300 p-4 rounded-xl shadow-inner">
                                    <p className="text-teal-600 mb-1 font-mono text-xs uppercase">Titular Certificador</p>
                                    <p className="font-medium text-slate-900">{data.owner}</p>
                                </div>
                                <div className="bg-slate-100 border border-slate-300 p-4 rounded-xl shadow-inner">
                                    <p className="text-teal-600 mb-1 font-mono text-xs uppercase">Fecha de Sellado (UTC)</p>
                                    <p className="font-medium text-teal-700 font-mono tracking-tight">{new Date(data.timestampCert).toLocaleString()}</p>
                                </div>
                                <div className="bg-slate-100 border border-slate-300 p-4 rounded-xl md:col-span-2 shadow-inner">
                                    <p className="text-teal-600 mb-1 font-mono text-xs uppercase">Firma SHA-256 Validada</p>
                                    <p className="font-mono text-xs text-slate-900 break-all bg-white p-2 rounded">{hash}</p>
                                </div>
                                <div className="bg-slate-100 border border-slate-300 p-4 rounded-xl md:col-span-2 flex items-start gap-3 shadow-inner hover:border-teal-500/50 transition-colors">
                                    <FileText className="w-6 h-6 text-teal-700 flex-shrink-0" />
                                    <div>
                                        <p className="text-teal-600 mb-1 font-mono text-xs uppercase">URL de Recurso (Backup)</p>
                                        <p className="font-mono text-[11px] text-teal-700 truncate opacity-80">{data.fileUrl}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                ) : (
                    <div className="bg-white/80 backdrop-blur-xl p-8 md:p-12 rounded-[2rem] border border-red-500/30 text-center relative overflow-hidden shadow-[0_0_50px_rgba(239,68,68,0.2)]">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-500 to-orange-500" />

                        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.3)]">
                            <ShieldAlert className="w-10 h-10 text-red-500" />
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">Verificación Fallida</h2>
                        <p className="text-red-400 font-medium mb-6">Advertencia: Integridad Comprometida</p>

                        <div className="bg-slate-100 shadow-inner p-6 rounded-2xl border border-red-500/20 text-left">
                            <p className="text-sm text-slate-900 mb-4 text-center font-medium">
                                El registro criptográfico <span className="text-red-400 font-mono">{hash.substring(0, 10)}...</span> no existe en nuestra base de datos inmutable o el archivo ha sido alterado criminalmente.
                            </p>
                            <div className="bg-red-500/10 p-4 rounded-xl border border-red-500/30">
                                <p className="text-xs text-red-400 text-center font-bold tracking-wide">ESTA EVIDENCIA CARECE DE VALIDEZ PERICIAL ANTE SAFEGUARD.</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="mt-8 text-center bg-white/40 inline-block px-6 py-2 rounded-full border border-slate-300/50 mx-auto w-fit">
                    <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-teal-600 font-mono">Tecnología forense provista por ProtegeT System v1.0.0</p>
                </div>
            </div>
        </div>
    );
}
