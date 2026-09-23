import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList,
  BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import type { ProductVariant } from "@/lib/product-catalog";

const ProductBreadcrumb = ({ product }: { product: ProductVariant }) => {
  return (
    <Breadcrumb  className="mb-8 md:mb-12">
      <BreadcrumbList>
        <BreadcrumbItem>
        <BreadcrumbLink href="/">Beranda</BreadcrumbLink></BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink  href="/product/">Produk</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem><BreadcrumbLink  href={`/product/regen-${product.productSize}/`}>REGEN {product.productSize}</BreadcrumbLink></BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
        <BreadcrumbPage className="font-medium text-slate-900">{product.displayName}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default ProductBreadcrumb;