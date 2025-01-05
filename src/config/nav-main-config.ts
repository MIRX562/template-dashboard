import { NavItem } from "./types";
import { LayoutDashboard, MoreHorizontal, MoreVertical } from "lucide-react";

const navMainConfig: NavItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "more single menu",
    url: "/dashboard",
    icon: MoreHorizontal,
  },
  {
    title: "Nested menus",
    url: "#",
    icon: MoreVertical,
    items: [
      { title: "Menu 1", url: "#" },
      { title: "Menu 2", url: "#" },
      { title: "Menu 3", url: "#" },
    ],
  },
];

export default navMainConfig;
