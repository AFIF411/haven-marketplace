import { Wrench } from "lucide-react";

export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center max-w-md">
        <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <Wrench className="h-10 w-10 text-primary" />
        </div>
        <h1 className="font-heading text-3xl font-bold">Maintenance en cours</h1>
        <p className="text-muted-foreground mt-3">Souk DZ est temporairement indisponible. Nous travaillons à améliorer votre expérience. Merci de revenir dans quelques minutes.</p>
      </div>
    </div>
  );
}
