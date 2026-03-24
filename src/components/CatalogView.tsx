'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import ProductCard from '@/components/ProductCard'
import QuickViewModal from '@/components/QuickViewModal'
import { SlidersHorizontal, ChevronDown, X } from 'lucide-react'

interface CatalogViewProps {
    initialProducts: any[]
}

const FILTROS = [
    { label: 'Todo', value: '' },
    { label: 'Adulto', value: 'adulto' },
    { label: 'Niño', value: 'nino' },
    { label: 'Deportivo', value: 'deportivo' },
    { label: 'Casual', value: 'casual' },
    { label: 'Formal', value: 'formal' },
    { label: 'Botas', value: 'botas' },
    { label: 'Sandalias', value: 'sandalias' },
]

export default function CatalogView({ initialProducts }: CatalogViewProps) {
    const [activeFilter, setActiveFilter] = useState('')
    const [sortBy, setSortBy] = useState('recientes')
    const [showSortMenu, setShowSortMenu] = useState(false)
    const [priceMax, setPriceMax] = useState(1000)
    const [showPriceFilter, setShowPriceFilter] = useState(false)

    const [quickViewProduct, setQuickViewProduct] = useState<any>(null)
    const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)

    const filteredProducts = useMemo(() => {
        let result = [...initialProducts]

        if (activeFilter) {
            const af = activeFilter.toLowerCase();
            result = result.filter(p =>
                (p.categoria && p.categoria.toLowerCase().includes(af)) ||
                (p.nombre && p.nombre.toLowerCase().includes(af)) ||
                (p.genero && p.genero.toLowerCase().includes(af)) ||
                (p.grupo_talla && p.grupo_talla.toLowerCase().includes(af)) ||
                (p.etiquetas && Array.isArray(p.etiquetas) && p.etiquetas.some((e: string) => e.toLowerCase().includes(af))) ||
                (p.subcategoria && p.subcategoria.toLowerCase().includes(af))
            )
        }

        result = result.filter(p => p.precio <= priceMax)

        if (sortBy === 'precio_asc') result.sort((a, b) => a.precio - b.precio)
        else if (sortBy === 'precio_desc') result.sort((a, b) => b.precio - a.precio)

        return result
    }, [initialProducts, activeFilter, sortBy, priceMax])

    const sortLabels: Record<string, string> = {
        recientes: 'Más Recientes',
        precio_asc: 'Menor Precio',
        precio_desc: 'Mayor Precio',
    }

    const hasFilters = activeFilter !== '' || priceMax < 1000

    return (
        <section className="max-w-7xl mx-auto px-4 py-8">

            {/* ── HEADER ─────────────────────────────────────────── */}
            <div className="mb-8">
                <p className="text-white/40 text-xs font-semibold tracking-[0.3em] uppercase mb-1">Importadora Fernández</p>
                <h1 className="text-4xl md:text-5xl font-black text-white mb-6">Catálogo</h1>

                {/* Controles en una fila */}
                <div className="flex flex-wrap items-center gap-3">
                    {/* Pills de filtro */}
                    <div className="flex flex-wrap items-center gap-2 flex-1">
                        {FILTROS.map(f => (
                            <button
                                key={f.value}
                                onClick={() => setActiveFilter(f.value)}
                                className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${activeFilter === f.value
                                    ? 'bg-white text-navy-600 shadow-lg'
                                    : 'bg-white/8 border border-white/10 text-white/60 hover:bg-white/15 hover:text-white'
                                    }`}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>

                    {/* Ordenar */}
                    <div className="relative">
                        <button
                            onClick={() => { setShowSortMenu(!showSortMenu); setShowPriceFilter(false) }}
                            className="flex items-center gap-2 bg-white/8 border border-white/10 text-white/70 px-4 py-2 rounded-full text-sm font-semibold hover:bg-white/15 transition"
                        >
                            <SlidersHorizontal size={14} />
                            {sortLabels[sortBy]}
                            <ChevronDown size={13} className={`transition-transform ${showSortMenu ? 'rotate-180' : ''}`} />
                        </button>
                        {showSortMenu && (
                            <div className="absolute right-0 top-[calc(100%+8px)] bg-navy-700 border border-white/10 rounded-2xl shadow-2xl shadow-black/40 overflow-hidden z-30 min-w-[170px]">
                                {Object.entries(sortLabels).map(([val, label]) => (
                                    <button key={val} onClick={() => { setSortBy(val); setShowSortMenu(false) }}
                                        className={`w-full text-left px-5 py-3 text-sm transition hover:bg-white/10 ${sortBy === val ? 'text-white font-bold' : 'text-white/60'}`}>
                                        {label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Filtro precio */}
                    <div className="relative">
                        <button
                            onClick={() => { setShowPriceFilter(!showPriceFilter); setShowSortMenu(false) }}
                            className={`flex items-center gap-2 border px-4 py-2 rounded-full text-sm font-semibold transition ${priceMax < 1000 ? 'bg-white text-navy-600 border-white' : 'bg-white/8 border-white/10 text-white/70 hover:bg-white/15'}`}
                        >
                            Bs máx: {priceMax}
                        </button>
                        {showPriceFilter && (
                            <div className="absolute right-0 top-[calc(100%+8px)] bg-navy-700 border border-white/10 rounded-2xl shadow-2xl shadow-black/40 z-30 p-5 min-w-[220px]">
                                <label className="text-white/50 text-xs uppercase tracking-widest font-bold block mb-3">Precio máximo (Bs)</label>
                                <input type="range" min={50} max={1000} step={50} value={priceMax}
                                    onChange={e => setPriceMax(Number(e.target.value))}
                                    className="w-full accent-white mb-2" />
                                <div className="flex justify-between text-white/40 text-xs">
                                    <span>Bs 50</span>
                                    <span className="text-white font-bold">Bs {priceMax}</span>
                                    <span>Bs 1000</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Limpiar filtros */}
                    {hasFilters && (
                        <button onClick={() => { setActiveFilter(''); setPriceMax(1000) }}
                            className="flex items-center gap-1.5 text-white/40 hover:text-white/70 text-sm transition">
                            <X size={14} /> Limpiar
                        </button>
                    )}
                </div>

                {/* Contador */}
                <p className="text-white/30 text-sm mt-4">
                    {filteredProducts.length} {filteredProducts.length === 1 ? 'modelo' : 'modelos'} disponibles
                </p>
            </div>

            {/* Cerrar menús al hacer click fuera */}
            {(showSortMenu || showPriceFilter) && (
                <div className="fixed inset-0 z-20" onClick={() => { setShowSortMenu(false); setShowPriceFilter(false) }} />
            )}

            {/* ── GRID DE PRODUCTOS ──────────────────────────────── */}
            {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                    {filteredProducts.map((zapato) => (
                        <ProductCard
                            key={zapato.id}
                            zapato={zapato}
                            onQuickView={(p) => {
                                setQuickViewProduct(p)
                                setIsQuickViewOpen(true)
                            }}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-24 text-white/30 gap-4">
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-2">
                        <SlidersHorizontal size={28} className="text-white/20" />
                    </div>
                    <h3 className="text-white/50 font-bold text-lg">Sin resultados</h3>
                    <p className="text-sm">Ajusta los filtros para ver más modelos</p>
                    <button onClick={() => { setActiveFilter(''); setPriceMax(1000) }}
                        className="mt-2 px-6 py-2.5 bg-white text-navy-600 font-bold rounded-full text-sm hover:bg-white/90 transition">
                        Ver todo el catálogo
                    </button>
                </div>
            )}

            {/* Quick View Modal */}
            <QuickViewModal
                producto={quickViewProduct}
                isOpen={isQuickViewOpen}
                onClose={() => setIsQuickViewOpen(false)}
            />
        </section>
    )
}
