'use client'

import { useState, useEffect } from 'react'
import { supabase, proxyImageUrl } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MessageCircle, ShieldCheck, Truck, Package, Info, ShoppingBag, Check } from 'lucide-react'
import ProductCard from '@/components/ProductCard' // Asegurar import
import { useCart } from '@/context/CartContext'

const WHATSAPP_NUMBER = '59173970609'

interface ProductViewProps {
    producto: any
    productosRelacionados?: any[]
}

export default function ProductView({ producto, productosRelacionados }: ProductViewProps) {
    const router = useRouter()
    const { addToCart } = useCart()

    // Imagen
    const [selectedImage, setSelectedImage] = useState(producto.url_imagen)

    // Lógica Mayorista
    const [tipoCurva, setTipoCurva] = useState<'Niño (27-32)' | 'Juvenil (32-37)' | 'Adulto (38-43)' | null>(() => {
        if (producto.categoria === 'nino' || producto.categoria === 'niño' || producto.categoria === 'infantil') return 'Niño (27-32)'
        if (producto.categoria === 'adulto' || producto.categoria === 'varon' || producto.categoria === 'mujer') return 'Adulto (38-43)'
        return null
    })
    const [cantidadCajon, setCantidadCajon] = useState<6 | 12>(12)

    // Nuevo: Selección de Color (puede ser objeto o string)
    const [selectedColorState, setSelectedColorState] = useState<any | null>(null)

    // Colores disponibles (si la DB no tiene, usamos un fallback seguro)
    const coloresDisponibles = producto.colores && producto.colores.length > 0
        ? producto.colores
        : ['#000000', '#FFFFFF', '#5D4037'] // Negro, Blanco, Café por defecto

    // Helpers para soportar nueva estructura JSON o antiguo string
    const getHex = (c: any) => typeof c === 'string' ? c : (c?.hex || '#000000')
    const getImg = (c: any) => typeof c === 'object' ? (c?.imagen_url || null) : null
    const getName = (c: any) => typeof c === 'string' ? (getColorNameFallback(c)) : (c?.nombre || 'Color')

    const getColorNameFallback = (hex: string) => {
        const names: { [key: string]: string } = {
            '#000000': 'Negro', '#FFFFFF': 'Blanco', '#5D4037': 'Café',
            '#1E40AF': 'Azul', '#DC2626': 'Rojo', '#F59E0B': 'Mostaza'
        }
        return names[hex] || 'Color'
    }

    // Efecto para cambiar imagen si el color tiene una
    useEffect(() => {
        if (selectedColorState) {
            const img = getImg(selectedColorState)
            if (img) setSelectedImage(img)
            else setSelectedImage(producto.url_imagen)
        }
    }, [selectedColorState, producto.url_imagen])

    const handleWhatsAppClick = async () => {
        await supabase.rpc('incrementar_consulta_zapato', { zapato_id: producto.id })

        const texto = `Hola, tengo una duda sobre el modelo *${producto.nombre}*.\nLink: ${window.location.href}`
        const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(texto)}`
        window.open(url, '_blank')
    }

    const handleAddToCart = () => {
        if (!tipoCurva || !selectedColorState) return

        const totalItem = producto.precio * cantidadCajon

        addToCart({
            id_producto: producto.id,
            nombre: producto.nombre,
            precio_unitario: producto.precio,
            imagen: getImg(selectedColorState) || producto.url_imagen,
            tipo_curva: tipoCurva,
            cantidad_pares: cantidadCajon,
            color: `${getName(selectedColorState)} (${getHex(selectedColorState)})`,
            total_item: totalItem
        })

        // Notificación temporal
        const btn = document.getElementById('add-btn')
        if (btn) {
            const originalText = btn.innerHTML
            btn.innerHTML = '✅ ¡Agregado!'
            btn.classList.add('bg-green-600')
            setTimeout(() => {
                btn.innerHTML = originalText
                btn.classList.remove('bg-green-600')
            }, 2000)
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 pt-28 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">

                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 mb-6 text-sm text-slate-500">
                    <Link href="/" className="hover:text-orange-500 flex items-center gap-1">
                        <ArrowLeft size={16} /> Volver al catálogo
                    </Link>
                    <span>/</span>
                    <span className="uppercase text-slate-800 font-semibold">{producto.categoria}</span>
                </div>

                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">

                        {/* Columna Izquierda: Imagen */}
                        <div className="bg-slate-50 p-6 lg:p-12 flex flex-col items-center justify-center relative group">
                            <div className="relative w-full aspect-square max-w-lg mx-auto">
                                <img
                                    src={proxyImageUrl(selectedImage)}
                                    alt={producto.nombre}
                                    className="w-full h-full object-contain rounded-3xl mix-blend-multiply transition-all duration-500 hover:scale-105 drop-shadow-xl"
                                />
                                <div className="absolute top-0 left-0 flex flex-col gap-2">
                                    {producto.etiquetas?.includes('nuevo') && (
                                        <span className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg tracking-wider">
                                            NUEVA COLECCIÓN
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Columna Derecha: Selección Mayorista */}
                        <div className="p-8 lg:p-12 flex flex-col">
                            <div className="mb-auto">
                                {producto.origen && (
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-2xl drop-shadow-sm filter">
                                            {producto.origen === 'Brazilero' ? '🇧🇷' : producto.origen === 'Peruano' ? '🇵🇪' : '🇧🇴'}
                                        </span>
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest bg-slate-100 px-2 py-1 rounded">
                                            Calidad {producto.origen}
                                        </span>
                                    </div>
                                )}
                                <h1 className="text-3xl lg:text-4xl font-black text-slate-900 mb-2 leading-tight">
                                    {producto.nombre}
                                </h1>

                                <div className="flex items-center gap-2 mb-6">
                                    <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                                        Precio Mayorista
                                    </span>
                                    <span className="text-3xl font-black text-slate-900">
                                        Bs {producto.precio}
                                        <span className="text-sm font-normal text-slate-400 ml-1">/ par</span>
                                    </span>
                                </div>

                                {/* Selección 1: Curva */}
                                <div className="mb-6">
                                    <h3 className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest flex items-center gap-2">
                                        1. Elige tu Curva (Tallas)
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        {[
                                            { label: 'Niño', range: '27-32', value: 'Niño (27-32)' },
                                            { label: 'Juvenil', range: '32-37', value: 'Juvenil (32-37)' },
                                            { label: 'Adulto', range: '38-43', value: 'Adulto (38-43)' }
                                        ].map((opcion) => (
                                            <button
                                                key={opcion.value}
                                                onClick={() => setTipoCurva(opcion.value as any)}
                                                className={`p-3 rounded-xl border-2 text-left transition-all ${tipoCurva === opcion.value
                                                    ? 'border-orange-500 bg-orange-50 ring-1 ring-orange-200'
                                                    : 'border-slate-200 hover:border-slate-300 bg-white'
                                                    }`}
                                            >
                                                <div className={`font-bold ${tipoCurva === opcion.value ? 'text-orange-700' : 'text-slate-700'}`}>
                                                    {opcion.label}
                                                </div>
                                                <div className="text-xs text-slate-500 font-medium">Tallas {opcion.range}</div>
                                            </button>
                                        ))}
                                    </div>
                                    {!tipoCurva && <p className="text-red-500 text-xs mt-1 font-medium animate-pulse">* Requerido</p>}
                                </div>

                                {/* Selección 2: Cantidad */}
                                <div className="mb-6">
                                    <h3 className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">2. Elige Cantidad del Paquete</h3>
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => setCantidadCajon(6)}
                                            className={`flex-1 py-3 px-4 rounded-xl border-2 flex items-center justify-between gap-2 transition-all ${cantidadCajon === 6
                                                ? 'border-orange-500 bg-orange-50/50 shadow-sm'
                                                : 'border-slate-200 bg-white hover:border-slate-300'
                                                }`}
                                        >
                                            <span className={`font-bold ${cantidadCajon === 6 ? 'text-orange-800' : 'text-slate-600'}`}>Media Docena</span>
                                            <span className="text-xs bg-white border border-slate-200 px-2 py-1 rounded font-medium text-slate-500">6 pares</span>
                                        </button>

                                        <button
                                            onClick={() => setCantidadCajon(12)}
                                            className={`flex-1 py-3 px-4 rounded-xl border-2 flex items-center justify-between gap-2 transition-all ${cantidadCajon === 12
                                                ? 'border-orange-500 bg-orange-50/50 shadow-sm'
                                                : 'border-slate-200 bg-white hover:border-slate-300'
                                                }`}
                                        >
                                            <span className={`font-bold ${cantidadCajon === 12 ? 'text-orange-800' : 'text-slate-600'}`}>Docena</span>
                                            <span className="text-xs bg-white border border-slate-200 px-2 py-1 rounded font-medium text-slate-500">12 pares</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Selección 3: Color (NUEVO) */}
                                <div className="mb-8 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                                    <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase flex items-center justify-between">
                                        3. Elige el Color del Paquete
                                        {selectedColorState && (
                                            <span className="text-xs font-normal text-slate-500 normal-case">
                                                Seleccionado: <strong>{getName(selectedColorState)}</strong>
                                            </span>
                                        )}
                                    </h3>

                                    <div className="flex flex-wrap gap-3">
                                        {coloresDisponibles.map((colorItem: any, idx: number) => {
                                            const hex = getHex(colorItem)
                                            const isSelected = selectedColorState === colorItem
                                            const img = getImg(colorItem)
                                            return (
                                                <button
                                                    key={idx}
                                                    onClick={() => setSelectedColorState(colorItem)}
                                                    className={`w-12 h-12 rounded-full border-2 shadow-sm transition-all relative flex items-center justify-center overflow-hidden ${isSelected
                                                        ? 'border-orange-500 ring-2 ring-orange-200 scale-110'
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
                                                            <Check size={20} className="text-white drop-shadow-md" />
                                                        </div>
                                                    )}
                                                </button>
                                            )
                                        })}
                                    </div>
                                    {!selectedColorState && (
                                        <p className="text-slate-400 text-xs mt-3 flex items-center gap-1">
                                            <Info size={12} />
                                            Todos los pares del paquete serán de este color.
                                        </p>
                                    )}
                                </div>

                                {/* Resumen del Pedido */}
                                <div className="bg-slate-900 text-white p-6 rounded-2xl mb-6 shadow-xl">
                                    <div className="flex justify-between items-center mb-2 text-slate-300 text-xs uppercase tracking-wider font-bold">
                                        <span>Total estimado</span>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <div className="text-4xl font-black text-white leading-none mb-1">
                                                Bs {producto.precio * cantidadCajon}
                                            </div>
                                            <div className="text-xs text-slate-400">
                                                ({cantidadCajon} pares x Bs {producto.precio})
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            {tipoCurva ? (
                                                <span className="text-green-400 text-xs font-bold bg-green-900/50 px-2 py-1 rounded border border-green-700">
                                                    {tipoCurva}
                                                </span>
                                            ) : <span className="text-slate-600 text-xs">Falta Curva</span>}

                                            {selectedColorState ? (
                                                <div className="flex items-center gap-1.5 text-xs font-bold text-white bg-white/10 px-2 py-1 rounded">
                                                    <div className="w-2 h-2 rounded-full" style={{ background: getHex(selectedColorState) }}></div>
                                                    {getName(selectedColorState)}
                                                </div>
                                            ) : <span className="text-orange-400 text-xs font-bold animate-pulse">Falta Color</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Botones de Acción */}
                            <div className="flex flex-col gap-3">
                                <button
                                    id="add-btn"
                                    onClick={handleAddToCart}
                                    disabled={!tipoCurva || !selectedColorState}
                                    className={`w-full py-4 text-white rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-3 transition-all ${(tipoCurva && selectedColorState)
                                        ? 'bg-orange-500 hover:bg-orange-600 hover:shadow-orange-500/30 hover:translate-y-[-2px]'
                                        : 'bg-slate-300 cursor-not-allowed grayscale'
                                        }`}
                                >
                                    <ShoppingBag size={24} />
                                    Agregar al Pedido
                                </button>

                                <button
                                    onClick={handleWhatsAppClick}
                                    className="w-full py-3 bg-white border-2 border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50 hover:border-slate-300 transition-colors flex items-center justify-center gap-2"
                                >
                                    <MessageCircle size={20} />
                                    Tengo una duda antes de pedir
                                </button>
                            </div>

                            {/* Garantías */}
                            <div className="flex items-center justify-around mt-6 pt-6 border-t border-slate-100 text-slate-400 text-xs font-medium">
                                <div className="flex items-center gap-2"><Truck size={14} /> Envíos Nacionales</div>
                                <div className="flex items-center gap-2"><Package size={14} /> Venta Mayorista</div>
                            </div>

                        </div>
                    </div>
                </div>

                {/* PRODUCTOS RELACIONADOS */}
                {productosRelacionados && productosRelacionados.length > 0 && (
                    <div className="mt-16 animate-fade-in-up">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900">
                                También te podría interesar
                            </h2>
                            <Link href="/catalogo" className="text-orange-600 font-bold text-sm hover:underline flex items-center gap-1">
                                Ver todo <ArrowLeft size={16} className="rotate-180" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {productosRelacionados.map((relacionado) => (
                                <ProductCard key={relacionado.id} zapato={relacionado} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
