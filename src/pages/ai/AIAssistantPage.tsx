import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { DashboardLayout } from "@/components/marketplace/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Send, Loader2, Globe } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

export default function AIAssistantPage() {
  const [input, setInput] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setToken(data.session?.access_token ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setToken(s?.access_token ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({
      api: `${SUPABASE_URL}/functions/v1/chat`,
      headers: () => ({
        Authorization: `Bearer ${token ?? SUPABASE_KEY}`,
        apikey: SUPABASE_KEY,
      }),
    }),
    onError: (e) => toast({ title: "Erreur IA", description: e.message, variant: "destructive" }),
  });

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const isLoading = status === "submitted" || status === "streaming";

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isLoading || !token) return;
    setInput("");
    await sendMessage({ text });
  };

  return (
    <DashboardLayout type="vendor" title="Assistant IA">
      <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-10rem)]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="font-heading text-lg font-semibold">LIA — Assistant vendeur</h2>
          </div>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Globe className="h-3 w-3" /> Recherche web activée
          </span>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto rounded-lg border bg-card p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-sm text-muted-foreground p-3 rounded-md bg-muted/40">
              👋 Bonjour ! Je suis LIA. Posez-moi n'importe quelle question sur votre boutique, vos produits ou les tendances du marché algérien.
            </div>
          )}
          {messages.map((m) => {
            const text = m.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
            const usedSearch = m.parts.some((p: any) => p.type?.startsWith("tool-"));
            return (
              <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] p-3 rounded-lg text-sm whitespace-pre-wrap ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                  {text || <span className="opacity-60 italic">…</span>}
                  {usedSearch && m.role === "assistant" && (
                    <div className="mt-2 text-xs flex items-center gap-1 opacity-70">
                      <Globe className="h-3 w-3" /> recherche web utilisée
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin" /> LIA réfléchit…
            </div>
          )}
          {error && <div className="text-xs text-destructive">{error.message}</div>}
        </div>

        <form onSubmit={send} className="mt-4 flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={token ? "Posez votre question..." : "Connectez-vous pour discuter"}
            disabled={!token || isLoading}
          />
          <Button type="submit" disabled={!token || isLoading || !input.trim()}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </div>
    </DashboardLayout>
  );
}
