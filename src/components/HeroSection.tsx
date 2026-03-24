'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronRight, ChevronLeft, ArrowRight, Package } from 'lucide-react'
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
            className="relative bg-navy-700 overflow-hidden min-h-[620px] flex items-center"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Fondo decorativo — gradiente sutil */}
            <div className="absolute inset-0 bg-gradient-to-br from-navy-600 via-navy-700 to-navy-800 pointer-events-none" />
            {/* Líneas decorativas sutiles */}
            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 60px, rgba(255,255,255,0.3) 60px, rgba(255,255,255,0.3) 61px)'
            }} />

            <div className="relative z-10 max-w-7xl mx-auto px-4 w-full py-12 md:py-20">
                <div className="flex flex-col md:grid md:grid-cols-2 gap-8 md:gap-12 items-center">

                    {/* IMAGEN MÓVIL (ARRIBA) Y DESKTOP (DERECHA) */}
                    <div className="order-1 md:order-2 relative h-[350px] md:h-[500px] w-full flex items-center justify-center">
                        {/* Círculo resplandor */}
                        <div className="absolute inset-0 rounded-full blur-3xl opacity-20 bg-white scale-75 pointer-events-none" />

                        <div className="relative z-10 w-full h-full rounded-2xl overflow-hidden shadow-2xl group" key={`img-${current}`}>
                            <img
                                src={proxyImageUrl(activeSlide.image_url)}
                                alt={activeSlide.title}
                                className="w-full h-full object-cover animate-slide-up group-hover:scale-105 transition-all duration-700"
                            />
                        </div>
                    </div>

                    {/* TEXTO */}
                    <div className="order-2 md:order-1 space-y-5 md:space-y-7 animate-fade-in w-full" key={`text-${current}`}>
                        {activeSlide.tag && (
                            <span className="inline-flex items-center gap-2 text-white/70 font-semibold tracking-[0.2em] uppercase text-[10px] md:text-xs bg-white/10 border border-white/20 px-3 py-1.5 md:px-4 md:py-2 rounded-full backdrop-blur-sm">
                                {activeSlide.tag}
                            </span>
                        )}

                        <h1 className="text-3xl md:text-6xl lg:text-7xl font-black text-white leading-tight tracking-tight">
                            {activeSlide.title}
                        </h1>

                        <p className="text-white/60 text-base md:text-lg leading-relaxed max-w-lg font-light">
                            {activeSlide.description}
                        </p>

                        {/* Badge mayorista */}
                        <div className="flex items-center gap-3 text-white/50 text-xs md:text-sm">
                            <div className="h-px w-6 md:w-8 bg-white/30" />
                            Venta por docena o media docena
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-2 w-full">
                            <Link href={activeSlide.product_link} className="w-full sm:w-auto">
                                <button className="w-full bg-white text-navy-600 font-bold py-3.5 md:py-4 px-8 md:px-10 rounded-xl md:rounded-full shadow-xl transition-all hover:scale-105 hover:shadow-2xl flex items-center justify-center gap-3 group">
                                    Ver Ahora
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </Link>
                            <Link href="/catalogo" className="w-full sm:w-auto">
                                <button className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-3.5 md:py-4 px-8 rounded-xl md:rounded-full border border-white/20 transition-all backdrop-blur-sm flex justify-center items-center">
                                    Explorar Catálogo
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Flechas */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-[225px] md:top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 rounded-full flex items-center justify-center text-white transition-all hover:scale-110 z-20"
            >
                <ChevronLeft size={20} />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 top-[225px] md:top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 rounded-full flex items-center justify-center text-white transition-all hover:scale-110 z-20"
            >
                <ChevronRight size={20} />
            </button>

            {/* Dots */}
            <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-20">
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
