import { z } from "zod";

export const productPublishSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Le nom doit contenir au moins 3 caractères")
    .max(120, "Le nom ne doit pas dépasser 120 caractères"),
  description: z
    .string()
    .trim()
    .min(20, "Décrivez le produit (au moins 20 caractères) pour rassurer les clients")
    .max(5000, "Description trop longue (max 5000 caractères)"),
  price: z
    .number({ invalid_type_error: "Prix invalide" })
    .positive("Le prix doit être supérieur à 0")
    .max(10_000_000, "Prix irréaliste"),
  original_price: z
    .number()
    .nonnegative()
    .max(10_000_000)
    .optional(),
  stock: z
    .number({ invalid_type_error: "Stock invalide" })
    .int("Le stock doit être un nombre entier")
    .nonnegative("Le stock ne peut pas être négatif"),
  sku: z
    .string()
    .trim()
    .max(64, "SKU trop long")
    .optional(),
  images: z
    .array(z.string().trim().url("Une des URL d'image est invalide"))
    .min(1, "Ajoutez au moins une image du produit"),
}).superRefine((val, ctx) => {
  if (val.original_price && val.original_price > 0 && val.original_price <= val.price) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["original_price"],
      message: "Le prix barré doit être supérieur au prix actuel",
    });
  }
});

export type ProductPublishInput = z.input<typeof productPublishSchema>;

export interface ValidationReport {
  valid: boolean;
  errors: { field: string; message: string }[];
  warnings: string[];
}

export function validateProductForPublish(input: ProductPublishInput): ValidationReport {
  const result = productPublishSchema.safeParse(input);
  const warnings: string[] = [];

  if (input.stock === 0) {
    warnings.push("Stock à 0 : le produit sera marqué « rupture de stock » après publication.");
  }
  if (input.images && input.images.length === 1) {
    warnings.push("Une seule image fournie — ajoutez-en plusieurs pour améliorer les conversions.");
  }
  if (input.description && input.description.length < 80) {
    warnings.push("Description courte — une description plus détaillée améliore le SEO.");
  }
  if (!input.sku) {
    warnings.push("Aucun SKU défini — recommandé pour suivre vos stocks.");
  }

  if (!result.success) {
    return {
      valid: false,
      warnings,
      errors: result.error.issues.map((i) => ({
        field: i.path.join(".") || "—",
        message: i.message,
      })),
    };
  }
  return { valid: true, errors: [], warnings };
}
