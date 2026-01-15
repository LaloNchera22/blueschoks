import ProductCardClient from "./product-card-client"

export default function ProductCard({ product }: { product: Record<string, unknown> }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <ProductCardClient product={product as any} />
}
