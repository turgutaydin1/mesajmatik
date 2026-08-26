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
    const anahtar = String(p.anahtar || "").slice(0, 500);
    const semantik = String(p.semantik || "").slice(0, 1000);
    const imza = String(p.imza || "").slice(0, 160);
    const onceki = String(p.onceki || "").slice(0, 1000);
    const zorunluAdlar = String(p.zorunluAdlar || "").slice(0, 350);

    if (!gun) return { error: "Gün bilgisi eksik." };

    const uzunlukMetni = uzunluk === "kisa" ? "45-70 kelime" : uzunluk === "uzun" ? "150-210 kelime" : "90-130 kelime";
    const uslupAdi = {
      samimi: "Samimi",
      resmi: "Resmî",
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
- Resmî: Saygılı, mesafeli, nazik, hitabet kurallarına tam uyan profesyonel bir dil kullan.
- Kurumsal: Şirket veya kurum kimliğine uygun, topluluk ruhunu yansıtan, ciddi, kucaklayıcı ve güven veren bir ton benimse.
- Dua Ağırlıklı: Manevi atmosferi yüksek, arka arkaya samimi hayır duaları barındıran derin ve huzurlu bir ton seç.
- Ayet / Hadis Ağırlıklı: Mesajın ana temasını destekleyen, doğruluğu kesinleşmiş kısa bir ayet meali veya sahih hadis-i şerif lafzını metne doğal bir akışla entegre et.

3. Coğrafi ve Toplumsal Hassasiyetler:
- Gazze, Doğu Türkistan ve benzeri coğrafi vurgularda ajitasyon, hamaset ve duygu sömürüsünden kaçın.
- İslam âlemi, Müslümanlar gibi ifadeleri bir coğrafya adı gibi kullanma.
- Mazlum coğrafyaların selametini vakur, insani ve duacı bir dille ele al.

4. Mesaj Yapısı:
- Giriş: Günün manasına uygun sade ve isabetli bir başlangıç.
- Gelişme: Anahtar kelimeleri anlam türlerine göre doğal biçimde işle.
- Kapanış: Seçilen üsluba özgü bir kapanış yap.
- İmza: Verilmişse en sonda ayrı satırda yalnızca imza yer alsın.
- Her çağrıda kalıplaşmış cümlelerden kaçın.

BU ÇAĞRIYA AİT BİLGİLER:
- Dini gün / zaman: ${gun}
- Mesaj türü: ${uslupAdi}
- Hedef uzunluk: ${uzunlukMetni}
- Hitap: ${hitap || "yok"}
- Kullanıcının ham özel vurguları: ${anahtar || "yok"}
- Önceden ayrıştırılmış anlam bilgisi: ${semantik || "yok"}
- Mesajda açıkça geçmesi gereken özel adlar / topluluk adları: ${zorunluAdlar || "yok"}
- İmza: ${imza || "yok"}

KESİN UYGULAMA KURALLARI:

1. ÖNCE ANLAMI ÇÖZ, SONRA CÜMLE KUR.
Coğrafi yer, topluluk/kapsam, kişi/kurum, duygu ve soyut tema aynı gramer grubuna sokulamaz.
Örneğin Gazze bir coğrafyadır; İslam âlemi bir topluluk/kapsam ifadesidir; umut ve sabır soyut temalardır.
Bunları “Gazze ve İslam için...” veya “Gazze ve İslam'ı unutmuyoruz...” gibi tek bir isim listesi yapma.

2. TÜRKÇE EK VE ÖZNE UYUMUNU KUSURSUZ KORU.
“islam'yi”, “Gazze ve İslam'yi”, “Dualarımızda ... unutmuyor” gibi yapılar kesinlikle yasaktır.
Özel adları doğru büyük harfle yaz: Gazze, Doğu Türkistan, İslam âlemi.
Özne tekilse yüklem tekil, çoğulsa çoğul olmalı.

3. COĞRAFYA VE TOPLULUK AYRIMI:
- Gazze, Doğu Türkistan, Filistin vb. için “Gazze'de yaşayanlar”, “Doğu Türkistan'daki kardeşlerimiz”, “Filistin'in huzuru” gibi coğrafyaya uygun yapı kullan.
- İslam âlemi / Müslümanlar için “İslam âleminin huzuru”, “Müslümanların birlik ve selameti” gibi topluluk yapısı kullan.
- Coğrafya ile topluluğu tek “orada/oradaki” zamiri altında birleştirme.

4. ANAHTAR KELİMELER:
Kelimeleri virgüllü liste gibi tekrarlama.
Özel adlar ve topluluk adları zorunluysa metinde açıkça geçsin.
Duygu/tema kelimelerinin hepsini aynen kullanmak zorunda değilsin; anlamlarını metne yedir.

5. ÜSLUPLAR SADECE KELİME DEĞİŞİMİ OLMAYACAK:
- Samimi: Bir kişiden bir kişiye yazılmış hissi versin. “gönülden”, “sevdikleriniz”, sıcak ama ölçülü bir yakınlık kullanılabilir.
- Resmî: Daha mesafeli ve protokol diline yakın olsun. Kişisel duygusal yoğunluğu azalt; cümleler daha dengeli ve resmî yapılsın. “tebrik ederim”, “esenlik dilerim”, “bu vesileyle” gibi yapılar kullanılabilir ama tekrar edilmesin.
- Kurumsal: Metin “biz” diliyle, kurum adına yazılmış gibi kurgulansın. Bireysel “gönlümden diliyorum” dili kullanılmasın. Ortak değerler, dayanışma, paydaşlar/toplum vurgusu yapılabilir.
- Dua Ağırlıklı: Cümlelerin çoğu dua kipinde olsun; “Rabbim... nasip eylesin / ihsan eylesin” yapıları doğal biçimde çeşitlendirilsin.
- Ayet/Hadis Ağırlıklı: Doğruluğundan yüksek derecede emin olduğun kısa bir kaynak kullan ve kaynağı belirt; uydurma yapma.

6. TEKRAR KONTROLÜ:
Aynı mesaj içinde aynı yüklem veya kalıbı peş peşe kullanma.
“diliyorum”, “temenni ederim”, “dileriz”, “vesile olsun”, “huzur ve bereket” gibi ifadeler gereksiz tekrarlanmasın.
Bir fiil iki kez kullanılacaksa aralarında belirgin yapı ve anlam farkı olmalı.

7. AKIŞ:
Her cümle bir öncekiyle anlam ilişkisi kursun.
Bir coğrafi hassasiyetten sonra alakasız bir hazır cümleye atlama.
Giriş → günün manası → kullanıcının hassasiyetleri → üsluba uygun kapanış sırası korunmalı.

8. Hitap verilmişse ilk satırda yaz ve sonra bir boş satır bırak.
9. İmza verilmişse sonda bir boş satırdan sonra yalnızca imzayı yaz.
10. “Allah kabul eylesin” gibi sabit kapanışları otomatik ekleme.
11. Başlık, madde işareti, açıklama veya “işte mesajınız” yazma.
${onceki ? `12. Aşağıdaki önceki mesajı incele ve yeni mesajı belirgin biçimde farklı kur. Aynı giriş, aynı hassasiyet cümlesi, aynı kapanış veya aynı cümle ritmini kullanma:
---
${onceki}
---` : ""}

Şimdi yalnızca nihai mesajı yaz.`;

    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + encodeURIComponent(apiKey);
    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 1.08, topP: 0.93, maxOutputTokens: 850 }
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
