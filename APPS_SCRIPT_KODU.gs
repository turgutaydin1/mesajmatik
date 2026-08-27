const MESAJMATIK_MODEL = "gemini-3.6-flash";

function doGet(e) {
  const p = e && e.parameter ? e.parameter : {};

  if (String(p.ping || "") === "1") {
    return ContentService
      .createTextOutput(JSON.stringify({
        status: "ok",
        service: "Mesajmatik",
        model: MESAJMATIK_MODEL,
        geminiKeyConfigured: !!PropertiesService.getScriptProperties().getProperty("GEMINI_API_KEY"),
        transport: "apps-script-native",
        requestMode: "single-request",
        uiSource: "Kod.gs"
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  return HtmlService
    .createHtmlOutput(getAppHtml_())
    .setTitle("Mesajmatik")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getAppHtml_() {
  return String.raw`<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Mesajmatik</title>
<style>
  :root{--green:#145c46;--green2:#2f8a66;--gold:#c89b2b;--line:#dfe8e3;--text:#1f2f2a;--muted:#6e7d77}
  *{box-sizing:border-box}
  body{margin:0;font-family:Arial,Helvetica,sans-serif;color:var(--text);background:linear-gradient(135deg,#edf8f2,#fffaf0)}
  .wrap{width:min(720px,94vw);margin:28px auto 50px;background:#fff;border:1px solid #e6ece8;border-radius:22px;overflow:hidden;box-shadow:0 18px 55px rgba(24,71,55,.12)}
  header{text-align:center;padding:28px 20px 24px;background:linear-gradient(110deg,#eff9f3,#fff8e7);border-bottom:1px solid var(--line)}
  .moon{font-size:34px;line-height:1} h1{margin:8px 0 4px;color:var(--green);font-size:34px} header p{margin:0;color:var(--muted);font-size:14px}
  main{padding:20px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}.full{grid-column:1/-1}
  label{display:block;font-weight:700;font-size:13px;margin:0 0 6px}
  select,input,textarea{width:100%;border:1px solid #ccd8d2;border-radius:11px;padding:11px 12px;font-size:14px;background:#fff;color:#22342d;outline:none}
  select:focus,input:focus,textarea:focus{border-color:#63a88c;box-shadow:0 0 0 3px rgba(47,138,102,.10)}
  .primary{width:100%;border:0;border-radius:12px;padding:14px 16px;font-weight:800;font-size:16px;cursor:pointer;color:#fff;background:linear-gradient(90deg,var(--green2),var(--gold))}.primary:disabled{opacity:.62;cursor:wait}
  .section{border-top:1px dashed #dce5e1;margin-top:18px;padding-top:18px}h2{font-size:18px;margin:0 0 10px;color:var(--green)}
  #sonuc{min-height:185px;resize:vertical;line-height:1.6;font-family:Georgia,"Times New Roman",serif}.status{margin:9px 0 0;font-size:12px;color:var(--green);font-weight:700;min-height:18px}
  .mainActions{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin-top:11px}.mainActions button{border:0;border-radius:10px;padding:10px 8px;font-weight:700;cursor:pointer;color:#fff}.mainActions button:nth-child(1){background:#2d6ea3}.mainActions button:nth-child(2){background:#7da493}.mainActions button:nth-child(3){background:#c49325}
  .socialActions{display:flex;justify-content:center;align-items:center;gap:10px;margin-top:12px;flex-wrap:wrap}.socialBtn{width:44px;height:44px;border:0;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;color:#fff;font-weight:800;font-size:20px;line-height:1;box-shadow:0 3px 10px rgba(0,0,0,.10)}.socialBtn:hover{transform:translateY(-1px)}.wa{background:#25D366}.fb{background:#1877F2}.xx{background:#111}.tg{background:#229ED9}.ig{background:radial-gradient(circle at 30% 110%,#feda75 0 25%,#d62976 45%,#962fbf 65%,#4f5bd5 100%)}
  .cardBox{display:none;margin-top:14px}canvas{width:100%;max-width:540px;display:block;margin:0 auto;border-radius:18px;border:1px solid #d8e2dd}.cardActions{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin-top:10px}.cardActions button{border:0;border-radius:10px;padding:11px 8px;font-weight:700;cursor:pointer}.note{font-size:12px;color:var(--muted);margin-top:10px}
  @media(max-width:650px){.grid{grid-template-columns:1fr}.full{grid-column:auto}.mainActions{grid-template-columns:1fr 1fr 1fr}.cardActions{grid-template-columns:1fr}.socialBtn{width:40px;height:40px;font-size:18px}h1{font-size:29px}}
</style>
</head>
<body>
<div class="wrap">
<header><div class="moon">🌙</div><h1>Mesajmatik</h1><p>Manevi günler için özgün mesaj ve paylaşım kartı oluşturucu</p></header>
<main>
<div class="grid">
<div><label for="gunSecim">Özel Gün / Zaman</label><select id="gunSecim"><option>Arefe Günü</option><option>Berat Kandili</option><option>Cuma Günü</option><option>Kadir Gecesi</option><option>Kurban Bayramı</option><option>Mevlid Kandili</option><option>Miraç Kandili</option><option>Ramazan Ayı</option><option>Ramazan Bayramı</option><option>Regaib Kandili</option></select></div>
<div><label for="uslup">Üslup</label><select id="uslup"><option value="samimi">Samimi</option><option value="resmi">Resmî</option><option value="kurumsal">Kurumsal</option><option value="dua">Dua Ağırlıklı</option><option value="kaynakli">Ayet / Hadis Ağırlıklı</option></select></div>
<div><label for="uzunluk">Mesaj Uzunluğu</label><select id="uzunluk"><option value="kisa">Kısa</option><option value="orta" selected>Orta</option><option value="uzun">Uzun</option></select></div>
<div><label for="hitap">Hitap</label><select id="hitap"><option value="">Hitap ekleme</option><option value="Değerli Dostum">Değerli Dostum</option><option value="Kıymetli Ailem">Kıymetli Ailem</option><option value="Değerli Arkadaşlar">Değerli Arkadaşlar</option><option value="Sayın Yetkili">Sayın Yetkili</option></select></div>
<div class="full"><label for="anahtarKelime">Özel Vurgu / Anahtar Kelimeler</label><input id="anahtarKelime" autocomplete="off"></div>
<div class="full"><label for="imza">İsim / Kurum / Şirket Adı</label><input id="imza" autocomplete="off"></div>
<div class="full"><button id="olusturBtn" class="primary" onclick="mesajOlustur()">✨ Mesajı Oluştur</button></div>
</div>
<div class="section"><h2>Oluşturulan Mesaj</h2><textarea id="sonuc" placeholder="Mesajınız burada görünecek..."></textarea><div id="status" class="status"></div>
<div class="mainActions"><button onclick="kopyala()">📋 Kopyala</button><button onclick="paylas()">📤 Paylaş</button><button onclick="gorselKartOlustur()">🖼️ Görsel Kart</button></div>
<div class="socialActions" aria-label="Sosyal medya paylaşımı"><button class="socialBtn wa" onclick="whatsapp()" title="WhatsApp" aria-label="WhatsApp">☎</button><button class="socialBtn fb" onclick="facebook()" title="Facebook" aria-label="Facebook">f</button><button class="socialBtn xx" onclick="xPaylas()" title="X" aria-label="X">𝕏</button><button class="socialBtn tg" onclick="telegram()" title="Telegram" aria-label="Telegram">➤</button><button class="socialBtn ig" onclick="instagram()" title="Instagram / Diğer" aria-label="Instagram / Diğer">◎</button></div></div>
<div id="cardBox" class="section cardBox"><h2>Paylaşım Kartı</h2><canvas id="cardCanvas" width="1080" height="1080"></canvas><div class="cardActions"><button onclick="gorselKaydet()">⬇️ Görseli Kaydet</button><button onclick="gorselPaylas()">📤 Görseli Paylaş</button><button onclick="tasarimDegistir()">🎨 Tasarımı Değiştir</button></div><div class="note">Görsel kart 1080×1080 hazırlanır; mesajın tamamı karta sığdırılır ve iki yana yaslanır.</div></div>
</main></div>
<script>
var __mesajmatikLastAiText="",__tasarimNo=0;
function el(id){return document.getElementById(id)}
function paramsOku(){return{gun:el("gunSecim").value,uslup:el("uslup").value,uzunluk:el("uzunluk").value,hitap:el("hitap").value,anahtar:el("anahtarKelime").value.trim(),imza:el("imza").value.trim(),onceki:(__mesajmatikLastAiText||"").slice(0,1500),seed:Date.now()+"-"+Math.random().toString(36).slice(2)}}
function butonBekle(v){var b=el("olusturBtn");b.disabled=v;b.textContent=v?"⏳ Mesaj hazırlanıyor...":"✨ Mesajı Oluştur"}
function mesajOlustur(){butonBekle(true);el("status").textContent="Gemini ile yeni mesaj hazırlanıyor...";google.script.run.withSuccessHandler(function(r){r=r||{};butonBekle(false);if(r.text&&String(r.text).trim().length>=35){var t=String(r.text).trim();__mesajmatikLastAiText=t;el("sonuc").value=t;el("status").textContent="Mesaj oluşturuldu · "+(r.model||"Gemini");window.__mesajmatikDebug={engine:"ai",detail:r.model||"Gemini",requestCount:r.requestCount||1,finishReason:r.finishReason||"STOP"};return}var d=[r.error,r.detail].filter(Boolean).join(" — ")||"Bilinmeyen hata";window.__mesajmatikDebug={engine:"ai_error",detail:d,requestCount:r.requestCount||1,finishReason:r.finishReason||""};el("status").textContent="AI hatası: "+d.slice(0,300);var devam=window.confirm("Yapay Zekâ Mesaj Üretim Hatası\n\n"+d+"\n\nYerel mesaj üreticisiyle devam etmek ister misiniz?");if(devam){el("sonuc").value=localMessage();el("status").textContent="Yerel mesaj oluşturuldu."}}).withFailureHandler(function(err){butonBekle(false);var d=String(err&&err.message?err.message:err);el("status").textContent="Sistem hatası: "+d.slice(0,300);window.alert("Mesaj oluşturulamadı.\n\n"+d)}).generateMessageBridge(paramsOku())}
function localMessage(){var p=paramsOku(),bas=p.hitap?p.hitap+"\n\n":"",vurgu=p.anahtar?" "+p.anahtar+" için de gönülden güzellikler diliyorum.":"",imza=p.imza?"\n\n"+p.imza:"",s=[p.gun+" vesilesiyle gönlünüzün huzurla, hanenizin bereketle dolmasını; dualarınızın hayırlara vesile olmasını diliyorum.","Mübarek "+p.gun+" gününün gönüllerimize ferahlık, hayatımıza sağlık, huzur ve bereket getirmesini diliyorum.",p.gun+"ın manevi ikliminin kalplerimizi iyilikte buluşturmasını, umutlarımızı tazelemesini ve dualarımızı güzelliklere ulaştırmasını diliyorum."];return bas+s[Math.floor(Math.random()*s.length)]+vurgu+imza}
function metin(){return el("sonuc").value.trim()} function kopyala(){var t=metin();if(t)navigator.clipboard.writeText(t).then(function(){el("status").textContent="Mesaj kopyalandı."})} function paylas(){var t=metin();if(!t)return;if(navigator.share)navigator.share({title:"Mesajmatik",text:t}).catch(function(){});else kopyala()}
function whatsapp(){var t=metin();if(t)window.open("https://wa.me/?text="+encodeURIComponent(t),"_blank")} function facebook(){var t=metin();if(t)window.open("https://www.facebook.com/sharer/sharer.php?u="+encodeURIComponent(location.href)+"&quote="+encodeURIComponent(t),"_blank")} function xPaylas(){var t=metin();if(t)window.open("https://twitter.com/intent/tweet?text="+encodeURIComponent(t),"_blank")} function telegram(){var t=metin();if(t)window.open("https://t.me/share/url?url="+encodeURIComponent(location.href)+"&text="+encodeURIComponent(t),"_blank")} function instagram(){paylas()}
function gunSimgesi(gun){var m={"Arefe Günü":"✦","Berat Kandili":"☾✧","Cuma Günü":"۞","Kadir Gecesi":"✧","Kurban Bayramı":"◈","Mevlid Kandili":"❁","Miraç Kandili":"↟","Ramazan Ayı":"☾★","Ramazan Bayramı":"☾✦","Regaib Kandili":"✧☾"};return m[gun]||"☾"}
function satirlaraBol(ctx,text,maxWidth){var paragraphs=String(text||"").split(/\n/),lines=[];for(var p=0;p<paragraphs.length;p++){var paragraph=paragraphs[p].trim();if(!paragraph){lines.push("");continue}var words=paragraph.split(/\s+/),line="";for(var i=0;i<words.length;i++){var test=line?line+" "+words[i]:words[i];if(ctx.measureText(test).width>maxWidth&&line){lines.push(line);line=words[i]}else{line=test}}if(line)lines.push(line)}return lines}
function metniKartaSigdir(ctx,text,maxWidth,maxHeight){for(var size=38;size>=16;size--){ctx.font=size+"px Georgia";var lines=satirlaraBol(ctx,text,maxWidth),lineHeight=Math.round(size*1.42),height=lines.length*lineHeight;if(height<=maxHeight)return{size:size,lines:lines,lineHeight:lineHeight}}ctx.font="16px Georgia";return{size:16,lines:satirlaraBol(ctx,text,maxWidth),lineHeight:23}}
function ikiYanaYaz(ctx,line,x,y,width,isLastLine){var words=String(line||"").trim().split(/\s+/);if(isLastLine||words.length<2){ctx.fillText(line,x,y);return}var wordsWidth=0;for(var i=0;i<words.length;i++)wordsWidth+=ctx.measureText(words[i]).width;var gap=(width-wordsWidth)/(words.length-1);var cursor=x;for(var j=0;j<words.length;j++){ctx.fillText(words[j],cursor,y);cursor+=ctx.measureText(words[j]).width+gap}}
function gorselKartOlustur(){if(!metin())return;el("cardBox").style.display="block";kartCiz();el("cardBox").scrollIntoView({behavior:"smooth",block:"start"})}
function kartCiz(){var c=el("cardCanvas"),ctx=c.getContext("2d"),palettes=[["#0d5a45","#d9bd63","#fffdf7"],["#174f43","#d9bd63","#fffdf7"],["#234f42","#c8ad5a","#fffdf7"]],p=palettes[__tasarimNo%palettes.length],gun=el("gunSecim").value;ctx.clearRect(0,0,1080,1080);ctx.fillStyle=p[0];ctx.fillRect(0,0,1080,1080);ctx.strokeStyle=p[1];ctx.lineWidth=6;ctx.strokeRect(54,54,972,972);ctx.fillStyle=p[1];ctx.textAlign="center";ctx.font="64px Georgia";ctx.fillText(gunSimgesi(gun),540,150);ctx.fillStyle=p[2];ctx.font="bold 48px Arial";ctx.fillText(gun,540,225);var fit=metniKartaSigdir(ctx,metin(),820,630),startY=320;ctx.font=fit.size+"px Georgia";ctx.textAlign="left";ctx.fillStyle=p[2];for(var i=0;i<fit.lines.length;i++){var line=fit.lines[i];if(line===""){startY+=Math.round(fit.lineHeight*.65)}else{var isLast=(i===fit.lines.length-1||fit.lines[i+1]==="");ikiYanaYaz(ctx,line,130,startY,820,isLast);startY+=fit.lineHeight}}ctx.textAlign="center";ctx.font="22px Arial";ctx.fillStyle=p[1];ctx.fillText("Mesajmatik",540,984)} function tasarimDegistir(){__tasarimNo++;kartCiz()} function gorselKaydet(){kartCiz();var a=document.createElement("a");a.href=el("cardCanvas").toDataURL("image/png");a.download="mesajmatik-kart.png";a.click()} function gorselPaylas(){kartCiz();el("cardCanvas").toBlob(function(blob){if(!blob)return;var f=new File([blob],"mesajmatik-kart.png",{type:"image/png"});if(navigator.canShare&&navigator.canShare({files:[f]}))navigator.share({files:[f],title:"Mesajmatik"}).catch(function(){});else gorselKaydet()},"image/png")}
</script></body></html>`;
}

function generateMessageBridge(p){return generateMessage_(p||{})}
function extractGeminiText_(data){const parts=data&&data.candidates&&data.candidates[0]&&data.candidates[0].content&&data.candidates[0].content.parts;if(!Array.isArray(parts))return"";return parts.map(function(part){return part&&part.text?String(part.text):""}).join("\n").trim()}
function cleanAiText_(text){return String(text||"").replace(/\(\s*\d{1,4}\s*\)/g,"").replace(/[ \t]+\n/g,"\n").replace(/\n{3,}/g,"\n\n").replace(/[ \t]{2,}/g," ").trim()}

function generateMessage_(p){
  try{
    const apiKey=PropertiesService.getScriptProperties().getProperty("GEMINI_API_KEY");
    if(!apiKey)return{error:"Yapay zekâ mesaj üretim hatası.",detail:"GEMINI_API_KEY Script Property bulunamadı.",requestCount:0};
    const gun=String(p.gun||"").slice(0,80),uslup=String(p.uslup||"samimi").slice(0,40),uzunluk=String(p.uzunluk||"orta").slice(0,20),hitap=String(p.hitap||"").slice(0,120),anahtar=String(p.anahtar||"").slice(0,900),imza=String(p.imza||"").slice(0,160),onceki=String(p.onceki||"").slice(0,1500),seed=String(p.seed||Date.now()).slice(0,80);
    if(!gun)return{error:"Yapay zekâ mesaj üretim hatası.",detail:"Gün bilgisi eksik.",requestCount:0};
    const uzunlukMetni=uzunluk==="kisa"?"45-70 kelime":uzunluk==="uzun"?"150-210 kelime":"90-130 kelime";
    const uslupAdi={samimi:"Samimi",resmi:"Resmî",kurumsal:"Kurumsal",dua:"Dua Ağırlıklı",kaynakli:"Ayet / Hadis Ağırlıklı"}[uslup]||"Samimi";
    const uslupTalimatlari={samimi:"İçten, sıcak ve kişiden kişiye doğal bir anlatım kullan.",resmi:"Saygılı, ölçülü, mesafeli ve protokole uygun bir anlatım kullan.",kurumsal:"Bir kurum adına yaz; çoğul anlatım, ortak değerler ve temsil dili kullan.",dua:"Mesajın ana omurgası dua olsun; dua fiillerini tekrar etme.",kaynakli:"Yalnız doğruluğundan emin olduğun kısa bir ayet meali veya sahih hadis kullan; kaynağı doğru belirt, alıntı uydurma."}[uslup]||"";
    const prompt=["Manevi ve özel günler için doğal, akıcı ve düzgün Türkçe kullanan özenli bir yazarsın.","Yalnızca nihai mesaj metnini yaz. Başlık, açıklama, analiz, madde numarası veya teknik işaret yazma.","","İstek kimliği: "+seed,"Gün: "+gun,"Üslup: "+uslupAdi,"Uzunluk: "+uzunlukMetni,"Hitap: "+(hitap||"yok"),"Özel vurgu: "+(anahtar||"yok"),"İmza: "+(imza||"yok"),"","Üslup talimatı: "+uslupTalimatlari,"","Kurallar:","- "+gun+" ifadesi mesajda doğal biçimde yer alsın.","- Özel vurgu doluysa virgül, noktalı virgül veya satır sonuyla ayrılmış HER ifade mesajda tanınabilir biçimde yer alsın.","- Özel vurguları hazır sözlüklerle sınıflandırma; anlamını bağlamdan çıkar.","- 'özel olarak belirttiğiniz', 'hassasiyetiniz', 'bu vurgu' gibi mekanik kalıplar kullanma.","- Türkçe ek, özne-yüklem, tekil-çoğul ve zamir uyumu doğru olsun.","- Samimi, Resmî ve Kurumsal metinlerin yapısı gerçekten farklı olsun.","- Hitap varsa ilk satırda yaz ve sonra bir boş satır bırak.","- İmza varsa en sonda bir boş satırdan sonra yalnızca imzayı yaz.","- Dinî, tarihî veya kurumsal bilgi uydurma.","- Parantez içinde tek başına sayı, dipnot numarası, kaynak numarası, token numarası veya benzeri teknik işaretler kullanma.","- Cümleyi yarıda kesme; mesaj doğal bir giriş ve tamamlanmış bir kapanış içersin.",onceki?"- Önceki mesaja yakın bir varyasyon üretme; giriş, ritim, vurgu sırası ve kapanışı değiştir.\n\nÖNCEKİ MESAJ:\n---\n"+onceki+"\n---":"","","Yalnızca nihai mesajı yaz."].join("\n");
    const payload={contents:[{role:"user",parts:[{text:prompt}]}],generationConfig:{maxOutputTokens:2048,thinkingConfig:{thinkingLevel:"minimal"}}};
    const response=UrlFetchApp.fetch("https://generativelanguage.googleapis.com/v1beta/models/"+MESAJMATIK_MODEL+":generateContent",{method:"post",contentType:"application/json",headers:{"x-goog-api-key":apiKey},payload:JSON.stringify(payload),muteHttpExceptions:true});
    const code=response.getResponseCode(),raw=response.getContentText()||"";let data={};
    try{data=JSON.parse(raw||"{}")}catch(err){return{error:"Yapay zekâ mesaj üretim hatası.",detail:"Gemini yanıtı JSON olarak okunamadı. HTTP "+code+" - "+String(err),requestCount:1}}
    if(code>=200&&code<300){
      const candidate=data&&data.candidates&&data.candidates[0]?data.candidates[0]:{};
      const finishReason=String(candidate.finishReason||"");
      const text=cleanAiText_(extractGeminiText_(data));
      if(finishReason&&finishReason!=="STOP")return{error:"Yapay zekâ mesaj üretim hatası.",detail:"Gemini mesajı tamamlamadan durdu. finishReason="+finishReason+". Yarım metin gösterilmedi.",finishReason:finishReason,requestCount:1};
      if(text.length>=35)return{text:text,engine:"ai",model:MESAJMATIK_MODEL,api:"generateContent",finishReason:finishReason||"STOP",requestCount:1};
      return{error:"Yapay zekâ mesaj üretim hatası.",detail:"Gemini başarılı yanıt verdi ancak mesaj metni boş veya yetersiz geldi.",finishReason:finishReason,requestCount:1};
    }
    const detail=data&&data.error?(data.error.message||JSON.stringify(data.error)):raw.slice(0,1200);
    return{error:"Yapay zekâ mesaj üretim hatası.",detail:"Gemini generateContent; model="+MESAJMATIK_MODEL+"; HTTP "+code+" - "+detail,requestCount:1};
  }catch(err){return{error:"Yapay zekâ mesaj üretim hatası.",detail:String(err),requestCount:1}}
}
