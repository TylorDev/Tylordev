import { FiMonitor, FiDatabase, FiLayout, FiBox, FiSmartphone, FiHash } from "react-icons/fi";
import { SiDiscord } from "react-icons/si";

export function getTypeIcon(type: string) {
  const normalized = type.toLowerCase().trim();
  if (normalized.includes("discord")) return <SiDiscord />;
  if (normalized.includes("full-stack") || normalized.includes("fullstack")) return <FiBox />;
  if (normalized.includes("backend")) return <FiDatabase />;
  if (normalized.includes("frontend")) return <FiLayout />;
  if (normalized.includes("desktop")) return <FiMonitor />;
  if (normalized.includes("mobile")) return <FiSmartphone />;
  return <FiHash />;
}
