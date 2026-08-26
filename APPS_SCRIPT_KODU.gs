function doGet(e) {
  const callback = String((e && e.parameter && e.parameter.callback) || "").replace(/[^a-zA-Z0-9_.$]/g, "");
  const result = generateMessage_(e && e.parameter ? e.parameter : {});
  const json = JSON.stringify(result);

  if (callback) {
    return ContentService
      .createTextOutput(callback + "(" + json + ");")
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
      .createTextOutput(JSON.stringify({ error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function generateMessage_(p) {
  try {
    const apiKey = PropertiesService.getScriptProperties().getProperty("GEMINI_API_KEY");
    if (!apiKey) return { error: "API anahtarı tanımlı değil." };

    const gun = String(p.gun || "").slice(0, 80);
    const uslup = String(p.uslup || "samimi").slice(0, 30);
    const uzunluk = String(p.uzunluk || "orta").slice(0, 20);
    const hitap = String(p.hitap || "").slice(0, 100);
    const anahtar = String(p.anahtar || "").slice(0, 300);
    const imza = String(p.imza || "").slice(0, 120);

    if (!gun) return { error: "Gün bilgisi eksik." };

    const uzunlukMetni = uzunluk === "kisa" ? "45-70 kelime" : uzunluk === "uzun" ? "150-210 kelime" : "90-130 kelime";

    const prompt = `Sen manevi yönü güçlü, hitabet yeteneği yüksek, samimi ve derinlikli bir yazarsın. Görevin; kullanıcının seçtiği dini gün ve belirttiği özel anahtar kelimeler/imza doğrultusunda özgün bir tebrik mesajı üretmektir.

Girdi:
- Dini gün / zaman: ${gun}
- Üslup tercihi: ${uslup}
- Hedef uzunluk: ${uzunlukMetni}
- Hitap: ${hitap || "yok"}
- Özel anahtar kelimeler / hassasiyetler: ${anahtar || "yok"}
- İmza: ${imza || "yok"}

Kurallar ve üslup rehberi:
1. Hitap ve Ton: Dil son derece samimi, sıcak, kucaklayıcı ve manevi derinliği yüksek bir Türkçe olmalı. Ne çok resmî ve soğuk ne de aşırı sıradan olmalı; kalbe dokunmalı.
2. Coğrafi ve Toplumsal Vurgular: Kullanıcı özellikle Gazze, Doğu Türkistan, tüm İslam âlemi veya mazlum coğrafyalar gibi hassasiyetler belirttiğinde bunu ajitasyon yapmadan, onurlu, duacı ve kucaklayıcı bir üslupla mesaja mutlaka entegre et.
3. Yapı: Akıcı bir giriş, günün manasına uygun dualar, anahtar kelimelerin doğal şekilde harmanlandığı orta bölüm ve istenmişse şık bir imza/kapanış kullan.
4. Çeşitlilik: Her üretimde kelimeleri, cümle yapılarını, açılışı ve kapanışı taze tut. Kalıplaşmış, ezbere metinlerden kaçın; mesaj benzersiz hissettirsin.
5. Türkçe dilbilgisi kusursuz olsun. Cuma Günü'ünüz gibi hatalı ekler kullanma.
6. Emin olmadığın ayet veya hadis alıntısı yapma; kaynak uydurma.
7. Dua ağırlıklı üslup seçilmiş olsa bile her mesajın sonuna otomatik olarak “Allah kabul eylesin” ekleme. Kapanışı mesajın anlamına göre doğal biçimde oluştur.
8. Hitap verilmişse ilk satırda hitabı yaz ve ardından bir boş satır bırak.
9. İmza verilmişse en sonda bir boş satırdan sonra yalnızca imzayı yaz; “Saygılarımla” gibi otomatik ek yapma.
10. Başlık, açıklama, madde işareti veya tırnak kullanma. Yalnızca son mesaj metnini döndür.
11. Önceki üretimlerden bağımsız ve taze bir metin üret. Aynı giriş-kapanış kalıbını tekrar etme.

Şimdi yalnızca nihai mesajı yaz.`;

    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + encodeURIComponent(apiKey);
    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 1.15,
        topP: 0.95,
        maxOutputTokens: 700
      }
    };

    const response = UrlFetchApp.fetch(url, {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    });

    const code = response.getResponseCode();
    const data = JSON.parse(response.getContentText() || "{}");

    if (code < 200 || code >= 300) {
      return { error: "Üretim servisi yanıt vermedi.", detail: (data.error && data.error.message) || String(code) };
    }

    const parts = data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts;
    const text = Array.isArray(parts) ? parts.map(function(x){ return x.text || ""; }).join("\n").trim() : "";

    if (!text) return { error: "Boş yanıt alındı." };
    return { text: text };

  } catch (err) {
    return { error: "Sunucu hatası.", detail: String(err) };
  }
}