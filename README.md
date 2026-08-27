# Mesajmatik — Ana Proje Şartnamesi

Bu dosya Mesajmatik projesinin **ana referansıdır**. Bundan sonraki tüm geliştirmelerde önce bu dosya esas alınacaktır. Yeni bir değişiklik yapılırken burada yazan çalışan kurallar bozulmayacak, ilgisiz özellikler değiştirilmemelidir.

## 1. Projenin amacı

Mesajmatik; manevi günler ve özel zamanlar için kullanıcı seçimlerine göre **özgün, doğal ve düzgün Türkçe mesajlar** oluşturan, bu mesajları kopyalama/paylaşma imkânı veren ve 1080×1080 sosyal medya paylaşım kartına dönüştüren mobil uyumlu web uygulamasıdır.

## 2. Kullanıcıdan alınan bilgiler

- Özel gün / zaman
- Üslup
- Mesaj uzunluğu
- Hitap
- Özel vurgu / anahtar ifadeler
- İsim / kurum / şirket adı

## 3. Desteklenen günler

- Berat Kandili
- Kadir Gecesi
- Mevlid Kandili
- Regaib Kandili
- Miraç Kandili
- Ramazan Bayramı
- Kurban Bayramı
- Cuma Günü
- Ramazan Ayı
- Arefe Günü

## 4. Mesaj üslupları

- Samimi
- Resmî
- Kurumsal
- Dua ağırlıklı
- Ayet / Hadis ağırlıklı

Bu üsluplar yalnızca birkaç kelime değiştirilerek birbirine benzetilmeyecek. Giriş, özne, cümle yapısı, vurgu sırası ve kapanış da üsluba göre değişmelidir.

## 5. Mesaj üretimindeki ana kural

**Her mesaj isteğinde ilk ve zorunlu üretici Gemini olacaktır.**

Kullanıcı `Mesajı Oluştur` butonuna bastığında sistem önce Google Apps Script üzerinden Gemini API'ye gider.

Doğru akış:

1. Kullanıcı `Mesajı Oluştur` der.
2. Gemini ile yeni mesaj üretilir.
3. Gemini başarılıysa mesaj kullanıcıya gösterilir.
4. Gemini başarısızsa yerel üretici otomatik devreye girmez.
5. Kullanıcıya şu mantıkta bir uyarı gösterilir: **“Yapay zekâ ile mesaj üretilemedi. Yerel mesaj üreticisiyle devam etmek ister misiniz?”**
6. Kullanıcı açıkça **Evet / Yerel mesaj üret** derse yerel üretici çalışır.
7. Kullanıcı istemezse mesaj üretilmez.

**Otomatik fallback yasaktır.**

## 6. Her tıklamada yeni mesaj zorunluluğu

Her `Mesajı Oluştur` tıklaması yeni bir mesaj isteğidir.

Aynı gün, aynı üslup, aynı hitap, aynı özel vurgu ve aynı imza seçili olsa bile her yeni tıklamada **yeni ve belirgin biçimde farklı bir mesaj** üretilmelidir.

Sadece birkaç kelimesi değiştirilmiş eski mesaj yeni mesaj sayılmaz.

Yeni üretimde mümkün olduğunca değişmesi gerekenler:

- giriş yapısı
- cümle ritmi
- vurgu sırası
- kullanılan fiiller
- paragraf akışı
- kapanış biçimi

Önceki mesaj Gemini'ye tekrar azaltmak amacıyla verilebilir. Yeni mesaj önceki metinle aşırı benzerse yeniden üretim istenmelidir.

## 7. Özel vurgu / anahtar ifadeler

Kullanıcı bu alana herhangi bir ifade yazabilir. Örnekler yalnızca örnektir:

- gazi
- şehit
- Türk milleti
- Gazze
- İslam âlemi
- Bakırköy Ruh ve Sinir Hastalıkları
- tekerlek
- çocuklar
- umut
- sabır

Kod içinde `Gazze = yer`, `gazi = kişi grubu`, `umut = duygu` gibi sabit anlam sözlükleri veya özel kelime haritaları oluşturulmayacaktır.

