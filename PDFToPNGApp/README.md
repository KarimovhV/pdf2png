# PDF to PNG Converter Mobile App

Bu proje, web sitesindeki PDF to PNG dönüştürücünün React Native ile geliştirilmiş mobil uygulama versiyonudur.

## Özellikler

- 📱 iOS ve Android desteği
- 📄 Çoklu PDF dosyası seçimi
- 🖼️ Yüksek kaliteli PNG dönüştürme
- 📊 Sayfa sınırı belirleme
- 📤 Dosya paylaşımı
- 🌙 Karanlık/Aydınlık tema desteği
- 📱 Responsive tasarım

## Kurulum

1. Projeyi klonlayın:
```bash
git clone <repository-url>
cd PDFToPNGApp
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Expo CLI'yi yükleyin (eğer yüklü değilse):
```bash
npm install -g @expo/cli
```

4. Uygulamayı başlatın:
```bash
npx expo start
```

## Kullanılan Teknolojiler

- **React Native**: Mobil uygulama framework'ü
- **Expo**: Geliştirme ve dağıtım platformu
- **React Native Paper**: Material Design bileşenleri
- **Expo Document Picker**: Dosya seçimi
- **Expo File System**: Dosya işlemleri
- **Expo Sharing**: Dosya paylaşımı

## Önemli Notlar

- PDF dönüştürme işlemi şu anda simüle edilmektedir
- Gerçek PDF to PNG dönüştürme için ek kütüphaneler gerekebilir
- iOS ve Android için farklı izinler gerekebilir

## Geliştirme

### PDF Dönüştürme İyileştirmeleri

Gerçek PDF dönüştürme işlemi için aşağıdaki kütüphaneler kullanılabilir:

1. **react-native-pdf**: PDF görüntüleme ve işleme
2. **react-native-view-shot**: Ekran görüntüsü alma
3. **react-native-canvas**: Canvas işlemleri

### Performans Optimizasyonları

- Büyük dosyalar için chunk-based işleme
- Background task desteği
- Progress indicator iyileştirmeleri
- Memory management

## Dağıtım

### Android
```bash
npx expo build:android
```

### iOS
```bash
npx expo build:ios
```

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır.