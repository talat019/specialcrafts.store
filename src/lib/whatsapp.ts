import { site } from "./site";
import { priceLabel, type Product } from "./product-view";

function link(text: string): string {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;
}

/** Ümumi əlaqə linki. */
export function waGeneral(note?: string): string {
  return link(
    ["Salam! specialcrafts.store saytından yazıram.", note ?? "Sualım var:"].join("\n"),
  );
}

/**
 * Məhsul linki — mesaj vəziyyətə görə dəyişir.
 * Stokda olanda ünvan, sifarişlə olanda rəng/ölçü soruşulur.
 */
export function waProduct(p: Product): string {
  const head = "Salam! specialcrafts.store saytından yazıram.";
  const id = `${p.ad} (kod: ${p.kod})`;
  const price = p.qiymet == null ? "" : ` · ${priceLabel(p)}`;

  if (p.stok === "var") {
    return link(
      [head, "STOKDA olan məhsulu almaq istəyirəm:", `${id}${price}`, "", "Çatdırılma ünvanı: "].join("\n"),
    );
  }
  if (p.stok === "satilib") {
    return link(
      [head, "Bu işin bənzərini sifariş etmək istəyirəm:", id, "", "İstədiyim rəng: ", "Nə vaxta lazımdır: "].join("\n"),
    );
  }
  const lines = [head, "SİFARİŞ vermək istəyirəm:", `${id}${price}`, ""];
  if (p.rengSecimleri.length) lines.push(`Rəng (${p.rengSecimleri.join(" / ")}): `);
  if (p.hekkMumkun) lines.push("Həkk mətni: ");
  lines.push("Nə vaxta lazımdır: ");
  return link(lines.join("\n"));
}

export function waButtonLabel(p: Product): string {
  if (p.stok === "var") return "Al — stokda var";
  if (p.stok === "satilib") return "Bənzərini sifariş et";
  return "Sifariş et";
}
