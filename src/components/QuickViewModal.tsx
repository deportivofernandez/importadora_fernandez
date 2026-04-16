'use client'

import { useState, useEffect } from 'react'
import { X, ShoppingBag, Check, ArrowRight } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import Link from 'next/link'
import { proxyImageUrl } from '@/lib/supabase'

interface QuickViewProps {
    producto: any
    isOpen: boolean
    onClose: () => void
}

export default function QuickViewModal({ producto, isOpen, onClose }: QuickViewProps) {
    const [selectedCurva, setSelectedCurva] = useState<string>('')
    const [selectedColorState, setSelectedColorState] = useState<any | null>(null)
    const [cantidadPares, setCantidadPares] = useState<6 | 12>(12) // Default docena
    const { addToCart } = useCart()
    const [isAdded, setIsAdded] = useState(false)

    // Resetear estados cuando cambia el producto
    useEffect(() => {
        if (isOpen) {
            setSelectedCurva('')
            setSelectedColorState(null)
            setCantidadPares(12)
            setIsAdded(false)
        }
    }, [isOpen, producto])

    if (!isOpen || !producto) return null

    // Lógica básica igual a ProductView
    const curvas = [
        { label: 'Niño', range: '27-32', value: 'Niño (27-32)' },
        { label: 'Juvenil', range: '32-37', value: 'Juvenil (32-37)' },
        { label: 'Adulto', range: '38-43', value: 'Adulto (38-43)' }
    ]

    // Helpers para soportar nueva estructura JSON o antiguo string
    const getHex = (c: any) => typeof c === 'string' ? c : (c?.hex || '#000000')
    const getImg = (c: any) => typeof c === 'object' ? (c?.imagen_url || null) : null
    const getName = (c: any) => typeof c === 'object' ? (c?.nombre || 'Color') : 'Color'

    const handleAddToCart = () => {
        if (!selectedCurva || !selectedColorState) return

        addToCart({
            id_producto: producto.id,
            nombre: producto.nombre,
            precio_unitario: producto.precio,
            imagen: getImg(selectedColorState) || producto.url_imagen,
            tipo_curva: selectedCurva as any,
            cantidad_pares: cantidadPares,
            color: `${getName(selectedColorState)} (${getHex(selectedColorState)})`,
            total_item: producto.precio * cantidadPares
        })

        setIsAdded(true)
        setTimeout(() => {
            onClose()
        }, 1500)
    }

    const coloresDisponibles = producto.colores && producto.colores.length > 0
        ? producto.colores
        : ['#000000', '#FFFFFF', '#5D4037', '#1E40AF']

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Backdrop con blur */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden relative animate-scale-up flex flex-col md:flex-row max-h-[90vh]">

                {/* Botón Cerrar */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 bg-white/80 p-2 rounded-full hover:bg-slate-100 transition-colors"
                >
                    <X size={24} className="text-slate-500" />
                </button>

                {/* Columna Izquierda: Imagen */}
                <div className="w-full md:w-1/2 bg-slate-50 relative flex items-center justify-center p-8">
                    <img
                        src={proxyImageUrl(selectedColorState ? (getImg(selectedColorState) || producto.url_imagen) : producto.url_imagen)}
                        alt={producto.nombre}
                        className="w-full h-full object-contain mix-blend-multiply max-h-[300px] md:max-h-[400px]"
                    />
                    {producto.origen && producto.origen !== 'Nacional' && (
                        <div className="absolute top-6 left-6 flex items-center gap-2 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full shadow-sm">
                            <span className="text-xl">{producto.origen === 'Brazilero' ? '🇧🇷' : '🇵🇪'}</span>
                            <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                                {producto.origen}
                            </span>
                        </div>
                    )}
                </div>

                {/* Columna Derecha: Info y Acciones */}
                <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col overflow-y-auto">
                    <div className="mb-1">
                        <span className="text-xs font-bold text-orange-500 uppercase tracking-wider">{producto.categoria}</span>
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 mb-2 leading-tight">{producto.nombre}</h2>
                    <p className="text-3xl font-black text-slate-900 mb-6">
                        Bs {producto.precio}
                        <span className="text-sm font-normal text-slate-400 ml-1">/ par</span>
                    </p>

                    {/* Selector Rápido */}
                    <div className="space-y-5 mb-8">
                        {/* 1. Curva */}
                        <div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide block mb-2">1. Elige Curva</span>
                            <div className="flex flex-wrap gap-2">
                                {curvas.map(c => (
                                    <button
                                        key={c.value}
                                        onClick={() => setSelectedCurva(c.value)}
                                        className={`px-3 py-2 rounded-lg text-xs font-bold border transition-all ${selectedCurva === c.value
                                                ? 'border-orange-500 bg-orange-50 text-orange-700'
                                                : 'border-slate-200 text-slate-600 hover:border-orange-300'
                                            }`}
                                    >
                                        {c.label} <span className="opacity-60 font-normal">({c.range})</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 2. Color */}
                        <div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide block mb-2">2. Elige Color</span>
                            <div className="flex flex-wrap gap-2">
                                {coloresDisponibles.map((colorItem: any, idx: number) => {
                                    const hex = getHex(colorItem)
                                    const isSelected = selectedColorState === colorItem
                                    const img = getImg(colorItem)
                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedColorState(colorItem)}
                                            className={`w-8 h-8 rounded-full border-2 shadow-sm transition-all relative flex items-center justify-center overflow-hidden ${isSelected
                                                    ? 'border-orange-500 ring-1 ring-orange-200 scale-110'
                                                    : 'border-slate-200 hover:scale-105'
                                                }`}
                                            style={img ? undefined : { backgroundColor: hex }}
                                            title={getName(colorItem)}
                                        >
                                            {img && (
                                                <img src={proxyImageUrl(img)} className="w-full h-full object-cover" alt={getName(colorItem)} />
                                            )}
                                            {isSelected && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                                    <Check size={14} className="text-white drop-shadow-md" />
                                                </div>
                                            )}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        {/* 3. Cantidad */}
                        <div className="flex gap-3 p-3 bg-slate-50 rounded-xl">
                            <button
                                onClick={() => setCantidadPares(6)}
                                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${cantidadPares === 6 ? 'bg-white shadow text-slate-900' : 'text-slate-400 hover:text-slate-600'
                                    }`}
                            >
                                6 Pares
                            </button>
                            <button
                                onClick={() => setCantidadPares(12)}
                                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${cantidadPares === 12 ? 'bg-white shadow text-slate-900' : 'text-slate-400 hover:text-slate-600'
                                    }`}
                            >
                                12 Pares
                            </button>
                        </div>
                    </div>

                    {/* Acciones */}
                    <div className="mt-auto space-y-3">
                        <button
                            onClick={handleAddToCart}
                            disabled={!selectedCurva || !selectedColorState || isAdded}
                            className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-all ${isAdded
                                    ? 'bg-green-500 text-white'
                                    : (!selectedCurva || !selectedColorState)
                                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                        : 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg hover:shadow-xl hover:-translate-y-1'
                                }`}
                        >
                            {isAdded ? (
                                <>
                                    <Check size={20} /> ¡Agregado!
                                </>
                            ) : (
                                <>
                                    <ShoppingBag size={20} /> Agregar al Pedido
                                </>
                            )}
                        </button>

                        <Link href={`/producto/${producto.id}`} className="block w-full text-center">
                            <button className="text-xs font-bold text-slate-500 hover:text-orange-500 flex items-center justify-center gap-1 mx-auto transition-colors">
                                Ver todos los detalles <ArrowRight size={14} />
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
