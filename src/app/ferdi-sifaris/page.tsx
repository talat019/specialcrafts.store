import type { Metadata } from "next";
import { site } from "@/lib/site";
import { waGeneral } from "@/lib/whatsapp";
import { WhatsAppLink } from "@/components/WhatsAppLink";

export const metadata: Metadata = {
  title: "Fərdi sifariş",
  description:
    "Rəng, ölçü və həkk mətni sizin seçiminizlə — epoksid əl işi 5–7 iş günü ərzində hazırlanır.",
};

const steps = [
  ["İdeyanı yazın", "Nə istədiyinizi bir-iki cümlə ilə yazın. Referans şəkil də göndərə bilərsiniz."],
  ["Qiymət və müddət", "24 saat ərzində dəqiq qiymət və hazırlıq müddəti deyirik."],
  ["Təsdiq və töküm", "Rəng nümunəsini razılaşdırıb işə başlayırıq."],
  ["5–7 gündə hazır", "Hədiyyə qutusunda paketləyib göndəririk."],
];

const template = `Fərdi sifariş vermək istəyirəm.

Nə hazırlansın: 
Rəng: 
Ölçü: 
Həkk mətni: 
Nə vaxta lazımdır: `;

export default function FerdiSifarisPage() {
  return (
    <div className="mx-auto max-w-[1440px] px-5 py-14 lg:px-14 lg:py-20">
      <div className="max-w-[62ch]">
        <span className="eyebrow text-gold">Fərdi sifariş</span>
        <h1 className="mt-4 text-[38px] leading-tight lg:text-[54px]">
          Ağlınızdakı işi hazırlayaq
        </h1>
        <p className="mt-5 leading-relaxed text-ink-muted lg:text-[18px]">
          Kataloqdakı işlərin rəngini dəyişmək, ölçünü böyütmək və ya tamamilə yeni bir şey
          hazırlatmaq mümkündür. Ad, tarix və loqo həkki də edirik.
        </p>
      </div>

      <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map(([t, d], i) => (
          <li key={t} className="flex flex-col gap-2.5 rounded-2xl border border-line bg-surface p-6 lg:p-7">
            <span className="font-display text-[30px] leading-none text-gold">{i + 1}</span>
            <span className="text-[16.5px] font-semibold">{t}</span>
            <span className="leading-relaxed text-[14.5px] text-ink-muted">{d}</span>
          </li>
        ))}
      </ol>

      <div className="mt-12 flex flex-col gap-6 rounded-3xl border border-line bg-band p-7 lg:flex-row lg:items-center lg:justify-between lg:p-11">
        <div className="max-w-[52ch]">
          <h2 className="text-[26px] lg:text-[32px]">Nə yazacağınızı bilmirsiniz?</h2>
          <p className="mt-3 leading-relaxed text-ink-muted">
            Aşağıdakı düymə WhatsApp-ı hazır şablonla açır — sadəcə boşluqları doldurun. Cavab
            adətən bir neçə saat ərzində gəlir.
          </p>
        </div>
        <WhatsAppLink href={waGeneral(template)} className="shrink-0 rounded-full">
          Sifarişi başlat
        </WhatsAppLink>
      </div>

      <p className="mt-8 text-[14px] text-ink-faint">
        Hazırlıq müddəti: {site.leadTime}. Bayram və toy sezonunda daha erkən yazmağınızı
        tövsiyə edirik.
      </p>
    </div>
  );
}
