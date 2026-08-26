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
    const anahtar = String(p.anahtar || "").slice(0, 350);
    const imza = String(p.imza || "").slice(0, 120);

    if (!gun) return { error: "Gün bilgisi eksik." };

    const uzunlukMetni = uzunluk === "kisa" ? "45-70 kelime" : uzunluk === "uzun" ? "150-210 kelime" : "90-130 kelime";

    const prompt = `Sen manevi yönü güçlü, hitabet yeteneği yüksek, samimi ve derinlikli bir yazarsın. Görevin; kullanıcının seçtiği dini gün ve belirttiği özel kavramlar doğrultusunda özgün bir tebrik mesajı üretmektir.

Girdi:
- Dini gün / zaman: ${gun}
- Üslup tercihi: ${uslup}
- Hedef uzunluk: ${uzunlukMetni}
- Hitap: ${hitap || "yok"}
- Kullanıcının verdiği kavramlar / hassasiyetler: ${anahtar || "yok"}
- İmza: ${imza || "yok"}

Kurallar ve üslup rehberi:
1. Dil son derece samimi, sıcak, kucaklayıcı ve manevi derinliği yüksek bir Türkçe olmalı. Ne çok resmî ve soğuk ne de aşırı sıradan olmalı; kalbe dokunmalı.
2. ANAHTAR KELİMELERİ LİSTE GİBİ TEKRARLAMA. Önce her kavramın anlamını, türünü ve bağlamını zihninde yorumla. Sonra ilgili kavramları anlamlı temalara dönüştürerek metne doğal biçimde yedir. Kullanıcının yazdığı kelimeleri aynen kullanmak zorunda değilsin.
3. Yer adlarını, insan gruplarını, duyguları, değerleri ve temennileri birbirinden ayır. Örneğin “Gazze, Doğu Türkistan, umut, çocuklar, sabır” girdisini “Gazze, Doğu Türkistan, umut, çocuklar, sabır için dua ediyoruz” gibi mekanik bir listeye dönüştürme. Gazze ve Doğu Türkistan'ı mazlum coğrafyalardaki kardeşlerimizin huzur ve selameti bağlamında; çocukları güven, merhamet ve gelecek bağlamında; umut ve sabrı ise metnin manevi duygusu içinde işle.
4. Gazze, Doğu Türkistan, tüm İslam âlemi, mazlum coğrafyalar gibi hassasiyetler varsa ajitasyon, slogan veya siyasi dil kullanmadan; onurlu, insani, duacı ve kucaklayıcı bir tonla yer ver.
5. Anahtar kelimeler arasında anlam ilişkisi kur. Birbirine ait olanları aynı cümlede doğal biçimde birleştir; alakasız olanları zorla yan yana getirme.
6. Yapı: Akıcı ve özgün bir giriş; günün manasına uygun manevi dilek ve dualar; kullanıcının hassasiyetlerinin anlamlı biçimde işlendiği orta bölüm; zarif ve doğal bir kapanış.
7. Çeşitlilik: Her üretimde kelime seçimini, cümle uzunluklarını, giriş biçimini, dua yapısını ve kapanışı değiştir. Kalıplaşmış “bu mübarek gün vesilesiyle...” tarzı ezber başlangıçlara sürekli yaslanma.
8. Aynı girdi tekrar verilse bile önceki mesaja benzeyen bir metin üretmemeye çalış. Benzersiz, insan eliyle yazılmış hissi versin.
9. Türkçe dilbilgisi kusursuz olsun. “Cuma Günü'ünüz” gibi yanlış ekler veya yapay ifadeler kullanma.
10. Dini içerikte saygılı ve ölçülü ol. Doğruluğundan emin olmadığın ayet veya hadis alıntısı yapma, kaynak uydurma.
11. Dua ağırlıklı üslup seçilmiş olsa bile her mesajın sonuna otomatik olarak “Allah kabul eylesin” veya başka sabit bir cümle ekleme. Kapanışı metnin anlamına göre özgün kur.
12. Hitap verilmişse ilk satırda hitabı yaz ve ardından bir boş satır bırak.
13. İmza verilmişse en sonda bir boş satırdan sonra yalnızca imzayı yaz; “Saygılarımla” gibi otomatik bir ek yapma.
14. Başlık, açıklama, madde işareti, tırnak veya “işte mesajınız” ifadesi kullanma. Yalnızca nihai mesaj metnini döndür.

Şimdi yalnızca nihai mesajı yaz.`;

    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + encodeURIComponent(apiKey);
    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 1.18,
        topP: 0.96,
        maxOutputTokens: 750
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