Gemini her girdiyi bağlam içinde dinamik olarak yorumlamalıdır.

### Zorunlu görünürlük

Özel vurgu alanına yazılan **her ayrı ifade nihai mesajda tanınabilir biçimde yer almak zorundadır**.

Türkçenin doğal akışı için çoğul, iyelik veya hâl eki kullanılabilir. Örneğin `gazi` girdisi mesajda `gazi`, `gazilerimiz`, `gazilerimize` gibi doğal bir biçimde geçebilir.

Bu örnek bir kelime sözlüğü değildir; aynı kural kullanıcının yazabileceği her ifade için geçerlidir.

### Mekanik kullanım yasaktır

Şu tip ifadeler kullanılmamalıdır:

- “Özel olarak belirttiğiniz ...”
- “... konusundaki hassasiyetiniz ...”
- “Bu vurgu ...”
- Kullanıcı girdisini tırnak içine alıp yapay biçimde cümleye yapıştırmak

Özel vurgu mesajın gerçek anlam akışına doğal biçimde yerleştirilmelidir.

## 8. Farklı anlam türlerini zorla birleştirmeme

Yer, topluluk, kişi, kurum, unvan, nesne, duygu, değer veya soyut kavram gibi farklı türde girdiler sırf aynı alana yazıldılar diye aynı dilbilgisel yapı içine zorla sokulmayacaktır.

Gemini her ifadeyi kendi anlamına göre kullanmalıdır.

## 9. Türkçe ve içerik kalitesi

Mesajlarda:

- Türkçe ekler doğru kullanılmalı
- özne-yüklem uyumu korunmalı
- tekil/çoğul uyumu doğru olmalı
- zamirlerin gönderimi açık olmalı
- aynı dilek fiilleri gereksiz tekrarlanmamalı
- hazır ve mekanik kalıplar azaltılmalı
- dinî, tarihî, kurumsal veya toplumsal bilgi uydurulmamalı

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

## 12. Gemini cevabının doğrulanması

Google Apps Script Gemini cevabını kullanıcıya vermeden önce en az şu kontrolleri yapmalıdır:

- cevap boş mu?
- yeterli bir mesaj metni var mı?
- seçilen gün bağlamı korunmuş mu?
- özel vurgu girildiyse her ayrı vurgu görünür mü?
- önceki mesaja aşırı benziyor mu?

Eksik veya uygunsuz cevap mümkünse yeniden üretilmelidir.

## 13. Yerel mesaj üreticisi

Yerel üretici yalnızca Gemini başarısız olduktan **ve kullanıcı açıkça izin verdikten sonra** çalışır.

Yerel üretici:

- sabit tek paragraf kullanmayacak
- otomatik olarak devreye girmeyecek
- aynı metni sürekli tekrar etmeyecek
- seçilen gün, üslup, uzunluk, hitap, özel vurgu ve imzayı dikkate alacak
- her yeni üretimde farklı kombinasyon kuracak

Yerel üretici Gemini kadar semantik yorum yapamayabilir; ancak kullanıcı girdilerini kaybetmemeli ve mesajı değişken üretmelidir.

## 14. Teknik mimari

Mesaj üretim akışı:

`index.html → Google Apps Script → Gemini API`

### `index.html`

- kullanıcı arayüzü
- seçimlerin toplanması
- Apps Script çağrısı
- Gemini cevabının gösterilmesi
- Gemini hatasında kullanıcıdan yerel üretim onayı alınması
- kullanıcının onayı sonrası yerel üretim
- mesaj kopyalama/paylaşma
- kart oluşturma ve paylaşma

### `APPS_SCRIPT_KODU.gs`

- gelen parametreleri alır
- `GEMINI_API_KEY` değerini Script Properties'ten okur
- Gemini API çağrısını yapar
- cevap doğrulamasını yapar
- gerekirse yeniden üretir
- başarılı mesajı veya gerçek hata bilgisini `index.html`e döndürür

API anahtarı GitHub dosyalarında veya `index.html` içinde tutulmayacaktır.

