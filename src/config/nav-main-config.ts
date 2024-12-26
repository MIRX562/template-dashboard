import { NavItem } from "./types";
import { SquareTerminal, Bot } from "lucide-react";

const navMainConfig: NavItem[] = [
  {
    title: "Not Nested",
    url: "#",
    icon: SquareTerminal,
    isActive: true,
  },
  {
    title: "Nested",
    url: "#",
    icon: Bot,
    items: [
      { title: "Genesis", url: "#" },
      { title: "Explorer", url: "#" },
      { title: "Quantum", url: "#" },
    ],
  },
];

export default navMainConfig;
