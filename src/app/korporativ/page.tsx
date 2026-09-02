import type { Metadata } from "next";
import { waGeneral } from "@/lib/whatsapp";
import { WhatsAppLink } from "@/components/WhatsAppLink";

export const metadata: Metadata = {
  title: "Korporativ hədiyyələr",
  description:
    "Şirkət loqosu ilə həkk olunmuş epoksid hədiyyələr — 10 ədəddən başlayaraq, faktura ilə.",
};

const points = [
  ["Loqo həkki", "Şirkət loqonuz və ya adınız işin üzərinə həkk olunur."],
  ["Korporativ rənglər", "Qatran brendinizin rənglərində tökülür."],
  ["10 ədəddən", "Topdan sifarişlərdə qiymət fərdi razılaşdırılır."],
  ["Faktura", "Hüquqi şəxslərə sənədli təhvil."],
];

export default function KorporativPage() {
  return (
    <div className="mx-auto max-w-[1440px] px-5 py-14 lg:px-14 lg:py-20">
      <div className="max-w-[62ch]">
        <span className="eyebrow text-gold">Korporativ</span>
        <h1 className="mt-4 text-[38px] leading-tight lg:text-[54px]">
          Şirkət hədiyyələri
        </h1>
        <p className="mt-5 leading-relaxed text-ink-muted lg:text-[18px]">
          Bayram, yubiley və ya müştəri hədiyyəsi üçün eyni dizaynda dəst hazırlayırıq. Şahmat və
          domino dəstləri, masaüstü saatlar və xəttatlıq pannoları ən çox seçilənlərdir.
        </p>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {points.map(([t, d]) => (
          <div key={t} className="flex flex-col gap-2.5 rounded-2xl border border-line bg-surface p-6 lg:p-7">
            <span className="text-[16.5px] font-semibold">{t}</span>
            <span className="leading-relaxed text-[14.5px] text-ink-muted">{d}</span>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-3xl border border-line bg-band p-7 lg:p-11">
        <h2 className="text-[26px] lg:text-[32px]">Təklif istəyin</h2>
        <p className="mt-3 max-w-[56ch] leading-relaxed text-ink-muted">
          Neçə ədəd, hansı məhsul və nə vaxta lazım olduğunu yazın — qiymət və müddət üçün cavab
          veririk.
        </p>
        <WhatsAppLink
          href={waGeneral(
            "Korporativ sifariş üçün yazıram.\n\nŞirkət: \nMəhsul: \nSay: \nNə vaxta lazımdır: ",
          )}
          className="mt-6 rounded-full"
        >
          Təklif istəyin
        </WhatsAppLink>
      </div>
    </div>
  );
}
