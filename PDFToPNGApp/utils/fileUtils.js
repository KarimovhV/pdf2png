import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getFileExtension = (filename) => {
  return filename.split('.').pop().toLowerCase();
};

export const isValidPDF = (file) => {
  const validExtensions = ['pdf'];
  const extension = getFileExtension(file.name);
  return validExtensions.includes(extension);
};

export const generateUniqueId = () => {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
};

export const downloadFile = async (url, filename) => {
  try {
    const downloadResumable = FileSystem.createDownloadResumable(
      url,
      FileSystem.documentDirectory + filename,
      {},
      (downloadProgress) => {
        const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
        console.log(`Download progress: ${Math.round(progress * 100)}%`);
      }
    );

    const result = await downloadResumable.downloadAsync();
    return result;
  } catch (error) {
    console.error('Download error:', error);
    throw error;
  }
};

export const shareFile = async (fileUri, filename, mimeType = 'image/png') => {
  try {
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri, {
        mimeType,
        dialogTitle: filename,
        UTI: mimeType === 'image/png' ? 'public.png' : 'public.item'
      });
      return true;
    } else {
      Alert.alert('Bilgi', 'Bu cihazda paylaşım özelliği mevcut değil.');
      return false;
    }
  } catch (error) {
    console.error('Share error:', error);
    Alert.alert('Hata', 'Dosya paylaşılırken bir hata oluştu.');
    return false;
  }
};

export const deleteFile = async (fileUri) => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    if (fileInfo.exists) {
      await FileSystem.deleteAsync(fileUri);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Delete error:', error);
    return false;
  }
};

export const createDirectory = async (dirPath) => {
  try {
    const dirInfo = await FileSystem.getInfoAsync(dirPath);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(dirPath, { intermediates: true });
    }
    return true;
  } catch (error) {
    console.error('Create directory error:', error);
    return false;
  }
};

export const clearCache = async () => {
  try {
    const cacheDir = FileSystem.cacheDirectory;
    const files = await FileSystem.readDirectoryAsync(cacheDir);
    
    const deletePromises = files.map(file => 
      FileSystem.deleteAsync(cacheDir + file, { idempotent: true })
    );
    
    await Promise.all(deletePromises);
    return true;
  } catch (error) {
    console.error('Clear cache error:', error);
    return false;
  }
};

export const getFileInfo = async (fileUri) => {
  try {
    const info = await FileSystem.getInfoAsync(fileUri);
    return info;
  } catch (error) {
    console.error('Get file info error:', error);
    return null;
  }
};

export const validateFileSize = (file, maxSizeMB = 50) => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

export const sanitizeFilename = (filename) => {
  // Remove or replace invalid characters
  return filename.replace(/[<>:"/\\|?*]/g, '_').trim();
};