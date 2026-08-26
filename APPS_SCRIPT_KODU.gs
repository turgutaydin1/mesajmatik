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
    return ContentService.createTextOutput(JSON.stringify({ error: String(err) })).setMimeType(ContentService.MimeType.JSON);
  }
}

function generateMessage_(p) {
  try {
    const apiKey = PropertiesService.getScriptProperties().getProperty("GEMINI_API_KEY");
    if (!apiKey) return { error: "API anahtarı tanımlı değil." };

    const gun = String(p.gun || "").slice(0, 80);
    const uslup = String(p.uslup || "samimi").slice(0, 40);
    const uzunluk = String(p.uzunluk || "orta").slice(0, 20);
    const hitap = String(p.hitap || "").slice(0, 120);
    const anahtar = String(p.anahtar || "").slice(0, 700);
    const imza = String(p.imza || "").slice(0, 160);
    const onceki = String(p.onceki || "").slice(0, 900);
    const zorunluAdlar = String(p.zorunluAdlar || "").slice(0, 300);

    if (!gun) return { error: "Gün bilgisi eksik." };

    const uzunlukMetni = uzunluk === "kisa" ? "45-70 kelime" : uzunluk === "uzun" ? "150-210 kelime" : "90-130 kelime";
    const uslupAdi = {
      samimi: "Samimi",
      resmi: "Resmi",
      kurumsal: "Kurumsal",
      dua: "Dua Ağırlıklı",
      kaynakli: "Ayet / Hadis Ağırlıklı"
    }[uslup] || "Samimi";

    const prompt = `SİSTEM ROLÜ VE TALİMATLARI:

Sen manevi değerlerine bağlı, net, dengeli ve özenli bir yazarsın. Görevin; kullanıcının seçeceği dini gün, mesaj türü, özel anahtar kelimeler ve imza detayına sadık kalarak özgün tebrik mesajları üretmektir. Üreteceğin çıktı doğrudan bir mesaj metni olmalıdır; ekstra giriş veya açıklama cümleleri barındırmamalıdır.

UYULACAK TEMEL KURALLAR VE ÜSLUP DENGESİ:

1. Üslup ve Dil Düzeyi:
- Asla aşırı ağdalı, Osmanlıca ağırlıklı, anlaşılması güç bir edebiyat yapma.
- Aynı şekilde laçka, argo veya aşırı sıradan mahalle ağzı ifadelerden kesinlikle kaçın.
- Dilin; son derece temiz, anlaşılır, vakur, samimi ve Türkçenin ve İslam'ın duru yapısına uygun olmalı.

2. Mesaj Türlerine Göre İçerik Ayrımı (Kesinlikle uyulacak):
- Samimi: İçten, dostane, sıcak ama seviyeyi koruyan bir ton kullan.
- Resmi: Saygılı, mesafeli, nazik, hitabet kurallarına tam uyan profesyonel bir dil kullan.
- Kurumsal: Şirket veya kurum kimliğine uygun, topluluk ruhunu yansıtan, ciddi, kucaklayıcı ve güven veren bir ton benimse.
- Dua Ağırlıklı: Manevi atmosferi yüksek, arka arkaya samimi hayır duaları barındıran derin ve huzurlu bir ton seç.
- Ayet / Hadis Ağırlıklı: Mesajın ana temasını destekleyen, doğruluğu kesinleşmiş kısa bir ayet meali veya hadis-i şerif lafzını metne doğal bir akışla entegre et.

3. Coğrafi ve Toplumsal Hassasiyetler (Gazze, Doğu Türkistan, İslam Âlemi vb.):
- Kullanıcı bu tarz coğrafi veya toplumsal vurgular eklediğinde; asla ajitasyona, hamasete veya ucuz duygu sömürüsüne kaçma.
- Bunun yerine onurlu, kararlı, ümitvar ve kucaklayıcı bir duacı üslup benimse. Mazlum coğrafyaların selametini vakur bir dille dile getir.

4. Mesaj Yapısı ve Akışı:
- Giriş: Günün manasına uygun sade ve isabetli bir başlangıç yap.
- Gelişme: Kullanıcının girdiği özel anahtar kelimeleri ve seçtiği mesaj türünü metne doğal bir şekilde harmanla.
- Kapanış ve İmza: Eğer kullanıcı bir isim veya şirket unvanı belirttiyse, bunu mesajın sonuna şık ve uygun bir imza bloğu olarak ekle.
- Çeşitlilik: Her çağrıda kalıplaşmış ve ezbere cümlelerden kaçınarak taze, özgün ve duru cümleler kur.

BU ÇAĞRIYA AİT BİLGİLER:
- Dini gün / zaman: ${gun}
- Mesaj türü: ${uslupAdi}
- Hedef uzunluk: ${uzunlukMetni}
- Hitap: ${hitap || "yok"}
- Özel vurgu / anahtar kelimeler: ${anahtar || "yok"}
- İmza: ${imza || "yok"}

UYGULAMA KURALLARI:
1. Mesaj türünü gerçekten değiştir. Resmi mesajı samimi mesajın kelimelerini değiştirerek üretme; cümle kuruluşu, hitap mesafesi ve kapanış biçimi de farklı olsun.
2. Aynı fiili veya kalıbı art arda kullanma. Özellikle “diliyorum”, “temenni ederim”, “vesile olsun”, “huzur ve bereket” gibi ifadeler aynı mesaj içinde gereksiz yere tekrarlanmasın.
3. Anahtar kelimeleri virgüllü bir liste gibi tekrar etme. “X, Y, Z için dua...” biçiminde mekanik cümle kurma. Önce anlamlarını ve aralarındaki ilişkiyi çöz; sonra metnin farklı noktalarına doğal biçimde dağıt.
4. Özel adlar ve yer adları kullanıcı tarafından yazıldıysa atlanmamalıdır. Zorunlu olarak açıkça geçmesi gereken adlar: ${zorunluAdlar || "yok"}. Bunları genel ifadelerle değiştirme; doğru Türkçe büyük/küçük harf kullanımıyla yaz.
5. Duygu ve tema sözcüklerinin hepsini aynen tekrar etmek zorunda değilsin; anlamlarını metne yedir.
6. Gazze, Doğu Türkistan ve benzeri hassasiyetleri tek bir ezber paragrafla anlatma. Aynı girdi tekrar geldiğinde vurgu sırasını, cümle yapısını ve anlatım biçimini değiştir.
7. Hitap verilmişse ilk satırda hitabı yaz, ardından bir boş satır bırak. İmza verilmişse en sonda bir boş satırdan sonra yalnızca imzayı yaz.
8. “Allah kabul eylesin” veya başka bir sabit kapanışı otomatik ekleme.
9. Ayet / Hadis Ağırlıklı tür seçilmişse yalnızca doğruluğundan yüksek derecede emin olduğun kısa bir ayet meali veya sahih hadis kullan ve kaynağı kısa biçimde belirt. Emin değilsen söz uydurma; bunun yerine doğruluğu bilinen başka kısa bir kaynak seç.
10. Başlık, madde işareti, açıklama, tırnak veya “işte mesajınız” ifadesi kullanma. Yalnızca mesajı döndür.
${onceki ? `11. Aşağıdaki önceki mesajla belirgin benzerlik kurma. Aynı giriş, aynı orta paragraf, aynı kapanış ve aynı cümle ritmini kullanma:\n---\n${onceki}\n---` : ""}

Şimdi yalnızca nihai mesajı yaz.`;

    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + encodeURIComponent(apiKey);
    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 1.12, topP: 0.94, maxOutputTokens: 800 }
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
    return { text: text, engine: "ai" };
  } catch (err) {
    return { error: "Sunucu hatası.", detail: String(err) };
  }
}
