import { useState } from "react";
import { DashboardLayout } from "@/components/marketplace/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Send } from "lucide-react";

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([
    { role: "ai", text: "Bonjour ! Je suis votre assistant IA. Je peux vous aider à créer des descriptions produit, optimiser votre boutique ou générer des idées de promotions. Comment puis-je vous aider ?" },
  ]);
  const [input, setInput] = useState("");

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages(m => [...m, { role: "user", text: input }, { role: "ai", text: "Voici ma suggestion : (réponse IA simulée). Vous pouvez affiner la demande pour obtenir un résultat plus précis." }]);
    setInput("");
  };

  return (
    <DashboardLayout type="vendor" title="Assistant IA">
      <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-10rem)]">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="font-heading text-lg font-semibold">Assistant vendeur</h2>
        </div>
        <div className="flex-1 overflow-y-auto rounded-lg border bg-card p-4 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] p-3 rounded-lg text-sm ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                {m.text}
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={send} className="mt-4 flex gap-2">
          <Input value={input} onChange={e => setInput(e.target.value)} placeholder="Posez votre question..." />
          <Button type="submit"><Send className="h-4 w-4" /></Button>
        </form>
      </div>
    </DashboardLayout>
  );
}
