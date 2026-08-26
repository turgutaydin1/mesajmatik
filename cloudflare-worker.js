// Mesajmatik - Cloudflare Worker
// OPENAI_API_KEY gizli değişken olarak Cloudflare Worker'a eklenmelidir.

const ALLOWED_ORIGINS = new Set([
  "https://turgutaydin1.github.io",
  "http://localhost:5500",
  "http://127.0.0.1:5500"
]);

function corsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.has(origin) ? origin : "https://turgutaydin1.github.io";
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin",
    "Content-Type": "application/json; charset=utf-8"
  };
}

function json(data, status, origin) {
  return new Response(JSON.stringify(data), {
    status,
    headers: corsHeaders(origin)
  });
}

function extractText(data) {
  if (typeof data?.output_text === "string" && data.output_text.trim()) {
    return data.output_text.trim();
  }
  const parts = [];
  for (const item of data?.output || []) {
    if (item?.type === "message") {
      for (const c of item.content || []) {
        if ((c?.type === "output_text" || c?.type === "text") && typeof c.text === "string") {
          parts.push(c.text);
        }
      }
    }
  }
  return parts.join("\n").trim();
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    if (request.method !== "POST") {
      return json({ error: "Yalnızca POST isteği desteklenir." }, 405, origin);
    }

    if (!ALLOWED_ORIGINS.has(origin)) {
      return json({ error: "Bu kaynaktan erişime izin verilmiyor." }, 403, origin);
    }

    if (!env.OPENAI_API_KEY) {
      return json({ error: "Sunucuda OPENAI_API_KEY tanımlı değil." }, 500, origin);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: "Geçersiz JSON." }, 400, origin);
    }

    const gun = String(body.gun || "").slice(0, 80);
    const uslup = String(body.uslup || "samimi").slice(0, 40);
    const uzunluk = String(body.uzunluk || "orta").slice(0, 20);
    const hitap = String(body.hitap || "").slice(0, 100);
    const anahtar = String(body.anahtar || "").slice(0, 300);
    const imza = String(body.imza || "").slice(0, 120);

    if (!gun) {
      return json({ error: "Özel gün/zaman bilgisi eksik." }, 400, origin);
    }

    const uzunlukTalebi = uzunluk === "kisa"
      ? "45-75 kelime"
      : uzunluk === "uzun"
        ? "150-220 kelime"
        : "90-135 kelime";

    const prompt = `Türkçe, doğal, zarif ve manevi bir kutlama/dua mesajı yaz.

Özel gün/zaman: ${gun}
Üslup: ${uslup}
Uzunluk: ${uzunlukTalebi}
Hitap: ${hitap || "yok"}
Özel vurgu/anahtar kelimeler: ${anahtar || "yok"}
İmza: ${imza || "yok"}

Kurallar:
- Mesaj klişe ve yapay görünmesin; akıcı, sıcak ve özgün olsun.
- Türkçe dilbilgisi ve ekleri kusursuz olsun. "Cuma Günü'ünüz" gibi hatalar yapma.
- Dini ifadelerde saygılı ve ölçülü ol; doğruluğundan emin olmadığın ayet/hadis alıntısı yapma.
- Gazze, Doğu Türkistan veya mazlumlar geçiyorsa insani, dua odaklı ve kışkırtıcı olmayan bir dil kullan.
- Hitap verilmişse ilk satırda hitabı yaz, sonra bir boş satır bırak.
- İmza verilmişse en sonda bir boş satırdan sonra yalnızca imzayı yaz; "Saygılarımla" ekleme.
- Başlık, açıklama, madde işareti veya tırnak kullanma. Yalnızca son mesaj metnini döndür.`;

    try {
      const r = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-5.4-mini",
          input: prompt,
          max_output_tokens: 500
        })
      });

      const data = await r.json();
      if (!r.ok) {
        return json({ error: "Yapay zekâ servisi yanıt vermedi.", detail: data?.error?.message || "Bilinmeyen hata" }, 502, origin);
      }

      const text = extractText(data);
      if (!text) {
        return json({ error: "Yapay zekâ boş yanıt döndürdü." }, 502, origin);
      }

      return json({ text }, 200, origin);
    } catch (e) {
      return json({ error: "Yapay zekâ servisine ulaşılamadı.", detail: String(e?.message || e) }, 502, origin);
    }
  }
};