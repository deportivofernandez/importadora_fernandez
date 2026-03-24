'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
    Search, ShoppingBag, User, Menu, X, ChevronDown, LogOut,
    Heart, Package, Truck, Globe, Tag, Sparkles, ArrowRight,
    Shield, LayoutGrid, Home, Sun
} from 'lucide-react'
import { supabase, proxyImageUrl } from '@/lib/supabase'
import { useDebouncedCallback } from 'use-debounce'
import { useCart } from '@/context/CartContext'
import { usePathname } from 'next/navigation'

export default function Navbar() {
    const pathname = usePathname() || '/'
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [catalogoOpen, setCatalogoOpen] = useState(false)
    const [userMenuOpen, setUserMenuOpen] = useState(false)
    const [user, setUser] = useState<any>(null)
    const [scrolled, setScrolled] = useState(false)

    const [searchTerm, setSearchTerm] = useState('')
    const [searchResults, setSearchResults] = useState<any[]>([])
    const [isSearching, setIsSearching] = useState(false)
    const [showResults, setShowResults] = useState(false)

    const { cartCount } = useCart()

    const handleSearch = useDebouncedCallback(async (term: string) => {
        if (!term || term.length < 2) {
            setSearchResults([])
            return
        }
        setIsSearching(true)
        const { data } = await supabase
            .from('zapatos')
            .select('id, nombre, precio, url_imagen, categoria')
            .ilike('nombre', `%${term}%`)
            .eq('disponible', true)
            .limit(5)
        setSearchResults(data || [])
        setIsSearching(false)
        setShowResults(true)
    }, 300)

    useEffect(() => {
        // Cerrar todos los menús al cambiar de ruta
        setMobileMenuOpen(false)
        setUserMenuOpen(false)
        setCatalogoOpen(false)
        setShowResults(false)
    }, [pathname])

    useEffect(() => {
        checkUser()
        const onScroll = () => setScrolled(window.scrollY > 10)
        window.addEventListener('scroll', onScroll)
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement
            if (userMenuOpen && !target.closest('.user-menu-container')) {
                setUserMenuOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            window.removeEventListener('scroll', onScroll)
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [userMenuOpen])

    const checkUser = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
    }

    const handleLogout = async () => {
        await supabase.auth.signOut()
        setUser(null)
        setUserMenuOpen(false)
    }

    const categorias = [
        { nombre: 'Deportivo',  slug: 'deportivo',  imagen: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop' },
        { nombre: 'Casual',     slug: 'casual',     imagen: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop' },
        { nombre: 'Formal',     slug: 'formal',     imagen: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=400&h=300&fit=crop' },
        { nombre: 'Niños',      slug: 'ninos',      imagen: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=400&h=300&fit=crop' },
        { nombre: 'Botas',      slug: 'botas',      imagen: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=400&h=300&fit=crop' },
        { nombre: 'Sandalias',  slug: 'sandalias',  imagen: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=400&h=300&fit=crop' },
    ]

    return (
        <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-2xl shadow-black/40' : ''}`}>



            {/* Main Navbar — Azul marino */}
            <div className="bg-navy-600 border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">

                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="relative w-10 h-10 bg-white/10 border border-white/20 rounded-lg flex items-center justify-center overflow-hidden group-hover:bg-white/20 transition">
                                <span className="text-white font-black text-lg tracking-tighter leading-none">IF</span>
                            </div>
                            <div className="flex flex-col leading-none">
                                <span className="text-white/60 font-medium text-[10px] tracking-[0.3em] uppercase">Importadora</span>
                                <span className="text-white font-black text-xl tracking-widest uppercase">Fernández</span>
                            </div>
                        </Link>

                        {/* Desktop Menu */}
                        <div className="hidden lg:flex items-center gap-8 text-sm font-semibold uppercase tracking-widest">
                            <Link href="/" className="text-white/80 hover:text-white transition-colors">
                                Inicio
                            </Link>

                            {/* Catálogo Mega Menú */}
                            <div
                                className="relative"
                                onMouseEnter={() => setCatalogoOpen(true)}
                                onMouseLeave={() => setCatalogoOpen(false)}
                            >
                                <button className="flex items-center gap-1.5 text-white/80 hover:text-white transition-colors">
                                    Catálogo
                                    <ChevronDown size={15} className={`transition-transform duration-200 ${catalogoOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {catalogoOpen && (
                                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 w-screen max-w-5xl bg-navy-700 rounded-2xl shadow-2xl shadow-black/50 border border-white/10 overflow-hidden">
                                        <div className="grid grid-cols-12 gap-0">
                                            {/* Columna Links */}
                                            <div className="col-span-3 p-6 border-r border-white/10 space-y-6">
                                                <div>
                                                    <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-3">Destacados</p>
                                                    <ul className="space-y-2">
                                                        <li>
                                                            <Link href="/catalogo" className="flex items-center gap-2 text-white/70 hover:text-white transition text-sm">
                                                                <LayoutGrid size={14} /> Ver Todo
                                                            </Link>
                                                        </li>
                                                        <li>
                                                            <Link href="/ofertas" className="flex items-center gap-2 text-white/70 hover:text-white transition text-sm">
                                                                <Tag size={14} /> Ofertas
                                                            </Link>
                                                        </li>
                                                        <li>
                                                            <Link href="/nuevos" className="flex items-center gap-2 text-white/70 hover:text-white transition text-sm">
                                                                <Sparkles size={14} /> Nuevos Ingresos
                                                            </Link>
                                                        </li>
                                                    </ul>
                                                </div>
                                                <div>
                                                    <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-3">Por Origen</p>
                                                    <ul className="space-y-2">
                                                        <li>
                                                            <Link href="/catalogo?origen=Brasil" className="flex items-center gap-2 text-white/70 hover:text-white transition text-sm">
                                                                <Globe size={14} /> Brasil
                                                            </Link>
                                                        </li>
                                                        <li>
                                                            <Link href="/catalogo?origen=Peru" className="flex items-center gap-2 text-white/70 hover:text-white transition text-sm">
                                                                <Globe size={14} /> Perú
                                                            </Link>
                                                        </li>
                                                        <li>
                                                            <Link href="/catalogo?origen=Nacional" className="flex items-center gap-2 text-white/70 hover:text-white transition text-sm">
                                                                <Globe size={14} /> Nacional
                                                            </Link>
                                                        </li>
                                                    </ul>
                                                </div>
                                                <div>
                                                    <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-3">Por Categoría</p>
                                                    <ul className="space-y-2">
                                                        {categorias.slice(0, 4).map(cat => (
                                                            <li key={cat.slug}>
                                                                <Link href={`/catalogo/${cat.slug}`} className="text-white/70 hover:text-white transition text-sm">
                                                                    {cat.nombre}
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>

                                            {/* Columna Visual */}
                                            <div className="col-span-9 p-6">
                                                <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-4">Explorar</p>
                                                <div className="grid grid-cols-3 gap-3">
                                                    {categorias.slice(0, 3).map(cat => (
                                                        <Link key={cat.slug} href={`/catalogo/${cat.slug}`} className="group/card relative overflow-hidden rounded-xl block">
                                                            <div className="aspect-video overflow-hidden">
                                                                <img
                                                                    src={proxyImageUrl(cat.imagen)}
                                                                    alt={cat.nombre}
                                                                    className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-500 brightness-75 group-hover/card:brightness-90"
                                                                />
                                                            </div>
                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-3">
                                                                <div className="flex items-center justify-between w-full">
                                                                    <span className="text-white font-bold text-sm">{cat.nombre}</span>
                                                                    <ArrowRight size={14} className="text-white opacity-0 group-hover/card:opacity-100 transition-opacity" />
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <Link href="/nuevos" className="text-white/80 hover:text-white transition-colors">
                                Nuevos
                            </Link>
                            <Link href="/ofertas" className="text-white hover:text-white/70 transition-colors">
                                Ofertas
                            </Link>
                        </div>

                        {/* Actions Top (Restaurados a petición de móvil) */}
                        <div className="flex items-center gap-2 lg:gap-3">
                            {/* Search */}
                            <div className="relative">
                                <div className="flex items-center bg-white/10 rounded-full px-3 md:px-4 py-2 gap-2 border border-white/10 focus-within:border-white/40 focus-within:bg-white/15 transition-all w-24 sm:w-40 md:w-60">
                                    <Search size={16} className="text-white/50 flex-shrink-0" />
                                    <input
                                        type="text"
                                        placeholder="Buscar..."
                                        className="bg-transparent outline-none text-sm w-full text-white placeholder-white/40 hidden sm:block"
                                        onChange={(e) => {
                                            setSearchTerm(e.target.value)
                                            handleSearch(e.target.value)
                                        }}
                                        onFocus={() => { if (searchResults.length > 0) setShowResults(true) }}
                                        onBlur={() => { setTimeout(() => setShowResults(false), 200) }}
                                        suppressHydrationWarning
                                    />
                                    <input
                                        type="text"
                                        placeholder="..."
                                        className="bg-transparent outline-none text-sm w-full text-white placeholder-white/40 sm:hidden"
                                        onChange={(e) => {
                                            setSearchTerm(e.target.value)
                                            handleSearch(e.target.value)
                                        }}
                                        onFocus={() => { if (searchResults.length > 0) setShowResults(true) }}
                                        onBlur={() => { setTimeout(() => setShowResults(false), 200) }}
                                        suppressHydrationWarning
                                    />
                                    {isSearching && <div className="w-3 h-3 border-2 border-white/50 border-t-transparent rounded-full animate-spin flex-shrink-0" />}
                                </div>

                                {showResults && searchResults.length > 0 && (
                                    <div className="absolute top-full right-0 md:left-0 md:right-auto mt-2 w-64 md:w-80 bg-navy-700 rounded-xl shadow-2xl border border-white/10 overflow-hidden z-[60]">
                                        <div className="p-2">
                                            <p className="text-[10px] font-bold text-white/40 px-2 py-1 uppercase tracking-widest">Resultados</p>
                                            {searchResults.map((result) => (
                                                <Link
                                                    key={result.id}
                                                    href={`/producto/${result.id}`}
                                                    className="flex items-center gap-3 p-2 hover:bg-white/10 rounded-lg transition-colors group"
                                                >
                                                    <img src={proxyImageUrl(result.url_imagen)} alt={result.nombre} className="w-10 h-10 object-contain bg-white/5 rounded-lg border border-white/10" />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-bold text-white truncate">{result.nombre}</p>
                                                        <p className="text-xs text-white/50">{result.categoria}</p>
                                                    </div>
                                                    <span className="text-sm font-bold text-white/80">Bs {result.precio}</span>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {showResults && searchResults.length === 0 && searchTerm.length >= 2 && !isSearching && (
                                    <div className="absolute top-full right-0 md:left-0 md:right-auto mt-2 w-64 md:w-80 bg-navy-700 rounded-xl shadow-2xl border border-white/10 p-4 text-center z-[60]">
                                        <p className="text-sm text-white/50">Sin resultados para "{searchTerm}"</p>
                                    </div>
                                )}
                            </div>

                            {/* User Menu */}
                            <div className="relative user-menu-container">
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition flex-shrink-0"
                                >
                                    {user ? <User size={16} className="text-white" /> : <User size={16} />}
                                </button>

                                {userMenuOpen && (
                                    <div className="absolute right-0 top-full mt-3 w-64 md:w-72 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden z-50 animate-fade-in-up origin-top-right">
                                        {user ? (
                                            <>
                                                <div className="bg-[#f8f9fa] p-5 border-b border-gray-100 flex flex-col items-start text-left">
                                                    <p className="font-extrabold text-[15px] text-black">Usuario Registrado</p>
                                                    <p className="text-[13px] text-gray-500 truncate w-full">{user.email}</p>
                                                </div>
                                                <div className="p-2 space-y-0.5 mt-1">
                                                    {/* Eliminado switcher de tema por solicitud */}
                                                    
                                                    <Link href="/admin/dashboard" onClick={() => setUserMenuOpen(false)} className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 rounded-xl text-[15px] font-medium transition-colors">
                                                        <Shield size={18} className="text-gray-400" />
                                                        <span>Panel Admin</span>
                                                    </Link>
                                                    
                                                    <div className="border-t border-gray-50 my-1 mx-2" />
                                                    
                                                    <Link href="/mis-pedidos" onClick={() => setUserMenuOpen(false)} className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 rounded-xl text-[15px] font-medium transition-colors">
                                                        <Package size={18} className="text-gray-400" />
                                                        <span>Mis Pedidos</span>
                                                    </Link>
                                                    <Link href="/favoritos" onClick={() => setUserMenuOpen(false)} className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 rounded-xl text-[15px] font-medium transition-colors">
                                                        <Heart size={18} className="text-gray-400" />
                                                        <span>Favoritos</span>
                                                    </Link>
                                                </div>
                                                <div className="px-3 pb-3 pt-1">
                                                    <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#fff0f0] text-red-500 hover:bg-[#ffe5e5] rounded-xl text-[15px] font-bold transition-colors">
                                                        <LogOut size={18} className="rotate-180" />
                                                        <span>Cerrar Sesión</span>
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="p-2">
                                                <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl mb-2 text-center text-slate-800">
                                                    <p className="font-bold text-[14px] uppercase tracking-wide mb-0.5">Bienvenido</p>
                                                    <p className="text-gray-500 text-xs">Accede a tu historial de pedidos</p>
                                                </div>
                                                <Link href="/mis-pedidos"><button onClick={() => setUserMenuOpen(false)} className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-600 hover:bg-gray-50 rounded-xl text-left text-[15px] font-medium"><Package size={18} className="text-gray-400" /><span>Mis Pedidos</span></button></Link>
                                                <Link href="/favoritos"><button onClick={() => setUserMenuOpen(false)} className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-600 hover:bg-gray-50 rounded-xl text-left text-[15px] font-medium"><Heart size={18} className="text-gray-400" /><span>Favoritos</span></button></Link>
                                                <div className="border-t border-gray-100 my-2" />
                                                <Link href="/admin/login"><button onClick={() => setUserMenuOpen(false)} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl text-[14px] font-bold transition-colors w-full"><Shield size={16} /><span>Administración</span></button></Link>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Cart */}
                            <Link href="/carrito" className="relative flex w-9 h-9 items-center justify-center rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition group flex-shrink-0">
                                <ShoppingBag size={16} className="group-hover:scale-110 transition-transform" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-white text-navy-600 text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full border border-navy-600">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>

                            {/* Mobile Toggle (Ya no se usa aquí porque va abajo) */}
                            {/* Eliminado de la barra superior */}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="lg:hidden bg-[#0a0f14] border-t border-white/5 shadow-2xl fixed inset-0 top-[73px] bottom-[68px] z-40 overflow-y-auto w-full pb-10">
                    <div className="px-4 py-6 space-y-1">
                        <div className="flex items-center bg-white/5 rounded-full px-4 py-3 gap-2 border border-white/10 mb-4 focus-within:border-white/20 focus-within:bg-white/10 transition-all">
                            <Search size={18} className="text-white/40" />
                            <input
                                type="text"
                                placeholder="Buscar modelos..."
                                className="bg-transparent outline-none text-[15px] w-full text-white placeholder-white/30"
                                onChange={(e) => {
                                    setSearchTerm(e.target.value)
                                    handleSearch(e.target.value)
                                }}
                            />
                        </div>

                        {/* Search Results Mobile */}
                        {searchResults.length > 0 && (
                            <div className="mb-6 bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                                <div className="p-2">
                                    <p className="text-[10px] font-bold text-white/30 px-3 py-2 uppercase tracking-widest">Resultados</p>
                                    {searchResults.map((result) => (
                                        <Link
                                            key={result.id}
                                            href={`/producto/${result.id}`}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="flex items-center gap-4 p-3 hover:bg-white/10 rounded-xl transition-colors group"
                                        >
                                            <img src={proxyImageUrl(result.url_imagen)} alt={result.nombre} className="w-12 h-12 object-contain bg-white/5 rounded-xl border border-white/10" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[15px] font-bold text-white truncate">{result.nombre}</p>
                                                <p className="text-xs text-white/40">{result.categoria}</p>
                                            </div>
                                            <span className="text-sm font-bold text-green-400">Bs {result.precio}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-4 py-3.5 px-4 text-white/80 hover:text-white hover:bg-white/5 rounded-2xl text-[16px] font-medium transition-all">
                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 text-white/60"><Home size={20} /></div>
                                Inicio
                            </Link>
                            <Link href="/catalogo" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-4 py-3.5 px-4 text-white/80 hover:text-white hover:bg-white/5 rounded-2xl text-[16px] font-medium transition-all">
                                <div className="w-10 h-10 rounded-full bg-[#1A2634] flex items-center justify-center flex-shrink-0 text-blue-400"><LayoutGrid size={20} /></div>
                                Catálogo Completo
                            </Link>
                            <Link href="/nuevos" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-4 py-3.5 px-4 text-white/80 hover:text-white hover:bg-white/5 rounded-2xl text-[16px] font-medium transition-all">
                                <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center flex-shrink-0 text-indigo-400"><Sparkles size={20} /></div>
                                Nuevos Ingresos
                            </Link>
                            <Link href="/ofertas" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-4 py-3.5 px-4 text-white/80 hover:text-white hover:bg-white/5 rounded-2xl text-[16px] font-medium transition-all">
                                <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0 text-red-400"><Tag size={20} /></div>
                                Ofertas
                            </Link>
                            {/* Opciones de usuario eliminadas para evitar duplicidad con el icono de perfil superior */}
                        </div>
                    </div>
                </div>
            )}

            {/* Bottom Navigation for Mobile (WhatsApp style) */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0B141A] text-white/50 border-t border-white/5 pb-2 pt-1.5 shadow-[0_-4px_25px_rgba(0,0,0,0.5)]">
                <div className="flex items-center justify-around h-[56px] px-1">
                    {/* Item: Inicio */}
                    <Link href="/" onClick={() => setMobileMenuOpen(false)} className={`flex flex-col items-center justify-center w-full h-full gap-[3px] transition-colors ${pathname === '/' && !mobileMenuOpen ? 'text-white' : 'hover:text-white'}`}>
                        <div className={`flex items-center justify-center w-[60px] h-[30px] rounded-full transition-all ${pathname === '/' && !mobileMenuOpen ? 'bg-[#1e3428]' : 'bg-transparent'}`}>
                            <Home size={22} className={pathname === '/' && !mobileMenuOpen ? 'text-[#25D366] fill-[#25D366]/20' : ''} />
                        </div>
                        <span className="text-[11px] font-semibold tracking-wide">Inicio</span>
                    </Link>

                    {/* Item: Catálogo */}
                    <Link href="/catalogo" onClick={() => setMobileMenuOpen(false)} className={`flex flex-col items-center justify-center w-full h-full gap-[3px] transition-colors ${(pathname.includes('/catalogo') && !mobileMenuOpen) ? 'text-white' : 'hover:text-white'}`}>
                        <div className={`flex items-center justify-center w-[60px] h-[30px] rounded-full transition-all ${(pathname.includes('/catalogo') && !mobileMenuOpen) ? 'bg-[#1e3428]' : 'bg-transparent'}`}>
                            <LayoutGrid size={22} className={(pathname.includes('/catalogo') && !mobileMenuOpen) ? 'text-[#25D366] fill-[#25D366]/20' : ''} />
                        </div>
                        <span className="text-[11px] font-semibold tracking-wide">Catálogo</span>
                    </Link>

                    {/* Item: Carrito */}
                    <Link href="/carrito" onClick={() => setMobileMenuOpen(false)} className={`relative flex flex-col items-center justify-center w-full h-full gap-[3px] transition-colors ${pathname === '/carrito' && !mobileMenuOpen ? 'text-white' : 'hover:text-white'}`}>
                        <div className={`relative flex items-center justify-center w-[60px] h-[30px] rounded-full transition-all ${pathname === '/carrito' && !mobileMenuOpen ? 'bg-[#1e3428]' : 'bg-transparent'}`}>
                            <ShoppingBag size={22} className={pathname === '/carrito' && !mobileMenuOpen ? 'text-[#25D366] fill-[#25D366]/20' : ''} />
                            {cartCount > 0 && (
                                <span className={`absolute -top-1 right-2 ${pathname === '/carrito' && !mobileMenuOpen ? 'bg-[#25D366] text-black' : 'bg-[#25D366] text-[#0B141A]'} text-[10px] font-black w-[18px] h-[18px] flex items-center justify-center rounded-full border-2 border-[#0B141A]`}>
                                    {cartCount}
                                </span>
                            )}
                        </div>
                        <span className="text-[11px] font-semibold tracking-wide">Carrito</span>
                    </Link>

                    {/* Item: Menú */}
                    <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className={`flex flex-col items-center justify-center w-full h-full gap-[3px] transition-colors ${mobileMenuOpen ? 'text-white' : 'hover:text-white'}`}>
                        <div className={`flex items-center justify-center w-[60px] h-[30px] rounded-full transition-all ${mobileMenuOpen ? 'bg-[#1e3428]' : 'bg-transparent'}`}>
                            {mobileMenuOpen ? (
                                <X size={24} className="text-[#25D366] fill-[#25D366]/20" />
                            ) : (
                                <Menu size={24} />
                            )}
                        </div>
                        <span className="text-[11px] font-semibold tracking-wide">Menú</span>
                    </button>
                </div>
            </div>
        </nav>
    )
}
