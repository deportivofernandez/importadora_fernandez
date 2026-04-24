'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Heart, ArrowRight, Globe } from 'lucide-react'
import { useFavorites } from '@/context/FavoritesContext'
import { proxyImageUrl } from '@/lib/supabase'

export default function ProductCard({ zapato, onQuickView }: { zapato: any, onQuickView?: (product: any) => void }) {
    const [isHovered, setIsHovered] = useState(false)
    const [activeColor, setActiveColor] = useState(0)
    const { toggleFavorite, isFavorite } = useFavorites()
    const liked = isFavorite(zapato.id)

    const handleLike = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        toggleFavorite({
            id: zapato.id,
            nombre: zapato.nombre,
            precio: zapato.precio,
            url_imagen: zapato.url_imagen,
            categoria: zapato.categoria || '',
            disponible: zapato.disponible ?? true
        })
    }

    const colores: any[] = zapato.colores || []
    const getHex = (c: any) => typeof c === 'string' ? c : (c?.hex || '#CCCCCC')
    const getImg = (c: any) => typeof c === 'object' ? (c?.imagen_url || null) : null
    const activeImg = colores[activeColor] ? (getImg(colores[activeColor]) || zapato.url_imagen) : zapato.url_imagen

    return (
        <Link href={`/producto/${zapato.id}`} className="group block">
            <div
                className="bg-white rounded-2xl p-2 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 relative flex flex-col"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* ── IMAGEN ────────────────────────────────────── */}
                <div className="relative bg-slate-50 overflow-hidden rounded-xl" style={{ aspectRatio: '1/1' }}>

                    {/* Badges */}
                    <div className="absolute top-2 left-2 z-10 flex flex-col gap-1.5">
                        {zapato.etiquetas?.includes('nuevo') && (
                            <span className="bg-[#0284C7] text-white text-[8px] font-black px-2 py-0.5 rounded-sm uppercase tracking-[0.2em]">
                                NEW
                            </span>
                        )}
                        {zapato.origen && zapato.origen !== 'Nacional' && (
                            <span className="bg-[#0284C7]/80 backdrop-blur-sm text-white text-[8px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-widest flex items-center gap-0.5">
                                <Globe size={7} />
                                {zapato.origen}
                            </span>
                        )}
                    </div>

                    {/* Corazón */}
                    <button
                        onClick={handleLike}
                        className={`absolute top-2 right-2 z-10 w-7 h-7 rounded-full flex items-center justify-center transition-all border ${liked
                            ? 'bg-red-50 border-red-200 text-red-500'
                            : 'bg-white/80 border-slate-200 text-slate-300 hover:text-red-400'
                            }`}
                    >
                        <Heart size={13} className={liked ? 'fill-current' : ''} />
                    </button>

                    {/* Imagen — ocupa todo el espacio, el contenedor la recorta curva */}
                    <img
                        src={proxyImageUrl(isHovered && zapato.imagen_hover ? zapato.imagen_hover : (activeImg || zapato.url_imagen))}
                        alt={zapato.nombre}
                        className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-105' : 'scale-100'}`}
                    />

                    {/* Overlay consultar al hacer hover */}
                    <div className={`absolute inset-x-0 bottom-0 flex justify-center pb-3 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                        <button
                            onClick={(e) => { e.preventDefault(); if (onQuickView) onQuickView(zapato) }}
                            className="flex items-center gap-1.5 bg-[#1B2436] text-white px-5 py-2 rounded-xl text-xs font-bold shadow-lg"
                        >
                            Consultar <ArrowRight size={12} />
                        </button>
                    </div>
                </div>

                {/* ── INFO ──────────────────────────────────────── */}
                <div className="px-3 pt-2.5 pb-3 flex flex-col gap-1.5">

                    {/* Swatches */}
                    {colores.length > 0 && (
                        <div className="flex items-center gap-1">
                            {colores.slice(0, 6).map((color: any, i: number) => {
                                const img = getImg(color)
                                return img ? (
                                    <button key={i} onClick={(e) => { e.preventDefault(); setActiveColor(i) }}
                                        className={`w-6 h-6 rounded-md overflow-hidden border-2 transition-all flex-shrink-0 ${activeColor === i ? 'border-[#1B2436] scale-110' : 'border-transparent hover:border-slate-300'}`}>
                                        <img src={proxyImageUrl(img)} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ) : (
                                    <button key={i} onClick={(e) => { e.preventDefault(); setActiveColor(i) }}
                                        className={`w-4 h-4 rounded-full border-2 transition-all flex-shrink-0 ${activeColor === i ? 'border-[#1B2436] scale-125' : 'border-white ring-1 ring-slate-200'}`}
                                        style={{ backgroundColor: getHex(color) }} />
                                )
                            })}
                            {colores.length > 6 && <span className="text-[9px] text-slate-400">+{colores.length - 6}</span>}
                        </div>
                    )}

                    <p className="text-[9px] uppercase tracking-[0.2em] text-slate-400 font-bold leading-none">{zapato.categoria}</p>
                    <h3 className="text-sm font-bold text-slate-800 leading-snug line-clamp-2">{zapato.nombre}</h3>

                    {/* Precio */}
                    <div className="flex items-center justify-between mt-0.5">
                        <div>
                            <p className="text-base font-black text-[#1B2436] leading-none">Bs {zapato.precio}</p>
                            <span className="text-[9px] text-slate-300 font-medium">por par</span>
                        </div>
                        <button
                            onClick={(e) => { e.preventDefault(); if (onQuickView) onQuickView(zapato) }}
                            className="w-8 h-8 bg-[#1B2436] text-white rounded-xl flex items-center justify-center hover:bg-[#243050] transition-colors"
                        >
                            <ArrowRight size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    )
}
