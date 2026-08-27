# Mesajmatik — Ana Proje Şartnamesi

Bu dosya Mesajmatik projesinin **ana ve bağlayıcı referansıdır**. Bundan sonraki tüm geliştirmelerde önce bu dosya esas alınacaktır. Yeni bir değişiklik yapılırken burada yazan ve çalışan kurallar bozulmayacak; ilgisiz özelliklere dokunulmayacaktır.

## 1. Projenin amacı

Mesajmatik; manevi günler ve özel zamanlar için kullanıcı seçimlerine göre özgün, doğal ve düzgün Türkçe mesajlar oluşturan, bu mesajları kopyalama/paylaşma imkânı veren ve 1080×1080 sosyal medya paylaşım kartına dönüştüren mobil uyumlu web uygulamasıdır.

## 2. Kullanıcıdan alınan bilgiler

- Özel gün / zaman
- Üslup
- Mesaj uzunluğu
- Hitap
- Özel vurgu / anahtar ifadeler
- İsim / kurum / şirket adı

## 3. Desteklenen günler ve sıralama

Özel Gün / Zaman açılır listesi **daima Türkçe A→Z alfabetik sırada** gösterilecektir:

- Arefe Günü
- Berat Kandili
- Cuma Günü
- Kadir Gecesi
- Kurban Bayramı
- Mevlid Kandili
- Miraç Kandili
- Ramazan Ayı
- Ramazan Bayramı
- Regaib Kandili

Yeni gün eklenirse liste yeniden A→Z sıralanacaktır.

## 4. Mesaj üslupları

- Samimi
- Resmî
- Kurumsal
- Dua ağırlıklı
- Ayet / Hadis ağırlıklı

Bu üsluplar yalnızca birkaç kelime değiştirilerek birbirine benzetilmeyecek. Giriş, özne, cümle yapısı, vurgu sırası ve kapanış da üsluba göre değişmelidir.

## 5. Çalışan Gemini yapısı — KORUNACAK

Mesajmatik’in halen çalışan yapısı:

- Model: `gemini-3.6-flash`
- API: `generateContent`
- Google Apps Script üzerinden doğrudan çağrı
- **1 tıklama = 1 Gemini API isteği**
- Otomatik retry yok
- İkinci/üçüncü kalite kontrol API çağrısı yok
- `maxOutputTokens: 2048`
- `thinkingConfig.thinkingLevel: "minimal"`
- `finishReason` kontrol edilir
- `STOP` dışındaki tamamlanmamış cevaplar başarılı mesaj olarak gösterilmez
- Yarım cevap kullanıcıya nihai mesaj diye verilmez

**Arayüz, kart, ikon, sıralama veya paylaşım düzeni değiştirilirken bu çalışan Gemini bölümü değiştirilmeyecektir.** Gemini tarafında değişiklik ancak doğrudan Gemini problemi için ayrıca karar verilirse yapılacaktır.

## 6. Mesaj üretimindeki ana kural

Her mesaj isteğinde ilk ve zorunlu üretici Gemini’dir.

Doğru akış:

1. Kullanıcı `Mesajı Oluştur` der.
2. Gemini ile yeni mesaj üretilir.
3. Gemini başarılıysa tamamlanmış mesaj gösterilir.
4. Gemini başarısızsa yerel üretici otomatik devreye girmez.
5. Kullanıcıya “Yapay zekâ ile mesaj üretilemedi. Yerel mesaj üreticisiyle devam etmek ister misiniz?” mantığında açık onay sorulur.
6. Kullanıcı açıkça onaylarsa yerel üretici çalışır.
7. Kullanıcı istemezse mesaj üretilmez.

**Otomatik fallback yasaktır.**

## 7. Her tıklamada yeni mesaj zorunluluğu

Her `Mesajı Oluştur` tıklaması yeni bir mesaj isteğidir. Aynı gün, aynı üslup, aynı hitap, aynı özel vurgu ve aynı imza seçili olsa bile yeni ve belirgin biçimde farklı bir mesaj üretilmelidir.

Yeni üretimde mümkün olduğunca şu unsurlar değişmelidir:

- giriş yapısı
- cümle ritmi
- vurgu sırası
- kullanılan fiiller
- paragraf akışı
- kapanış biçimi

Önceki mesaj yalnızca çeşitliliği artırmak için bağlam olarak verilebilir. Bunun için ikinci bir API çağrısı yapılmayacaktır.

## 8. Özel vurgu / anahtar ifadeler

Kullanıcı bu alana herhangi bir ifade yazabilir. Kod içinde sabit semantik sözlükler veya kelime haritaları oluşturulmayacaktır.

