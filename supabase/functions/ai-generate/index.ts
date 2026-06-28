import { generateText, generateImage, Output } from "npm:ai";
import { z } from "npm:zod";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createLovableAiGatewayProvider } from "../_shared/ai-gateway.ts";

const BodySchema = z.object({
  activityName: z.string().min(1).max(120),
  productType: z.string().min(1).max(120),
  description: z.string().max(1000).optional(),
  generateImage: z.boolean().default(true),
});

const ShopSchema = z.object({
  name: z.string().min(1),
  tagline: z.string().min(1),
  description: z.string().min(1),
  categories: z.array(z.string().min(1)).min(3).max(8),
  colorPalette: z.object({
    primary: z.string(),
    secondary: z.string(),
    accent: z.string(),
  }),
  products: z.array(
    z.object({
      name: z.string().min(1),
      description: z.string().min(1),
      priceRange: z.string().min(1),
      category: z.string().min(1),
    })
  ).min(3).max(8),
  welcomeMessage: z.string().min(1),
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const key = Deno.env.get("LOVABLE_API_KEY");
  if (!key) {
    return new Response(JSON.stringify({ error: "Missing LOVABLE_API_KEY" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const parsed = BodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: parsed.error.flatten() }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const { activityName, productType, description, generateImage: shouldGenerateImage } = parsed.data;

  const gateway = createLovableAiGatewayProvider(key);
  const textModel = gateway("google/gemini-3-flash-preview");

  const { output: shop } = await generateText({
    model: textModel,
    system:
      "Tu es un expert en création de boutiques e-commerce algériennes. Tu conçois des propositions de boutique complètes, avec un nom accrocheur, un slogan, une description, des catégories pertinentes, une palette de couleurs, des idées de produits et un message de bienvenue. Adapte tout au contexte algérien (DZD, wilayas, goûts locaux). Réponds en français.",
    output: Output.object({ schema: ShopSchema }),
    prompt: `Crée une proposition de boutique pour une activité nommée "${activityName}" qui vend des produits de type "${productType}". ${
      description ? `Description additionnelle : ${description}` : ""
    }`,
  });

  let imageUrl: string | null = null;
  if (shouldGenerateImage) {
    try {
      const { image } = await generateImage({
        model: gateway.imageModel("google/gemini-3.1-flash-image"),
        prompt: `Bannière élégante et minimaliste pour une boutique e-commerce algérienne nommée "${shop.name}". ${shop.tagline}. Style premium, fond clair, couleurs ${shop.colorPalette.primary}, ${shop.colorPalette.secondary}, ${shop.colorPalette.accent}. Sans texte.`,
        size: "1024x1024",
      });
      imageUrl = image.base64;
    } catch (imgError) {
      console.error("Image generation failed:", imgError);
    }
  }

  return Response.json(
    { shop, imageUrl },
    { headers: corsHeaders },
  );
});
