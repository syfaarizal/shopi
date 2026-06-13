import { ShoppingBag, Truck, ShieldCheck, RotateCcw, Headphones } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-surface dark:bg-dark-surface border-t border-border dark:border-dark-border mt-8">
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <ShoppingBag size={18} className="text-white" />
            </span>
            <span className="text-lg font-extrabold text-ink dark:text-dark-ink">Shopi</span>
          </div>
          <p className="text-sm text-muted leading-relaxed">
            Your trusted online marketplace for electronics, fashion, beauty and
            everyday essentials — at the best prices.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-ink dark:text-dark-ink mb-3 text-sm">Customer Service</h4>
          <ul className="space-y-2 text-sm text-muted">
            <li>Help Center</li>
            <li>How to Shop</li>
            <li>Shipping Info</li>
            <li>Returns & Refunds</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-ink dark:text-dark-ink mb-3 text-sm">About Shopi</h4>
          <ul className="space-y-2 text-sm text-muted">
            <li>About Us</li>
            <li>Careers</li>
            <li>Privacy Policy</li>
            <li>Terms & Conditions</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-ink dark:text-dark-ink mb-3 text-sm">Why Shop With Us</h4>
          <ul className="space-y-3 text-sm text-muted">
            <li className="flex items-center gap-2"><Truck size={16} className="text-primary" /> Free shipping over Rp50,000</li>
            <li className="flex items-center gap-2"><ShieldCheck size={16} className="text-primary" /> 100% secure payment</li>
            <li className="flex items-center gap-2"><RotateCcw size={16} className="text-primary" /> 14-day easy returns</li>
            <li className="flex items-center gap-2"><Headphones size={16} className="text-primary" /> 24/7 customer support</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border dark:border-dark-border py-4 text-center text-xs text-muted">
        © 2026 Shopi. All rights reserved.
      </div>
    </footer>
  );
}
