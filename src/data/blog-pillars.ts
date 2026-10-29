export const blogPillars = [
  { name: "Re:Set", label: "Mulai dari kebiasaan", description: "Meninjau ulang kebiasaan minum manis dan menemukan alternatif untuk setiap hari.", topics: "Kebiasaan minum · Pilihan asupan", backgroundClass: "bg-[#e9efb0]", icon: "↺" },
  { name: "Re:Search", label: "Cari tahu lebih dalam", description: "Mengenal gula, membaca label gizi, dan memahami data di balik pilihan kita.", topics: "Label gizi · Data & riset", backgroundClass: "bg-[#dce8ee]", icon: "↗" },
  { name: "Re:Fresh", label: "Bergerak, lalu segar lagi", description: "Teman untuk ritme kerja, perjalanan harian, dan akhir pekan yang aktif.", topics: "Hidrasi · Gerak & energi", backgroundClass: "bg-[#f4dfbd]", icon: "✳" },
  { name: "Re:Mix", label: "Racik versi segarmu", description: "Eksplorasi kreasi REGEN dengan teh, buah, dan ide racikan sederhana.", topics: "Resep · Kreasi rasa", backgroundClass: "bg-[#eed9e3]", icon: "+" },
] as const;
export function normalizeBlogCategory(value: string) {
  const key = value.toLowerCase().replace(/[^a-z]/g, "");
  return blogPillars.find(p => p.name.toLowerCase().replace(":", "") === key)?.name ?? value;
}
