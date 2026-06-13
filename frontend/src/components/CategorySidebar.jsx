import { Link } from "react-router-dom";
import { ChevronRight, LayoutGrid } from "lucide-react";
import { CATEGORIES } from "../data/products";
import { getIcon } from "../utils/icons";

export default function CategorySidebar() {
  return (
    <aside className="bg-surface dark:bg-dark-surface rounded-xl border border-border dark:border-dark-border shadow-card overflow-hidden h-full">
      <div className="bg-primary text-white px-4 py-3 flex items-center gap-2 font-semibold text-sm">
        <LayoutGrid size={16} />
        Categories
      </div>
      <ul className="py-1">
        {CATEGORIES.map((cat) => {
          const Icon = getIcon(cat.icon);
          return (
            <li key={cat.id}>
              <Link
                to={`/search?category=${cat.id}`}
                className="flex items-center justify-between px-4 py-2.5 text-sm text-ink dark:text-dark-ink hover:bg-bg dark:hover:bg-dark-bg hover:text-primary transition-colors group"
              >
                <span className="flex items-center gap-3">
                  <Icon size={16} className="text-muted group-hover:text-primary" />
                  {cat.name}
                </span>
                <ChevronRight size={14} className="text-muted" />
              </Link>
            </li>
          );
        })}
        <li>
          <Link
            to="/search"
            className="flex items-center justify-between px-4 py-2.5 text-sm font-medium text-primary hover:bg-bg dark:hover:bg-dark-bg transition-colors"
          >
            View All
            <ChevronRight size={14} />
          </Link>
        </li>
      </ul>
    </aside>
  );
}
