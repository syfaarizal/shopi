import { Star } from "lucide-react";

export default function StarRating({ rating = 0, size = 13, showValue = false }) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div className="flex items-center gap-0.5">
      {stars.map((s) => (
        <Star
          key={s}
          size={size}
          className={s <= Math.round(rating) ? "star-filled" : "text-border"}
          fill={s <= Math.round(rating) ? "currentColor" : "none"}
        />
      ))}
      {showValue && <span className="text-xs text-muted ml-1">{rating.toFixed(1)}</span>}
    </div>
  );
}
