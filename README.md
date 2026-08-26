# Mesajmatik

Manevi günler ve özel zamanlar için özgün tebrik mesajları ve 1080×1080 paylaşım kartları oluşturan mobil uyumlu web uygulamasıdır.

## Güncel yapı

- Öncelikli mesaj üretimi: Google Apps Script üzerinden Gemini
- API yanıt vermezse: tarayıcı içinde çalışan yedek mesaj motoru
- Kullanıcı arayüzünde kullanılan motor gösterilmez
- API anahtarı GitHub dosyalarında tutulmaz; Apps Script Properties içinde `GEMINI_API_KEY` olarak saklanır

## Desteklenen günler

Berat Kandili, Kadir Gecesi, Mevlid Kandili, Regaib Kandili, Miraç Kandili, Ramazan Bayramı, Kurban Bayramı, Cuma Günü, Ramazan Ayı ve Arefe Günü.

## Mesaj türleri

- Samimi
- Resmî
- Kurumsal
- Dua ağırlıklı
- Ayet / Hadis ağırlıklı

## Diğer özellikler

- Kısa, orta ve uzun mesaj
- İsteğe bağlı hitap
- Özel vurgu / anahtar kelimeler
- İsim / kurum / şirket imzası
- Kopyalama ve WhatsApp paylaşımı
- Günlere özel farklı çizim simgeleri
- Üç farklı kart yerleşimi
- Uzun metinlerde otomatik yazı boyutu ayarı
- PNG kaydetme ve desteklenen cihazlarda doğrudan görsel paylaşımı

## Çalışma ilkesi

Uygulama çevrimiçiyken önce Gemini üzerinden özgün mesaj almaya çalışır. Bağlantı, kota veya servis sorunu yaşanırsa kullanıcı boş bırakılmaz; yedek mesaj motoru otomatik devreye girer. Kart oluşturma işlemi tarayıcıdaki Canvas üzerinde yapılır.

## Kurulum

Web arayüzü `index.html` dosyasıdır. Gemini tarafının kurulumu için `API_KURULUM.md` dosyasındaki güncel Google Apps Script adımları kullanılmalıdır.
