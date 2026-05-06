import BannerBuyRegenContent from "@/components/banner-buy-regen";
import BannerHeader from "@/components/global/banner-header";
import { ViewTransition } from "react"

const Regen300mlPage = () => {
    return (
        <ViewTransition>
            <BannerHeader
                content={[{ 
                    desktopImageUrl: "/banner-product.webp", 
                    tabletImageUrl: "/banner-product-tablet.webp",
                    mobileImageUrl: "/banner-product-mobile.webp",
                    alt: "Banner product regen" 
                    }]}>
            </BannerHeader>
            <div className="px-4 py-12 h-full">
                <h1 className="text-3xl font-bold mb-4">Regen 300ml</h1>
                <p className="text-lg mb-8">Regen 300ml adalah varian terbaru dari produk Regen yang hadir dengan kemasan praktis dan ukuran yang pas untuk kebutuhan harian Anda. Dengan rasa yang tetap lezat dan manis alami, Regen 300ml cocok untuk menemani aktivitas Anda kapan saja dan di mana saja.</p>
                <h2 className="text-2xl font-semibold mb-4">Keunggulan Regen 300ml</h2>
                <ul className="list-disc pl-6 mb-8">
                    <li>Ukuran Praktis: Dengan kemasan 300ml, Anda dapat dengan mudah membawa Regen ke mana pun Anda pergi, baik itu ke kantor, sekolah, atau saat berolahraga.</li>
                    <li>Rasa Tetap Lezat: Meskipun dalam ukuran yang lebih kecil, Regen 300ml tetap mempertahankan rasa manis alami yang menjadi ciri khas produk Regen.</li>
                    <li>Manis Alami: Seperti varian lainnya, Regen 300ml menggunakan pemanis alami dari stevia, sehingga memberikan kenikmatan tanpa kalori tambahan.</li>
                    <li>Cocok untuk Segala Aktivitas: Dengan ukuran yang pas, Regen 300ml adalah pilihan ideal untuk menemani berbagai aktivitas Anda sepanjang hari.</li>
                </ul>
                <h2 className="text-2xl font-semibold mb-4">Dapatkan Regen 300ml Sekarang!</h2>
                <p className="text-lg mb-8">Jangan lewatkan kesempatan untuk mencoba kelezatan dan kesegaran Regen 300ml. Dapatkan produk ini di toko online favorit Anda atau di gerai-gerai terdekat. Nikmati setiap tegukan Regen 300ml yang menyegarkan dan bebas gula, kapan saja dan di mana saja!</p>
            </div>
            <BannerBuyRegenContent /> 
        </ViewTransition>
    )
}
export default Regen300mlPage;