import { NavItemProtected } from "./types";
import { Logs, MoreHorizontal, UserRoundCog } from "lucide-react";

const navProtected: NavItemProtected[] = [
  { name: "User Management", url: "/users", icon: UserRoundCog },
  { name: "Logs", url: "/logs", icon: Logs },
  { name: "More Admin menus", url: "#", icon: MoreHorizontal },
];

export default navProtected;
