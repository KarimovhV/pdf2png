import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
  Dimensions,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Ionicons } from '@expo/vector-icons';
import { Provider as PaperProvider, Card, Button, TextInput, Chip } from 'react-native-paper';

const { width, height } = Dimensions.get('window');

export default function App() {
  return (
    <PaperProvider>
      <PDFToPNGConverter />
    </PaperProvider>
  );
}

function PDFToPNGConverter() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isConverting, setIsConverting] = useState(false);
  const [convertedFiles, setConvertedFiles] = useState([]);

  const pickPDFFiles = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        multiple: true,
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        const newFiles = result.assets.map(file => ({
          ...file,
          id: Math.random().toString(36).substr(2, 9),
          pageLimit: '',
        }));
        setSelectedFiles(prev => [...prev, ...newFiles]);
      }
    } catch (error) {
      Alert.alert('Hata', 'Dosya seçimi sırasında bir hata oluştu.');
      console.error('Error picking files:', error);
    }
  };

  const removeFile = (fileId) => {
    setSelectedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const updatePageLimit = (fileId, pageLimit) => {
    setSelectedFiles(prev =>
      prev.map(file =>
        file.id === fileId ? { ...file, pageLimit } : file
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
      // Bu kısımda gerçek PDF to PNG dönüştürme işlemi yapılacak
      // Şimdilik demo amaçlı simüle ediyoruz
      
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        
        // Simulated conversion delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Demo converted file
        const convertedFile = {
          id: Math.random().toString(36).substr(2, 9),
          name: file.name.replace('.pdf', '.png'),
          originalName: file.name,
          uri: file.uri, // In real app, this would be the converted PNG URI
          size: file.size,
        };
        
        setConvertedFiles(prev => [...prev, convertedFile]);
      }

      Alert.alert('Başarılı', 'Tüm dosyalar başarıyla dönüştürüldü!');
    } catch (error) {
      Alert.alert('Hata', 'Dönüştürme sırasında bir hata oluştu.');
      console.error('Conversion error:', error);
    } finally {
      setIsConverting(false);
    }
  };

  const shareFile = async (file) => {
    try {
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(file.uri);
      } else {
        Alert.alert('Hata', 'Paylaşım bu cihazda desteklenmiyor.');
      }
    } catch (error) {
      Alert.alert('Hata', 'Dosya paylaşımı sırasında bir hata oluştu.');
      console.error('Sharing error:', error);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>PDF to PNG</Text>
        <Text style={styles.headerSubtitle}>Dönüştürücü</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Info Card */}
        <Card style={styles.infoCard}>
          <Card.Content>
            <Text style={styles.infoTitle}>✨ Her zaman en yüksek kalitede dönüştürme</Text>
            <Text style={styles.infoText}>
              PDF dosyalarınızı yüksek kaliteli PNG görüntülere dönüştürün. 
              Sayfa sınırı belirleyebilir ve dosyalarınızı kolayca paylaşabilirsiniz.
            </Text>
          </Card.Content>
        </Card>

        {/* File Picker */}
        <TouchableOpacity style={styles.filePickerButton} onPress={pickPDFFiles}>
          <Ionicons name="document-outline" size={32} color="#fff" />
          <Text style={styles.filePickerText}>PDF Dosyası Seç</Text>
          <Text style={styles.filePickerSubtext}>Birden fazla dosya seçebilirsiniz</Text>
        </TouchableOpacity>

        {/* Selected Files */}
        {selectedFiles.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Seçilen Dosyalar ({selectedFiles.length})</Text>
            {selectedFiles.map((file) => (
              <Card key={file.id} style={styles.fileCard}>
                <Card.Content>
                  <View style={styles.fileHeader}>
                    <View style={styles.fileInfo}>
                      <Ionicons name="document-text" size={24} color="#667eea" />
                      <View style={styles.fileDetails}>
                        <Text style={styles.fileName} numberOfLines={1}>
                          {file.name}
                        </Text>
                        <Text style={styles.fileSize}>
                          {formatFileSize(file.size)}
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => removeFile(file.id)}
                    >
                      <Ionicons name="close-circle" size={24} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                  
                  <TextInput
                    style={styles.pageInput}
                    label="Sayfa Sınırı (isteğe bağlı)"
                    value={file.pageLimit}
                    onChangeText={(text) => updatePageLimit(file.id, text)}
                    keyboardType="numeric"
                    mode="outlined"
                    dense
                  />
                </Card.Content>
              </Card>
            ))}
          </View>
        )}

        {/* Convert Button */}
        {selectedFiles.length > 0 && (
          <Button
            mode="contained"
            style={styles.convertButton}
            contentStyle={styles.convertButtonContent}
            onPress={convertToPNG}
            disabled={isConverting}
            loading={isConverting}
          >
            {isConverting ? 'Dönüştürülüyor...' : '✨ Dönüştür'}
          </Button>
        )}

        {/* Converted Files */}
        {convertedFiles.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Dönüştürülen Dosyalar</Text>
            {convertedFiles.map((file) => (
              <Card key={file.id} style={styles.convertedFileCard}>
                <Card.Content>
                  <View style={styles.convertedFileHeader}>
                    <View style={styles.fileInfo}>
                      <Ionicons name="image" size={24} color="#10b981" />
                      <View style={styles.fileDetails}>
                        <Text style={styles.fileName} numberOfLines={1}>
                          {file.name}
                        </Text>
                        <Chip icon="check-circle" textStyle={styles.chipText}>
                          Hazır
                        </Chip>
                      </View>
                    </View>
                    <TouchableOpacity
                      style={styles.shareButton}
                      onPress={() => shareFile(file)}
                    >
                      <Ionicons name="share-outline" size={24} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </Card.Content>
              </Card>
            ))}
          </View>
        )}

        {/* Related Products */}
        <Card style={styles.relatedCard}>
          <Card.Content>
            <Text style={styles.relatedTitle}>🔗 İlgili Ürünlerimiz</Text>
            <View style={styles.productRecommendation}>
              <View style={styles.productIcon}>
                <Text style={styles.productIconText}>📱</Text>
              </View>
              <View style={styles.productInfo}>
                <Text style={styles.productName}>QR Kod Üreticisi</Text>
                <Text style={styles.productDesc}>
                  URL, metin ve iletişim bilgileri için anında QR kodları oluşturun.
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            🔗 Eğer eklenmesini istediğiniz bir dönüştürme varsa lütfen site sahibi ile iletişim kurun:
          </Text>
          <Text style={styles.footerLink}>www.karimov.info</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#667eea',
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#e0e7ff',
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  infoCard: {
    marginBottom: 20,
    borderRadius: 12,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  filePickerButton: {
    backgroundColor: '#667eea',
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  filePickerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 8,
  },
  filePickerSubtext: {
    color: '#e0e7ff',
    fontSize: 14,
    marginTop: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  fileCard: {
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
  },
  fileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  fileDetails: {
    marginLeft: 12,
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  fileSize: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },
  removeButton: {
    padding: 4,
  },
  pageInput: {
    marginTop: 8,
  },
  convertButton: {
    marginBottom: 20,
    borderRadius: 12,
    backgroundColor: '#10b981',
  },
  convertButtonContent: {
    paddingVertical: 8,
  },
  convertedFileCard: {
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#10b981',
  },
  convertedFileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chipText: {
    fontSize: 12,
  },
  shareButton: {
    backgroundColor: '#8b5cf6',
    borderRadius: 8,
    padding: 8,
  },
  relatedCard: {
    marginBottom: 20,
    borderRadius: 12,
    elevation: 2,
    borderTopWidth: 3,
    borderTopColor: '#667eea',
  },
  relatedTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
    textAlign: 'center',
  },
  productRecommendation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productIcon: {
    width: 50,
    height: 50,
    backgroundColor: '#667eea',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  productIconText: {
    fontSize: 24,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  productDesc: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 18,
  },
  footer: {
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 16,
  },
  footerLink: {
    fontSize: 12,
    color: '#667eea',
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 4,
  },
});