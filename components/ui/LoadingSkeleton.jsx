"use client";

import { cn } from "@/lib/utils";

/** Reusable skeleton variants for loading states */

export function SkeletonBox({ className, ...props }) {
  return <div className={cn("skeleton", className)} {...props} />;
}

export function ProductCardSkeleton() {
  return (
    <div className="luxury-card overflow-hidden">
      {/* Image */}
      <div className="skeleton h-64 rounded-t-2xl rounded-b-none" />
      <div className="p-4 space-y-3">
        {/* Brand */}
        <div className="skeleton h-3 w-20 rounded-full" />
        {/* Name */}
        <div className="skeleton h-5 w-3/4 rounded-lg" />
        {/* Rating */}
        <div className="skeleton h-3 w-28 rounded-full" />
        {/* Price */}
        <div className="flex items-center gap-3">
          <div className="skeleton h-5 w-16 rounded-lg" />
          <div className="skeleton h-4 w-12 rounded-lg" />
        </div>
        {/* Button */}
        <div className="skeleton h-10 w-full rounded-xl mt-2" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Gallery */}
      <div className="space-y-3">
        <div className="skeleton h-[480px] rounded-2xl" />
        <div className="flex gap-3">
          {[1,2,3,4].map(i => <div key={i} className="skeleton h-20 w-20 rounded-xl" />)}
        </div>
      </div>
      {/* Info */}
      <div className="space-y-5">
        <div className="skeleton h-4 w-24 rounded-full" />
        <div className="skeleton h-10 w-3/4 rounded-xl" />
        <div className="skeleton h-4 w-32 rounded-full" />
        <div className="skeleton h-8 w-40 rounded-xl" />
        <div className="skeleton h-px w-full" />
        <div className="space-y-2">
          {[1,2,3].map(i => <div key={i} className="skeleton h-4 w-full rounded-lg" />)}
        </div>
        <div className="skeleton h-12 w-full rounded-2xl" />
        <div className="skeleton h-12 w-full rounded-2xl" />
      </div>
    </div>
  );
}

export function OrderCardSkeleton() {
  return (
    <div className="luxury-card p-5 space-y-4">
      <div className="flex justify-between">
        <div className="skeleton h-5 w-32 rounded-lg" />
        <div className="skeleton h-5 w-20 rounded-full" />
      </div>
      <div className="skeleton h-px w-full" />
      <div className="flex gap-4">
        <div className="skeleton h-16 w-16 rounded-xl" />
        <div className="space-y-2 flex-1">
          <div className="skeleton h-4 w-1/2 rounded-lg" />
          <div className="skeleton h-3 w-1/3 rounded-full" />
        </div>
      </div>
      <div className="skeleton h-4 w-24 rounded-full ml-auto" />
    </div>
  );
}

export default SkeletonBox;
