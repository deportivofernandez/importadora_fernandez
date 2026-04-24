import Link from 'next/link'
import { Facebook, Instagram, Phone, MapPin, Mail, ArrowUpRight } from 'lucide-react'

export default function Footer() {
    return (
        <footer className="relative z-10 bg-brand-black border-t border-white/10 text-white">
            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

                    {/* Columna 1: Marca */}
                    <div>
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-10 h-10 bg-white/10 border border-white/20 rounded-lg flex items-center justify-center">
                                <span className="text-white font-black text-base tracking-tighter">IF</span>
                            </div>
                            <div className="flex flex-col leading-none">
                                <span className="text-white/40 font-medium text-[9px] tracking-[0.3em] uppercase">Importadora</span>
                                <span className="text-white font-black text-base tracking-widest uppercase">Fernández</span>
                            </div>
                        </div>
                        <p className="text-white/40 text-sm leading-relaxed mb-6">
                            Distribuidora mayorista de calzado de origen brasilero, peruano y nacional. Más de 10 años en el mercado.
                        </p>
                        <div className="flex gap-3">
                            <a href="#" aria-label="Facebook" className="w-9 h-9 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center hover:bg-white/15 hover:border-white/20 transition">
                                <Facebook size={15} className="text-white/60" />
                            </a>
                            <a href="#" aria-label="Instagram" className="w-9 h-9 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center hover:bg-white/15 hover:border-white/20 transition">
                                <Instagram size={15} className="text-white/60" />
                            </a>
                        </div>
                    </div>

                    {/* Columna 2: Navegación */}
                    <div>
                        <h4 className="text-[10px] font-bold text-white/30 tracking-[0.25em] uppercase mb-5">Navegación</h4>
                        <ul className="space-y-3">
                            {[
                                { label: 'Inicio',           href: '/' },
                                { label: 'Catálogo',         href: '/catalogo' },
                                { label: 'Nuevos Ingresos',  href: '/nuevos' },
                                { label: 'Ofertas',          href: '/ofertas' },
                                { label: 'Mis Pedidos',      href: '/mis-pedidos' },
                                { label: 'Panel Admin',      href: '/admin/login' },
                            ].map(item => (
                                <li key={item.href}>
                                    <Link href={item.href} className="text-white/50 hover:text-white transition text-sm flex items-center gap-1.5 group">
                                        <span>{item.label}</span>
                                        <ArrowUpRight size={11} className="opacity-0 group-hover:opacity-100 transition" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Columna 3: Categorías */}
                    <div>
                        <h4 className="text-[10px] font-bold text-white/30 tracking-[0.25em] uppercase mb-5">Categorías</h4>
                        <ul className="space-y-3">
                            {[
                                { label: 'Deportivo',  href: '/catalogo/deportivo' },
                                { label: 'Casual',     href: '/catalogo/casual' },
                                { label: 'Formal',     href: '/catalogo/formal' },
                                { label: 'Botas',      href: '/catalogo/botas' },
                                { label: 'Niños',      href: '/catalogo/ninos' },
                                { label: 'Sandalias',  href: '/catalogo/sandalias' },
                            ].map(item => (
                                <li key={item.href}>
                                    <Link href={item.href} className="text-white/50 hover:text-white transition text-sm flex items-center gap-1.5 group">
                                        <span>{item.label}</span>
                                        <ArrowUpRight size={11} className="opacity-0 group-hover:opacity-100 transition" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Columna 4: Contacto */}
                    <div>
                        <h4 className="text-[10px] font-bold text-white/30 tracking-[0.25em] uppercase mb-5">Contacto</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <MapPin size={15} className="text-white/30 mt-0.5 flex-shrink-0" />
                                <span className="text-white/50 text-sm leading-relaxed">
                                    Av. Principal #123<br />
                                    La Paz, Bolivia
                                </span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone size={15} className="text-white/30 flex-shrink-0" />
                                <a href="tel:+59173970609" className="text-white/50 hover:text-white transition text-sm">
                                    +591 73970609
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail size={15} className="text-white/30 flex-shrink-0" />
                                <a href="mailto:ventas@importadorafernandez.com" className="text-white/50 hover:text-white transition text-sm break-all">
                                    ventas@importadorafernandez.com
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-white/10 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
                    <p className="text-white/25 text-xs">
                        © 2026 Importadora Fernández. Todos los derechos reservados.
                    </p>
                    <div className="flex gap-5 text-xs">
                        <a href="#" className="text-white/25 hover:text-white/60 transition">Términos y Condiciones</a>
                        <a href="#" className="text-white/25 hover:text-white/60 transition">Privacidad</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}
