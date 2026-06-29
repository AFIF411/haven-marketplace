// Smart fallback image picker for products based on the product name / category.
// Used when a vendor publishes a product without uploading an image, so the
// public catalogue never shows a random visual that contradicts the title
// (ex: "Deglet Nour" must show dates, not mangoes).

const KEYWORD_IMAGES: Array<[RegExp, string]> = [
  // Dattes
  [/\b(deglet|datte|dattes|tamr|tmar|تمر|دقلة)\b/i, "https://images.unsplash.com/photo-1609501676725-7186f017a4b7?w=600"],
  // Fruits courants
  [/\bmangue|mango\b/i, "https://images.unsplash.com/photo-1553279768-865429fa0078?w=600"],
  [/\bbanane|banana\b/i, "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600"],
  [/\borange|agrume\b/i, "https://images.unsplash.com/photo-1547514701-42782101795e?w=600"],
  [/\bpomme|apple\b/i, "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=600"],
  [/\braisin|grape\b/i, "https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=600"],
  [/\bfigue|fig\b/i, "https://images.unsplash.com/photo-1601379329542-31c59cce6c69?w=600"],
  [/\bgrenade|pomegranate\b/i, "https://images.unsplash.com/photo-1541344999736-83eca272f6fc?w=600"],
  // Épicerie / alimentation
  [/\bmiel|honey\b/i, "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600"],
  [/\bhuile|olive|zit\b/i, "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600"],
  [/\bcouscous|semoule\b/i, "https://images.unsplash.com/photo-1604908554027-39061cefa48b?w=600"],
  [/\bpain|bread|khobz\b/i, "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600"],
  [/\bcafe|coffee\b/i, "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600"],
  [/\bthe|tea\b/i, "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600"],
  [/\bepice|spice|harissa|ras el|safran\b/i, "https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=600"],
  [/\bchocolat|chocolate\b/i, "https://images.unsplash.com/photo-1511381939415-e44015466834?w=600"],
  // Mode / textile
  [/\bsac|bag\b/i, "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600"],
  [/\bchauss(ure|ures)|sneaker|basket\b/i, "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600"],
  [/\bmontre|watch\b/i, "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600"],
  [/\bbijou|collier|bague|bracelet\b/i, "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600"],
  [/\brobe|dress|kaftan|caftan|abaya|djellaba|hijab\b/i, "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600"],
  [/\bt-?shirt|chemise|pull|veste\b/i, "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600"],
  // Beauté
  [/\bparfum|perfume\b/i, "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600"],
  [/\bcrem(e|a)|hydratant|serum|cosmetique\b/i, "https://images.unsplash.com/photo-1522335789203-aaa311c3a3d4?w=600"],
  [/\bsavon|soap\b/i, "https://images.unsplash.com/photo-1607006333439-505849ef4f76?w=600"],
  // Maison
  [/\btapis|berbere|kilim\b/i, "https://images.unsplash.com/photo-1600166898405-da9535204843?w=600"],
  [/\bvase|poterie|ceramique\b/i, "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600"],
  [/\bmeuble|chaise|table|canape\b/i, "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600"],
  // Électronique
  [/\btelephone|smartphone|iphone|samsung\b/i, "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600"],
  [/\blaptop|ordinateur|pc\b/i, "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600"],
  [/\bcasque|headphone|ecouteur\b/i, "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600"],
];

const CATEGORY_FALLBACK: Record<string, string> = {
  alimentation: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600",
  food: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600",
  epicerie: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=600",
  mode: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600",
  fashion: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600",
  beaute: "https://images.unsplash.com/photo-1522335789203-aaa311c3a3d4?w=600",
  beauty: "https://images.unsplash.com/photo-1522335789203-aaa311c3a3d4?w=600",
  maison: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600",
  home: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600",
  artisanat: "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=600",
  craft: "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=600",
  electronique: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600",
  tech: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600",
};

const DEFAULT = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600";

function norm(s?: string | null) {
  return (s ?? "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/** Retourne une image cohérente avec le nom/catégorie du produit. */
export function pickProductImage(opts: {
  name?: string | null;
  category?: string | null;
}): string {
  const hay = `${norm(opts.name)} ${norm(opts.category)}`;
  for (const [rx, url] of KEYWORD_IMAGES) {
    if (rx.test(hay)) return url;
  }
  const cat = norm(opts.category);
  for (const key of Object.keys(CATEGORY_FALLBACK)) {
    if (cat.includes(key)) return CATEGORY_FALLBACK[key];
  }
  return DEFAULT;
}

/** True si le nom du produit correspond à un mot-clé image connu. */
export function hasKeywordMatch(name?: string | null, category?: string | null): boolean {
  const hay = `${norm(name)} ${norm(category)}`;
  return KEYWORD_IMAGES.some(([rx]) => rx.test(hay));
}

/**
 * Résout l'image finale d'un produit.
 * - Une image uploadée par le vendeur (non Unsplash/placeholder) est prioritaire.
 * - Sinon, si le nom matche un mot-clé connu, on force l'image thématique
 *   (évite "Deglet Nour" affiché avec une mangue stockée par défaut).
 * - Sinon on garde l'image stockée, puis fallback intelligent.
 */
export function resolveProductImage(opts: {
  name?: string | null;
  category?: string | null;
  storedImages?: (string | null | undefined)[];
}): string {
  const stored = (opts.storedImages ?? []).find(Boolean) as string | undefined;
  const isGeneric = (u?: string) =>
    !u || /images\.unsplash\.com|placeholder|picsum\.photos/i.test(u);

  if (stored && !isGeneric(stored)) return stored;
  if (hasKeywordMatch(opts.name, opts.category)) {
    return pickProductImage({ name: opts.name, category: opts.category });
  }
  return stored ?? pickProductImage({ name: opts.name, category: opts.category });
}