Gemini her girdiyi bağlam içinde dinamik olarak yorumlamalıdır.

Özel vurgu alanına yazılan her ayrı ifade nihai mesajda tanınabilir biçimde yer almalıdır. Türkçenin doğal akışı için uygun ekler kullanılabilir.

Şu tip mekanik kullanımlar yasaktır:

- “Özel olarak belirttiğiniz ...”
- “... konusundaki hassasiyetiniz ...”
- “Bu vurgu ...”
- Kullanıcı girdisini tırnak içine alıp yapay biçimde cümleye yapıştırmak

Yer, topluluk, kişi, kurum, unvan, nesne, duygu, değer veya soyut kavram gibi farklı anlam türleri aynı dilbilgisel kalıba zorlanmayacaktır.

## 9. Türkçe ve içerik kalitesi

Mesajlarda:

- Türkçe ekler doğru kullanılmalı
- özne-yüklem uyumu korunmalı
- tekil/çoğul uyumu doğru olmalı
- zamirlerin gönderimi açık olmalı
- aynı dilek fiilleri gereksiz tekrarlanmamalı
- hazır ve mekanik kalıplar azaltılmalı
- dinî, tarihî, kurumsal veya toplumsal bilgi uydurulmamalı
- parantez içinde anlamsız sayı, token numarası, teknik işaret vb. bulunmamalı
- cümleler yarım bırakılmamalı

Sabit kapanışlar otomatik olarak her mesaja eklenmeyecektir.

## 10. Mesaj uzunluğu

Yaklaşık hedefler:

- Kısa: 45–70 kelime
- Orta: 90–130 kelime
- Uzun: 150–210 kelime

Doğal anlatım kelime sayısından daha önemlidir.

## 11. Hitap ve imza düzeni

Hitap seçilmişse ilk satırda bulunur, ardından bir boş satır bırakılır.

İsim / kurum / şirket girilmişse mesaj sonunda bir boş satırdan sonra yalnızca imza yer alır.

## 12. Teknik mimari — GÜNCEL

Gerçek çalışan uygulama artık GitHub Pages içindeki eski uygulama değildir.

Güncel yapı:

`GitHub Pages index.html → çalışan Google Apps Script /exec adresine yönlendirme`

`Google Apps Script Kod.gs → arayüz + kart sistemi + google.script.run → Gemini API`

### Google Apps Script `Kod.gs`

- uygulamanın gerçek arayüzünü doğrudan üretir
- HTML içeriği `String.raw` ile güvenli biçimde gömülür
- kullanıcı seçimlerini toplar
- `google.script.run` ile sunucu fonksiyonunu çağırır
- `GEMINI_API_KEY` değerini Script Properties’ten okur
- Gemini API çağrısını yapar
- tamamlanmamış cevabı reddeder
- mesajı, paylaşımı ve kart sistemini çalıştırır

### GitHub `index.html`

- artık eski uygulama kodunu çalıştırmaz
- doğrudan canlı Apps Script `/exec` adresine yönlendirir
- böylece GitHub Pages adresini açan kullanıcı da gerçek çalışan Mesajmatik’e ulaşır

GitHub Pages üzerinde eski popup, iframe, JSONP veya eski API köprüsü yeniden kullanılmayacaktır.

## 13. Sosyal medya paylaşımı

Desteklenecek platformlar:

- WhatsApp
- Instagram
- Facebook
- X
- Telegram
- cihazın desteklediği diğer uygulamalar

Tarayıcı ve işletim sistemi izin verdiğinde Web Share API / yerel paylaşım menüsü tercih edilir.

### Sosyal medya butonlarının görünümü

- Büyük, satır genişliğinde sosyal medya butonları kullanılmayacaktır.
- Sosyal platformlar **küçük, kompakt, ikon/logo ağırlıklı butonlarla** gösterilecektir.
- WhatsApp, Facebook, X, Telegram ve Instagram kendi tanınabilir simge/işaretleriyle temsil edilecektir.
- Ana `Kopyala`, `Paylaş` ve `Görsel Kart` işlemleri ayrı ana işlem butonları olarak kalabilir.
- Sosyal medya ikonları mobil ekranda gereksiz alan kaplamamalıdır.

Instagram için tarayıcıdan sahte/doğrudan metin paylaşım URL’si uydurulmayacak; yerel paylaşım veya görsel paylaşım yolu kullanılacaktır.

## 14. Paylaşım kartı — SABİT TASARIM KURALLARI

