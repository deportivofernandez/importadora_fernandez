'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, ShoppingBag, User, Menu, X, ChevronDown, LogOut, Heart, Package } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useDebouncedCallback } from 'use-debounce'
import { useCart } from '@/context/CartContext'

export default function Navbar() {
    // 1. Estados
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [catalogoOpen, setCatalogoOpen] = useState(false)
    const [userMenuOpen, setUserMenuOpen] = useState(false)
    const [user, setUser] = useState<any>(null)

    // Estados para búsqueda
    const [searchTerm, setSearchTerm] = useState('')
    const [searchResults, setSearchResults] = useState<any[]>([])
    const [isSearching, setIsSearching] = useState(false)
    const [showResults, setShowResults] = useState(false)

    // 2. Hooks
    const { cartCount } = useCart()

    // 3. Funciones
    // Función de búsqueda con debounce
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
        checkUser()
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement
            if (userMenuOpen && !target.closest('.user-menu-container')) {
                setUserMenuOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
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
        {
            nombre: 'Adulto',
            slug: 'adulto',
            imagen: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop',
            descripcion: 'Estilo y comodidad'
        },
        {
            nombre: 'Niño',
            slug: 'nino',
            imagen: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=400&h=300&fit=crop',
            descripcion: 'Diversión y confort'
        },
        {
            nombre: 'Deportivo',
            slug: 'deportivo',
            imagen: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop',
            descripcion: 'Rendimiento máximo'
        },
        {
            nombre: 'Botas',
            slug: 'botas',
            imagen: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=400&h=300&fit=crop',
            descripcion: 'Resistencia y estilo'
        },
        {
            nombre: 'Sandalias',
            slug: 'sandalias',
            imagen: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=400&h=300&fit=crop',
            descripcion: 'Frescura y libertad'
        },
        {
            nombre: 'Formales',
            slug: 'formales',
            imagen: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=400&h=300&fit=crop',
            descripcion: 'Elegancia profesional'
        }
    ]

    return (
        <nav className="sticky top-0 z-50 bg-white shadow-md">
            {/* Top Bar - Naranja */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600">
                <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center text-xs md:text-sm">
                    <div className="flex gap-4">
                        <Link href="/admin/login" className="text-white hover:text-orange-100 transition font-medium">
                            🔐 Panel Admin
                        </Link>
                    </div>
                    <div className="hidden md:block">
                        <span className="text-white font-medium">📦 Venta por Mayor - Pedido mínimo: 6 pares</span>
                    </div>
                    <div className="md:hidden">
                        <span className="text-white font-medium text-xs">📦 Venta por Mayor</span>
                    </div>
                </div>
            </div>

            {/* Main Navbar */}
            <div className="max-w-7xl mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="text-2xl md:text-3xl font-bold">
                            <span className="text-orange-500">Zapatería</span>
                            <span className="text-gray-900"> Moderna</span>
                        </div>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex items-center gap-8 text-base font-semibold">
                        <Link href="/" className="text-gray-700 hover:text-orange-500 transition">
                            Inicio
                        </Link>

                        {/* Catálogo con Mega Menú Mejorado */}
                        <div
                            className="relative"
                            onMouseEnter={() => setCatalogoOpen(true)}
                            onMouseLeave={() => setCatalogoOpen(false)}
                        >
                            <button className="flex items-center gap-1 text-gray-700 hover:text-orange-500 transition">
                                Catálogo
                                <ChevronDown size={18} className={`transition-transform ${catalogoOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Mega Menú Desplegable Mejorado */}
                            {catalogoOpen && (
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-screen max-w-6xl bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                                    <div className="grid grid-cols-12 gap-8">
                                        {/* Columna 1: Destacados */}
                                        <div className="col-span-2">
                                            <h3 className="font-bold text-gray-900 mb-4 text-xs uppercase tracking-widest border-b border-gray-100 pb-2">Destacados</h3>
                                            <ul className="space-y-3">
                                                <li><Link href="/catalogo" className="text-gray-600 hover:text-orange-500 transition text-sm flex items-center gap-2"><div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>Ver Todo</Link></li>
                                                <li><Link href="/ofertas" className="text-orange-600 hover:text-orange-700 transition text-sm font-bold flex items-center gap-2">🔥 SALE</Link></li>
                                                <li><Link href="/nuevos" className="text-gray-600 hover:text-orange-500 transition text-sm">Lo Nuevo</Link></li>
                                                <li><Link href="/catalogo" className="text-gray-600 hover:text-orange-500 transition text-sm">Más Vendidos</Link></li>
                                            </ul>
                                        </div>

                                        {/* Columna 2: Por Origen (NUEVO) */}
                                        <div className="col-span-2">
                                            <h3 className="font-bold text-gray-900 mb-4 text-xs uppercase tracking-widest border-b border-gray-100 pb-2">Por Origen</h3>
                                            <ul className="space-y-3">
                                                <li>
                                                    <Link href="/catalogo/origen/brazilero" className="text-gray-600 hover:text-orange-500 transition text-sm font-medium flex items-center gap-2">
                                                        <span className="text-lg">🇧🇷</span> Brazilera
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link href="/catalogo/origen/peruano" className="text-gray-600 hover:text-orange-500 transition text-sm font-medium flex items-center gap-2">
                                                        <span className="text-lg">🇵🇪</span> Peruana
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link href="/catalogo/origen/nacional" className="text-gray-600 hover:text-orange-500 transition text-sm font-medium flex items-center gap-2">
                                                        <span className="text-lg">🇧🇴</span> Nacional
                                                    </Link>
                                                </li>
                                            </ul>
                                        </div>

                                        {/* Columna 3: Por Categoría */}
                                        <div className="col-span-2">
                                            <h3 className="font-bold text-gray-900 mb-4 text-xs uppercase tracking-widest border-b border-gray-100 pb-2">Por Categoría</h3>
                                            <ul className="space-y-3">
                                                <li><Link href="/catalogo/adulto" className="text-gray-600 hover:text-orange-500 transition text-sm decoration-orange-500/30 hover:underline underline-offset-4">Adulto (Hombre/Mujer)</Link></li>
                                                <li><Link href="/catalogo/nino" className="text-gray-600 hover:text-orange-500 transition text-sm decoration-orange-500/30 hover:underline underline-offset-4">Niño / Niña</Link></li>
                                                <li><Link href="/catalogo/deportivo" className="text-gray-600 hover:text-orange-500 transition text-sm">Deportivos</Link></li>
                                                <li><Link href="/catalogo/formales" className="text-gray-600 hover:text-orange-500 transition text-sm">Formales</Link></li>
                                                <li><Link href="/catalogo/botas" className="text-gray-600 hover:text-orange-500 transition text-sm">Botas</Link></li>
                                            </ul>
                                        </div>

                                        {/* Columna 4-12: Tarjetas Visuales */}
                                        <div className="col-span-6 bg-gray-50 rounded-xl p-4">
                                            <h3 className="font-bold text-gray-900 mb-4 text-xs uppercase tracking-widest">Explora Visualmente</h3>
                                            <div className="grid grid-cols-3 gap-3">
                                                {categorias.slice(0, 3).map((cat) => (
                                                    <Link
                                                        key={cat.slug}
                                                        href={`/catalogo/${cat.slug}`}
                                                        className="group relative overflow-hidden rounded-lg hover:shadow-lg transition-all duration-300 block"
                                                    >
                                                        <div className="aspect-square overflow-hidden">
                                                            <img
                                                                src={cat.imagen}
                                                                alt={cat.nombre}
                                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 grayscale-[20%] group-hover:grayscale-0"
                                                            />
                                                        </div>
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-3">
                                                            <h4 className="text-white font-bold text-sm leading-none">{cat.nombre}</h4>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                            <div className="mt-3 text-right">
                                                <Link href="/catalogo" className="text-xs font-bold text-orange-500 hover:text-orange-600 flex items-center justify-end gap-1">
                                                    Ver todo el catálogo <ShoppingBag size={12} />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <Link href="/nuevos" className="text-gray-700 hover:text-orange-500 transition">
                            Nuevos
                        </Link>
                        <Link href="/ofertas" className="text-orange-500 hover:text-orange-600 transition font-bold">
                            🔥 Ofertas
                        </Link>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        {/* Search - Desktop Inteligente */}
                        <div className="hidden md:block relative">
                            <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 gap-2 border border-gray-200 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-100 transition-all w-64">
                                <Search size={20} className="text-gray-500" />
                                <input
                                    type="text"
                                    placeholder="Buscar zapatos..."
                                    className="bg-transparent outline-none text-sm w-full text-gray-700 placeholder-gray-500"
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value)
                                        handleSearch(e.target.value)
                                    }}
                                    onFocus={() => {
                                        if (searchResults.length > 0) setShowResults(true)
                                    }}
                                    onBlur={() => {
                                        setTimeout(() => setShowResults(false), 200)
                                    }}
                                    suppressHydrationWarning
                                />
                                {isSearching && <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>}
                            </div>

                            {/* Resultados Flotantes */}
                            {showResults && searchResults.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-[60] animate-fade-in">
                                    <div className="p-2">
                                        <p className="text-xs font-bold text-gray-400 px-2 py-1 uppercase">Resultados</p>
                                        {searchResults.map((result) => (
                                            <Link
                                                key={result.id}
                                                href={`/producto/${result.id}`}
                                                className="flex items-center gap-3 p-2 hover:bg-orange-50 rounded-lg transition-colors group"
                                            >
                                                <img src={result.url_imagen} alt={result.nombre} className="w-10 h-10 object-contain bg-white rounded-md border border-gray-100" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold text-gray-800 truncate group-hover:text-orange-600">{result.nombre}</p>
                                                    <p className="text-xs text-gray-500">{result.categoria}</p>
                                                </div>
                                                <span className="text-sm font-bold text-orange-600">${result.precio}</span>
                                            </Link>
                                        ))}
                                        <div className="border-t border-gray-100 mt-2 pt-2">
                                            <Link href="/catalogo" className="block text-center text-xs text-blue-600 hover:underline py-1">
                                                Ver todos los resultados
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Estado vacío search */}
                            {showResults && searchResults.length === 0 && searchTerm.length >= 2 && !isSearching && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 p-4 text-center z-[60] animate-fade-in">
                                    <p className="text-sm text-gray-500">No encontramos zapatos con ese nombre 👟</p>
                                </div>
                            )}
                        </div>

                        {/* User Menu Dropdown */}
                        <div className="relative hidden md:block user-menu-container">
                            <button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className="flex items-center gap-2 text-gray-700 hover:text-orange-500 transition"
                            >
                                {user ? (
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                                        <User size={18} className="text-white" />
                                    </div>
                                ) : (
                                    <User size={24} />
                                )}
                            </button>

                            {/* Dropdown User */}
                            {userMenuOpen && (
                                <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                                    {user ? (
                                        <>
                                            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 text-white">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                                        <User size={24} className="text-white" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-sm truncate">{user.user_metadata?.nombre || 'Usuario'}</p>
                                                        <p className="text-xs text-white/80 truncate">{user.email}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-2">
                                                <Link href="/perfil"><button onClick={() => setUserMenuOpen(false)} className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-orange-50 rounded-lg text-left"><User size={18} className="text-orange-500" /><span className="font-medium">Mi perfil</span></button></Link>
                                                <Link href="/mis-pedidos"><button onClick={() => setUserMenuOpen(false)} className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-orange-50 rounded-lg text-left"><Package size={18} className="text-orange-500" /><span className="font-medium">Mis pedidos</span></button></Link>
                                                <Link href="/favoritos"><button onClick={() => setUserMenuOpen(false)} className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-orange-50 rounded-lg text-left"><Heart size={18} className="text-orange-500" /><span className="font-medium">Favoritos</span></button></Link>
                                                <div className="border-t border-gray-100 my-2"></div>
                                                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg text-left"><LogOut size={18} /><span className="font-medium">Cerrar sesión</span></button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="p-2">
                                            <div className="p-3 bg-orange-50 rounded-lg mb-2">
                                                <p className="text-orange-800 font-bold text-xs uppercase tracking-wide mb-1">Bienvenido</p>
                                                <p className="text-slate-600 text-xs">Accede a tu historial local</p>
                                            </div>

                                            <Link href="/mis-pedidos">
                                                <button onClick={() => setUserMenuOpen(false)} className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg text-left transition-colors">
                                                    <Package size={18} className="text-orange-500" />
                                                    <span className="font-medium text-sm">Mis Pedidos</span>
                                                </button>
                                            </Link>

                                            <Link href="/favoritos">
                                                <button onClick={() => setUserMenuOpen(false)} className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg text-left transition-colors">
                                                    <Heart size={18} className="text-orange-500" />
                                                    <span className="font-medium text-sm">Favoritos</span>
                                                </button>
                                            </Link>

                                            <div className="border-t border-gray-100 my-2"></div>

                                            <Link href="/admin/login">
                                                <button onClick={() => setUserMenuOpen(false)} className="w-full flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-slate-600 rounded-lg text-left transition-colors text-xs">
                                                    <User size={14} />
                                                    <span>Administración</span>
                                                </button>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* CART BUTTON WITH BADGE */}
                        <Link href="/carrito" className="relative text-gray-700 hover:text-orange-500 transition hidden md:block group">
                            <ShoppingBag size={24} className="group-hover:scale-110 transition-transform" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white animate-bounce-short">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden text-gray-700 hover:text-orange-500 transition"
                        >
                            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
                    {/* ... (Contenido Móvil existente) ... */}
                    <div className="px-4 py-6 space-y-4">
                        <div className="flex items-center bg-gray-100 rounded-full px-4 py-3 gap-2 border border-gray-200">
                            <Search size={20} className="text-gray-500" />
                            <input type="text" placeholder="Buscar zapatos..." className="bg-transparent outline-none text-sm w-full" />
                        </div>
                        <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block py-2 font-bold text-gray-700">Inicio</Link>
                        <Link href="/catalogo" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-gray-600">Catálogo</Link>
                        <Link href="/nuevos" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-gray-600">Nuevos</Link>
                        <Link href="/ofertas" onClick={() => setMobileMenuOpen(false)} className="block py-2 font-bold text-orange-500">🔥 Ofertas</Link>
                        <Link href="/carrito" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 py-2 font-bold text-gray-700 bg-gray-50 px-3 rounded-lg">
                            <ShoppingBag size={20} /> Carrito <span className="text-orange-500">({cartCount})</span>
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    )
}
