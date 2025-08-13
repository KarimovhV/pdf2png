import { Alert } from 'react-native';

// Backend URL'inizi buraya ekleyin
const BASE_URL = 'https://pdf2png-ihrx.onrender.com'; // Örnek: 'https://your-backend.herokuapp.com'

class ApiService {
  constructor() {
    this.baseURL = BASE_URL;
    this.timeout = 30000; // 30 saniye timeout
  }

  async convertPDFToPNG(files, pageLimits) {
    try {
      const formData = new FormData();
      
      // Dosyaları form data'ya ekle
      files.forEach((file, index) => {
        formData.append('pdf_files', {
          uri: file.uri,
          type: 'application/pdf',
          name: file.name
        });
        formData.append('page_limits', pageLimits[index] || '');
      });

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(`${this.baseURL}/convert`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Error:', error);
      
      if (error.name === 'AbortError') {
        throw new Error('İstek zaman aşımına uğradı. Lütfen tekrar deneyin.');
      }
      
      if (error.message.includes('Network request failed')) {
        throw new Error('İnternet bağlantınızı kontrol edin.');
      }
      
      throw new Error('Dönüştürme sırasında bir hata oluştu.');
    }
  }

  async downloadFile(url) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(`${this.baseURL}${url}`, {
        method: 'GET',
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response;
    } catch (error) {
      console.error('Download Error:', error);
      
      if (error.name === 'AbortError') {
        throw new Error('İndirme zaman aşımına uğradı.');
      }
      
      throw new Error('Dosya indirilemedi.');
    }
  }

  async checkServerHealth() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 saniye

      const response = await fetch(`${this.baseURL}/`, {
        method: 'GET',
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      console.error('Health Check Error:', error);
      return false;
    }
  }

  setBaseURL(url) {
    this.baseURL = url;
  }

  getBaseURL() {
    return this.baseURL;
  }
}

// Singleton instance
const apiService = new ApiService();

export default apiService;

// Helper functions
export const handleApiError = (error) => {
  let message = 'Bilinmeyen bir hata oluştu.';
  
  if (error.message) {
    message = error.message;
  }
  
  Alert.alert('Hata', message);
};

export const isNetworkError = (error) => {
  return error.message.includes('Network request failed') || 
         error.message.includes('fetch');
};

export const isTimeoutError = (error) => {
  return error.name === 'AbortError' || 
         error.message.includes('timeout');
};