'use client';

import { useState, useRef } from 'react';
import { Image as ImageIcon, Mic, Video as VideoIcon, StopCircle, CheckCircle, Monitor, Settings, Square } from 'lucide-react';
import axios from 'axios';

export default function RecordEvidence() {
    const [isRecording, setIsRecording] = useState(false);
    const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [reportResult, setReportResult] = useState<any>(null);
    const [errorMsg, setErrorMsg] = useState('');
    const [recordingMode, setRecordingMode] = useState<'video' | 'audio'>('video');

    const videoRef = useRef<HTMLVideoElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<BlobPart[]>([]);

    const startRecording = async () => {
        try {
            setReportResult(null);
            setRecordedBlob(null);
            setErrorMsg('');
            chunksRef.current = [];

            // Modo Video vs Modo Solo Audio
            let stream: MediaStream;
            if (recordingMode === 'video') {
                stream = await navigator.mediaDevices.getDisplayMedia({ video: { displaySurface: "monitor" }, audio: true });
            } else {
                stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            }

            if (videoRef.current && recordingMode === 'video') {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            }

            const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
            mediaRecorderRef.current = mediaRecorder;

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) chunksRef.current.push(event.data);
            };

            mediaRecorder.onstop = () => {
                const mime = recordingMode === 'video' ? 'video/webm' : 'audio/webm';
                const blob = new Blob(chunksRef.current, { type: mime });
                setRecordedBlob(blob);
                if (videoRef.current) videoRef.current.srcObject = null;
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start(1000);
            setIsRecording(true);
        } catch (err: any) {
            console.error('Error starting recording:', err);
            if (err.name === 'NotAllowedError') {
                setErrorMsg('Permiso denegado. Por favor, autorice el acceso a la pantalla y al micrófono en su navegador para poder grabar.');
            } else {
                setErrorMsg('Ocurrió un error al intentar iniciar la captura: ' + (err.message || 'Error desconocido'));
            }
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const uploadEvidence = async () => {
        if (!recordedBlob) return;
        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append('file', recordedBlob, recordingMode === 'video' ? 'evidence.webm' : 'evidence.audio.webm');
            const response = await axios.post('http://localhost:3001/api/evidence/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setReportResult(response.data);
            setRecordedBlob(null);
        } catch (err: any) {
            console.error(err);
            alert('Error uploading evidence: ' + (err.response?.data?.message || err.message));
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="flex flex-col items-center flex-1 w-full bg-slate-100 relative min-h-[80vh]">
            <div className="absolute top-0 w-full h-32 bg-gradient-to-b from-navy-800/50 to-transparent pointer-events-none z-10" />

            {/* Header / Top Bar */}
            <div className="absolute top-6 w-full flex items-center justify-between px-6 z-40">
                <div className="px-4 py-1.5 rounded-full bg-white/80 border border-teal-500/20 shadow-sm backdrop-blur-md">
                    <span className="font-mono text-xs text-teal-600 font-bold tracking-widest">REC-OP</span>
                </div>
                <button className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-teal-700 hover:text-slate-900 transition-all border border-slate-300/50 shadow-[0_0_15px_rgba(111,255,233,0.1)]">
                    <Settings className="w-5 h-5" />
                </button>
            </div>

            {/* Segmented Control Selector (Pantalla / Audio) */}
            {!isRecording && !recordedBlob && !reportResult && (
                <div className="absolute top-20 w-full flex justify-center z-40">
                    <div className="flex bg-white/80 p-1.5 rounded-2xl w-[85%] max-w-[280px] border border-slate-300/50 backdrop-blur-md shadow-lg">
                        <button
                            onClick={() => setRecordingMode('video')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-[14px] transition-all duration-300 ${recordingMode === 'video' ? 'bg-slate-100 text-teal-700 shadow-[0_0_15px_rgba(91,192,190,0.2)] border border-teal-500/30' : 'text-slate-500 hover:text-teal-700'}`}>
                            <Monitor className="w-4 h-4" /> Pantalla
                        </button>
                        <button
                            onClick={() => setRecordingMode('audio')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-[14px] transition-all duration-300 ${recordingMode === 'audio' ? 'bg-slate-100 text-teal-700 shadow-[0_0_15px_rgba(91,192,190,0.2)] border border-teal-500/30' : 'text-slate-500 hover:text-teal-700'}`}>
                            <Mic className="w-4 h-4" /> Audio
                        </button>
                    </div>
                </div>
            )}

            {/* Central Wrapper for Absolute Centering */}
            <div className="flex-1 w-full flex flex-col items-center justify-center relative z-20 pt-16">

                {/* Main Big Button Element */}
                <div className="relative flex flex-col items-center justify-center w-full max-w-sm mx-auto h-[450px]">
                    {/* Concentric circles background shadows (Absolutely centered to match button) */}
                    <div className="absolute inset-0 m-auto w-80 h-80 bg-teal-600/5 rounded-full animate-in zoom-in duration-1000 border border-teal-500/5" />
                    <div className="absolute inset-0 m-auto w-64 h-64 bg-teal-600/10 shadow-[inset_0_0_30px_rgba(91,192,190,0.1)] rounded-full animate-in zoom-in duration-700" />
                    <div className="absolute inset-0 m-auto w-52 h-52 bg-teal-600/20 rounded-full animate-in zoom-in duration-500 blur-sm" />

                    {/* The Action Button Segment */}
                    {!isRecording && !recordedBlob && !reportResult && (
                        <div className="relative flex flex-col items-center justify-center z-30 w-full h-full">
                            <button
                                onClick={startRecording}
                                className="w-48 h-48 rounded-full bg-gradient-to-br from-teal-600 to-teal-400 text-white flex flex-col items-center justify-center shadow-[0_10px_50px_rgba(111,255,233,0.3)] hover:scale-105 active:scale-95 transition-all duration-300 relative gap-3 border-[4px] border-navy-900 ring-2 ring-teal-500/50"
                            >
                                <div className="w-16 h-16 rounded-full border-[3px] border-navy-900/60 flex items-center justify-center">
                                    <div className="w-6 h-6 bg-slate-100 rounded-sm" />
                                </div>
                                <span className="font-bold text-lg tracking-[0.2em] font-mono">GRABAR</span>
                            </button>

                            {/* Status Info Below Button */}
                            <div className="absolute bottom-4 flex flex-col items-center">
                                <span className="text-[17px] text-teal-700 font-medium mb-1.5 uppercase tracking-widest text-xs">Sistema Online</span>
                                <div className="flex items-center gap-2 bg-white/80 px-4 py-1.5 rounded-full border border-teal-500/20 shadow-[0_0_15px_rgba(91,192,190,0.1)]">
                                    <div className="w-2.5 h-2.5 rounded-full bg-teal-600 animate-pulse shadow-[0_0_10px_rgba(111,255,233,0.8)]"></div>
                                    <span className="text-[14px] text-teal-600 font-semibold tracking-wide">Espera de captura</span>
                                </div>
                            </div>

                            {errorMsg && (
                                <div className="absolute -bottom-12 p-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl text-center w-[90%] mx-auto shadow-[0_0_20px_rgba(239,68,68,0.1)] backdrop-blur-md">
                                    <strong>Advertencia:</strong> {errorMsg}
                                </div>
                            )}
                        </div>
                    )}

                    {isRecording && (
                        <div className="relative z-10 w-full h-[320px] max-w-sm flex flex-col items-center justify-center bg-slate-100 rounded-[2.5rem] shadow-[inset_0_0_80px_rgba(0,0,0,0.5)] border border-slate-200 overflow-hidden">

                            {/* Overlay top-center stop button */}
                            <div className="absolute top-6 z-30 w-full flex justify-center">
                                <button
                                    onClick={stopRecording}
                                    className="px-6 py-2.5 rounded-full bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(239,68,68,0.2)] transition-all animate-pulse"
                                >
                                    <StopCircle className="w-5 h-5" />
                                    <span className="text-sm tracking-wider">DETENER GRABACIÓN</span>
                                </button>
                            </div>

                            {recordingMode === 'video' ? (
                                <video
                                    ref={videoRef}
                                    className="absolute inset-0 w-full h-full object-cover opacity-80"
                                    muted
                                />
                            ) : (
                                <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-navy-900 to-navy-800 relative">
                                    {/* Soundwave pulse elements behind mic */}
                                    <div className="absolute w-40 h-40 bg-red-500/5 rounded-full animate-ping duration-[3000ms]" />
                                    <div className="absolute w-32 h-32 bg-red-500/10 rounded-full animate-pulse blur-xl" />
                                    <Mic className="w-20 h-20 text-red-500/80 relative z-20 drop-shadow-[0_0_15px_rgba(239,68,68,0.4)]" strokeWidth={1.5} />

                                    <div className="absolute bottom-6 flex items-center gap-2">
                                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                        <span className="text-red-400 font-mono text-xs tracking-[0.2em]">REC</span>
                                    </div>
                                </div>
                            )}

                            {/* subtle scanning line effect */}
                            <div className="absolute inset-0 w-full h-full pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] opacity-20" />
                        </div>
                    )}

                    {recordedBlob && !isUploading && (
                        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center bg-white rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden border border-slate-300 p-2">
                            {recordingMode === 'video' ? (
                                <video
                                    src={URL.createObjectURL(recordedBlob)}
                                    className="w-full h-48 object-cover bg-black rounded-2xl border border-slate-300/50"
                                    controls
                                />
                            ) : (
                                <audio src={URL.createObjectURL(recordedBlob)} className="w-full mt-4" controls />
                            )}
                            <div className="flex gap-4 p-4 w-full mt-2">
                                <button onClick={uploadEvidence} className="flex-1 bg-gradient-to-r from-teal-600 to-teal-400 text-white py-3 rounded-xl font-bold shadow-[0_0_20px_rgba(91,192,190,0.3)] hover:scale-[1.02] transition-transform">
                                    Sellar Evidencia
                                </button>
                                <button onClick={() => setRecordedBlob(null)} className="flex-1 bg-slate-100 text-slate-500 hover:text-red-400 py-3 rounded-xl font-bold border border-slate-300/50 transition-colors">
                                    Descartar
                                </button>
                            </div>
                        </div>
                    )}

                    {isUploading && (
                        <div className="relative z-10 text-teal-700 font-bold animate-pulse text-lg tracking-wider">
                            Certificando en el Blockchain...
                        </div>
                    )}

                    {reportResult && (
                        <div className="relative z-10 w-full bg-teal-600/10 border border-teal-500/30 p-8 rounded-3xl flex flex-col items-center text-center shadow-[0_0_40px_rgba(91,192,190,0.15)] backdrop-blur-md">
                            <CheckCircle className="w-20 h-20 text-teal-700 mb-6 drop-shadow-[0_0_15px_rgba(111,255,233,0.5)]" />
                            <h3 className="font-bold text-slate-900 text-2xl mb-2">Evidencia Sellada</h3>
                            <p className="text-sm text-teal-600 mb-6 break-words w-full font-mono bg-slate-100/50 p-4 rounded-xl border border-slate-300">
                                {reportResult.hash}
                            </p>
                            <button onClick={() => setReportResult(null)} className="w-full bg-teal-600 hover:bg-cyan-300 text-white font-bold py-4 rounded-xl transition-colors shadow-[0_0_20px_rgba(111,255,233,0.3)]">
                                Generar Nuevo Sello
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
