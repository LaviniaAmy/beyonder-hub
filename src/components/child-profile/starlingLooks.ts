import type { Pose } from "@/data/childProfileStore";

// Shades of blue and orange. body / belly / wing.
export const STARLING_COLOURS: { id: string; label: string; body: string; belly: string; wing: string; warm: boolean }[] = [
  { id: "blue-navy", label: "Navy", body: "#1E3A5F", belly: "#5B7DA3", wing: "#142a45", warm: false },
  { id: "blue-deep", label: "Deep blue", body: "#2B4C7E", belly: "#7E9CC4", wing: "#1f3a63", warm: false },
  { id: "blue-steel", label: "Steel blue", body: "#4E6E8E", belly: "#A4BACF", wing: "#3b5672", warm: false },
  { id: "blue-sky", label: "Sky blue", body: "#5B8DC9", belly: "#BCD3EE", wing: "#466fa3", warm: false },
  { id: "blue-mist", label: "Misty blue", body: "#8BA5BE", belly: "#DCE7F1", wing: "#6d879f", warm: false },
  { id: "orange-rust", label: "Rust", body: "#C4714F", belly: "#EDBBA2", wing: "#9f5638", warm: true },
  { id: "orange-terra", label: "Terracotta", body: "#D98A6A", belly: "#F4CDB9", wing: "#b96d4e", warm: true },
  { id: "orange-peach", label: "Peach", body: "#E8A080", belly: "#F8DCCD", wing: "#cc8263", warm: true },
  { id: "orange-apricot", label: "Apricot", body: "#F0A85A", belly: "#FAD9B1", wing: "#d18a3d", warm: true },
  { id: "orange-sunset", label: "Sunset", body: "#E07B39", belly: "#F6C49E", wing: "#bb6127", warm: true },
];

export const POSES: { id: Pose; label: string }[] = [
  { id: "perched", label: "Perched" },
  { id: "waving", label: "Waving" },
  { id: "flying", label: "Flying" },
  { id: "snuggled", label: "Snuggled" },
];
