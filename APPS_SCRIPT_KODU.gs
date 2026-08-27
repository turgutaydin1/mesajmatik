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
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Mesajmatik</title>
<style>
  :root{--green:#145c46;--green2:#2f8a66;--gold:#c89b2b;--line:#dfe8e3;--text:#1f2f2a;--muted:#6e7d77}
  *{box-sizing:border-box}
  html,body{width:100%;max-width:100%;overflow-x:hidden}
  body{margin:0;font-family:Arial,Helvetica,sans-serif;color:var(--text);background:linear-gradient(135deg,#edf8f2,#fffaf0);padding-left:env(safe-area-inset-left);padding-right:env(safe-area-inset-right)}
  .wrap{width:min(720px,calc(100% - 24px));margin:20px auto 40px;background:#fff;border:1px solid #e6ece8;border-radius:22px;overflow:hidden;box-shadow:0 18px 55px rgba(24,71,55,.12)}
  header{text-align:center;padding:28px 20px 24px;background:linear-gradient(110deg,#eff9f3,#fff8e7);border-bottom:1px solid var(--line)}
  .moon{font-size:34px;line-height:1} h1{margin:8px 0 4px;color:var(--green);font-size:34px} header p{margin:0;color:var(--muted);font-size:14px}
  main{padding:20px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}.full{grid-column:1/-1}
  label{display:block;font-weight:700;font-size:13px;margin:0 0 6px}
  select,input,textarea{width:100%;min-width:0;border:1px solid #ccd8d2;border-radius:11px;padding:11px 12px;font-size:14px;background:#fff;color:#22342d;outline:none}
  select:focus,input:focus,textarea:focus{border-color:#63a88c;box-shadow:0 0 0 3px rgba(47,138,102,.10)}
  .primary{width:100%;border:0;border-radius:12px;padding:14px 16px;font-weight:800;font-size:16px;cursor:pointer;color:#fff;background:linear-gradient(90deg,var(--green2),var(--gold))}.primary:disabled{opacity:.62;cursor:wait}
  .section{border-top:1px dashed #dce5e1;margin-top:18px;padding-top:18px}h2{font-size:18px;margin:0 0 10px;color:var(--green)}
  #sonuc{min-height:185px;resize:vertical;line-height:1.6;font-family:Georgia,"Times New Roman",serif}.status{margin:9px 0 0;font-size:12px;color:var(--green);font-weight:700;min-height:18px;overflow-wrap:anywhere}
  .mainActions{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin-top:11px}.mainActions button{min-width:0;border:0;border-radius:10px;padding:10px 8px;font-weight:700;cursor:pointer;color:#fff}.mainActions button:nth-child(1){background:#2d6ea3}.mainActions button:nth-child(2){background:#7da493}.mainActions button:nth-child(3){background:#c49325}
  .socialActions{display:flex;justify-content:center;align-items:center;gap:10px;margin-top:12px;flex-wrap:wrap}.socialBtn{width:44px;height:44px;flex:0 0 44px;border:0;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;color:#fff;font-weight:800;font-size:20px;line-height:1;box-shadow:0 3px 10px rgba(0,0,0,.10)}.socialBtn:hover{transform:translateY(-1px)}.socialBtn svg{width:23px;height:23px;display:block;fill:currentColor}.wa{background:#25D366}.fb{background:#1877F2}.xx{background:#111}.tg{background:#229ED9}.ig{background:radial-gradient(circle at 30% 110%,#feda75 0 25%,#d62976 45%,#962fbf 65%,#4f5bd5 100%)}
  .cardBox{display:none;margin-top:14px}canvas{width:100%;height:auto;max-width:540px;display:block;margin:0 auto;border-radius:18px;border:1px solid #d8e2dd}.cardActions{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin-top:10px}.cardActions button{min-width:0;border:0;border-radius:10px;padding:11px 8px;font-weight:700;cursor:pointer}.note{font-size:12px;color:var(--muted);margin-top:10px}
  @media(max-width:650px){
    .wrap{width:calc(100% - 16px);margin:8px auto 24px;border-radius:16px}
    header{padding:20px 14px 18px}.moon{font-size:28px}h1{font-size:28px}header p{font-size:12px;line-height:1.4}
    main{padding:14px}.grid{grid-template-columns:1fr;gap:11px}.full{grid-column:auto}
    select,input,textarea{font-size:16px;padding:12px 11px}.primary{font-size:15px;padding:14px 12px}
    #sonuc{min-height:210px}.section{margin-top:14px;padding-top:14px}
    .mainActions{grid-template-columns:1fr 1fr;gap:8px}.mainActions button:nth-child(3){grid-column:1/-1}
    .socialActions{gap:9px;margin-top:11px}.socialBtn{width:42px;height:42px;flex-basis:42px}.socialBtn svg{width:22px;height:22px}
    .cardActions{grid-template-columns:1fr;gap:7px}.cardActions button{padding:12px 10px}
    canvas{max-width:100%;border-radius:12px}
  }
  @media(max-width:380px){
    .wrap{width:calc(100% - 10px);margin:5px auto 18px}main{padding:11px}header{padding:17px 10px 15px}h1{font-size:25px}
    .mainActions{grid-template-columns:1fr}.mainActions button:nth-child(3){grid-column:auto}
    .socialActions{gap:7px}.socialBtn{width:40px;height:40px;flex-basis:40px}
  }
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
<div><label for="hitap">Hitap</label><input id="hitap" autocomplete="off"></div>
<div class="full"><label for="imza">İsim / Kurum / Şirket Adı</label><input id="imza" autocomplete="off"></div>
<div class="full"><button id="olusturBtn" class="primary" onclick="mesajOlustur()">✨ Mesajı Oluştur</button></div>
</div>
<div class="section"><h2>Oluşturulan Mesaj</h2><textarea id="sonuc" placeholder="Mesajınız burada görünecek..."></textarea><div id="status" class="status"></div>
<div class="mainActions"><button onclick="kopyala()">📋 Kopyala</button><button onclick="paylas()">📤 Paylaş</button><button onclick="gorselKartOlustur()">🖼️ Görsel Kart</button></div>
<div class="socialActions" aria-label="Sosyal medya paylaşımı"><button class="socialBtn wa" onclick="whatsapp()" title="WhatsApp" aria-label="WhatsApp"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.66 15l-1.1 4.02 4.11-1.08A10 10 0 1 0 12 2Zm0 18a8 8 0 0 1-4.08-1.12l-.29-.17-2.44.64.65-2.37-.19-.3A8 8 0 1 1 12 20Zm4.37-5.64c-.24-.12-1.4-.69-1.62-.77-.22-.08-.38-.12-.54.12-.16.24-.62.77-.76.93-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.93-1.19-.71-.63-1.19-1.42-1.33-1.66-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.19-.46-.39-.4-.54-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.69 2.58 4.1 3.62.57.25 1.02.4 1.37.51.58.18 1.1.16 1.51.1.46-.07 1.4-.57 1.6-1.12.2-.55.2-1.02.14-1.12-.06-.1-.22-.16-.46-.28Z"/></svg></button><button class="socialBtn fb" onclick="facebook()" title="Facebook" aria-label="Facebook">f</button><button class="socialBtn xx" onclick="xPaylas()" title="X" aria-label="X">𝕏</button><button class="socialBtn tg" onclick="telegram()" title="Telegram" aria-label="Telegram">➤</button><button class="socialBtn ig" onclick="instagram()" title="Instagram / Diğer" aria-label="Instagram / Diğer">◎</button></div></div>
<div id="cardBox" class="section cardBox"><h2>Paylaşım Kartı</h2><canvas id="cardCanvas" width="1080" height="1080"></canvas><div class="cardActions"><button onclick="gorselKaydet()">⬇️ Görseli Kaydet</button><button onclick="gorselPaylas()">📤 Görseli Paylaş</button><button onclick="tasarimDegistir()">🎨 Tasarımı Değiştir</button></div><div class="note">Görsel kart 1080×1080 hazırlanır; mesajın tamamı karta sığdırılır, ana metin iki yana yaslanır ve imza sağa hizalanır.</div></div>
</main></div>
<script>
var __mesajmatikLastAiText="",__tasarimNo=0;
function el(id){return document.getElementById(id)}
function paramsOku(){return{gun:el("gunSecim").value,uslup:el("uslup").value,uzunluk:el("uzunluk").value,hitap:el("hitap").value.trim(),imza:el("imza").value.trim(),onceki:(__mesajmatikLastAiText||"").slice(0,1500),seed:Date.now()+"-"+Math.random().toString(36).slice(2)}}
function butonBekle(v){var b=el("olusturBtn");b.disabled=v;b.textContent=v?"⏳ Mesaj hazırlanıyor...":"✨ Mesajı Oluştur"}
function mesajOlustur(){butonBekle(true);el("status").textContent="Mesaj hazırlanıyor...";google.script.run.withSuccessHandler(function(r){r=r||{};butonBekle(false);if(r.text&&String(r.text).trim().length>=35){var t=String(r.text).trim();__mesajmatikLastAiText=t;el("sonuc").value=t;el("status").textContent="Mesaj oluşturuldu.";window.__mesajmatikDebug={engine:"ai",detail:r.model||"Gemini",requestCount:r.requestCount||1,finishReason:r.finishReason||"STOP"};return}var d=[r.error,r.detail].filter(Boolean).join(" — ")||"Bilinmeyen hata";window.__mesajmatikDebug={engine:"ai_error",detail:d,requestCount:r.requestCount||1,finishReason:r.finishReason||""};el("status").textContent="AI hatası: "+d.slice(0,300);var devam=window.confirm("Yapay Zekâ Mesaj Üretim Hatası\n\n"+d+"\n\nYerel mesaj üreticisiyle devam etmek ister misiniz?");if(devam){el("sonuc").value=localMessage();el("status").textContent="Yerel mesaj oluşturuldu."}}).withFailureHandler(function(err){butonBekle(false);var d=String(err&&err.message?err.message:err);el("status").textContent="Sistem hatası: "+d.slice(0,300);window.alert("Mesaj oluşturulamadı.\n\n"+d)}).generateMessageBridge(paramsOku())}
function localMessage(){var p=paramsOku(),bas=p.hitap?p.hitap+"\n\n":"",imza=p.imza?"\n\n"+p.imza:"",s=[p.gun+" vesilesiyle gönlünüzün huzurla, hanenizin bereketle dolmasını; dualarınızın hayırlara vesile olmasını diliyorum.","Mübarek "+p.gun+" gününün gönüllerimize ferahlık, hayatımıza sağlık, huzur ve bereket getirmesini diliyorum.",p.gun+"ın manevi ikliminin kalplerimizi iyilikte buluşturmasını, umutlarımızı tazelemesini ve dualarımızı güzelliklere ulaştırmasını diliyorum."];return bas+s[Math.floor(Math.random()*s.length)]+imza}
function metin(){return el("sonuc").value.trim()} function kopyala(){var t=metin();if(t)navigator.clipboard.writeText(t).then(function(){el("status").textContent="Mesaj kopyalandı."})} function paylas(){var t=metin();if(!t)return;if(navigator.share)navigator.share({title:"Mesajmatik",text:t}).catch(function(){});else kopyala()}
function whatsapp(){var t=metin();if(t)window.open("https://wa.me/?text="+encodeURIComponent(t),"_blank")} function facebook(){var t=metin();if(t)window.open("https://www.facebook.com/sharer/sharer.php?u="+encodeURIComponent(location.href)+"&quote="+encodeURIComponent(t),"_blank")} function xPaylas(){var t=metin();if(t)window.open("https://twitter.com/intent/tweet?text="+encodeURIComponent(t),"_blank")} function telegram(){var t=metin();if(t)window.open("https://t.me/share/url?url="+encodeURIComponent(location.href)+"&text="+encodeURIComponent(t),"_blank")} function instagram(){paylas()}
function gunSimgesi(gun){var m={"Arefe Günü":"✦","Berat Kandili":"☾✧","Cuma Günü":"۞","Kadir Gecesi":"✧","Kurban Bayramı":"◈","Mevlid Kandili":"❁","Miraç Kandili":"↟","Ramazan Ayı":"☾★","Ramazan Bayramı":"☾✦","Regaib Kandili":"✧☾"};return m[gun]||"☾"}
function satirlaraBol(ctx,text,maxWidth){var paragraphs=String(text||"").split(/\n/),lines=[];for(var p=0;p<paragraphs.length;p++){var paragraph=paragraphs[p].trim();if(!paragraph){lines.push("");continue}var words=paragraph.split(/\s+/),line="";for(var i=0;i<words.length;i++){var test=line?line+" "+words[i]:words[i];if(ctx.measureText(test).width>maxWidth&&line){lines.push(line);line=words[i]}else{line=test}}if(line)lines.push(line)}return lines}
function metniKartaSigdir(ctx,text,maxWidth,maxHeight){for(var size=38;size>=16;size--){ctx.font=size+"px Georgia";var lines=satirlaraBol(ctx,text,maxWidth),lineHeight=Math.round(size*1.42),height=lines.length*lineHeight;if(height<=maxHeight)return{size:size,lines:lines,lineHeight:lineHeight}}ctx.font="16px Georgia";return{size:16,lines:satirlaraBol(ctx,text,maxWidth),lineHeight:23}}
function ikiYanaYaz(ctx,line,x,y,width,isLastLine){var words=String(line||"").trim().split(/\s+/);if(isLastLine||words.length<2){ctx.fillText(line,x,y);return}var wordsWidth=0;for(var i=0;i<words.length;i++)wordsWidth+=ctx.measureText(words[i]).width;var gap=(width-wordsWidth)/(words.length-1);var cursor=x;for(var j=0;j<words.length;j++){ctx.fillText(words[j],cursor,y);cursor+=ctx.measureText(words[j]).width+gap}}
function kartMetniniAyir(){var tam=metin(),imza=el("imza").value.trim();if(imza&&tam.slice(-imza.length)===imza){var govde=tam.slice(0,-imza.length).replace(/\s+$/g,"");return{govde:govde,imza:imza}}return{govde:tam,imza:""}}
function kartTemasi(no){var t=[
{a:"#063b31",b:"#0b7156",c:"#e4c86b",d:"#fffdf6",e:"#95d0b4"},
{a:"#12253f",b:"#284f72",c:"#e6c879",d:"#fffaf0",e:"#91b9d1"},
{a:"#f2ead9",b:"#dfd2b8",c:"#78603a",d:"#24342d",e:"#a89068"},
{a:"#3a1735",b:"#752d57",c:"#efc579",d:"#fff7ec",e:"#d89bb9"},
{a:"#152a25",b:"#3b5944",c:"#d7bd73",d:"#fffdf4",e:"#9abd9d"},
{a:"#eef2f1",b:"#dce7e3",c:"#386659",d:"#17372f",e:"#7fa99d"},
{a:"#2d2117",b:"#715332",c:"#efcb7a",d:"#fff8e9",e:"#be9a67"},
{a:"#082d45",b:"#0b7181",c:"#f0d083",d:"#fffdf5",e:"#6fc3c7"}
];return t[no%t.length]}
function kartZeminCiz(ctx,t,no){var g=ctx.createLinearGradient(no%2?1080:0,0,no%2?0:1080,1080);g.addColorStop(0,t.a);g.addColorStop(1,t.b);ctx.fillStyle=g;ctx.fillRect(0,0,1080,1080);ctx.save();if(no===0){ctx.strokeStyle=t.c;ctx.lineWidth=5;ctx.strokeRect(50,50,980,980);ctx.lineWidth=1.5;ctx.strokeRect(72,72,936,936);for(var i=0;i<4;i++){ctx.beginPath();ctx.arc(95+i*297,95,10,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.arc(985-i*297,985,10,0,Math.PI*2);ctx.stroke()}}else if(no===1){ctx.fillStyle="rgba(0,0,0,.16)";ctx.fillRect(0,0,1080,185);ctx.strokeStyle=t.c;ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(70,205);ctx.lineTo(1010,205);ctx.stroke();for(var x=85;x<1010;x+=92){ctx.beginPath();ctx.moveTo(x,205);ctx.lineTo(x+23,232);ctx.lineTo(x+46,205);ctx.stroke()}}else if(no===2){ctx.fillStyle="rgba(255,255,255,.36)";ctx.fillRect(55,55,970,970);ctx.strokeStyle=t.c;ctx.lineWidth=3;ctx.strokeRect(78,78,924,924);ctx.beginPath();ctx.moveTo(160,78);ctx.quadraticCurveTo(540,390,920,78);ctx.stroke();ctx.beginPath();ctx.moveTo(160,1002);ctx.quadraticCurveTo(540,690,920,1002);ctx.stroke()}else if(no===3){ctx.strokeStyle=t.c;ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(75,1000);ctx.lineTo(75,230);ctx.quadraticCurveTo(540,-80,1005,230);ctx.lineTo(1005,1000);ctx.stroke();ctx.lineWidth=1;for(var r=120;r<=300;r+=45){ctx.beginPath();ctx.arc(540,170,r,Math.PI,2*Math.PI);ctx.stroke()}}else if(no===4){ctx.fillStyle="rgba(255,255,255,.06)";ctx.beginPath();ctx.arc(540,520,445,0,Math.PI*2);ctx.fill();ctx.strokeStyle=t.c;ctx.lineWidth=4;ctx.beginPath();ctx.arc(540,520,465,0,Math.PI*2);ctx.stroke();ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(540,520,430,0,Math.PI*2);ctx.stroke()}else if(no===5){ctx.fillStyle="rgba(255,255,255,.76)";ctx.fillRect(105,75,870,930);ctx.strokeStyle=t.c;ctx.lineWidth=3;ctx.strokeRect(105,75,870,930);ctx.fillStyle=t.c;ctx.fillRect(105,75,12,930);ctx.fillRect(963,75,12,930);for(var y=120;y<970;y+=85){ctx.beginPath();ctx.arc(82,y,5,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(998,y,5,0,Math.PI*2);ctx.fill()}}else if(no===6){ctx.fillStyle="rgba(0,0,0,.13)";ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(1080,0);ctx.lineTo(1080,240);ctx.lineTo(0,360);ctx.closePath();ctx.fill();ctx.strokeStyle=t.c;ctx.lineWidth=5;ctx.strokeRect(55,55,970,970);for(var q=0;q<7;q++){var xx=120+q*140;ctx.beginPath();ctx.moveTo(xx,85);ctx.lineTo(xx+14,99);ctx.lineTo(xx,113);ctx.lineTo(xx-14,99);ctx.closePath();ctx.stroke()}}else{ctx.strokeStyle=t.c;ctx.lineWidth=4;ctx.strokeRect(52,52,976,976);ctx.globalAlpha=.35;for(var s=0;s<28;s++){var sx=80+(s*173)%920,sy=90+(s*251)%900;ctx.fillStyle=s%3===0?t.c:t.e;ctx.beginPath();ctx.arc(sx,sy,s%4===0?4:2,0,Math.PI*2);ctx.fill()}ctx.globalAlpha=1;ctx.beginPath();ctx.arc(540,155,105,0,Math.PI*2);ctx.stroke()}ctx.restore()}
function gorselKartOlustur(){if(!metin())return;el("cardBox").style.display="block";kartCiz();el("cardBox").scrollIntoView({behavior:"smooth",block:"start"})}
function kartCiz(){var c=el("cardCanvas"),ctx=c.getContext("2d"),no=__tasarimNo%8,t=kartTemasi(no),gun=el("gunSecim").value,parca=kartMetniniAyir();ctx.clearRect(0,0,1080,1080);kartZeminCiz(ctx,t,no);var iconY=no===1?125:145,titleY=no===1?185:240;ctx.fillStyle=t.c;ctx.textAlign="center";ctx.font="58px Georgia";ctx.fillText(gunSimgesi(gun),540,iconY+18);ctx.fillStyle=t.d;ctx.font="bold 46px Arial";ctx.fillText(gun,540,titleY);if(no!==1){ctx.strokeStyle=t.c;ctx.globalAlpha=.45;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(270,titleY+30);ctx.lineTo(810,titleY+30);ctx.stroke();ctx.globalAlpha=1}var startY=no===1?295:330,maxH=parca.imza?535:610,fit=metniKartaSigdir(ctx,parca.govde,820,maxH);ctx.font=fit.size+"px Georgia";ctx.textAlign="left";ctx.fillStyle=t.d;for(var i=0;i<fit.lines.length;i++){var line=fit.lines[i];if(line===""){startY+=Math.round(fit.lineHeight*.65)}else{var isLast=(i===fit.lines.length-1||fit.lines[i+1]==="");ikiYanaYaz(ctx,line,130,startY,820,isLast);startY+=fit.lineHeight}}if(parca.imza){ctx.textAlign="right";ctx.fillStyle=t.c;ctx.font="italic "+Math.max(24,Math.min(32,fit.size))+"px Georgia";ctx.fillText(parca.imza,950,925)}} function tasarimDegistir(){__tasarimNo=(__tasarimNo+1)%8;kartCiz()} function gorselKaydet(){kartCiz();var a=document.createElement("a");a.href=el("cardCanvas").toDataURL("image/png");a.download="mesajmatik-kart.png";a.click()} function gorselPaylas(){kartCiz();el("cardCanvas").toBlob(function(blob){if(!blob)return;var f=new File([blob],"mesajmatik-kart.png",{type:"image/png"});if(navigator.canShare&&navigator.canShare({files:[f]}))navigator.share({files:[f],title:"Mesajmatik"}).catch(function(){});else gorselKaydet()},"image/png")}
</script></body></html>`;
}

function generateMessageBridge(p){return generateMessage_(p||{})}
function extractGeminiText_(data){const parts=data&&data.candidates&&data.candidates[0]&&data.candidates[0].content&&data.candidates[0].content.parts;if(!Array.isArray(parts))return"";return parts.map(function(part){return part&&part.text?String(part.text):""}).join("\n").trim()}
function cleanAiText_(text){return String(text||"").replace(/\(\s*\d{1,4}\s*\)/g,"").replace(/[ \t]+\n/g,"\n").replace(/\n{3,}/g,"\n\n").replace(/[ \t]{2,}/g," ").trim()}

function generateMessage_(p){
  try{
    const apiKey=PropertiesService.getScriptProperties().getProperty("GEMINI_API_KEY");
    if(!apiKey)return{error:"Yapay zekâ mesaj üretim hatası.",detail:"GEMINI_API_KEY Script Property bulunamadı.",requestCount:0};
    const gun=String(p.gun||"").slice(0,80),uslup=String(p.uslup||"samimi").slice(0,40),uzunluk=String(p.uzunluk||"orta").slice(0,20),hitap=String(p.hitap||"").slice(0,120),imza=String(p.imza||"").slice(0,160),onceki=String(p.onceki||"").slice(0,1500),seed=String(p.seed||Date.now()).slice(0,80);
    if(!gun)return{error:"Yapay zekâ mesaj üretim hatası.",detail:"Gün bilgisi eksik.",requestCount:0};
    const uzunlukMetni=uzunluk==="kisa"?"45-70 kelime":uzunluk==="uzun"?"150-210 kelime":"90-130 kelime";
    const uslupAdi={samimi:"Samimi",resmi:"Resmî",kurumsal:"Kurumsal",dua:"Dua Ağırlıklı",kaynakli:"Ayet / Hadis Ağırlıklı"}[uslup]||"Samimi";
    const uslupTalimatlari={samimi:"İçten, sıcak ve kişiden kişiye doğal bir anlatım kullan.",resmi:"Saygılı, ölçülü, mesafeli ve protokole uygun bir anlatım kullan.",kurumsal:"Bir kurum adına yaz; çoğul anlatım, ortak değerler ve temsil dili kullan.",dua:"Mesajın ana omurgası dua olsun; dua fiillerini tekrar etme.",kaynakli:"Yalnız doğruluğundan emin olduğun kısa bir ayet meali veya sahih hadis kullan; kaynağı doğru belirt, alıntı uydurma."}[uslup]||"";
    const prompt=["Manevi ve özel günler için doğal, akıcı ve düzgün Türkçe kullanan özenli bir yazarsın.","Yalnızca nihai mesaj metnini yaz. Başlık, açıklama, analiz, madde numarası veya teknik işaret yazma.","","İstek kimliği: "+seed,"Gün: "+gun,"Üslup: "+uslupAdi,"Uzunluk: "+uzunlukMetni,"Hitap: "+(hitap||"yok"),"İmza: "+(imza||"yok"),"","Üslup talimatı: "+uslupTalimatlari,"","Kurallar:","- "+gun+" ifadesi mesajda doğal biçimde yer alsın.","- Türkçe ek, özne-yüklem, tekil-çoğul ve zamir uyumu doğru olsun.","- Samimi, Resmî ve Kurumsal metinlerin yapısı gerçekten farklı olsun.","- Hitap varsa kullanıcının yazdığı biçimi koruyarak ilk satırda yaz ve sonra bir boş satır bırak.","- İmza varsa en sonda bir boş satırdan sonra yalnızca imzayı yaz.","- Dinî, tarihî veya kurumsal bilgi uydurma.","- Parantez içinde tek başına sayı, dipnot numarası, kaynak numarası, token numarası veya benzeri teknik işaretler kullanma.","- Cümleyi yarıda kesme; mesaj doğal bir giriş ve tamamlanmış bir kapanış içersin.",onceki?"- Önceki mesaja yakın bir varyasyon üretme; giriş, ritim ve kapanışı değiştir.\n\nÖNCEKİ MESAJ:\n---\n"+onceki+"\n---":"","","Yalnızca nihai mesajı yaz."].join("\n");
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
