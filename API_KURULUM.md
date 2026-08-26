# Mesajmatik – Yapay Zekâ API Kurulumu

Mesajmatik GitHub Pages üzerinde çalıştığı için API anahtarı **index.html içine yazılmamalıdır**. Aksi halde anahtar herkese açık hale gelir.

Bu depo içinde `cloudflare-worker.js` adlı güvenli bir aracı servis hazırlanmıştır.

## Önerilen yapı

GitHub Pages → Cloudflare Worker → OpenAI API

Bu yapıda OpenAI anahtarı yalnızca Cloudflare tarafında gizli değişken olarak tutulur.

## 1. OpenAI API anahtarı alın

1. https://platform.openai.com/ adresine giriş yapın.
2. API bölümünden yeni bir API key oluşturun.
3. Anahtarı bir yere yapıştırıp GitHub'a yüklemeyin.
4. Hesabınızda kullanım/faturalandırma sınırı belirleyin.

Mesajmatik için önerilen model: `gpt-5.4-mini`.

## 2. Cloudflare hesabı açın

1. https://dash.cloudflare.com/ adresine girin.
2. Workers & Pages bölümünden yeni bir Worker oluşturun.
3. Depodaki `cloudflare-worker.js` içeriğini Worker kodu olarak kullanın.
4. Worker ayarlarında Secret / Environment Variable olarak şunu ekleyin:

`OPENAI_API_KEY`

Değer kısmına OpenAI API anahtarınızı yazın.

## 3. Worker'ı yayınlayın

Yayınlandıktan sonra buna benzer bir adres elde edersiniz:

`https://mesajmatik-api.<hesabiniz>.workers.dev`

Bu adres gizli değildir. Gizli olan yalnızca `OPENAI_API_KEY` değeridir.

## 4. Ön yüz bağlantısı

Worker adresi alındıktan sonra Mesajmatik `index.html` içindeki “Yapay Zekâ ile Oluştur” düğmesi bu adrese bağlanacaktır.

API geçici olarak çalışmazsa Mesajmatik'in mevcut yerel mesaj üreticisi yedek olarak çalışmaya devam edecek şekilde tasarlanmalıdır.

## Güvenlik

- API anahtarını GitHub'a koymayın.
- API anahtarını sohbetlerde paylaşmayın.
- OpenAI hesabında düşük bir aylık harcama limiti belirleyin.
- Worker yalnızca `https://turgutaydin1.github.io` kaynağına tarayıcı erişimi verecek şekilde hazırlanmıştır.
