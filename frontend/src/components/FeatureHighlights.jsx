import { Truck, Clock, ShieldCheck, BadgeCheck } from "lucide-react";

const FEATURES = [
  {
    icon: Truck,
    title: "Free Shipping",
    subtitle: "Min. order Rp50,000",
  },
  {
    icon: Clock,
    title: "Fast Delivery",
    subtitle: "1-2 days arrival",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payment",
    subtitle: "100% protected",
  },
  {
    icon: BadgeCheck,
    title: "100% Guarantee",
    subtitle: "Money-back policy",
  },
];

export default function FeatureHighlights() {
  return (
    <div className="bg-surface dark:bg-dark-surface rounded-xl border border-border dark:border-dark-border shadow-card p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
      {FEATURES.map(({ icon: Icon, title, subtitle }) => (
        <div key={title} className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Icon size={20} />
          </span>
          <div>
            <p className="text-sm font-semibold text-ink dark:text-dark-ink">{title}</p>
            <p className="text-xs text-muted">{subtitle}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
