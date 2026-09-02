import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Çatdırılma və qaydalar",
  description: "Çatdırılma, ödəniş, epoksid işlərə qulluq və dəyişdirmə şərtləri.",
};

const sections: [string, string[]][] = [
  [
    "Çatdırılma",
    [
      `Stokda olan işlər sifarişdən sonra ${site.stockDelivery} ərzində göndərilir.`,
      `Sifarişlə hazırlananlar ${site.leadTime} ərzində hazır olur, sonra göndərilir.`,
      `${site.city}daxili çatdırılma kuryerlə olur. Rayonlara göndəriş üçün WhatsApp-da yazın.`,
    ],
  ],
  [
    "Ödəniş",
    [
      "Ödəniş üsulunu sifariş təsdiqlənəndə WhatsApp-da razılaşırıq.",
      "Fərdi sifarişlərdə işə başlamaq üçün beh alınır.",
    ],
  ],
  [
    "Epoksid işlərə qulluq",
    [
      "Birbaşa günəş şüası altında uzun müddət saxlamayın — qatran vaxtla saralar.",
      "İsti su və aşındırıcı təmizləyicilərdən çəkinin; yumşaq nəm parça kifayətdir.",
      "Səth cızığa həssasdır — sərt əşya ilə sürtməyin.",
      "Sobaya, radiatora və ya isti səthə yaxın qoymayın.",
    ],
  ],
  [
    "Dəyişdirmə və qaytarma",
    [
      "Nəqliyyat zamanı zədə olarsa, açılış videosu ilə birlikdə 24 saat ərzində yazın — dəyişdiririk.",
      "Hər iş əl ilə tökülür: rəng axını və damarlar şəkildəkinin eynisi olmur, bu qüsur sayılmır.",
      "Fərdi hazırlanmış və həkk olunmuş işlər geri qaytarılmır.",
    ],
  ],
];

export default function QaydalarPage() {
  return (
    <div className="mx-auto max-w-[1440px] px-5 py-14 lg:px-14 lg:py-20">
      <div className="max-w-[68ch]">
        <h1 className="text-[36px] leading-tight lg:text-[48px]">Çatdırılma və qaydalar</h1>
        <div className="mt-10 flex flex-col gap-10">
          {sections.map(([t, items]) => (
            <section key={t}>
              <h2 className="text-[22px] lg:text-[26px]">{t}</h2>
              <ul className="mt-4 flex flex-col gap-2.5">
                {items.map((i) => (
                  <li key={i} className="flex gap-3 leading-relaxed text-ink-muted">
                    <span className="mt-2.5 block size-1.5 shrink-0 rounded-full bg-gold" aria-hidden="true" />
                    {i}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
