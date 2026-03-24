import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CatalogView from '@/components/CatalogView'

export const revalidate = 0

export default async function CatalogoPage() {
    const { data: zapatos } = await supabase
        .from('zapatos')
        .select('*')
        .eq('disponible', true)
        .order('fecha_creacion', { ascending: false })

    return (
        <main className="min-h-screen bg-navy-600">
            <Navbar />
            <CatalogView initialProducts={zapatos || []} />
            <Footer />
        </main>
    )
}