## 15. Sosyal medya paylaşımı

Mesajmatik yalnızca WhatsApp paylaşımı yapan bir uygulama değildir.

Paylaşım sistemi mümkün olan platformlarda aşağıdakileri kapsamalıdır:

- WhatsApp
- Instagram
- Facebook
- X (Twitter)
- Telegram
- cihazın desteklediği diğer uygulamalar / sosyal ağlar

### Paylaşım ilkesi

Tarayıcı ve işletim sisteminin izin verdiği yerde **Web Share API / yerel paylaşım menüsü** tercih edilir. Böylece kullanıcı oluşturulan mesajı veya görsel kartı cihazında kurulu Instagram, Facebook, X, WhatsApp, Telegram ve diğer desteklenen uygulamalara gönderebilir.

Platformun doğrudan web paylaşım adresi desteklediği durumlarda uygun paylaşım bağlantıları kullanılabilir.

Instagram gibi tarayıcıdan doğrudan metin paylaşım URL'si sunmayan platformlarda kullanıcıya yanlış çalışan sahte bir bağlantı verilmeyecek; cihazın yerel paylaşım menüsü veya görsel kaydetme/paylaşma yöntemi kullanılacaktır.

**Sadece WhatsApp butonuyla sınırlı kalınmayacaktır.**

## 16. Paylaşım kartı

- Kart boyutu: 1080×1080
- Seçilen güne göre farklı görsel dil / simge kullanılabilir
- Kart mevcut mesajı kullanır; yeni mesaj üretmez
- Kart üretimi mesaj motorundan bağımsız tutulur
- uzun metin mümkün olduğunca kesilmeden otomatik ölçeklenir
- hitap ve imza düzeni korunur

### `Tasarımı Değiştir`

Bu buton:

- mesajı değiştirmez
- Gemini çağırmaz
- yerel mesaj üretmez
- yalnızca mevcut kartın tasarım varyasyonunu değiştirir

## 17. Kopyalama ve paylaşım

Kullanıcı oluşturulan metni:

- panoya kopyalayabilir
- desteklenen sosyal ağlara paylaşabilir
- görsel karta dönüştürebilir
- PNG olarak kaydedebilir
- cihaz destekliyorsa görseli doğrudan paylaşım menüsüne gönderebilir

## 18. Geliştirme sırasında korunacak kural

Bir özellik düzeltilirken çalışan, ilgisiz özellikler değiştirilmemelidir.

Örneğin mesaj motorunda değişiklik yapılıyorsa kart tasarımının çalışan kısmı gereksiz yere yeniden yazılmamalıdır.

Her değişiklik **cerrahi ve sınırlı** olmalıdır.

## 19. GitHub / Google Apps Script çalışma yöntemi

Ana dosyalar:

- `index.html`
- `APPS_SCRIPT_KODU.gs`
- `README.md` — bu ana şartname

GitHub tarafındaki dosyalar ChatGPT tarafından güncellenebilir.

Google Apps Script GitHub ile otomatik senkronize değildir. `APPS_SCRIPT_KODU.gs` değiştirildiğinde güncel kod kullanıcıya doğrudan verilmelidir. Kullanıcı bunu Google Apps Script'teki `Kod.gs` dosyasına yapıştırıp yeni sürüm olarak dağıtır.

Kod gerektiğinde kullanıcıya yalnızca “GitHub'a koydum” denmeyecek; **güncel kod doğrudan verilecektir**.

## 20. Nihai mesaj akışı

`Mesajı Oluştur`

→ Gemini ile yeni ve özgün mesaj üret

→ başarılıysa mesajı göster

→ başarısızsa kullanıcıya yerel üretim isteyip istemediğini sor

→ kullanıcı onaylarsa yerel özgün mesaj üret

→ kullanıcı onaylamazsa işlemi bitir

Ve sistemin değişmez ana kuralı:

> **Her yeni mesaj isteği, aynı girdiler kullanılsa bile yeni ve belirgin biçimde farklı bir mesaj üretmelidir.**
