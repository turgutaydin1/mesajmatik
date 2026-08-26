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
    const anahtar = String(p.anahtar || "").slice(0, 900);
    const imza = String(p.imza || "").slice(0, 160);
    const onceki = String(p.onceki || "").slice(0, 1200);

    if (!gun) return { error: "Gün bilgisi eksik." };

    const uzunlukMetni =
      uzunluk === "kisa" ? "45-70 kelime" :
      uzunluk === "uzun" ? "150-210 kelime" :
      "90-130 kelime";

    const uslupAdi = {
      samimi: "Samimi",
      resmi: "Resmî",
      kurumsal: "Kurumsal",
      dua: "Dua Ağırlıklı",
      kaynakli: "Ayet / Hadis Ağırlıklı"
    }[uslup] || "Samimi";

    const uslupTalimatlari = {
      samimi: `
SAMİMİ MESAJ:
- Metni kişiden kişiye yazılmış gibi kur.
- İçten, dostane ve sıcak ol; fakat seviyeyi koru.
- Kurumsal "biz", "paydaşlarımız", "kurumumuz" diline kayma.
- Resmî yazışma kalıplarını ana omurga yapma.
- Cümle yapıları daha doğal ve insani olsun.
`,
      resmi: `
RESMÎ MESAJ:
- Samimi metnin kelimelerini resmîleştirmekle yetinme; metni baştan resmî kur.
- Saygılı, mesafeli, dengeli ve profesyonel bir hitabet kullan.
- Kişisel duygu yoğunluğunu ve konuşma dili sıcaklığını azalt.
- Cümle kuruluşları daha kontrollü, ölçülü ve protokol diline yakın olsun.
- Aynı "dilerim / temenni ederim / ümit ederim" fiillerini art arda tekrarlama.
- Kapanış samimi mesajdan yapısal olarak farklı olsun.
`,
      kurumsal: `
KURUMSAL MESAJ:
- Bireysel bir metni çoğul eki ekleyerek kurumsallaştırma; metni baştan kurum adına tasarla.
- Temsil dili kullan; bireysel "ben / gönlümden / şahsen" yapılarından kaçın.
- Uygun olduğunda ortak değerler, birlik, dayanışma, çalışanlar, paydaşlar, toplum ve sorumluluk perspektifi kur.
- "Biz" dili yalnızca doğal olduğu yerde kullan.
- Mesaj bir kurumun yayımlayacağı metin gibi güven veren, ciddi ve kucaklayıcı olsun.
- Kapanış kurum adına tebrik niteliğinde olsun.
`,
      dua: `
DUA AĞIRLIKLI MESAJ:
- Metnin ana omurgası dua olsun.
- Aynı dua kipini peş peşe tekrarlama; dua fiillerini ve cümle yapısını çeşitlendir.
- Sıradan bir tebrik metninin sonuna birkaç dua eklemekle yetinme.
- Manevi yoğunluk yüksek ama sade ve anlaşılır olsun.
`,
      kaynakli: `
AYET / HADİS AĞIRLIKLI MESAJ:
- Ana temayı destekleyen yalnızca kısa ve doğruluğundan yüksek derecede emin olduğun bir ayet meali veya sahih hadis kullan.
- Kaynağı kısa ve açık biçimde belirt.
- Emin olmadığın hiçbir sözü ayet veya hadis diye aktarma.
- Kaynak, mesajın akışına doğal biçimde bağlansın; metni boğmasın.
`
    }[uslup] || "";

    const prompt = `SİSTEM ROLÜ VE TALİMATLARI:

Sen manevi değerlerine bağlı, net, dengeli ve özenli bir yazarsın. Görevin; kullanıcının seçtiği dini gün, mesaj türü, özel vurgu / anahtar kelimeler, hitap ve imza detayına sadık kalarak özgün tebrik mesajları üretmektir.

Üreteceğin çıktı doğrudan kullanılabilir mesaj metni olmalıdır. Başlık, açıklama, analiz, madde listesi veya "işte mesajınız" gibi ifadeler yazma.

TEMEL DİL KURALLARI:
- Türkçe temiz, doğal, anlaşılır, vakur ve dilbilgisel olarak doğru olmalı.
- Ağdalı, Osmanlıca ağırlıklı veya anlaşılması güç bir dil kullanma.
- Laçka, argo veya aşırı sıradan bir dil kullanma.
- Aynı kelimeyi, yüklemi, dilek kalıbını veya cümle ritmini kısa aralıklarla tekrar etme.
- Özellikle "diliyorum", "dilerim", "temenni ederim", "ümit ederim", "vesile olsun", "huzur ve bereket" gibi kalıpları gereksiz yere çoğaltma.
- Her cümle metne yeni bir anlam, duygu veya işlev katmalı.

MESAJ TÜRÜ: ${uslupAdi}
${uslupTalimatlari}

KULLANICI GİRDİLERİ:
- Dini gün / zaman: ${gun}
- Hedef uzunluk: ${uzunlukMetni}
- Hitap: ${hitap || "yok"}
- Özel vurgu / anahtar kelimeler: ${anahtar || "yok"}
- İmza: ${imza || "yok"}

DİNAMİK ANLAMLANDIRMA KURALI — EN ÖNEMLİ BÖLÜM:
Kullanıcının özel vurgu alanına yazdığı hiçbir ifade için önceden tanımlanmış sabit bir kelime listesine, sözlüğe, örnek tablosuna veya birkaç bilinen kelimeye bağımlı kalma.

Her çağrıda kullanıcının yazdığı HER ifadeyi kendi bağlamı içinde sessizce analiz et ve anlamını kendin belirle. Bir ifade; özel ad, kişi, kurum, kuruluş, yer, coğrafya, topluluk, millet, insan grubu, unvan, statü, nesne, olay, tarihî kavram, duygu, değer, soyut tema, hedef, temenni veya bunların dışında başka bir anlam türünde olabilir. Bu liste yalnızca olası türleri anlatır; kullanıcı girdisini bu seçeneklerden birine zorlamak zorunda değilsin.

Önce şu soruları sessizce çöz:
1. İfade gerçekte neyi ifade ediyor?
2. Tekil mi, çoğul mu, özel ad mı, cins isim mi?
3. Cümlede hangi dilbilgisel görevi doğal biçimde alır?
4. Kullanıcının diğer ifadeleriyle anlam ilişkisi nedir?
5. Dini gün mesajında bu ifade hangi bağlamda doğal ve saygılı biçimde kullanılabilir?
6. İfade hassas bir insan grubu, tarihî/toplumsal konu, sağlık kurumu, unvan/statü, nesne veya başka özel bağlam taşıyorsa bunu uygun saygı ve doğrulukla nasıl ele almak gerekir?

ÇOK ÖNEMLİ:
- Kullanıcının yazdığı hiçbir ifadeyi sırf alışılmadık diye atlama.
- Bir ifadenin özel ad, kurum adı, kişi adı, unvan veya resmî adlandırma olma ihtimali varsa ve doğru yazımından emin değilsen, onu kafana göre başka bir ada dönüştürme; kullanıcının verdiği biçimi koru.
- Yalnızca açık ve güvenli bir Türkçe büyük/küçük harf ya da ek düzeltmesi olduğundan eminsen düzelt.
- Anlamından emin olmadığın bir ifadeye kategori uydurma; nötr ama dilbilgisel olarak doğru bir bağ kur.
- Kullanıcının tüm girdilerini tek tek zihninde hesaba kattığından emin ol; bazılarını sessizce yok sayma.

Bu iç analizi kullanıcıya yazma; yalnızca sonucunu düzgün Türkçe mesajda uygula.

ANLAMSAL BÜTÜNLÜK:
- Farklı anlam türlerini sırf kullanıcı virgülle yan yana yazdı diye aynı dilbilgisel nesneymiş gibi bağlama.
- Her ifadeye gerçek anlamına uygun ek, zamir, fiil ve cümle ilişkisi kur.
- "orada", "onlar", "bunlar", "için", "hakkında" gibi zamir ve edatları ancak hangi ifadeye döndüğü açık ve dilbilgisel olarak doğruysa kullan.
- Özne-yüklem, tekil-çoğul, kişi ve zaman uyumunu son kontrolde mutlaka doğrula.
- Türkçe ekleri özel adların ve kurum/topluluk adlarının gerçek yazımına göre doğru getir.
- Kullanıcının yazımında küçük/büyük harf veya açık bir ek hatası varsa anlamı bozmadan Türkçe yazımını düzelt.

KULLANICI VURGULARININ KULLANIMI:
- Kullanıcının verdiği ifadeleri mekanik bir liste gibi tekrar etme.
- Birden fazla ifadeyi "X, Y, Z için..." biçiminde zorla tek cümleye yığma.
- Somut veya kimliği belirli bir kişi, yer, kurum, topluluk, unvan/statü ya da özel ad kullanıcının asıl vurgusunu oluşturuyorsa onu metinde tanınabilir biçimde koru.
- Soyut duygu/değer/tema niteliğindeki ifadeleri aynen yazmak zorunda değilsin; anlamlarını doğal biçimde metne yedirebilirsin.
- Kullanıcının yazdığı bir ifade alışılmadık olsa bile onu görmezden gelme; önce bağlamını anlamaya çalış, sonra mesajın doğallığını bozmadan işle.
- Bir ifadenin anlamından emin değilsen yanlış sınıflandırma uydurma. İfadeyi güvenli, genel ve dilbilgisel olarak doğru bir yapı içinde kullan.

ÜSLUPLAR ARASINDA GERÇEK FARK:
Aynı girdiler farklı mesaj türleriyle çağrıldığında yalnızca birkaç kelime değiştirilmiş benzer metinler üretme.
- Samimi: kişisel yakınlık, sıcaklık ve doğal anlatım.
- Resmî: mesafe, saygı, profesyonel hitabet ve kontrollü cümle yapısı.
- Kurumsal: kurum/topluluk perspektifi, temsil dili, ortak değerler ve çoğul bakış.
- Dua Ağırlıklı: dua yapısı metnin ana omurgası.
- Ayet/Hadis Ağırlıklı: güvenilir kısa kaynak metnin ana temasını destekler.
Giriş, gelişme, vurgu sırası, özne seçimi, fiil yapısı ve kapanış da seçilen türe göre değişmeli.

AKIŞ:
- Günün anlamına uygun doğal bir giriş kur.
- Kullanıcının özel vurgularını anlam ilişkisine göre uygun yerlere dağıt.
- Cümleler birbirinden kopuk hazır parçalar gibi durmasın.
- Bir önceki cümlenin anlamından alakasız bir şablon cümleye atlama.
- Kapanışı seçilen üsluba göre kur.
- Bu akış bir kalıp değildir; her çağrıda farklı bir yapı oluşturabilirsin.

HİTAP VE İMZA:
- Hitap verilmişse ilk satırda yaz ve ardından bir boş satır bırak.
- İmza verilmişse en sonda bir boş satırdan sonra yalnızca imzayı yaz.
- Otomatik olarak "Saygılarımla", "Sevgilerimle", "Allah kabul eylesin" gibi sabit kapanışlar ekleme.

DİNİ DOĞRULUK:
- Ayet/Hadis Ağırlıklı tür seçilmediyse gereksiz alıntılarla metni doldurma.
- Kaynaklı türde doğruluğundan yüksek derecede emin olmadığın hiçbir ayet veya hadis aktarma.
- Dinî, tarihî, kurumsal veya toplumsal bilgi uydurma.

TEKRAR ÖNLEME:
${onceki ? `Aşağıdaki metin bir önceki üretimdir:
---
${onceki}
---
Yeni mesajda aynı giriş, aynı orta paragraf, aynı özel vurgu cümlesi, aynı kapanış veya aynı cümle ritmini kullanma. Yeni metni belirgin biçimde farklı kur.` : `Bu çağrıda da ezber ve kalıplaşmış cümlelerden uzak dur.`}

SON KONTROL:
Mesajı döndürmeden önce sessizce kontrol et:
- Kullanıcının tüm önemli vurgularını gerçekten ele aldın mı?
- Her ifade gerçek anlamına uygun biçimde kullanıldı mı?
- Bir özel adı, kurum adını veya unvanı yanlışlıkla başka şeye çevirdin mi?
- Yanlış sınıflandırma, anlamsız bağlama veya uygunsuz zamir var mı?
- Özne-yüklem ve tekil-çoğul uyumu doğru mu?
- Türkçe ekler, özel ad yazımı ve büyük/küçük harfler doğru mu?
- Aynı fiil veya kalıp gereksiz tekrar ediyor mu?
- Seçilen mesaj türü yalnızca kelimelerde değil, bütün metin yapısında hissediliyor mu?
- Metin doğal, tutarlı ve insan eliyle yazılmış gibi mi?

Bir hata görürsen sessizce düzelt. Yalnızca nihai mesajı döndür.`;

    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + encodeURIComponent(apiKey);
    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 1.05,
        topP: 0.92,
        maxOutputTokens: 900
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
      return {
        error: "Üretim servisi yanıt vermedi.",
        detail: (data.error && data.error.message) || String(code)
      };
    }

    const parts = data && data.candidates && data.candidates[0] &&
      data.candidates[0].content && data.candidates[0].content.parts;

    const text = Array.isArray(parts)
      ? parts.map(function(x){ return x.text || ""; }).join("\n").trim()
      : "";

    if (!text) return { error: "Boş yanıt alındı." };

    return { text: text, engine: "ai" };
  } catch (err) {
    return { error: "Sunucu hatası.", detail: String(err) };
  }
}
