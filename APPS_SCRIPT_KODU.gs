function doGet(e) {
  const p = e && e.parameter ? e.parameter : {};
  const prefix = String(p.prefix || "").replace(/[^a-zA-Z0-9_.$]/g, "");

  if (String(p.ping || "") === "1") {
    const payload = {
      status: "ok",
      service: "Mesajmatik",
      geminiKeyConfigured: !!PropertiesService.getScriptProperties().getProperty("GEMINI_API_KEY"),
      model: "gemini-3.6-flash",
      transport: "jsonp"
    };
    return jsonpOrJson_(prefix, payload);
  }

  if (!p.gun && !prefix) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "ok",
      service: "Mesajmatik",
      geminiKeyConfigured: !!PropertiesService.getScriptProperties().getProperty("GEMINI_API_KEY"),
      model: "gemini-3.6-flash",
      transport: "jsonp"
    })).setMimeType(ContentService.MimeType.JSON);
  }

  return jsonpOrJson_(prefix, generateMessage_(p));
}

function jsonpOrJson_(prefix, payload) {
  const json = JSON.stringify(payload || {});
  if (prefix) {
    return ContentService
      .createTextOutput(prefix + "(" + json + ");")
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService
    .createTextOutput(json)
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const body = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    return ContentService
      .createTextOutput(JSON.stringify(generateMessage_(body)))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({
        error: "İstek okunamadı.",
        detail: String(err)
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function normalizeTr_(s) {
  return String(s || "")
    .toLocaleLowerCase("tr-TR")
    .replace(/[’']/g, "")
    .replace(/[^a-zçğıöşü0-9 ]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function visibleInText_(term, text) {
  const t = normalizeTr_(term);
  const x = normalizeTr_(text);
  if (!t) return true;
  if (x.indexOf(t) !== -1) return true;
  const words = t.split(" ").filter(function(w) { return w.length >= 3; });
  if (!words.length) return true;
  return words.every(function(w) {
    const stem = w.length <= 4 ? w : w.slice(0, Math.max(4, w.length - 3));
    return x.indexOf(stem) !== -1;
  });
}

function missingRequirements_(text, gun, anahtar) {
  const missing = [];
  if (!visibleInText_(gun, text)) missing.push("GÜN=" + gun);
  String(anahtar || "")
    .split(/[,;\n]+/)
    .map(function(x) { return x.trim(); })
    .filter(Boolean)
    .forEach(function(term) {
      if (!visibleInText_(term, text)) missing.push("VURGU=" + term);
    });
  return missing;
}

function similarity_(a, b) {
  if (!a || !b) return 0;
  function wordSet_(s) {
    const out = {};
    normalizeTr_(s).split(" ").forEach(function(w) {
      if (w.length > 3) out[w] = true;
    });
    return out;
  }
  const A = wordSet_(a), B = wordSet_(b);
  const ak = Object.keys(A), bk = Object.keys(B);
  if (!ak.length || !bk.length) return 0;
  let hit = 0;
  ak.forEach(function(w) { if (B[w]) hit++; });
  return hit / Math.max(1, Math.min(ak.length, bk.length));
}

function extractText_(data) {
  const parts = data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts;
  return Array.isArray(parts)
    ? parts.map(function(x) { return x.text || ""; }).join("\n").trim()
    : "";
}

function generateMessage_(p) {
  try {
    const apiKey = PropertiesService.getScriptProperties().getProperty("GEMINI_API_KEY");
    if (!apiKey) {
      return { error: "Yapay zekâ mesaj üretim hatası.", detail: "GEMINI_API_KEY Script Property bulunamadı." };
    }

    const gun = String(p.gun || "").slice(0, 80);
    const uslup = String(p.uslup || "samimi").slice(0, 40);
    const uzunluk = String(p.uzunluk || "orta").slice(0, 20);
    const hitap = String(p.hitap || "").slice(0, 120);
    const anahtar = String(p.anahtar || "").slice(0, 900);
    const imza = String(p.imza || "").slice(0, 160);
    const onceki = String(p.onceki || "").slice(0, 1600);
    const seed = String(p.seed || new Date().getTime()).slice(0, 80);

    if (!gun) return { error: "Yapay zekâ mesaj üretim hatası.", detail: "Gün bilgisi eksik." };

    const uzunlukMetni = uzunluk === "kisa" ? "45-70 kelime" : uzunluk === "uzun" ? "150-210 kelime" : "90-130 kelime";
    const uslupAdi = {
      samimi: "Samimi",
      resmi: "Resmî",
      kurumsal: "Kurumsal",
      dua: "Dua Ağırlıklı",
      kaynakli: "Ayet / Hadis Ağırlıklı"
    }[uslup] || "Samimi";

    const uslupTalimatlari = {
      samimi: "İçten, sıcak ve kişiden kişiye doğal bir anlatım kullan.",
      resmi: "Saygılı, ölçülü, mesafeli ve resmî bir anlatım kullan.",
      kurumsal: "Bir kurum adına yaz; çoğul anlatım, ortak değerler ve temsil dili kullan.",
      dua: "Mesajın ana omurgası dua olsun; dua fiillerini tekrar etme.",
      kaynakli: "Yalnız doğruluğundan yüksek derecede emin olduğun kısa ayet meali veya sahih hadis kullan ve kaynağını belirt."
    }[uslup] || "";

    const prompt = `Manevi ve özel günler için temiz, doğal ve düzgün Türkçe kullanan özenli bir yazarsın.
Yalnızca nihai mesaj metnini yaz. Başlık, açıklama, analiz veya not yazma.

Bu istek yeni bir üretimdir. İstek kimliği: ${seed}
Aynı bilgiler daha önce kullanılmış olsa bile belirgin biçimde yeni bir mesaj yaz.

Gün: ${gun}
Üslup: ${uslupAdi}
Uzunluk: ${uzunlukMetni}
Hitap: ${hitap || "yok"}
Özel vurgu: ${anahtar || "yok"}
İmza: ${imza || "yok"}

Üslup talimatı: ${uslupTalimatlari}

Kurallar:
- “${gun}” mesajda açıkça ve doğal biçimde yer alsın.
- Özel vurgu alanı doluysa virgül, noktalı virgül veya satır sonuyla ayrılan HER ifade mesajda tanınabilir biçimde yer alsın.
- Özel vurguları hazır kelime sözlüğüyle sınıflandırma; her birini bağlama göre doğal biçimde yorumla.
- Kullanıcı girdisini “özel olarak belirttiğiniz”, “hassasiyetiniz”, “bu vurgu” gibi mekanik kalıplarla kullanma.
- Farklı anlam türlerini aynı dilbilgisel kalıba zorla sokma.
- Türkçe ek, özne-yüklem, tekil-çoğul ve zamir uyumunu doğru kur.
- Aynı dilek fiillerini art arda tekrar etme.
- Samimi, Resmî ve Kurumsal metinleri yalnız birkaç kelime değiştirerek üretme; yapılarını gerçekten farklı kur.
- Hitap varsa ilk satırda yaz ve sonra bir boş satır bırak.
- İmza varsa en sonda bir boş satırdan sonra yalnızca imzayı yaz.
- Dinî, tarihî, kurumsal veya toplumsal bilgi uydurma.
${onceki ? `- Aşağıdaki önceki mesajın kopyasını veya yakın varyasyonunu üretme. Giriş, ritim, vurgu sırası ve kapanışı belirgin biçimde değiştir.\n\nÖNCEKİ MESAJ:\n---\n${onceki}\n---` : ""}

Yalnızca nihai mesajı yaz.`;

    const model = "gemini-3.6-flash";
    let lastDetail = "Bilinmeyen servis hatası.";
    let lastCode = 0;
    let correction = "";

    for (let attempt = 1; attempt <= 3; attempt++) {
      const payload = {
        contents: [{ role: "user", parts: [{ text: prompt + correction }] }],
        generationConfig: {
          maxOutputTokens: 1000
        }
      };

      const url = "https://generativelanguage.googleapis.com/v1beta/models/" + model + ":generateContent";
      const response = UrlFetchApp.fetch(url, {
        method: "post",
        contentType: "application/json",
        headers: { "x-goog-api-key": apiKey },
        payload: JSON.stringify(payload),
        muteHttpExceptions: true
      });

      const code = response.getResponseCode();
      lastCode = code;
      let data = {};
      try {
        data = JSON.parse(response.getContentText() || "{}");
      } catch (parseErr) {
        lastDetail = "Gemini yanıtı JSON olarak okunamadı: " + String(parseErr);
      }

      if (code >= 200 && code < 300) {
        const text = extractText_(data);
        if (text && text.length >= 35) {
          const missing = missingRequirements_(text, gun, anahtar);
          const sim = onceki ? similarity_(onceki, text) : 0;
          if (!missing.length && sim < 0.78) {
            return { text: text, engine: "ai", model: model, attempt: attempt, similarity: sim };
          }
          const problems = [];
          if (missing.length) problems.push("Eksik zorunlu öğe: " + missing.join(", "));
          if (sim >= 0.78) problems.push("Önceki mesaja fazla benzer: " + sim.toFixed(2));
          lastDetail = problems.join(" | ") || "Kalite kontrolünden geçmedi.";
          correction = "\n\nÖNCEKİ DENEME KABUL EDİLMEDİ: " + lastDetail + ". Mesajı baştan ve belirgin biçimde farklı yaz.";
          continue;
        }

        const finishReason = data && data.candidates && data.candidates[0] && data.candidates[0].finishReason;
        const blockReason = data && data.promptFeedback && data.promptFeedback.blockReason;
        lastDetail = "Boş veya yetersiz Gemini yanıtı" +
          (finishReason ? "; finishReason=" + finishReason : "") +
          (blockReason ? "; blockReason=" + blockReason : "");
        continue;
      }

      lastDetail = data && data.error && data.error.message
        ? data.error.message
        : response.getContentText().slice(0, 800);

      if ((code === 429 || code === 500 || code === 502 || code === 503 || code === 504) && attempt < 3) {
        Utilities.sleep(700 * attempt);
        continue;
      }
      break;
    }

    return {
      error: "Yapay zekâ mesaj üretim hatası.",
      detail: "model=" + model + "; HTTP " + lastCode + " - " + lastDetail
    };
  } catch (err) {
    return { error: "Yapay zekâ mesaj üretim hatası.", detail: String(err) };
  }
}
