import {
  Cpu,
  Shirt,
  Sparkles,
  Home,
  Smartphone,
  Dumbbell,
  Car,
  UtensilsCrossed,
  Grid3x3,
} from "lucide-react";

export const ICON_MAP = {
  Cpu,
  Shirt,
  Sparkles,
  Home,
  Smartphone,
  Dumbbell,
  Car,
  UtensilsCrossed,
};

export function getIcon(name) {
  return ICON_MAP[name] || Grid3x3;
}
