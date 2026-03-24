import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

/**
 * Función requerida para eludir bloqueos de operadoras a *.supabase.co.
 * Reemplaza el dominio quemado en la base de datos (url_imagen) 
 * por el dominio base actual de Supabase configurado en el entorno
 * (el cual en producción probablemente pase por un proxy o custom domain).
 */
export function proxyImageUrl(url: string | null | undefined): string {
    if (!url) return '';
    try {
        if (url.includes('.supabase.co')) {
            const parsedUrl = new URL(url);
            // Retorna la base configurada + el path de la imagen
            return `${supabaseUrl}${parsedUrl.pathname}${parsedUrl.search}`;
        }
        return url;
    } catch {
        return url;
    }
}
