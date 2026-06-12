import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertOctagon } from "lucide-react";

export default function ServerErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center max-w-md">
        <div className="mx-auto w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
          <AlertOctagon className="h-10 w-10 text-destructive" />
        </div>
        <h1 className="font-heading text-3xl font-bold">Erreur 500</h1>
        <p className="text-muted-foreground mt-3">Une erreur inattendue s'est produite côté serveur. Notre équipe a été alertée.</p>
        <Button asChild className="mt-6"><Link to="/">Retour à l'accueil</Link></Button>
      </div>
    </div>
  );
}
