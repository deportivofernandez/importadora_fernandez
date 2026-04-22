import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
    const pathname = req.nextUrl.pathname
    const isAdminRoute = pathname.startsWith('/admin')
    const isLoginPage = pathname === '/admin/login'

    // Solo revisar autenticación para rutas admin (excepto la página de login)
    if (isAdminRoute && !isLoginPage) {

        // Leer la cookie de sesión de Supabase que el navegador envía
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

        // Buscar el access token en las cookies de la request
        const cookieHeader = req.headers.get('cookie') || ''
        const hasAuthToken = cookieHeader.includes('sb-') && cookieHeader.includes('-auth-token')

        if (!hasAuthToken) {
            // No tiene cookie de sesión → redirigir al login ANTES de renderizar
            const loginUrl = new URL('/admin/login', req.url)
            return NextResponse.redirect(loginUrl)
        }
    }

    return NextResponse.next()
}

// Este middleware solo se activa en rutas /admin/*
export const config = {
    matcher: ['/admin/:path*']
}
