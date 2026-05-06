import BannerHeader from "@/components/global/banner-header";
import { ViewTransition } from "react";

const Regen450mlPage = () => {
    return (
        <ViewTransition>
            <BannerHeader content={[
                {desktopImageUrl: "/banner-product.webp"}
            ]}>

            </BannerHeader>
        </ViewTransition>
    )
}
export default Regen450mlPage;