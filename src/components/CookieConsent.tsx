'use client'
import { useState, useEffect } from 'react'
import { X, Cookie } from 'lucide-react'

export default function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        // Al cargar la página, verificamos si el usuario ya aceptó las cookies
        const consent = localStorage.getItem('cookie_consent')
        if (!consent) {
            // Damos un pequeño retraso para que la animación de entrada se vea fluida
            const timer = setTimeout(() => setIsVisible(true), 1500)
            return () => clearTimeout(timer)
        }
    }, [])

    const handleAccept = () => {
        // Función real: Guarda el consentimiento en el almacenamiento local
        // Esto permite que el Carrito y los Favoritos funcionen sin problemas de privacidad
        localStorage.setItem('cookie_consent', 'accepted')
        setIsVisible(false)
    }

    const handleDecline = () => {
        // Si rechaza, solo lo ocultamos por esta sesión (usando sessionStorage)
        sessionStorage.setItem('cookie_consent_declined', 'true')
        setIsVisible(false)
    }

    if (!isVisible) return null

    // Verificamos si lo rechazó en esta sesión para no molestarlo en cada recarga
    if (typeof window !== 'undefined' && sessionStorage.getItem('cookie_consent_declined')) {
        return null
    }

    return (
        <div className="fixed bottom-0 inset-x-0 pb-4 sm:pb-6 px-4 sm:px-6 z-[100] pointer-events-none">
            <div className="max-w-2xl mx-auto animate-slide-up pointer-events-auto">
                <div className="bg-[#1B2436] border border-white/10 p-5 sm:p-6 rounded-2xl shadow-2xl flex flex-col sm:flex-row gap-5 items-center">
                    
                    {/* Icono y Texto */}
                    <div className="flex gap-4 items-start flex-1">
                        <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center flex-shrink-0">
                            <Cookie className="text-white/80" size={20} />
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-1">Experiencia Personalizada</h4>
                            <p className="text-white/60 text-xs leading-relaxed">
                                Utilizamos cookies y almacenamiento local para guardar tu <strong>carrito de compras</strong> y tus <strong>modelos favoritos</strong>, permitiéndote retomar tus cotizaciones en cualquier momento.
                            </p>
                        </div>
                    </div>

                    {/* Botones */}
                    <div className="flex sm:flex-col gap-2 w-full sm:w-auto flex-shrink-0">
                        <button
                            onClick={handleAccept}
                            className="flex-1 sm:flex-none bg-[#0284C7] hover:bg-[#0284C7]/90 text-white text-xs font-bold px-6 py-2.5 rounded-lg transition-colors"
                        >
                            Aceptar Cookies
                        </button>
                        <button
                            onClick={handleDecline}
                            className="flex-1 sm:flex-none bg-white/5 hover:bg-white/10 text-white/70 text-xs font-medium px-6 py-2.5 rounded-lg transition-colors border border-white/5"
                        >
                            Solo necesarias
                        </button>
                    </div>

                    {/* Botón Cerrar */}
                    <button 
                        onClick={handleDecline}
                        className="absolute top-2 right-2 p-2 text-white/30 hover:text-white/80 transition-colors sm:hidden"
                        aria-label="Cerrar"
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>
        </div>
    )
}
