'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronRight, ChevronLeft, ArrowRight, Package, Sparkles } from 'lucide-react'
import { proxyImageUrl } from '@/lib/supabase'

interface Slide {
    id: string;
    title: string;
    description: string;
    image_url: string;
    product_link: string;
    tag?: string;
}

interface HeroProps {
    slides: Slide[]
}

export default function HeroSection({ slides }: HeroProps) {
    const [current, setCurrent] = useState(0)
    const [isHovered, setIsHovered] = useState(false)

    if (!slides || slides.length === 0) return (
        <div className="py-20 flex flex-col items-center justify-center bg-navy-700 text-white/40 gap-3 min-h-[400px]">
            <Package size={40} className="text-white/20" />
            <p className="text-sm">El administrador aún no configura la portada.</p>
        </div>
    );

    useEffect(() => {
        if (isHovered) return
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length)
        }, 5500)
        return () => clearInterval(interval)
    }, [slides.length, isHovered])

    const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length)
    const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length)
    const activeSlide = slides[current]

    return (
        <section
            className="relative bg-navy-700 overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Fondo decorativo */}
            <div className="absolute inset-0 bg-gradient-to-br from-navy-600 via-navy-700 to-navy-800 pointer-events-none" />
            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 60px, rgba(255,255,255,0.3) 60px, rgba(255,255,255,0.3) 61px)'
            }} />

            {/* ── LAYOUT MÓVIL: tarjeta compacta sin espacios ─────────────── */}
            <div className="md:hidden relative z-10 w-full" key={`mobile-${current}`}>

                {/* Imagen full-width — sin recorte */}
                <div className="relative w-full bg-navy-800/60" style={{ aspectRatio: '16/10' }}>
                    <img
                        src={proxyImageUrl(activeSlide.image_url)}
                        alt={activeSlide.title}
                        className="w-full h-full object-contain animate-slide-up"
                        style={{ padding: '12px' }}
                    />
                    {/* Gradiente que suaviza hacia el texto abajo */}
                    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-navy-700 to-transparent pointer-events-none" />

                    {/* Tag badge sobre la imagen */}
                    {activeSlide.tag && (
                        <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 text-white/80 font-bold tracking-[0.18em] uppercase text-[9px] bg-white/10 border border-white/20 px-2.5 py-1 rounded-full backdrop-blur-sm">
                            <Sparkles size={8} />
                            {activeSlide.tag}
                        </span>
                    )}

                    {/* Flechas sobre imagen móvil */}
                    <button onClick={prevSlide} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/30 hover:bg-black/50 backdrop-blur border border-white/10 rounded-full flex items-center justify-center text-white transition-all z-20">
                        <ChevronLeft size={16} />
                    </button>
                    <button onClick={nextSlide} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/30 hover:bg-black/50 backdrop-blur border border-white/10 rounded-full flex items-center justify-center text-white transition-all z-20">
                        <ChevronRight size={16} />
                    </button>
                </div>

                {/* Texto compacto pegado a la imagen */}
                <div className="px-5 pt-4 pb-20 space-y-3" key={`mtext-${current}`}>
                    <h1 className="text-2xl font-black text-white leading-tight tracking-tight">
                        {activeSlide.title}
                    </h1>
                    <p className="text-white/55 text-sm leading-relaxed font-light line-clamp-2">
                        {activeSlide.description}
                    </p>
                    <div className="flex items-center gap-2 text-white/40 text-[11px]">
                        <div className="h-px w-5 bg-white/25" />
                        Venta por docena o media docena
                    </div>

                    {/* CTAs */}
                    <div className="flex gap-2.5 pt-1">
                        <Link href={activeSlide.product_link} className="flex-1">
                            <button className="w-full bg-white text-navy-600 font-bold py-3 rounded-2xl shadow-lg transition-all hover:scale-[1.02] flex items-center justify-center gap-2 text-sm">
                                Ver Ahora <ArrowRight size={15} />
                            </button>
                        </Link>
                        <Link href="/catalogo" className="flex-1">
                            <button className="w-full bg-white/10 hover:bg-white/15 text-white font-semibold py-3 rounded-2xl border border-white/15 transition-all text-sm flex justify-center items-center">
                                Catálogo
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Dots */}
                <div className="absolute bottom-[72px] left-0 right-0 flex justify-center gap-1.5 z-20">
                    {slides.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrent(idx)}
                            className={`h-1 rounded-full transition-all duration-300 ${idx === current
                                ? 'bg-white w-6'
                                : 'bg-white/25 hover:bg-white/50 w-1'
                            }`}
                            aria-label={`Diapositiva ${idx + 1}`}
                        />
                    ))}
                </div>
            </div>

            {/* ── LAYOUT DESKTOP: grid 2 columnas ─────────────────────────── */}
            <div className="hidden md:block relative z-10 max-w-7xl mx-auto px-4 w-full py-20">
                <div className="grid md:grid-cols-2 gap-12 items-center">

                    {/* Imagen derecha */}
                    <div className="order-2 relative h-[500px] w-full flex items-center justify-center" key={`img-${current}`}>
                        <div className="absolute inset-0 rounded-full blur-3xl opacity-20 bg-white scale-75 pointer-events-none" />
                        <div className="relative z-10 w-full h-full rounded-3xl overflow-hidden shadow-2xl bg-navy-800/40">
                            <img
                                src={proxyImageUrl(activeSlide.image_url)}
                                alt={activeSlide.title}
                                className="w-full h-full object-contain animate-slide-up transition-all duration-700"
                                style={{ padding: '24px' }}
                            />
                        </div>
                    </div>

                    {/* Texto izquierda */}
                    <div className="order-1 space-y-7 animate-fade-in w-full" key={`text-${current}`}>
                        {activeSlide.tag && (
                            <span className="inline-flex items-center gap-2 text-white/70 font-semibold tracking-[0.2em] uppercase text-xs bg-white/10 border border-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                                <Sparkles size={10} />
                                {activeSlide.tag}
                            </span>
                        )}
                        <h1 className="text-5xl lg:text-7xl font-black text-white leading-tight tracking-tight">
                            {activeSlide.title}
                        </h1>
                        <p className="text-white/60 text-lg leading-relaxed max-w-lg font-light">
                            {activeSlide.description}
                        </p>
                        <div className="flex items-center gap-3 text-white/50 text-sm">
                            <div className="h-px w-8 bg-white/30" />
                            Venta por docena o media docena
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 pt-2">
                            <Link href={activeSlide.product_link}>
                                <button className="bg-white text-navy-600 font-bold py-4 px-10 rounded-full shadow-xl transition-all hover:scale-105 hover:shadow-2xl flex items-center justify-center gap-3 group">
                                    Ver Ahora
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </Link>
                            <Link href="/catalogo">
                                <button className="bg-white/10 hover:bg-white/20 text-white font-semibold py-4 px-8 rounded-full border border-white/20 transition-all backdrop-blur-sm flex justify-center items-center">
                                    Explorar Catálogo
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Flechas desktop */}
            <button onClick={prevSlide} className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 rounded-full items-center justify-center text-white transition-all hover:scale-110 z-20">
                <ChevronLeft size={20} />
            </button>
            <button onClick={nextSlide} className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 rounded-full items-center justify-center text-white transition-all hover:scale-110 z-20">
                <ChevronRight size={20} />
            </button>

            {/* Dots desktop */}
            <div className="hidden md:flex absolute bottom-8 left-0 right-0 justify-center gap-2 z-20">
                {slides.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrent(idx)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${idx === current
                            ? 'bg-white w-8'
                            : 'bg-white/30 hover:bg-white/60 w-1.5'
                        }`}
                        aria-label={`Diapositiva ${idx + 1}`}
                    />
                ))}
            </div>
        </section>
    )
}
