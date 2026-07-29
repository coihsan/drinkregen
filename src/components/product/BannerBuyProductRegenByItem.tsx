import type {
  OnlineStore,
  OfflineStore,
  ProductAvailability,
} from "@/lib/product-availability";
import { useIsMobile } from "@/hooks/use-mobile";
import LogoRegenWhite from "../../assets/icons/logo-regen-white.svg";

interface DataProductByItem {
  content: ProductAvailability;
}

const getGoogleMapsSearchUrl = (query: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

const StoreLogoLink = ({
  href,
  imageURL,
  ariaLabel,
  name,
}: {
  href: string;
  imageURL: string;
  ariaLabel: string;
  name: string;
}) => {
  return (
    <a
      className="inline-flex min-h-12 items-center rounded-md transition-opacity hover:opacity-75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
    >
      <div className="max-h-[60px] h-full flex items-center justify-center">
        <img
          className="w-auto object-contain"
          src={imageURL}
          width={180}
          height={56}
          alt={name}
        />
      </div>
    </a>
  );
};

const StoreGroup = ({
  stores,
  type,
  productName,
}: {
  stores: OnlineStore[] | OfflineStore[];
  type: "online" | "offline";
  productName: string;
}) => {
  if (stores.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <p className="text-base text-center md:text-start font-medium text-neutral-600 md:text-xl">
        {type === "online" ? "Belanja" : "Temukan"}{" "}
        <span className="font-bold">Regen {productName}</span>{" "}
        {type === "online"
          ? "langsung di toko online favorit Anda"
          : "di minimarket terdekat"}
      </p>

      <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-7 gap-y-5">
        {stores.map((store) => {
          const href =
            type === "online"
              ? (store as OnlineStore).urlStore
              : getGoogleMapsSearchUrl((store as OfflineStore).query);

          return (
            <StoreLogoLink
              key={store.name}
              href={href}
              imageURL={store.imageURL}
              ariaLabel={
                store.ariaLabel ??
                `Cari ${store.name} terdekat untuk membeli Regen ${productName}`
              }
              name={store.name}
            />
          );
        })}
      </div>
    </div>
  );
};

const BannerBuyProductRegenByItem = ({ content }: DataProductByItem) => {
  const onlineStores = content.stores.online ?? [];
  const offlineStores = content.stores.offline ?? [];
  const hasAvailableStore = onlineStores.length > 0 || offlineStores.length > 0;
  const isMobile = useIsMobile();

  if (!content.isAvailable || !hasAvailableStore) {
    return null;
  }

  return (
    <section
      className={`${content.bgProduct} py-8 md:py-12 relative overflow-hidden`}
    >
      <div className="container relative z-10">
        <div className="w-full mb-6">
          <h2 className="text-5xl text-center md:text-start md:text-6xl font-bold text-white leading-none">
            Dapatkan{" "}
            <img
              src={LogoRegenWhite.src}
              width={100}
              height={30}
              alt="logo regen"
              className="inline-block align-middle h-[0.8em] w-auto mx-1"
            />{" "}
            <br />
            di toko favoritmu
          </h2>
        </div>
        <div className="flex flex-col md:flex-row gap-0 md:gap-4 lg:gap-4 items-center relative justify-between relative">
          <div className="rounded-xl bg-white px-6 py-8 md:px-16 md:py-14">
            <div className="space-y-8 md:space-y-10">
              <StoreGroup
                stores={onlineStores}
                type="online"
                productName={content.productName}
              />
              <StoreGroup
                stores={offlineStores}
                type="offline"
                productName={content.productName}
              />
            </div>
          </div>
          <div className="">
            {isMobile ? null : (
              <img
                className="rotate-15 absolute -bottom-30 scale-130 right-20"
                src={content.urlImage}
                width={200}
                height={300}
                alt={content.ariaLabel}
                aria-label={content.ariaLabel}
              />
            )}
          </div>
        </div>
      </div>
      <img
        className="object-end w-full h-full block object-cover scale-150 md:scale-100 z-0 opacity-20 absolute right-0 pointer-events-none"
        src={"/element/logo-R.svg"}
        alt="logo R"
      />
    </section>
  );
};

export default BannerBuyProductRegenByItem;
