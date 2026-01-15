import ProductCardClient from "./product-card-client"

export default function ProductCard({ product }: { product: any }) {
  return <ProductCardClient product={product} />
}
