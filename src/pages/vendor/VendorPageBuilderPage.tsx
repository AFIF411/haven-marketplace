import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Plus, Trash2, GripVertical, Save, Eye, Undo2, Redo2 } from "lucide-react";
import { DashboardLayout } from "@/components/marketplace/DashboardLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { BLOCK_REGISTRY, ALL_BLOCK_TYPES, createBlock, type FieldDef } from "@/lib/pageBuilder/blockRegistry";
import { BlockRenderer } from "@/lib/pageBuilder/BlockRenderer";
import { useShopPage, saveShopPage } from "@/hooks/useMarketplace";
import type { PageBlock, BlockType } from "@/types/marketplace";
import { cn } from "@/lib/utils";

const SHOP_ID = "s1"; // Dans une vraie app : récupéré depuis le contexte vendeur

export default function VendorPageBuilderPage() {
  const navigate = useNavigate();
  const { data: page, loading } = useShopPage(SHOP_ID);
  const [blocks, setBlocks] = useState<PageBlock[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [history, setHistory] = useState<PageBlock[][]>([]);
  const [future, setFuture] = useState<PageBlock[][]>([]);
  const [previewMode, setPreviewMode] = useState(false);

  // Charger les blocs depuis l'API
  useMemo(() => { if (page) setBlocks(page.blocks); }, [page]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const commit = useCallback((next: PageBlock[]) => {
    setHistory(h => [...h, blocks]);
    setFuture([]);
    setBlocks(next);
  }, [blocks]);

  const addBlock = (type: BlockType) => {
    const b = createBlock(type);
    commit([...blocks, b]);
    setSelectedId(b.id);
  };

  const removeBlock = (id: string) => {
    commit(blocks.filter(b => b.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const updateBlock = (id: string, patch: Record<string, unknown>) => {
    commit(blocks.map(b => b.id === id ? { ...b, props: { ...b.props, ...patch } } : b));
  };

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIdx = blocks.findIndex(b => b.id === active.id);
    const newIdx = blocks.findIndex(b => b.id === over.id);
    commit(arrayMove(blocks, oldIdx, newIdx));
  };

  const undo = () => {
    if (!history.length) return;
    setFuture(f => [blocks, ...f]);
    setBlocks(history[history.length - 1]);
    setHistory(h => h.slice(0, -1));
  };
  const redo = () => {
    if (!future.length) return;
    setHistory(h => [...h, blocks]);
    setBlocks(future[0]);
    setFuture(f => f.slice(1));
  };

  const save = async () => {
    await saveShopPage(SHOP_ID, blocks);
    toast({ title: "Page sauvegardée", description: "Vos modifications sont en ligne." });
  };

  const selected = blocks.find(b => b.id === selectedId) || null;

  return (
    <DashboardLayout type="vendor" title="Page Builder">
      <PageHeader
        title="Page Builder"
        description="Glissez-déposez les blocs pour personnaliser la page d'accueil de votre boutique."
        actions={
          <>
            <Button variant="outline" size="sm" onClick={undo} disabled={!history.length}><Undo2 className="h-4 w-4" /></Button>
            <Button variant="outline" size="sm" onClick={redo} disabled={!future.length}><Redo2 className="h-4 w-4" /></Button>
            <Button variant="outline" size="sm" onClick={() => setPreviewMode(p => !p)}><Eye className="h-4 w-4 me-1" />{previewMode ? "Édition" : "Aperçu"}</Button>
            <Button variant="outline" size="sm" onClick={() => navigate("/shop/artisan-cuir-alger")}>Voir la boutique</Button>
            <Button size="sm" onClick={save}><Save className="h-4 w-4 me-1" />Publier</Button>
          </>
        }
      />

      {loading ? (
        <p className="text-sm text-muted-foreground">Chargement...</p>
      ) : previewMode ? (
        <div className="bg-background rounded-xl border p-4 md:p-6 space-y-6">
          {blocks.map(b => <BlockRenderer key={b.id} block={b} />)}
        </div>
      ) : (
        <div className="grid grid-cols-12 gap-4">
          {/* Palette */}
          <aside className="col-span-12 md:col-span-2 bg-card border rounded-lg p-3 space-y-1 h-fit md:sticky md:top-20">
            <p className="text-xs font-semibold text-muted-foreground uppercase mb-2 px-1">Blocs</p>
            {ALL_BLOCK_TYPES.map(t => {
              const def = BLOCK_REGISTRY[t];
              const Icon = def.icon;
              return (
                <button key={t} onClick={() => addBlock(t)}
                  className="w-full flex items-center gap-2 px-2 py-2 text-sm rounded-md hover:bg-accent transition-colors text-start">
                  <Icon className="h-4 w-4 text-muted-foreground" /> {def.label}
                </button>
              );
            })}
          </aside>

          {/* Canvas */}
          <main className="col-span-12 md:col-span-7 bg-card border rounded-lg p-4 min-h-[500px]">
            {blocks.length === 0 ? (
              <div className="border-2 border-dashed rounded-lg p-12 text-center">
                <Plus className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Cliquez sur un bloc à gauche pour commencer</p>
              </div>
            ) : (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-3">
                    {blocks.map(b => (
                      <SortableBlock key={b.id} block={b}
                        selected={selectedId === b.id}
                        onSelect={() => setSelectedId(b.id)}
                        onRemove={() => removeBlock(b.id)} />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </main>

          {/* Props panel */}
          <aside className="col-span-12 md:col-span-3 bg-card border rounded-lg p-4 h-fit md:sticky md:top-20">
            {selected ? (
              <PropsPanel block={selected} onChange={(patch) => updateBlock(selected.id, patch)} />
            ) : (
              <p className="text-xs text-muted-foreground">Sélectionnez un bloc pour l'éditer</p>
            )}
          </aside>
        </div>
      )}
    </DashboardLayout>
  );
}

function SortableBlock({ block, selected, onSelect, onRemove }: { block: PageBlock; selected: boolean; onSelect: () => void; onRemove: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id });
  const def = BLOCK_REGISTRY[block.type];
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      onClick={onSelect}
      className={cn("group relative rounded-lg border-2 transition-all cursor-pointer",
        selected ? "border-primary" : "border-transparent hover:border-border",
        isDragging && "opacity-50")}
    >
      <div className="flex items-center justify-between bg-secondary/50 px-3 py-1.5 rounded-t-md border-b">
        <div className="flex items-center gap-2">
          <button {...attributes} {...listeners} className="cursor-grab text-muted-foreground hover:text-foreground">
            <GripVertical className="h-4 w-4" />
          </button>
          <span className="text-xs font-medium">{def.label}</span>
        </div>
        <button onClick={(e) => { e.stopPropagation(); onRemove(); }} className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="p-3 pointer-events-none">
        <BlockRenderer block={block} />
      </div>
    </div>
  );
}

function PropsPanel({ block, onChange }: { block: PageBlock; onChange: (patch: Record<string, unknown>) => void }) {
  const def = BLOCK_REGISTRY[block.type];
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 pb-2 border-b">
        <def.icon className="h-4 w-4 text-primary" />
        <h3 className="font-semibold text-sm">{def.label}</h3>
      </div>
      {def.fields.map(f => (
        <FieldEditor key={f.key} field={f} value={block.props[f.key]} onChange={(v) => onChange({ [f.key]: v })} />
      ))}
    </div>
  );
}

function FieldEditor({ field, value, onChange }: { field: FieldDef; value: unknown; onChange: (v: unknown) => void }) {
  const v = value as string | number | string[] | undefined;
  return (
    <div>
      <label className="text-xs font-medium mb-1 block">{field.label}</label>
      {field.type === "textarea" ? (
        <Textarea value={(v as string) ?? ""} onChange={(e) => onChange(e.target.value)} className="min-h-[70px] text-sm" />
      ) : field.type === "select" ? (
        <select value={(v as string) ?? ""} onChange={(e) => onChange(e.target.value)} className="w-full h-9 px-2 rounded-md border bg-background text-sm">
          {field.options?.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      ) : field.type === "number" ? (
        <Input type="number" value={(v as number) ?? 0} onChange={(e) => onChange(Number(e.target.value))} />
      ) : field.type === "product_ids" ? (
        <Input value={Array.isArray(v) ? v.join(",") : ""} onChange={(e) => onChange(e.target.value.split(",").map(s => s.trim()).filter(Boolean))} placeholder="p1,p2,p3" />
      ) : (
        <Input value={(v as string) ?? ""} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  );
}
