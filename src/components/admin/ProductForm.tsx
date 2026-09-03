"use client";

import Image from "next/image";
import { useActionState } from "react";
import { deleteImageAction, saveProductAction } from "@/lib/admin-actions";

type Cat = { key: string; name: string; code: string };
type Img = { id: string; url: string };

export function ProductForm({
  id, cats, initial, images,
}: {
  id: string | null;
  cats: Cat[];
  images: Img[];
  initial: {
    code: string; name: string; categoryKey: string; price: string;
    stock: string; stockQty: number; description: string;
    material: string; colorOptions: string;
    isUnique: boolean; engraving: boolean; active: boolean;
  };
}) {
  const bound = saveProductAction.bind(null, id);
  const [state, action, pending] = useActionState(bound, null as { error?: string } | null);

  const field = "w-full rounded-xl border border-line-strong bg-ground px-4 py-3 text-[15px] outline-none focus:border-emerald";
  const label = "mb-1.5 block text-[11px] uppercase tracking-[0.16em] text-ink-faint font-bold";

  return (
    <form action={action} className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="flex flex-col gap-5 rounded-2xl border border-line bg-surface p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label} htmlFor="kod">Kod</label>
            <input id="kod" name="kod" required defaultValue={initial.code} placeholder="SAT-009" className={`${field} code`} />
          </div>
          <div>
            <label className={label} htmlFor="kateqoriya">Kateqoriya</label>
            <select id="kateqoriya" name="kateqoriya" defaultValue={initial.categoryKey} className={field}>
              {cats.map((c) => <option key={c.key} value={c.key}>{c.name} ({c.code})</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className={label} htmlFor="ad">Ad</label>
          <input id="ad" name="ad" required defaultValue={initial.name} className={field} />
        </div>

        <div>
          <label className={label} htmlFor="tesvir">Təsvir</label>
          <textarea id="tesvir" name="tesvir" rows={5} defaultValue={initial.description} className={field} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label} htmlFor="material">Material <span className="normal-case tracking-normal">(vergüllə)</span></label>
            <input id="material" name="material" defaultValue={initial.material} className={field} placeholder="Epoksid qatran, Qoz ağacı" />
          </div>
          <div>
            <label className={label} htmlFor="rengSecimleri">Rəng seçimləri <span className="normal-case tracking-normal">(vergüllə)</span></label>
            <input id="rengSecimleri" name="rengSecimleri" defaultValue={initial.colorOptions} className={field} placeholder="Okean, Ağ-qızılı" />
          </div>
        </div>

        <div>
          <label className={label} htmlFor="sekiller">Şəkil əlavə et</label>
          <input id="sekiller" name="sekiller" type="file" accept="image/*" multiple className={`${field} py-2.5`} />
          <p className="mt-1.5 text-[13px] text-ink-faint">Bir neçə şəkil seçə bilərsiniz. Hər fayl 6 MB-a qədər.</p>
        </div>

        {images.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {images.map((im) => (
              <div key={im.id} className="relative size-24 overflow-hidden rounded-xl border border-line">
                <Image src={im.url} alt="" fill sizes="96px" className="object-cover" />
                <button
                  type="button"
                  onClick={() => { void deleteImageAction(im.id, id ?? ""); }}
                  className="absolute right-1 top-1 size-6 rounded-full bg-ink/80 text-surface"
                  aria-label="Şəkli sil"
                >×</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <aside className="flex h-fit flex-col gap-5 rounded-2xl border border-line bg-surface p-6">
        <div>
          <label className={label} htmlFor="qiymet">Qiymət (₼)</label>
          <input id="qiymet" name="qiymet" defaultValue={initial.price} className={field} placeholder="boş = «Qiymət üçün yazın»" />
          <p className="mt-1.5 text-[13px] text-ink-faint">Qiymət olmadan məhsul səbətə atıla bilmir.</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={label} htmlFor="stok">Vəziyyət</label>
            <select id="stok" name="stok" defaultValue={initial.stock} className={field}>
              <option value="var">Stokda var</option>
              <option value="sifarisle">Sifarişlə</option>
              <option value="satilib">Satılıb</option>
            </select>
          </div>
          <div>
            <label className={label} htmlFor="stokSayi">Ədəd</label>
            <input id="stokSayi" name="stokSayi" type="number" min={0} defaultValue={initial.stockQty} className={field} />
          </div>
        </div>

        <div className="flex flex-col gap-2.5 text-[14.5px]">
          <label className="flex items-center gap-2.5"><input type="checkbox" name="teksNusxe" defaultChecked={initial.isUnique} className="accent-[#1F6B5B]" /> Tək nüsxə</label>
          <label className="flex items-center gap-2.5"><input type="checkbox" name="hekk" defaultChecked={initial.engraving} className="accent-[#1F6B5B]" /> Həkk mümkündür</label>
          <label className="flex items-center gap-2.5"><input type="checkbox" name="aktiv" defaultChecked={initial.active} className="accent-[#1F6B5B]" /> Saytda göstərilsin</label>
        </div>

        {state?.error && (
          <p className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-[13.5px] text-red-800">{state.error}</p>
        )}

        <button type="submit" disabled={pending} className="rounded-xl bg-emerald px-6 py-3.5 font-bold text-surface disabled:opacity-60">
          {pending ? "Saxlanılır…" : "Yadda saxla"}
        </button>
      </aside>
    </form>
  );
}
