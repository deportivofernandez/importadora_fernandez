'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
    LayoutDashboard,
    Package,
    Tags,
    Image,
    LogOut,
    TrendingUp,
    ShoppingBag,
    Eye,
    ArrowUpRight,
    Sparkles,
    Clock,
    CheckCircle2
} from 'lucide-react'

export default function AdminDashboard() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({
        totalProductos: 0,
        productosActivos: 0,
        categorias: 0,
        productosNuevos: 0
    })

    useEffect(() => {
        checkAuth()
        loadStats()
    }, [])

    const checkAuth = async () => {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
            router.push('/admin/login')
        }
        setLoading(false)
    }

    const loadStats = async () => {
        const { count: totalProductos } = await supabase
            .from('zapatos')
            .select('*', { count: 'exact', head: true })

        const { count: productosActivos } = await supabase
            .from('zapatos')
            .select('*', { count: 'exact', head: true })
            .eq('disponible', true)

        const { data: categoriasData } = await supabase
            .from('zapatos')
            .select('categoria')

        const categoriasUnicas = new Set(categoriasData?.map(p => p.categoria))

        const hace7Dias = new Date()
        hace7Dias.setDate(hace7Dias.getDate() - 7)

        const { count: productosNuevos } = await supabase
            .from('zapatos')
            .select('*', { count: 'exact', head: true })
            .gte('fecha_creacion', hace7Dias.toISOString())

        setStats({
            totalProductos: totalProductos || 0,
            productosActivos: productosActivos || 0,
            categorias: categoriasUnicas.size,
            productosNuevos: productosNuevos || 0
        })
    }

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/admin/login')
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto"></div>
                    <p className="mt-4 text-slate-600 font-medium">Cargando panel...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Navbar Admin Moderno */}
            <nav className="bg-white/80 backdrop-blur-xl shadow-lg border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                                <LayoutDashboard className="text-white" size={22} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">
                                    <span className="text-slate-800">Panel de</span>
                                    <span className="text-orange-500"> Administración</span>
                                </h1>
                                <p className="text-xs text-slate-500">Zapatería Moderna</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Link href="/">
                                <button className="px-4 py-2 text-slate-600 hover:text-orange-600 font-medium transition-colors flex items-center gap-2">
                                    <Eye size={18} />
                                    <span className="hidden md:inline">Ver Tienda</span>
                                </button>
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-medium transition-all flex items-center gap-2"
                            >
                                <LogOut size={18} />
                                <span className="hidden md:inline">Cerrar Sesión</span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Header con Bienvenida */}
                <div className="mb-8 animate-fade-in">
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="text-orange-500" size={24} />
                        <h2 className="text-3xl font-bold text-slate-800">Bienvenido de nuevo</h2>
                    </div>
                    <p className="text-slate-600">Aquí tienes un resumen de tu tienda</p>
                </div>

                {/* Tarjetas de Estadísticas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Total Productos */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-all animate-slide-up">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                                <Package className="text-white" size={24} />
                            </div>
                            <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">
                                Total
                            </span>
                        </div>
                        <h3 className="text-3xl font-bold text-slate-800 mb-1">{stats.totalProductos}</h3>
                        <p className="text-slate-600 text-sm font-medium">Productos en total</p>
                        <div className="mt-4 pt-4 border-t border-slate-100">
                            <Link href="/admin/productos">
                                <button className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1 group">
                                    Ver todos
                                    <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                </button>
                            </Link>
                        </div>
                    </div>

                    {/* Productos Activos */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-all animate-slide-up delay-100">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                                <CheckCircle2 className="text-white" size={24} />
                            </div>
                            <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold">
                                Activos
                            </span>
                        </div>
                        <h3 className="text-3xl font-bold text-slate-800 mb-1">{stats.productosActivos}</h3>
                        <p className="text-slate-600 text-sm font-medium">Productos disponibles</p>
                        <div className="mt-4 pt-4 border-t border-slate-100">
                            <div className="flex items-center gap-2">
                                <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                                    <div
                                        className="bg-gradient-to-r from-green-500 to-green-600 h-full rounded-full transition-all"
                                        style={{ width: `${stats.totalProductos > 0 ? (stats.productosActivos / stats.totalProductos) * 100 : 0}%` }}
                                    ></div>
                                </div>
                                <span className="text-xs font-semibold text-slate-600">
                                    {stats.totalProductos > 0 ? Math.round((stats.productosActivos / stats.totalProductos) * 100) : 0}%
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Categorías */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-all animate-slide-up delay-200">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                <Tags className="text-white" size={24} />
                            </div>
                            <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-semibold">
                                Categorías
                            </span>
                        </div>
                        <h3 className="text-3xl font-bold text-slate-800 mb-1">{stats.categorias}</h3>
                        <p className="text-slate-600 text-sm font-medium">Categorías únicas</p>
                        <div className="mt-4 pt-4 border-t border-slate-100">
                            <Link href="/admin/categorias">
                                <button className="text-purple-600 hover:text-purple-700 font-medium text-sm flex items-center gap-1 group">
                                    Gestionar
                                    <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                </button>
                            </Link>
                        </div>
                    </div>

                    {/* Nuevos (7 días) */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-all animate-slide-up delay-300">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                                <Clock className="text-white" size={24} />
                            </div>
                            <span className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-semibold">
                                7 días
                            </span>
                        </div>
                        <h3 className="text-3xl font-bold text-slate-800 mb-1">{stats.productosNuevos}</h3>
                        <p className="text-slate-600 text-sm font-medium">Productos nuevos</p>
                        <div className="mt-4 pt-4 border-t border-slate-100">
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                <TrendingUp size={14} className="text-orange-500" />
                                Últimos 7 días
                            </div>
                        </div>
                    </div>
                </div>

                {/* Acciones Rápidas */}
                <div className="mb-8">
                    <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <div className="w-1 h-6 bg-orange-500 rounded-full"></div>
                        Acciones Rápidas
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Link href="/admin/productos">
                            <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200 hover:shadow-lg hover:border-orange-300 transition-all cursor-pointer group">
                                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-500 transition-colors">
                                    <Package className="text-orange-600 group-hover:text-white transition-colors" size={24} />
                                </div>
                                <h4 className="font-bold text-slate-800 mb-1">Gestionar Productos</h4>
                                <p className="text-sm text-slate-600">Crear, editar y eliminar productos</p>
                            </div>
                        </Link>

                        <Link href="/admin/categorias">
                            <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200 hover:shadow-lg hover:border-purple-300 transition-all cursor-pointer group">
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-500 transition-colors">
                                    <Tags className="text-purple-600 group-hover:text-white transition-colors" size={24} />
                                </div>
                                <h4 className="font-bold text-slate-800 mb-1">Categorías</h4>
                                <p className="text-sm text-slate-600">Organizar productos por categorías</p>
                            </div>
                        </Link>

                        <Link href="/admin/portada">
                            <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200 hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer group">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-500 transition-colors">
                                    <Image className="text-blue-600 group-hover:text-white transition-colors" size={24} />
                                </div>
                                <h4 className="font-bold text-slate-800 mb-1">Portada</h4>
                                <p className="text-sm text-slate-600">Editar banner principal</p>
                            </div>
                        </Link>

                        <Link href="/">
                            <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200 hover:shadow-lg hover:border-green-300 transition-all cursor-pointer group">
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-500 transition-colors">
                                    <Eye className="text-green-600 group-hover:text-white transition-colors" size={24} />
                                </div>
                                <h4 className="font-bold text-slate-800 mb-1">Ver Tienda</h4>
                                <p className="text-sm text-slate-600">Previsualizar la tienda</p>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Información Adicional */}
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl shadow-xl p-8 text-white">
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="text-2xl font-bold mb-2">¿Necesitas ayuda?</h3>
                            <p className="text-orange-100 mb-6">Consulta nuestra documentación o contacta con soporte</p>
                            <div className="flex gap-3">
                                <button className="px-6 py-3 bg-white text-orange-600 rounded-lg font-semibold hover:bg-orange-50 transition-colors">
                                    Ver Documentación
                                </button>
                                <button className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-lg font-semibold hover:bg-white/30 transition-colors">
                                    Contactar Soporte
                                </button>
                            </div>
                        </div>
                        <div className="hidden lg:block">
                            <div className="w-32 h-32 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                                <Sparkles size={64} className="text-white/80" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
