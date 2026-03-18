/** Skeleton loader for product cards */
const ProductSkeleton = () => (
  <div className="animate-pulse">
    <div className="aspect-[3/4] rounded-xl bg-muted" />
    <div className="mt-3 space-y-2">
      <div className="h-4 w-3/4 rounded bg-muted" />
      <div className="h-3 w-1/4 rounded bg-muted" />
    </div>
  </div>
);

export default ProductSkeleton;
