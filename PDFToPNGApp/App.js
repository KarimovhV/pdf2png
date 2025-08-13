import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
  StatusBar,
  SafeAreaView,
  ActivityIndicator,
  Linking,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';

const { width, height } = Dimensions.get('window');

export default function App() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isConverting, setIsConverting] = useState(false);
  const [convertedFiles, setConvertedFiles] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const colors = {
    light: {
      primary: '#667eea',
      secondary: '#764ba2',
      background: '#f8fafc',
      surface: '#ffffff',
      text: '#374151',
      textSecondary: '#6b7280',
      border: '#e5e7eb',
      success: '#10b981',
      danger: '#ef4444',
      info: '#3b82f6'
    },
    dark: {
      primary: '#4338ca',
      secondary: '#6366f1',
      background: '#0f172a',
      surface: '#1e293b',
      text: '#f1f5f9',
      textSecondary: '#cbd5e1',
      border: '#475569',
      success: '#059669',
      danger: '#dc2626',
      info: '#2563eb'
    }
  };

  const theme = isDarkMode ? colors.dark : colors.light;

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        multiple: true,
        copyToCacheDirectory: true
      });

      if (!result.canceled && result.assets) {
        const newFiles = result.assets.map(asset => ({
          ...asset,
          id: Math.random().toString(36).substr(2, 9),
          pageLimit: null
        }));
        setSelectedFiles(prev => [...prev, ...newFiles]);
      }
    } catch (error) {
      Alert.alert('Hata', 'Dosya seçilirken bir hata oluştu.');
    }
  };

  const removeFile = (fileId) => {
    setSelectedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const updatePageLimit = (fileId, limit) => {
    setSelectedFiles(prev => 
      prev.map(file => 
        file.id === fileId ? { ...file, pageLimit: limit } : file
      )
    );
  };

  const convertToPNG = async () => {
    if (selectedFiles.length === 0) {
      Alert.alert('Uyarı', 'Lütfen en az bir PDF dosyası seçin.');
      return;
    }

    setIsConverting(true);
    setConvertedFiles([]);

    try {
      const formData = new FormData();
      
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        formData.append('pdf_files', {
          uri: file.uri,
          type: 'application/pdf',
          name: file.name
        });
        formData.append('page_limits', file.pageLimit || '');
      }

      // Web sitenizin URL'ini buraya ekleyin
      const response = await fetch('YOUR_WEBSITE_URL/convert', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = await response.json();
      
      if (data.urls && data.urls.length > 0) {
        const downloadedFiles = [];
        
        for (const url of data.urls) {
          try {
            const filename = url.split('/').pop();
            const downloadUrl = `YOUR_WEBSITE_URL${url}`;
            const localUri = FileSystem.documentDirectory + filename;
            
            const downloadResult = await FileSystem.downloadAsync(downloadUrl, localUri);
            
            if (downloadResult.status === 200) {
              downloadedFiles.push({
                name: filename,
                uri: downloadResult.uri
              });
            }
          } catch (downloadError) {
            console.error('Download error:', downloadError);
          }
        }
        
        setConvertedFiles(downloadedFiles);
        Alert.alert('Başarılı', `${downloadedFiles.length} dosya başarıyla dönüştürüldü!`);
      }
    } catch (error) {
      console.error('Conversion error:', error);
      Alert.alert('Hata', 'Dönüştürme sırasında bir hata oluştu.');
    } finally {
      setIsConverting(false);
    }
  };

  const shareFile = async (fileUri, fileName) => {
    try {
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'image/png',
          dialogTitle: fileName
        });
      } else {
        Alert.alert('Bilgi', 'Bu cihazda paylaşım özelliği mevcut değil.');
      }
    } catch (error) {
      Alert.alert('Hata', 'Dosya paylaşılırken bir hata oluştu.');
    }
  };

  const openQRCodeSite = () => {
    Linking.openURL('https://qrkodyarat.netlify.app');
  };

  const openWebsite = () => {
    Linking.openURL('https://www.karimov.info');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar 
        barStyle={isDarkMode ? 'light-content' : 'dark-content'} 
        backgroundColor={theme.background}
      />
      
      {/* Header */}
      <LinearGradient
        colors={[theme.primary, theme.secondary]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>PDF to PNG</Text>
          <Text style={styles.headerSubtitle}>✨ En yüksek kalitede dönüştürme</Text>
          <TouchableOpacity
            style={styles.themeToggle}
            onPress={() => setIsDarkMode(!isDarkMode)}
          >
            <Ionicons 
              name={isDarkMode ? 'sunny' : 'moon'} 
              size={24} 
              color="white" 
            />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Contact Info */}
        <View style={[styles.infoCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.infoText, { color: theme.textSecondary }]}>
            🔗 Eğer eklenmesini istediğiniz bir dönüştürme varsa lütfen site sahibi ile iletişim kurun:
          </Text>
          <TouchableOpacity onPress={openWebsite}>
            <Text style={[styles.linkText, { color: theme.primary }]}>
              www.karimov.info
            </Text>
          </TouchableOpacity>
        </View>

        {/* Related Products */}
        <View style={[styles.productCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.productTitle, { color: theme.text }]}>🔗 İlgili Ürünlerimiz</Text>
          <View style={[styles.productItem, { backgroundColor: theme.background, borderColor: theme.border }]}>
            <View style={styles.productIcon}>
              <MaterialIcons name="qr-code" size={30} color="white" />
            </View>
            <View style={styles.productInfo}>
              <Text style={[styles.productName, { color: theme.text }]}>QR Kod Üreticisi</Text>
              <Text style={[styles.productDesc, { color: theme.textSecondary }]}>
                URL, metin ve iletişim bilgileri için anında QR kodları oluşturun.
              </Text>
              <TouchableOpacity 
                style={[styles.productButton, { backgroundColor: theme.primary }]}
                onPress={openQRCodeSite}
              >
                <Text style={styles.productButtonText}>🔗 Ziyaret Et</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* File Selection */}
        <TouchableOpacity
          style={[styles.selectButton, { backgroundColor: theme.primary }]}
          onPress={pickDocument}
        >
          <LinearGradient
            colors={[theme.primary, theme.secondary]}
            style={styles.selectButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Ionicons name="document-outline" size={24} color="white" />
            <Text style={styles.selectButtonText}>📁 PDF Dosyası Seç</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Selected Files */}
        {selectedFiles.map((file) => (
          <View key={file.id} style={[styles.fileCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.fileHeader}>
              <Ionicons name="document-text" size={24} color={theme.primary} />
              <Text style={[styles.fileName, { color: theme.text }]} numberOfLines={1}>
                {file.name}
              </Text>
              <TouchableOpacity
                style={[styles.removeButton, { backgroundColor: theme.danger }]}
                onPress={() => removeFile(file.id)}
              >
                <Ionicons name="trash-outline" size={16} color="white" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.fileActions}>
              <Text style={[styles.pageLimitLabel, { color: theme.textSecondary }]}>
                Sayfa sınırı (isteğe bağlı):
              </Text>
              <View style={styles.pageLimitContainer}>
                <TouchableOpacity
                  style={[styles.pageLimitButton, { backgroundColor: theme.border }]}
                  onPress={() => updatePageLimit(file.id, Math.max(1, (file.pageLimit || 1) - 1))}
                >
                  <Ionicons name="remove" size={16} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.pageLimitText, { color: theme.text }]}>
                  {file.pageLimit || 'Tümü'}
                </Text>
                <TouchableOpacity
                  style={[styles.pageLimitButton, { backgroundColor: theme.border }]}
                  onPress={() => updatePageLimit(file.id, (file.pageLimit || 0) + 1)}
                >
                  <Ionicons name="add" size={16} color={theme.text} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}

        {/* Convert Button */}
        {selectedFiles.length > 0 && (
          <TouchableOpacity
            style={[styles.convertButton, { backgroundColor: theme.success }]}
            onPress={convertToPNG}
            disabled={isConverting}
          >
            <LinearGradient
              colors={[theme.success, '#047857']}
              style={styles.convertButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              {isConverting ? (
                <>
                  <ActivityIndicator size="small" color="white" />
                  <Text style={styles.convertButtonText}>⏳ Dönüştürülüyor...</Text>
                </>
              ) : (
                <>
                  <Ionicons name="color-wand-outline" size={24} color="white" />
                  <Text style={styles.convertButtonText}>✨ Dönüştür</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        )}

        {/* Converted Files */}
        {convertedFiles.length > 0 && (
          <View style={[styles.resultsSection, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.resultsTitle, { color: theme.text }]}>📥 Dönüştürülen Dosyalar</Text>
            {convertedFiles.map((file, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.resultFile, { backgroundColor: theme.background, borderColor: theme.border }]}
                onPress={() => shareFile(file.uri, file.name)}
              >
                <Ionicons name="image-outline" size={24} color={theme.primary} />
                <Text style={[styles.resultFileName, { color: theme.text }]} numberOfLines={1}>
                  {file.name}
                </Text>
                <Ionicons name="share-outline" size={20} color={theme.textSecondary} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: Constants.statusBarHeight + 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: 'center',
    position: 'relative',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  themeToggle: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  infoCard: {
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 15,
    borderWidth: 1,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  linkText: {
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  productCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  productItem: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'flex-start',
  },
  productIcon: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  productDesc: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  productButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  productButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  selectButton: {
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
  },
  selectButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  selectButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  fileCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  fileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  fileName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
    marginRight: 12,
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fileActions: {
    marginTop: 8,
  },
  pageLimitLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  pageLimitContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageLimitButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageLimitText: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 20,
    minWidth: 60,
    textAlign: 'center',
  },
  convertButton: {
    borderRadius: 12,
    marginVertical: 20,
    overflow: 'hidden',
  },
  convertButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
  },
  convertButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  resultsSection: {
    padding: 20,
    borderRadius: 16,
    marginTop: 20,
    borderWidth: 1,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  resultFile: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  resultFileName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 12,
    marginRight: 12,
  },
  bottomSpacing: {
    height: 40,
  },
});