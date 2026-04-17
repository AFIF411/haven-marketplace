// ============================================================
// Page Builder — registre des blocs disponibles
// Chaque bloc a : type, label, icon, props par défaut, schéma d'édition.
// ============================================================

import type { BlockType, PageBlock } from "@/types/marketplace";
import { LayoutTemplate, Grid3x3, Image as ImageIcon, Type, Megaphone, Users, Mail, MoveVertical, FolderTree } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type FieldType = "text" | "textarea" | "url" | "number" | "select" | "image" | "product_ids";

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  options?: { label: string; value: string }[];
  placeholder?: string;
}

export interface BlockDef {
  type: BlockType;
  label: string;
  icon: LucideIcon;
  defaultProps: Record<string, unknown>;
  fields: FieldDef[];
}

export const BLOCK_REGISTRY: Record<BlockType, BlockDef> = {
  hero: {
    type: "hero", label: "Hero", icon: LayoutTemplate,
    defaultProps: { title: "Bienvenue", subtitle: "Découvrez notre boutique", imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200", ctaLabel: "Voir les produits", ctaHref: "#products" },
    fields: [
      { key: "title", label: "Titre", type: "text" },
      { key: "subtitle", label: "Sous-titre", type: "textarea" },
      { key: "imageUrl", label: "Image de fond (URL)", type: "url" },
      { key: "ctaLabel", label: "Bouton — texte", type: "text" },
      { key: "ctaHref", label: "Bouton — lien", type: "text" },
    ],
  },
  product_grid: {
    type: "product_grid", label: "Grille produits", icon: Grid3x3,
    defaultProps: { title: "Nos produits", productIds: [], columns: 4 },
    fields: [
      { key: "title", label: "Titre", type: "text" },
      { key: "columns", label: "Colonnes", type: "select", options: [{label:"2",value:"2"},{label:"3",value:"3"},{label:"4",value:"4"}] },
      { key: "productIds", label: "IDs produits (séparés par virgule)", type: "product_ids" },
    ],
  },
  category_grid: {
    type: "category_grid", label: "Catégories", icon: FolderTree,
    defaultProps: { title: "Nos catégories", categoryIds: [] },
    fields: [
      { key: "title", label: "Titre", type: "text" },
      { key: "categoryIds", label: "IDs catégories (virgule)", type: "product_ids" },
    ],
  },
  banner: {
    type: "banner", label: "Bannière promo", icon: Megaphone,
    defaultProps: { title: "Promo limitée", subtitle: "Jusqu'à -30%", color: "primary" },
    fields: [
      { key: "title", label: "Titre", type: "text" },
      { key: "subtitle", label: "Sous-titre", type: "text" },
      { key: "color", label: "Couleur", type: "select", options: [{label:"Primaire",value:"primary"},{label:"Accent",value:"accent"},{label:"Sombre",value:"dark"}] },
    ],
  },
  text: {
    type: "text", label: "Texte", icon: Type,
    defaultProps: { content: "Votre texte ici...", align: "left" },
    fields: [
      { key: "content", label: "Contenu", type: "textarea" },
      { key: "align", label: "Alignement", type: "select", options: [{label:"Gauche",value:"left"},{label:"Centre",value:"center"},{label:"Droite",value:"right"}] },
    ],
  },
  image: {
    type: "image", label: "Image", icon: ImageIcon,
    defaultProps: { url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200", alt: "" },
    fields: [
      { key: "url", label: "URL de l'image", type: "url" },
      { key: "alt", label: "Texte alternatif", type: "text" },
    ],
  },
  testimonials: {
    type: "testimonials", label: "Témoignages", icon: Users,
    defaultProps: { title: "Avis clients", items: [{ name: "Amina", text: "Excellent service !", rating: 5 }] },
    fields: [{ key: "title", label: "Titre", type: "text" }],
  },
  newsletter: {
    type: "newsletter", label: "Newsletter", icon: Mail,
    defaultProps: { title: "Restez informé", subtitle: "Inscrivez-vous à notre newsletter" },
    fields: [
      { key: "title", label: "Titre", type: "text" },
      { key: "subtitle", label: "Sous-titre", type: "text" },
    ],
  },
  spacer: {
    type: "spacer", label: "Espacement", icon: MoveVertical,
    defaultProps: { height: 40 },
    fields: [{ key: "height", label: "Hauteur (px)", type: "number" }],
  },
};

export const ALL_BLOCK_TYPES = Object.keys(BLOCK_REGISTRY) as BlockType[];

export function createBlock(type: BlockType): PageBlock {
  return {
    id: `b-${Math.random().toString(36).slice(2, 10)}`,
    type,
    props: { ...BLOCK_REGISTRY[type].defaultProps },
  };
}
