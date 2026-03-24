'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, ArrowRight, Eye, EyeOff, ChevronLeft } from 'lucide-react'

export default function AdminLogin() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        const { error } = await supabase.auth.signInWithPassword({ email, password })

        if (error) {
            setError('Credenciales incorrectas. Verifica tu correo y contraseña.')
            setLoading(false)
        } else {
            router.push('/admin/dashboard')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
            style={{ background: 'radial-gradient(ellipse at 60% 0%, #1B2436 0%, #0D0D0D 60%)' }}
        >
            {/* Fondo decorativo */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* Grid sutil */}
                <div className="absolute inset-0 opacity-[0.04]" style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }} />
                {/* Glow navy */}
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-navy-600/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] bg-navy-600/10 rounded-full blur-[100px]" />
            </div>

            {/* Card */}
            <div className="relative z-10 w-full max-w-sm mx-4 animate-slide-up">
                <div className="bg-[#161D2C] border border-white/10 rounded-3xl shadow-2xl shadow-black/60 overflow-hidden">

                    {/* Header de la card */}
                    <div className="px-8 pt-10 pb-6 text-center border-b border-white/8">
                        {/* Logo */}
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/5 border border-white/15 rounded-2xl mb-5">
                            <div className="text-center leading-none">
                                <div className="text-white/40 text-[8px] font-bold tracking-[0.2em] uppercase">Import.</div>
                                <div className="text-white font-black text-lg tracking-wider">IF</div>
                            </div>
                        </div>

                        <h1 className="text-white font-black text-2xl leading-tight mb-1">Panel Administrativo</h1>
                        <p className="text-white/40 text-sm">Ingresa tus credenciales para gestionar la tienda</p>
                    </div>

                    {/* Formulario */}
                    <form onSubmit={handleLogin} className="px-8 py-7 space-y-5">
                        {/* Error */}
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl text-center">
                                {error}
                            </div>
                        )}

                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-white/50 text-xs font-bold uppercase tracking-widest">Correo Electrónico</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail size={16} className="text-white/30" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 focus:border-white/30 focus:ring-2 focus:ring-white/10 text-white placeholder-white/20 rounded-xl pl-11 pr-4 py-3.5 text-sm outline-none transition-all"
                                    placeholder="admin@importadorafernandez.com"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <label className="text-white/50 text-xs font-bold uppercase tracking-widest">Contraseña</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock size={16} className="text-white/30" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 focus:border-white/30 focus:ring-2 focus:ring-white/10 text-white placeholder-white/20 rounded-xl pl-11 pr-12 py-3.5 text-sm outline-none transition-all"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/25 hover:text-white/60 transition"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Botón */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-white text-navy-600 font-black py-4 rounded-xl hover:bg-white/90 transition-all shadow-xl hover:shadow-white/20 disabled:opacity-50 flex items-center justify-center gap-3 text-sm tracking-wider uppercase group mt-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-navy-600/30 border-t-navy-600 rounded-full animate-spin" />
                                    Iniciando sesión...
                                </>
                            ) : (
                                <>
                                    INICIAR SESIÓN
                                    <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer de la card */}
                    <div className="px-8 pb-8 text-center space-y-3">
                        <div className="text-white/20 text-[10px] tracking-widest uppercase font-semibold">Sistema V2.0</div>
                        <Link href="/" className="inline-flex items-center gap-1.5 text-white/35 hover:text-white/70 text-xs transition font-medium">
                            <ChevronLeft size={13} />
                            Volver a la tienda
                        </Link>
                    </div>
                </div>

                {/* Copyright */}
                <p className="text-center text-white/20 text-xs mt-6">
                    © 2026 Importadora Fernández. Todos los derechos reservados.
                </p>
            </div>
        </div>
    )
}