- Kart boyutu kesin olarak 1080×1080’dir.
- Tasarım sade, temiz ve manevi çizgide olacaktır.
- Gereksiz süs, karmaşa ve yoğun dekor kullanılmayacaktır.
- Her özel gün/gece için **ayrı ve tanınabilir bir simge** olacaktır.
- Gün simgesi yalnız dekor değil, seçilen günü ayırt eden sabit görsel kimlik unsurudur.
- Kart mevcut mesajı kullanır; yeni mesaj üretmez.
- Kart üretimi Gemini mesaj motorundan bağımsızdır.
- **Mesajın tamamı karta alınacaktır; metin kesilmeyecektir.**
- Metin uzun olduğunda yazı boyutu ve satır aralığı otomatik küçültülerek 1080×1080 alana sığdırılacaktır.
- Mesajın son kısmını kesmek, `...` ile kırpmak veya belirli satır sayısından sonra durdurmak yasaktır.
- Hitap, paragraf boşlukları ve imza düzeni mümkün olduğunca korunacaktır.
- **Kartın ana gövde metni iki yana yaslı (justify) olacaktır.**
- Paragrafın son satırı doğal biçimde sola hizalı kalabilir; diğer satırlar sol ve sağ metin sınırlarına dengeli oturmalıdır.
- Daha önce mutabık kalınan iki yana yaslı metin düzeni sonraki tasarım değişikliklerinde bozulmayacaktır.

### Günlere özel simge zorunluluğu

Mevcut desteklenen her gün için farklı simge tanımlanacaktır. Yeni gün eklenirse ona da ayrı simge tanımlanması zorunludur.

### `Tasarımı Değiştir`

Bu buton:

- mesajı değiştirmez
- Gemini çağırmaz
- yerel mesaj üretmez
- yalnızca kartın sade görsel varyasyonunu değiştirir
- iki yana yaslı metin, tam metni gösterme ve güne özel simge kurallarını bozmaz

## 15. Kopyalama ve paylaşım

Kullanıcı oluşturulan metni:

- panoya kopyalayabilir
- desteklenen sosyal ağlara paylaşabilir
- görsel karta dönüştürebilir
- PNG olarak kaydedebilir
- cihaz destekliyorsa görseli doğrudan paylaşım menüsüne gönderebilir

## 16. Geliştirme sırasında korunacak temel kural

**Çalışan bir özellik, başka bir özellik düzeltilirken değiştirilmez.**

Özellikle:

- kart değişikliği yapılırken Gemini motoruna dokunulmaz
- sosyal medya butonları değiştirilirken mesaj motoruna dokunulmaz
- gün sıralaması değiştirilirken API akışına dokunulmaz
- simge değiştirilirken metin hizası veya tam metin kuralı bozulmaz
- daha önce açıkça mutabık kalınmış tasarım/işlev kararları yeni bir talimat onları değiştirmedikçe korunur

Her değişiklik cerrahi ve sınırlı olmalıdır.

## 17. GitHub / Google Apps Script çalışma yöntemi

Ana dosyalar:

- `APPS_SCRIPT_KODU.gs` — Google Apps Script `Kod.gs` için ana kaynak
- `index.html` — yalnızca canlı Apps Script uygulamasına yönlendirme
- `README.md` — ana şartname ve bağlayıcı karar kaydı

Google Apps Script GitHub ile otomatik senkronize değildir.

`APPS_SCRIPT_KODU.gs` değiştirildiğinde:

1. GitHub güncellenir.
2. Güncel dosya yeniden GitHub’dan okunur.
3. Kullanıcıya **tam ve güncel Kod.gs içeriği** doğrudan verilir.
4. Kullanıcı Apps Script’e yapıştırır ve yeni sürüm dağıtır.

Kullanıcıya yalnızca “GitHub’a koydum” denmeyecektir.

## 18. Değişmez nihai akış

`Mesajı Oluştur`

→ Gemini 3.6 Flash ile **tek API isteğinde** yeni ve özgün mesaj üret

→ cevap `STOP` ile tamamlandıysa mesajı göster

→ tamamlanmadıysa yarım metni göstermeden hata kabul et

→ başarısızsa kullanıcıya yerel üretim isteyip istemediğini sor

→ kullanıcı onaylarsa yerel mesaj üret

→ kullanıcı onaylamazsa işlemi bitir

Değişmez ana kurallar:

> **Her yeni mesaj isteği, aynı girdiler kullanılsa bile yeni ve belirgin biçimde farklı bir mesaj üretmelidir.**

> **Çalışan Gemini yapısı, arayüz ve görsel geliştirmeleri sırasında bozulmayacaktır.**

> **Paylaşım kartı mesajın tamamını göstermeli, ana metni iki yana yaslı olmalı ve seçilen güne özel simge kullanmalıdır.**
