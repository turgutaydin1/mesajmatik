function doGet(e) {
  const callback = String((e && e.parameter && e.parameter.callback) || "").replace(/[^a-zA-Z0-9_.$]/g, "");
  const result = generateMessage_(e && e.parameter ? e.parameter : {});
  const json = JSON.stringify(result);
  if (callback) {
    return ContentService.createTextOutput(callback + "(" + json + ");").setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(json).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const body = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    return ContentService.createTextOutput(JSON.stringify(generateMessage_(body))).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ error: "İstek okunamadı.", detail: String(err) })).setMimeType(ContentService.MimeType.JSON);
  }
}

function normalizeTr_(s) {
  return String(s || "").toLocaleLowerCase("tr-TR").replace(/[’']/g, "").replace(/[^a-zçğıöşü0-9 ]/gi, " ").replace(/\s+/g, " ").trim();
}

function visibleInText_(term, text) {
  const t = normalizeTr_(term), x = normalizeTr_(text);
  if (!t) return true;
  if (x.indexOf(t) !== -1) return true;
  const words = t.split(" ").filter(function(w){ return w.length >= 3; });
  if (!words.length) return true;
  return words.every(function(w) {
    const stem = w.length <= 4 ? w : w.slice(0, Math.max(4, w.length - 3));
    return x.indexOf(stem) !== -1;
  });
}

function missingRequirements_(text, gun, anahtar) {
  const missing = [];
  if (!visibleInText_(gun, text)) missing.push("GÜN=" + gun);
  String(anahtar || "").split(/[,;\n]+/).map(function(x){ return x.trim(); }).filter(Boolean).forEach(function(term) {
    if (!visibleInText_(term, text)) missing.push("VURGU=" + term);
  });
  return missing;
}

function extractText_(data) {
  const parts = data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts;
  return Array.isArray(parts) ? parts.map(function(x){ return x.text || ""; }).join("\n").trim() : "";
}

function generateMessage_(p) {
  try {
    const apiKey = PropertiesService.getScriptProperties().getProperty("GEMINI_API_KEY");
    if (!apiKey) return { error: "Mesaj servisine bağlanılamadı.", detail: "GEMINI_API_KEY Script Property bulunamadı." };

    const gun = String(p.gun || "").slice(0, 80);
    const uslup = String(p.uslup || "samimi").slice(0, 40);
    const uzunluk = String(p.uzunluk || "orta").slice(0, 20);
    const hitap = String(p.hitap || "").slice(0, 120);
    const anahtar = String(p.anahtar || "").slice(0, 900);
    const imza = String(p.imza || "").slice(0, 160);
    const onceki = String(p.onceki || "").slice(0, 1200);
    if (!gun) return { error: "Gün bilgisi eksik.", detail: "gun parametresi boş." };

    const uzunlukMetni = uzunluk === "kisa" ? "45-70 kelime" : uzunluk === "uzun" ? "150-210 kelime" : "90-130 kelime";
    const uslupAdi = {samimi:"Samimi",resmi:"Resmî",kurumsal:"Kurumsal",dua:"Dua Ağırlıklı",kaynakli:"Ayet / Hadis Ağırlıklı"}[uslup] || "Samimi";
    const uslupTalimatlari = {
      samimi:"Metni kişiden kişiye yazılmış gibi kur. İçten, sıcak ve doğal ol; kurumsal veya protokol dili kullanma.",
      resmi:"Metni baştan resmî kur. Saygılı, mesafeli, dengeli ve profesyonel hitabet kullan. Samimi metnin birkaç kelimesini değiştirmiş gibi görünmesin.",
      kurumsal:"Metni baştan kurum adına tasarla. Temsil dili, ortak değerler ve çoğul bakış kullan. Bireysel bir mesajı sadece çoğul eklerle kurumsallaştırma.",
      dua:"Metnin ana omurgası dua olsun. Dua kiplerini ve fiilleri çeşitlendir; aynı kalıbı tekrar etme.",
      kaynakli:"Doğruluğundan yüksek derecede emin olduğun kısa bir ayet meali veya sahih hadis kullan ve kaynağını belirt. Emin olmadığın alıntıyı kullanma."
    }[uslup] || "";

    const basePrompt = `Sen manevi değerlerine bağlı, temiz ve doğal Türkçe kullanan özenli bir yazarsın. Yalnızca nihai mesaj metnini üret; başlık, açıklama veya analiz yazma.

SEÇİMLER:
- Gün: ${gun}
- Üslup: ${uslupAdi}
- Uzunluk: ${uzunlukMetni}
- Hitap: ${hitap || "yok"}
- Özel vurgu / kullanıcı girdisi: ${anahtar || "yok"}
- İmza: ${imza || "yok"}

ÜSLUP KURALI:
${uslupTalimatlari}

ZORUNLU KURALLAR:
1. Seçilen gün/zamanın adı olan “${gun}” nihai mesajda açık ve tanınabilir biçimde geçmek ZORUNDADIR.
2. Özel vurgu alanı boş değilse kullanıcının yazdığı HER ayrı ifade nihai mesajda tanınabilir biçimde yer almak ZORUNDADIR. Hiçbirini atlama.
3. Her ifadeyi anlamına göre bağlam içinde yorumla; önceden tanımlanmış kelime listesi kullanma.
4. Türkçe doğal akış için çekim ekleri kullanılabilir; ancak kullanıcının verdiği ifadenin kökü ve anlamı açıkça seçilebilmelidir.
5. Farklı anlam türlerini sırf virgülle yan yana yazıldı diye aynı dilbilgisel nesne gibi birleştirme.
6. Kullanıcı girdisini tırnak içine alıp “bu konudaki hassasiyetiniz”, “özel olarak belirttiğiniz” veya “bu vurgu” gibi mekanik cümlelerle geçiştirme.
7. Türkçe ekleri, zamirleri, özne-yüklem ve tekil-çoğul uyumunu doğru kur.
8. Samimi, Resmî ve Kurumsal metinlerin yapı, özne, vurgu sırası ve kapanışı birbirinden belirgin biçimde farklı olsun.
9. Aynı dilek fiillerini ve kalıpları art arda tekrar etme.
10. Hitap verilmişse ilk satırda yaz ve bir boş satır bırak. İmza verilmişse en sonda bir boş satırdan sonra yalnızca imzayı yaz.
11. Dinî, tarihî, kurumsal veya toplumsal bilgi uydurma.
12. Mesajı göndermeden önce seçilen günün ve HER özel vurgunun görünür olduğunu sessizce kontrol et; eksik varsa düzelt.

${onceki ? `ÖNCEKİ MESAJ:\n---\n${onceki}\n---\nYeni mesajı önceki mesajdan belirgin biçimde farklı kur. Aynı giriş, cümle ritmi ve kapanışı kullanma.` : ""}

Yalnızca nihai mesajı yaz.`;

    const models = ["gemini-3.6-flash", "gemini-2.5-flash"];
    let lastCode = 0, lastDetail = "Bilinmeyen servis hatası.", lastModel = "";

    for (let mi = 0; mi < models.length; mi++) {
      const model = models[mi];
      let correction = "";

      for (let attempt = 1; attempt <= 3; attempt++) {
        const payload = {
          contents: [{ parts: [{ text: basePrompt + correction }] }],
          generationConfig: { temperature: 1.05, topP: 0.92, maxOutputTokens: 900 }
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
        lastCode = code; lastModel = model;
        let data = {};
        try { data = JSON.parse(response.getContentText() || "{}"); }
        catch (parseErr) { lastDetail = "Servis yanıtı okunamadı: " + String(parseErr); }

        if (code >= 200 && code < 300) {
          const text = extractText_(data);
          if (text) {
            const missing = missingRequirements_(text, gun, anahtar);
            if (!missing.length) return { text:text, engine:"ai", model:model, attempt:attempt };
            lastDetail = "Eksik zorunlu öğe: " + missing.join(", ");
            correction = `\n\nÖNCEKİ DENEME ZORUNLU ÖĞELERİ ATLADI. Şunların tamamı yeni metinde açıkça ve doğal biçimde bulunmalıdır: ${missing.join(" | ")}. Önceki metni kopyalama; mesajı yeniden yaz.`;
            if (attempt < 3) Utilities.sleep(300);
            continue;
          }
          const finishReason = data && data.candidates && data.candidates[0] && data.candidates[0].finishReason;
          const blockReason = data && data.promptFeedback && data.promptFeedback.blockReason;
          lastDetail = "Boş yanıt" + (finishReason ? "; finishReason=" + finishReason : "") + (blockReason ? "; blockReason=" + blockReason : "");
          if (attempt < 3) Utilities.sleep(450 * attempt);
          continue;
        }

        lastDetail = (data && data.error && data.error.message) ? data.error.message : response.getContentText().slice(0, 500);
        if ((code === 429 || code === 500 || code === 502 || code === 503 || code === 504) && attempt < 3) {
          Utilities.sleep(650 * Math.pow(2, attempt - 1));
          continue;
        }
        break;
      }
    }

    return { error:"Mesaj oluşturulamadı.", detail:"model=" + lastModel + "; HTTP " + lastCode + " - " + lastDetail };
  } catch (err) {
    return { error:"Sunucu hatası.", detail:String(err) };
  }
}
