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

function generateMessage_(p) {
  try {
    const apiKey = PropertiesService.getScriptProperties().getProperty("GEMINI_API_KEY");
    if (!apiKey) {
      return { error: "Gemini bağlantısı kurulamadı.", detail: "GEMINI_API_KEY Script Property bulunamadı." };
    }

    const gun = String(p.gun || "").slice(0, 80);
    const uslup = String(p.uslup || "samimi").slice(0, 40);
    const uzunluk = String(p.uzunluk || "orta").slice(0, 20);
    const hitap = String(p.hitap || "").slice(0, 120);
    const anahtar = String(p.anahtar || "").slice(0, 900);
    const imza = String(p.imza || "").slice(0, 160);
    const onceki = String(p.onceki || "").slice(0, 1200);

    if (!gun) return { error: "Gün bilgisi eksik.", detail: "gun parametresi boş." };

    const uzunlukMetni = uzunluk === "kisa" ? "45-70 kelime" : uzunluk === "uzun" ? "150-210 kelime" : "90-130 kelime";
    const uslupAdi = {
      samimi: "Samimi",
      resmi: "Resmî",
      kurumsal: "Kurumsal",
      dua: "Dua Ağırlıklı",
      kaynakli: "Ayet / Hadis Ağırlıklı"
    }[uslup] || "Samimi";

    const uslupTalimatlari = {
      samimi: "Metni kişiden kişiye yazılmış gibi kur. İçten, sıcak ve doğal ol; kurumsal veya protokol dili kullanma.",
      resmi: "Metni baştan resmî kur. Saygılı, mesafeli, dengeli ve profesyonel hitabet kullan. Samimi metnin birkaç kelimesini değiştirmiş gibi görünmesin.",
      kurumsal: "Metni baştan kurum adına tasarla. Temsil dili, ortak değerler ve çoğul bakış kullan. Bireysel bir mesajı sadece çoğul eklerle kurumsallaştırma.",
      dua: "Metnin ana omurgası dua olsun. Dua kiplerini ve fiilleri çeşitlendir; aynı kalıbı tekrar etme.",
      kaynakli: "Doğruluğundan yüksek derecede emin olduğun kısa bir ayet meali veya sahih hadis kullan ve kaynağını belirt. Emin olmadığın alıntıyı kullanma."
    }[uslup] || "";

    const prompt = `Sen manevi değerlerine bağlı, temiz ve doğal Türkçe kullanan özenli bir yazarsın. Yalnızca nihai mesaj metnini üret; başlık, açıklama veya analiz yazma.

SEÇİMLER:
- Gün: ${gun}
- Üslup: ${uslupAdi}
- Uzunluk: ${uzunlukMetni}
- Hitap: ${hitap || "yok"}
- Özel vurgu / kullanıcı girdisi: ${anahtar || "yok"}
- İmza: ${imza || "yok"}

ÜSLUP KURALI:
${uslupTalimatlari}

ZORUNLU KALİTE KURALLARI:
1. Kullanıcının özel vurgu alanındaki HER ifadeyi önce bağlam içinde sessizce anlamlandır. Önceden tanımlanmış kelime listelerine dayanma. İfade kişi, kurum, yer, topluluk, millet, unvan, statü, nesne, olay, duygu, değer, soyut kavram veya bambaşka bir şey olabilir.
2. Farklı anlam türlerini sırf virgülle yan yana yazıldı diye aynı dilbilgisel nesne gibi birleştirme.
3. Türkçe ekleri, zamirleri, özne-yüklem ve tekil-çoğul uyumunu kusursuz kur. Bir zamirin neye döndüğü belirsizse o zamiri kullanma.
4. Kullanıcının yazdığı özel ad, kurum, kişi, unvan veya resmî adlandırmanın doğru biçiminden emin değilsen onu başka bir ada dönüştürme. Yalnızca açık bir yazım düzeltmesinden eminsen düzelt.
5. Kullanıcı girdisini mekanik biçimde tırnak içine alıp “bu konudaki hassasiyetiniz” gibi hazır cümlelere yerleştirme. Girdinin gerçek anlamını mesajın doğal akışına yedir.
6. “diliyorum”, “dilerim”, “temenni ederim”, “ümit ederim”, “vesile olsun”, “huzur ve bereket” gibi kalıpları gereksiz tekrar etme.
7. Aynı girdilerde Samimi, Resmî ve Kurumsal mesajlar yalnızca kelime değişiklikleriyle birbirine benzemesin. Giriş, özne, cümle yapısı, vurgu sırası ve kapanış da değişsin.
8. Cümleler birbirine anlam bakımından bağlı olsun; hazır parçalar yapıştırılmış gibi görünmesin.
9. Hitap verilmişse ilk satırda yaz ve bir boş satır bırak. İmza verilmişse en sonda bir boş satırdan sonra yalnızca imzayı yaz.
10. “Allah kabul eylesin”, “Saygılarımla”, “Sevgilerimle” gibi sabit kapanışları otomatik ekleme.
11. Dinî, tarihî, kurumsal veya toplumsal bilgi uydurma.
12. Mesajı göndermeden önce sessizce dilbilgisi, anlam, tekrar ve seçilen üslup açısından kontrol edip hataları düzelt.

${onceki ? `ÖNCEKİ MESAJ:\n---\n${onceki}\n---\nYeni mesajı bunun girişinden, cümle ritminden, vurgu sırasından ve kapanışından belirgin biçimde farklı kur.` : ""}

Yalnızca nihai mesajı yaz.`;

    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";
    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 1.05,
        topP: 0.92,
        maxOutputTokens: 900
      }
    };

    let lastCode = 0;
    let lastDetail = "Bilinmeyen Gemini API hatası.";

    for (let attempt = 1; attempt <= 3; attempt++) {
      const response = UrlFetchApp.fetch(url, {
        method: "post",
        contentType: "application/json",
        headers: {
          "x-goog-api-key": apiKey,
          "x-goog-api-client": "mesajmatik-appsscript/1.0"
        },
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
        const parts = data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts;
        const text = Array.isArray(parts) ? parts.map(function(x){ return x.text || ""; }).join("\n").trim() : "";
        if (text) return { text: text, engine: "ai", attempt: attempt };

        const finishReason = data && data.candidates && data.candidates[0] && data.candidates[0].finishReason;
        const blockReason = data && data.promptFeedback && data.promptFeedback.blockReason;
        lastDetail = "Gemini boş yanıt verdi" + (finishReason ? "; finishReason=" + finishReason : "") + (blockReason ? "; blockReason=" + blockReason : "") + ".";
        if (attempt < 3) Utilities.sleep(700 * attempt);
        continue;
      }

      lastDetail = (data && data.error && data.error.message) ? data.error.message : response.getContentText().slice(0, 500);

      if ((code === 429 || code === 500 || code === 502 || code === 503 || code === 504) && attempt < 3) {
        Utilities.sleep(800 * Math.pow(2, attempt - 1));
        continue;
      }

      break;
    }

    return {
      error: "Gemini API hatası [" + lastCode + "]",
      detail: lastDetail
    };

  } catch (err) {
    return {
      error: "Sunucu hatası.",
      detail: String(err)
    };
  }
}
