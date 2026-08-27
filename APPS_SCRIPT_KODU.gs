function doGet(e) {
  const p = e && e.parameter ? e.parameter : {};
  const prefix = String(p.prefix || "").replace(/[^a-zA-Z0-9_.$]/g, "");

  if (String(p.ping || "") === "1") {
    const payload = {
      status: "ok",
      service: "Mesajmatik",
      geminiKeyConfigured: !!PropertiesService.getScriptProperties().getProperty("GEMINI_API_KEY"),
      model: "gemini-2.5-flash",
      transport: "apps-script-direct",
      api: "generateContent",
      requestMode: "single-request"
    };
    return jsonpOrJson_(prefix, payload);
  }

  if (p.gun || prefix) {
    return jsonpOrJson_(prefix, generateMessage_(p));
  }

  return renderApp_();
}

function renderApp_() {
  const sourceUrl = "https://turgutaydin1.github.io/mesajmatik/?appsScriptSource=" + new Date().getTime();
  const response = UrlFetchApp.fetch(sourceUrl, {
    muteHttpExceptions: true,
    followRedirects: true
  });

  if (response.getResponseCode() < 200 || response.getResponseCode() >= 300) {
    return HtmlService.createHtmlOutput(
      "<!doctype html><html><body style='font-family:Arial;padding:24px'>Mesajmatik arayüzü yüklenemedi. HTTP " +
      response.getResponseCode() + "</body></html>"
    ).setTitle("Mesajmatik");
  }

  let html = response.getContentText();
  const directBridge = `
<script>
(function(){
  window.mesajOlustur=function(){
    const b=document.getElementById("olusturBtn");
    const sonuc=document.getElementById("sonuc");
    const status=document.getElementById("status");
    b.disabled=true;
    b.textContent="⏳ Mesaj hazırlanıyor...";
    status.textContent="Gemini ile yeni mesaj hazırlanıyor...";

    const params={
      gun:document.getElementById("gunSecim").value,
      uslup:document.getElementById("uslup").value,
      uzunluk:document.getElementById("uzunluk").value,
      hitap:document.getElementById("hitap").value,
      anahtar:document.getElementById("anahtarKelime").value.trim(),
      onceki:(window.__mesajmatikLastAiText||"").slice(0,1500),
      imza:document.getElementById("imza").value.trim(),
      seed:Date.now()+"-"+Math.random().toString(36).slice(2)
    };

    const finish=function(){
      b.disabled=false;
      b.textContent="✨ Mesajı Oluştur";
    };

    const handleError=function(detail){
      finish();
      detail=String(detail||"Bilinmeyen hata");
      window.__mesajmatikDebug={engine:"ai_error",detail:detail,time:new Date().toISOString()};
      status.textContent="AI hatası: "+detail.slice(0,300);
      const ok=window.confirm("Yapay Zekâ Mesaj Üretim Hatası\\n\\n"+detail+"\\n\\nYerel mesaj üreticisiyle devam etmek ister misiniz?");
      if(ok && typeof window.localMessage==="function"){
        sonuc.value=window.localMessage();
        status.textContent="Yerel mesaj oluşturuldu.";
        window.__mesajmatikDebug.engine="local";
      }else{
        status.textContent="Mesaj oluşturulmadı.";
      }
    };

    google.script.run
      .withSuccessHandler(function(r){
        r=r||{};
        const text=r.text?String(r.text).trim():"";
        if(text.length>30){
          window.__mesajmatikLastAiText=text;
          sonuc.value=text;
          status.textContent="Mesaj oluşturuldu.";
          window.__mesajmatikDebug={
            engine:"ai",
            detail:"model:"+(r.model||"gemini-2.5-flash")+" api:"+(r.api||"generateContent")+" requests:"+(r.requestCount||1),
            time:new Date().toISOString()
          };
          finish();
          return;
        }
        handleError([r.error,r.detail].filter(Boolean).join(" — ")||"empty_response");
      })
      .withFailureHandler(function(err){
        handleError(String(err&&err.message?err.message:err));
      })
      .generateMessageBridge(params);
  };
})();
</script>`;

  html = html.replace(/<\/body>/i, directBridge + "</body>");
  return HtmlService.createHtmlOutput(html)
    .setTitle("Mesajmatik")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function generateMessageBridge(p) {
  return generateMessage_(p || {});
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

function extractGeminiText_(data) {
  const parts = data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts;
  if (!Array.isArray(parts)) return "";
  return parts.map(function(part) {
    return part && part.text ? String(part.text) : "";
  }).join("\n").trim();
}

function generateMessage_(p) {
  try {
    const apiKey = PropertiesService.getScriptProperties().getProperty("GEMINI_API_KEY");
    if (!apiKey) {
      return {
        error: "Yapay zekâ mesaj üretim hatası.",
        detail: "GEMINI_API_KEY Script Property bulunamadı.",
        requestCount: 0
      };
    }

    const gun = String(p.gun || "").slice(0, 80);
    const uslup = String(p.uslup || "samimi").slice(0, 40);
    const uzunluk = String(p.uzunluk || "orta").slice(0, 20);
    const hitap = String(p.hitap || "").slice(0, 120);
    const anahtar = String(p.anahtar || "").slice(0, 900);
    const imza = String(p.imza || "").slice(0, 160);
    const onceki = String(p.onceki || "").slice(0, 1600);
    const seed = String(p.seed || new Date().getTime()).slice(0, 80);

    if (!gun) {
      return {
        error: "Yapay zekâ mesaj üretim hatası.",
        detail: "Gün bilgisi eksik.",
        requestCount: 0
      };
    }

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
- Mesajın içine kaynak numarası, dipnot numarası, parantez içinde tek başına sayı, madde numarası, token numarası veya benzeri teknik işaretler ekleme.
- Cümleleri yarıda kesme; mesaj doğal bir girişle başlasın ve tamamlanmış bir kapanışla bitsin.
${onceki ? `- Aşağıdaki önceki mesajın kopyasını veya yakın varyasyonunu üretme. Giriş, ritim, vurgu sırası ve kapanışı belirgin biçimde değiştir.\n\nÖNCEKİ MESAJ:\n---\n${onceki}\n---` : ""}

Yalnızca nihai mesajı yaz.`;

    const model = "gemini-2.5-flash";
    const payload = {
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt }
          ]
        }
      ],
      generationConfig: {
        maxOutputTokens: 1000
      }
    };

    const response = UrlFetchApp.fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/" + model + ":generateContent",
      {
        method: "post",
        contentType: "application/json",
        headers: {
          "x-goog-api-key": apiKey
        },
        payload: JSON.stringify(payload),
        muteHttpExceptions: true
      }
    );

    const code = response.getResponseCode();
    const rawText = response.getContentText() || "";
    let data = {};

    try {
      data = JSON.parse(rawText || "{}");
    } catch (parseErr) {
      return {
        error: "Yapay zekâ mesaj üretim hatası.",
        detail: "Gemini yanıtı JSON olarak okunamadı. HTTP " + code + " - " + String(parseErr),
        requestCount: 1
      };
    }

    if (code >= 200 && code < 300) {
      const text = extractGeminiText_(data);
      if (text && text.length >= 35) {
        return {
          text: text,
          engine: "ai",
          model: model,
          api: "generateContent",
          requestCount: 1
        };
      }

      return {
        error: "Yapay zekâ mesaj üretim hatası.",
        detail: "Gemini başarılı HTTP yanıtı verdi ancak mesaj metni boş veya yetersiz geldi.",
        requestCount: 1
      };
    }

    const detail = data && data.error
      ? (data.error.message || JSON.stringify(data.error))
      : rawText.slice(0, 1200);

    return {
      error: "Yapay zekâ mesaj üretim hatası.",
      detail: "Gemini generateContent; model=" + model + "; HTTP " + code + " - " + detail,
      requestCount: 1
    };

  } catch (err) {
    return {
      error: "Yapay zekâ mesaj üretim hatası.",
      detail: String(err),
      requestCount: 1
    };
  }
}
