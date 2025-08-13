# PDF to PNG Dönüştürücü - Mobil Uygulama

Bu uygulama, PDF dosyalarını yüksek kalitede PNG görüntülerine dönüştüren mobil uygulamadır. React Native ve Expo kullanılarak geliştirilmiştir.

## Özellikler

- 📱 **Çoklu Platform Desteği**: iOS ve Android
- 📄 **Çoklu PDF Seçimi**: Aynı anda birden fazla PDF dosyası seçebilme
- 🎯 **Sayfa Sınırı**: Her PDF için dönüştürülecek sayfa sayısını belirleme
- 🌙 **Karanlık/Aydınlık Tema**: Kullanıcı tercihine göre tema değiştirme
- 📤 **Kolay Paylaşım**: Dönüştürülen dosyaları kolayca paylaşma
- 🔗 **İlgili Ürünler**: QR Kod üreticisi gibi diğer araçlara erişim

## Kurulum

### Gereksinimler
- Node.js (v14 veya üzeri)
- Expo CLI
- iOS Simulator (iOS geliştirme için)
- Android Studio (Android geliştirme için)

### Adımlar

1. **Bağımlılıkları yükleyin:**
   ```bash
   npm install
   ```

2. **Uygulamayı başlatın:**
   ```bash
   npx expo start
   ```

3. **Cihazda test edin:**
   - iOS: `i` tuşuna basın
   - Android: `a` tuşuna basın
   - Fiziksel cihaz: Expo Go uygulamasını indirin ve QR kodu tarayın

## Yapılandırma

### Backend URL'ini Güncelleme

`App.js` dosyasında `YOUR_WEBSITE_URL` kısmını gerçek backend URL'iniz ile değiştirin:

```javascript
const response = await fetch('https://your-backend-url.com/convert', {
  method: 'POST',
  body: formData,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});
```

### App Store / Google Play Store için Hazırlık

1. **EAS Build kurulumu:**
   ```bash
   npm install -g @expo/cli
   expo install expo-dev-client
   ```

2. **Build yapılandırması:**
   ```bash
   expo build:configure
   ```

3. **iOS için build:**
   ```bash
   expo build:ios
   ```

4. **Android için build:**
   ```bash
   expo build:android
   ```

## Kullanılan Teknolojiler

- **React Native**: Mobil uygulama framework'ü
- **Expo**: Geliştirme ve dağıtım platformu
- **expo-document-picker**: Dosya seçimi
- **expo-file-system**: Dosya işlemleri
- **expo-sharing**: Dosya paylaşımı
- **expo-linear-gradient**: Gradient efektleri
- **@expo/vector-icons**: İkonlar

## Özellik Detayları

### PDF Dosyası Seçimi
- Cihazdan PDF dosyalarını seçme
- Çoklu dosya seçimi desteği
- Dosya bilgilerini görüntüleme

### Dönüştürme İşlemi
- Backend API ile entegrasyon
- İlerleme göstergesi
- Hata yönetimi

### Sonuç Yönetimi
- Dönüştürülen dosyaları listeleme
- Dosyaları paylaşma
- Yerel depolama

### Kullanıcı Deneyimi
- Responsive tasarım
- Karanlık/aydınlık tema
- Smooth animasyonlar
- Kullanıcı dostu arayüz

## Geliştirme Notları

### Performans Optimizasyonları
- Lazy loading
- Memory management
- Efficient re-rendering

### Güvenlik
- Dosya türü doğrulama
- Güvenli API çağrıları
- Kullanıcı verilerinin korunması

## Sorun Giderme

### Yaygın Sorunlar

1. **Metro bundler hatası:**
   ```bash
   npx expo start --clear
   ```

2. **iOS simulator açılmıyor:**
   ```bash
   sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
   ```

3. **Android emulator bağlantı sorunu:**
   ```bash
   adb reverse tcp:8081 tcp:8081
   ```

## Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add some amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## İletişim

- Website: [www.karimov.info](https://www.karimov.info)
- QR Kod Üreticisi: [qrkodyarat.netlify.app](https://qrkodyarat.netlify.app)