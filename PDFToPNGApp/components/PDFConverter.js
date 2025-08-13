import * as FileSystem from 'expo-file-system';
import { Alert } from 'react-native';

// PDF to PNG conversion utility
export class PDFConverter {
  static async convertPDFToPNG(pdfUri, pageLimit = null) {
    try {
      // Bu gerçek bir PDF to PNG dönüştürme implementasyonu olacak
      // Şimdilik demo amaçlı basit bir simülasyon yapıyoruz
      
      const fileName = pdfUri.split('/').pop().replace('.pdf', '');
      const outputDir = `${FileSystem.documentDirectory}converted/`;
      
      // Klasör oluştur
      await FileSystem.makeDirectoryAsync(outputDir, { intermediates: true });
      
      // Simulated conversion - gerçek uygulamada PDF parsing library kullanılacak
      const convertedFiles = [];
      const maxPages = pageLimit || 5; // Demo için maksimum 5 sayfa
      
      for (let i = 1; i <= maxPages; i++) {
        const outputPath = `${outputDir}${fileName}_page_${i}.png`;
        
        // Demo amaçlı boş dosya oluştur
        // Gerçek uygulamada burada PDF sayfası PNG'ye dönüştürülecek
        await FileSystem.writeAsStringAsync(outputPath, '', { encoding: 'base64' });
        
        convertedFiles.push({
          page: i,
          path: outputPath,
          name: `${fileName}_page_${i}.png`
        });
      }
      
      return convertedFiles;
    } catch (error) {
      console.error('PDF conversion error:', error);
      throw new Error('PDF dönüştürme işlemi başarısız oldu.');
    }
  }
  
  static async getFileInfo(uri) {
    try {
      const info = await FileSystem.getInfoAsync(uri);
      return info;
    } catch (error) {
      console.error('File info error:', error);
      return null;
    }
  }
  
  static formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}