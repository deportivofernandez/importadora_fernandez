'use client'
import { useState } from 'react'
import { Share2, X } from 'lucide-react'

export default function SocialSpeedDial() {
    const [isOpen, setIsOpen] = useState(false)

    const toggleOpen = () => setIsOpen(!isOpen)

    const socials = [
        {
            name: 'WhatsApp',
            color: 'bg-[#25D366]',
            icon: (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
            ),
            href: 'https://wa.me/59178303866'
        },
        {
            name: 'Instagram',
            color: 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
            ),
            href: 'https://instagram.com'
        },
        {
            name: 'TikTok',
            color: 'bg-black',
            icon: (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
            ),
            href: 'https://tiktok.com'
        },
        {
            name: 'Facebook',
            color: 'bg-[#1877F2]',
            icon: (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
            ),
            href: 'https://facebook.com'
        }
    ]

    return (
        <div className="fixed bottom-[80px] lg:bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Burbuja Pastilla Horizontal Blanca */}
            <div 
                className={`
                    absolute bottom-[76px] right-0 flex items-center justify-center bg-white p-2 sm:p-3 rounded-[32px] shadow-[0_10px_40px_rgba(0,0,0,0.15)] transition-all duration-300 origin-bottom-right md:origin-bottom
                    ${isOpen ? 'opacity-100 scale-100 translate-y-0 translate-x-0' : 'opacity-0 scale-50 translate-y-10 translate-x-4 pointer-events-none'}
                `}
            >
                {/* Cuadrito de punta de burbuja hacia abajo */}
                <div className="absolute -bottom-[6px] right-6 w-4 h-4 bg-white rotate-45 transform origin-center -z-10 rounded-sm" />
                
                <div className="flex flex-row items-center justify-center gap-3 bg-white z-10 px-2 rounded-[32px]">
                    {socials.map((social) => (
                        <a
                            key={social.name}
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full shadow-sm text-white transition-transform hover:scale-110 hover:-translate-y-1 ${social.color}`}
                        >
                            {social.icon}
                        </a>
                    ))}
                </div>
            </div>

            {/* Botón Principal "Redes" */}
            <button
                onClick={toggleOpen}
                className={`
                    relative flex flex-col items-center justify-center min-w-[64px] h-16 px-4 rounded-[20px] shadow-xl text-white outline-none transition-all duration-300 z-50 overflow-hidden
                    ${isOpen ? 'bg-[#1A2634] scale-95 shadow-md' : 'bg-[#FF5A26] hover:scale-105 hover:bg-[#E84E1A] hover:shadow-2xl'}
                `}
                aria-label="Redes Sociales"
            >
                {isOpen ? (
                    <X size={28} className="text-white" />
                ) : (
                    <div className="flex flex-col items-center gap-[2px]">
                        <Share2 size={24} className="text-white fill-white/10" />
                        <span className="text-[12px] font-bold tracking-wide leading-none">Redes</span>
                    </div>
                )}
            </button>
        </div>
    )
}
