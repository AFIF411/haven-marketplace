// Image par catégorie pour adapter le visuel des boutiques au contenu vendu
// lorsqu'aucune cover/logo n'a été uploadé par le vendeur.

const CATEGORY_COVERS: Record<string, string> = {
  mode: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800",
  fashion: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800",
  vetement: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800",
  cuir: "https://images.unsplash.com/photo-1547949003-9792a18a2601?w=800",
  leather: "https://images.unsplash.com/photo-1547949003-9792a18a2601?w=800",
  maroquinerie: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800",
  bien: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800",
  wellness: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800",
  beaute: "https://images.unsplash.com/photo-1522335789203-aaa311c3a3d4?w=800",
  cosmetique: "https://images.unsplash.com/photo-1522335789203-aaa311c3a3d4?w=800",
  alimentation: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800",
  food: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800",
  epicerie: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800",
  artisanat: "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=800",
  craft: "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=800",
  bijou: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800",
  electronique: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800",
  electronics: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800",
  tech: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800",
  informatique: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800",
  maison: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800",
  decoration: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800",
  meuble: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800",
  sport: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800",
  livre: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800",
  enfant: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=800",
  jouet: "https://images.unsplash.com/photo-1558877385-8c1a892fcacb?w=800",
  auto: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800",
  jardin: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800",
  fleur: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800",
};

const DEFAULT_COVER = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800";
const DEFAULT_LOGO = "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=200";

function norm(s?: string) {
  return (s ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/** Retourne une image cohérente avec la catégorie / nom de boutique. */
export function pickShopCover(opts: {
  cover?: string | null;
  productImage?: string | null;
  category?: string | null;
  name?: string | null;
}): string {
  if (opts.cover) return opts.cover;
  if (opts.productImage) return opts.productImage;
  const haystack = `${norm(opts.category)} ${norm(opts.name)}`;
  for (const key of Object.keys(CATEGORY_COVERS)) {
    if (haystack.includes(key)) return CATEGORY_COVERS[key];
  }
  return DEFAULT_COVER;
}

export function pickShopLogo(opts: {
  logo?: string | null;
  productImage?: string | null;
  category?: string | null;
  name?: string | null;
}): string {
  if (opts.logo) return opts.logo;
  if (opts.productImage) return opts.productImage;
  const haystack = `${norm(opts.category)} ${norm(opts.name)}`;
  for (const key of Object.keys(CATEGORY_COVERS)) {
    if (haystack.includes(key)) return CATEGORY_COVERS[key];
  }
  return DEFAULT_LOGO;
}
