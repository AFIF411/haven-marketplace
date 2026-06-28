import { convertToModelMessages, streamText, type UIMessage } from "npm:ai";
import { createClient } from "npm:@supabase/supabase-js@2";
import { z } from "npm:zod";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createLovableAiGatewayProvider } from "../_shared/ai-gateway.ts";

const BodySchema = z.object({
  messages: z.array(z.any()),
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

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !supabaseServiceKey) {
    return new Response(JSON.stringify({ error: "Missing Supabase env" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { Authorization: authHeader } },
  });

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
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

  const { messages }: { messages: UIMessage[] } = parsed.data;

  // Get or create the single conversation for this user
  let conversationId: string;
  const { data: existingConv } = await supabase
    .from("conversations")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (existingConv?.id) {
    conversationId = existingConv.id;
  } else {
    const { data: newConv, error: convError } = await supabase
      .from("conversations")
      .insert({ user_id: user.id, title: "Assistant LIA" })
      .select("id")
      .single();
    if (convError || !newConv) {
      return new Response(JSON.stringify({ error: "Failed to create conversation" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    conversationId = newConv.id;
  }

  // Persist the latest user message if not already stored
  const lastUserMessage = messages.filter((m) => m.role === "user").pop();
  if (lastUserMessage) {
    const { data: latestStored } = await supabase
      .from("chat_messages")
      .select("content")
      .eq("conversation_id", conversationId)
      .eq("role", "user")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (latestStored?.content !== lastUserMessage.content) {
      await supabase.from("chat_messages").insert({
        conversation_id: conversationId,
        role: "user",
        content: lastUserMessage.content,
        parts: lastUserMessage.parts ?? [],
      });
    }
  }

  const gateway = createLovableAiGatewayProvider(key);
  const model = gateway("google/gemini-3-flash-preview");

  const result = streamText({
    model,
    system:
      "Tu es LIA, l'assistant IA de OneClick Tijara, une marketplace algérienne. Tu aides les vendeurs à créer des descriptions produit, optimiser leurs boutiques, générer des idées de promotions et répondre à leurs questions sur la plateforme. Réponds en français ou en arabe selon la langue de l'utilisateur. Sois concis, pratique, structuré et encourageant. Quand tu proposes des idées, donne des exemples concrets adaptés au marché algérien.",
    messages: await convertToModelMessages(messages),
    async onFinish({ response }) {
      const assistantText = response.messages
        .filter((m) => m.role === "assistant")
        .map((m) => (typeof m.content === "string" ? m.content : ""))
        .join("\n");
      if (assistantText) {
        await supabase.from("chat_messages").insert({
          conversation_id: conversationId,
          role: "assistant",
          content: assistantText,
          parts: response.messages,
        });
      }
    },
  });

  return result.toUIMessageStreamResponse({ headers: corsHeaders });
});
