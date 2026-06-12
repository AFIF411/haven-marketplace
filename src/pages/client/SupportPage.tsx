import { useState } from "react";
import { DashboardLayout } from "@/components/marketplace/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

const tickets = [
  { id: "T-102", subject: "Produit non reçu", status: "Ouvert", date: "10 juin" },
  { id: "T-099", subject: "Demande de remboursement", status: "Résolu", date: "5 juin" },
];

export default function SupportPage() {
  const [subject, setSubject] = useState("");
  const [type, setType] = useState("");
  const [message, setMessage] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Ticket envoyé", description: "Notre équipe vous répondra sous 24h." });
    setSubject(""); setType(""); setMessage("");
  };

  return (
    <DashboardLayout type="client" title="Support client">
      <div className="max-w-3xl">
        <h1 className="font-heading text-2xl font-bold">Support client</h1>
        <p className="text-sm text-muted-foreground mt-1">Envoyez une réclamation ou une demande d'aide.</p>

        <form onSubmit={onSubmit} className="mt-6 p-6 rounded-lg border bg-card space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Type de demande</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Choisir..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="commande">Problème de commande</SelectItem>
                  <SelectItem value="livraison">Problème de livraison</SelectItem>
                  <SelectItem value="paiement">Problème de paiement</SelectItem>
                  <SelectItem value="autre">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>Sujet</Label><Input value={subject} onChange={e => setSubject(e.target.value)} required className="mt-1" /></div>
          </div>
          <div><Label>Message</Label><Textarea value={message} onChange={e => setMessage(e.target.value)} required rows={5} className="mt-1" /></div>
          <Button type="submit">Envoyer la demande</Button>
        </form>

        <h2 className="font-heading text-lg font-semibold mt-10 mb-3">Mes tickets</h2>
        <div className="rounded-lg border bg-card divide-y">
          {tickets.map(t => (
            <div key={t.id} className="p-4 flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">{t.subject}</div>
                <div className="text-xs text-muted-foreground">{t.id} • {t.date}</div>
              </div>
              <Badge variant={t.status === "Résolu" ? "outline" : "default"}>{t.status}</Badge>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
