import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const navigate = useNavigate();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) return toast({ title: "Mot de passe trop court", description: "8 caractères minimum.", variant: "destructive" });
    if (password !== confirm) return toast({ title: "Erreur", description: "Les mots de passe ne correspondent pas.", variant: "destructive" });
    toast({ title: "Mot de passe mis à jour", description: "Vous pouvez vous reconnecter." });
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <form onSubmit={onSubmit} className="w-full max-w-md bg-card border rounded-lg p-6 space-y-4">
        <div>
          <h1 className="font-heading text-2xl font-bold">Nouveau mot de passe</h1>
          <p className="text-sm text-muted-foreground mt-1">Définissez un nouveau mot de passe sécurisé.</p>
        </div>
        <div className="grid gap-2">
          <Label>Mot de passe</Label>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div className="grid gap-2">
          <Label>Confirmer</Label>
          <Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
        </div>
        <Button type="submit" className="w-full">Mettre à jour</Button>
        <p className="text-center text-sm">
          <Link to="/login" className="text-primary hover:underline">Retour à la connexion</Link>
        </p>
      </form>
    </div>
  );
}
