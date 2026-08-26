# Mesajmatik – Gemini / Google Apps Script Kurulumu

Mesajmatik GitHub Pages üzerinde çalışır. Gemini API anahtarı `index.html` içine yazılmaz. Anahtar Google Apps Script tarafında Script Properties içinde saklanır.

## Güncel mimari

GitHub Pages → Google Apps Script Web App → Gemini API

Gemini yanıt vermezse web arayüzündeki yerel yedek mesaj motoru otomatik devreye girer.

## 1. Apps Script projesi

Google Apps Script projesinde `Kod.gs` dosyasının tamamını depodaki `APPS_SCRIPT_KODU.gs` içeriğiyle aynı tutun.

## 2. API anahtarı

Apps Script proje ayarlarında Script Properties bölümüne şu özelliği ekleyin:

- Özellik adı: `GEMINI_API_KEY`
- Değer: Gemini API anahtarınız

API anahtarını GitHub'a, HTML içine veya herkese açık bir dosyaya yazmayın.

## 3. Web App dağıtımı

Apps Script içinde:

1. Dağıt → Dağıtımları yönet
2. Mevcut Web App dağıtımını düzenle
3. Yeni sürüm seç
4. Yürütme sahibi: Ben
5. Erişim: Herkes
6. Dağıt / Güncelle

Mevcut dağıtımı güncellerseniz `/exec` adresi değişmez.

## 4. Ön yüz bağlantısı

`index.html` içindeki `API_URL` değeri Apps Script Web App `/exec` adresini gösterir.

## 5. Çalışma düzeni

- Önce Gemini çağrılır.
- Başarılı yanıt gelirse mesaj doğrudan kullanılır.
- Ağ, kota, servis veya zaman aşımı olursa yedek motor devreye girer.
- Son kullanıcıya hangi motorun çalıştığı gösterilmez.
- Geliştirme için son motor bilgisi tarayıcıda `window.__mesajmatikDebug` değişkeninde tutulur.

## 6. Güncelleme notu

`APPS_SCRIPT_KODU.gs` GitHub'da değiştirildiğinde Google Apps Script'teki canlı dağıtım otomatik güncellenmez. Canlı servis için Apps Script kodu da güncel içerikle eşleştirilip yeni sürüm olarak dağıtılmalıdır.
