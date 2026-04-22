import Link from 'next/link'
import { supabase, proxyImageUrl } from '@/lib/supabase'
import HeroSection from '@/components/HeroSection'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import {
    ArrowRight, Package,
    Globe, Star, ShieldCheck, Zap
} from 'lucide-react'

export const revalidate = 0;

export default async function Home() {
    // Portada activa
    const { data: heroData } = await supabase
        .from('portada_destacada')
        .select('*')
        .eq('activo', true)
        .single()

    // Zapatos disponibles — solo columnas necesarias para la portada, máx 20
    const { data: zapatos } = await supabase
        .from('zapatos')
        .select('id, nombre, precio, url_imagen, imagen_hover, categoria, disponible, colores, etiquetas, origen, fecha_creacion')
        .eq('disponible', true)
        .order('fecha_creacion', { ascending: false })
        .limit(20)

    // Slides para el Hero
    const slides = []
    if (heroData) {
        slides.push({
            id: 'portada-main',
            title: heroData.titulo,
            description: heroData.descripcion,
            image_url: heroData.url_imagen,
            product_link: heroData.id_producto ? `/producto/${heroData.id_producto}` : '/catalogo',
            tag: 'Destacado'
        })
    }
    if (zapatos) {
        const nuevos = zapatos.slice(0, 4).map((z: any) => ({
            id: z.id,
            title: z.nombre,
            description: `Disponible desde Bs ${z.precio} por par. Nuevo ingreso de temporada.`,
            image_url: z.url_imagen,
            product_link: `/producto/${z.id}`,
            tag: 'Nuevo Ingreso'
        }))
        slides.push(...nuevos)
    }

    // Productos destacados para las 3 cards
    const pNuevo   = zapatos && zapatos.length > 0 ? zapatos[0] : null
    const pPopular = zapatos && zapatos.length > 0 ? (
        zapatos.find((z: any) => z.nombre.toLowerCase().includes('nike') || z.nombre.toLowerCase().includes('tn'))
        || zapatos[1] || zapatos[0]
    ) : null
    const pOferta  = zapatos && zapatos.length > 0
        ? [...zapatos].sort((a: any, b: any) => a.precio - b.precio)[0]
        : null

    return (
        <main className="min-h-screen bg-navy-600 relative overflow-hidden">

            {/* Navbar */}
            <Navbar />

            {/* Hero */}
            <HeroSection slides={slides} />


            {/* ── STRIP DE CONFIANZA ─────────────────────────────────────── */}
            <section className="bg-navy-800 border-b border-white/8">
                <div className="max-w-7xl mx-auto px-4 py-5">
                    <div className="flex flex-wrap items-center justify-center md:justify-between gap-6 text-white/50 text-xs font-semibold tracking-widest uppercase">
                        <div className="flex items-center gap-2">
                            <Globe size={14} className="text-white/30" />
                            Calzado Brasilero
                        </div>
                        <div className="hidden md:block h-4 w-px bg-white/10" />
                        <div className="flex items-center gap-2">
                            <Globe size={14} className="text-white/30" />
                            Calzado Peruano
                        </div>
                        <div className="hidden md:block h-4 w-px bg-white/10" />
                        <div className="flex items-center gap-2">
                            <Globe size={14} className="text-white/30" />
                            Producción Nacional
                        </div>
                        <div className="hidden md:block h-4 w-px bg-white/10" />
                        <div className="flex items-center gap-2">
                            <ShieldCheck size={14} className="text-white/30" />
                            Precio Mayorista Directo
                        </div>
                        <div className="hidden md:block h-4 w-px bg-white/10" />
                        <div className="flex items-center gap-2">
                            <Star size={14} className="text-white/30" />
                            Stock Actualizado
                        </div>
                        <div className="hidden md:block h-4 w-px bg-white/10" />
                        <div className="flex items-center gap-2">
                            <Zap size={14} className="text-white/30" />
                            Despacho Rápido
                        </div>
                    </div>
                </div>
            </section>

            {/* ── CARDS DESTACADAS ───────────────────────────────────────── */}
            <section className="relative z-10 max-w-7xl mx-auto px-4 py-14">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Nuevo Ingreso */}
                    <Link href={pNuevo ? `/producto/${pNuevo.id}` : '/catalogo'} className="h-64 group">
                        <div className="relative bg-navy-700 border border-white/10 rounded-2xl p-6 overflow-hidden h-full flex flex-col justify-between hover:border-white/25 hover:-translate-y-1 transition-all duration-300">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none rounded-2xl" />
                            <div className="relative z-20 max-w-[55%]">
                                <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-white/60 bg-white/10 border border-white/10 px-3 py-1 rounded-full mb-3">
                                    <Zap size={9} /> Nuevo Ingreso
                                </span>
                                <h3 className="text-white text-xl font-black leading-tight line-clamp-2">
                                    {pNuevo?.nombre || 'Nueva Colección'}
                                </h3>
                                <p className="text-white/40 text-xs mt-1 font-medium">Últimos modelos disponibles</p>
                            </div>
                            <div className="relative z-20 flex items-center gap-1.5 text-white/50 text-xs font-semibold group-hover:text-white/80 transition-colors">
                                Ver modelo <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                            {pNuevo && (
                                <div className="absolute top-4 right-4 w-[42%] h-[85%] pointer-events-none">
                                    <img
                                        src={proxyImageUrl(pNuevo.url_imagen)}
                                        alt={pNuevo.nombre}
                                        className="w-full h-full object-contain transform rotate-[-8deg] group-hover:rotate-0 group-hover:scale-105 transition-all duration-500 drop-shadow-xl"
                                    />
                                </div>
                            )}
                        </div>
                    </Link>

                    {/* Más Buscado */}
                    <Link href={pPopular ? `/producto/${pPopular.id}` : '/catalogo'} className="h-64 group">
                        <div className="relative bg-white rounded-2xl p-6 overflow-hidden h-full flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 shadow-xl shadow-black/20">
                            <div className="relative z-20 max-w-[55%]">
                                <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-navy-600/60 bg-navy-600/10 border border-navy-600/10 px-3 py-1 rounded-full mb-3">
                                    <Star size={9} /> Más Buscado
                                </span>
                                <h3 className="text-navy-600 text-xl font-black leading-tight line-clamp-2">
                                    {pPopular?.nombre || 'Tendencias'}
                                </h3>
                                <p className="text-navy-600/40 text-xs mt-1 font-medium">El preferido de nuestros clientes</p>
                            </div>
                            <div className="relative z-20 flex items-center gap-1.5 text-navy-600/50 text-xs font-semibold group-hover:text-navy-600 transition-colors">
                                Ver modelo <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                            {pPopular && (
                                <div className="absolute top-4 right-4 w-[42%] h-[85%] pointer-events-none">
                                    <img
                                        src={proxyImageUrl(pPopular.url_imagen)}
                                        alt={pPopular.nombre}
                                        className="w-full h-full object-contain transform rotate-[-8deg] group-hover:rotate-0 group-hover:scale-105 transition-all duration-500 drop-shadow-xl"
                                    />
                                </div>
                            )}
                        </div>
                    </Link>

                    {/* Mejor Precio */}
                    <Link href={pOferta ? `/producto/${pOferta.id}` : '/ofertas'} className="h-64 group">
                        <div className="relative bg-navy-700 border border-white/10 rounded-2xl p-6 overflow-hidden h-full flex flex-col justify-between hover:border-white/25 hover:-translate-y-1 transition-all duration-300">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none rounded-2xl" />
                            <div className="relative z-20 max-w-[55%]">
                                <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-white/60 bg-white/10 border border-white/10 px-3 py-1 rounded-full mb-3">
                                    <ShieldCheck size={9} /> Mejor Precio
                                </span>
                                <h3 className="text-white text-xl font-black leading-tight line-clamp-2">
                                    {pOferta?.nombre || 'Ofertas'}
                                </h3>
                                <p className="text-white text-2xl font-black mt-2">
                                    Bs {pOferta?.precio}
                                    <span className="text-white/40 text-xs font-normal ml-1">/ par</span>
                                </p>
                            </div>
                            <div className="relative z-20 flex items-center gap-1.5 text-white/50 text-xs font-semibold group-hover:text-white/80 transition-colors">
                                Ver oferta <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                            {pOferta && (
                                <div className="absolute top-4 right-4 w-[42%] h-[85%] pointer-events-none">
                                    <img
                                        src={proxyImageUrl(pOferta.url_imagen)}
                                        alt={pOferta.nombre}
                                        className="w-full h-full object-contain transform rotate-[-8deg] group-hover:rotate-0 group-hover:scale-105 transition-all duration-500 drop-shadow-xl"
                                    />
                                </div>
                            )}
                        </div>
                    </Link>
                </div>
            </section>

            {/* ── CATÁLOGO ───────────────────────────────────────────────── */}
            <div id="catalogo" className="relative z-10 max-w-7xl mx-auto py-8 px-4 pb-20">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-5">
                    <div>
                        <p className="text-white/40 text-xs font-semibold tracking-[0.3em] uppercase mb-1">Disponibles Ahora</p>
                        <h2 className="text-4xl md:text-5xl font-black text-white">Catálogo</h2>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Link href="/catalogo">
                            <button className="px-5 py-2.5 rounded-full bg-white text-navy-600 font-bold text-sm hover:bg-white/90 transition shadow-md">
                                Ver Todo
                            </button>
                        </Link>
                        <Link href="/catalogo/deportivo">
                            <button className="px-5 py-2.5 rounded-full bg-white/8 border border-white/10 text-white/70 hover:bg-white/15 hover:text-white transition text-sm font-medium">
                                Deportivo
                            </button>
                        </Link>
                        <Link href="/catalogo/casual">
                            <button className="px-5 py-2.5 rounded-full bg-white/8 border border-white/10 text-white/70 hover:bg-white/15 hover:text-white transition text-sm font-medium">
                                Casual
                            </button>
                        </Link>
                        <Link href="/catalogo/ninos">
                            <button className="px-5 py-2.5 rounded-full bg-white/8 border border-white/10 text-white/70 hover:bg-white/15 hover:text-white transition text-sm font-medium">
                                Niños
                            </button>
                        </Link>
                        <Link href="/catalogo/botas">
                            <button className="px-5 py-2.5 rounded-full bg-white/8 border border-white/10 text-white/70 hover:bg-white/15 hover:text-white transition text-sm font-medium">
                                Botas
                            </button>
                        </Link>
                    </div>
                </div>

                {zapatos && zapatos.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
                        {zapatos.map((zapato) => (
                            <ProductCard key={zapato.id} zapato={zapato} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-24 text-white/30 gap-4">
                        <Package size={48} className="text-white/15" />
                        <p className="text-sm font-medium">El catálogo se está cargando. Agrega productos desde el panel admin.</p>
                        <Link href="/admin">
                            <button className="mt-2 px-6 py-3 bg-white text-navy-600 font-bold rounded-full text-sm hover:bg-white/90 transition">
                                Ir al Panel Admin
                            </button>
                        </Link>
                    </div>
                )}
            </div>

            {/* Footer */}
            <Footer />
        </main>
    )
}
