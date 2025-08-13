import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Pdf from 'react-native-pdf';

const { width, height } = Dimensions.get('window');

const FilePreview = ({ visible, file, onClose, theme }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadComplete = (numberOfPages) => {
    setTotalPages(numberOfPages);
    setIsLoading(false);
  };

  const handlePageChanged = (page) => {
    setCurrentPage(page);
  };

  const handleError = (error) => {
    console.error('PDF Preview Error:', error);
    setIsLoading(false);
    Alert.alert('Hata', 'PDF önizlemesi yüklenemedi.');
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
          <View style={styles.headerLeft}>
            <Text style={[styles.fileName, { color: theme.text }]} numberOfLines={1}>
              {file?.name || 'PDF Önizleme'}
            </Text>
            {totalPages > 0 && (
              <Text style={[styles.pageInfo, { color: theme.textSecondary }]}>
                {currentPage} / {totalPages}
              </Text>
            )}
          </View>
          <TouchableOpacity
            style={[styles.closeButton, { backgroundColor: theme.danger }]}
            onPress={onClose}
          >
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* PDF Viewer */}
        <View style={styles.pdfContainer}>
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.primary} />
              <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
                PDF yükleniyor...
              </Text>
            </View>
          )}
          
          {file && (
            <Pdf
              source={{ uri: file.uri }}
              onLoadComplete={handleLoadComplete}
              onPageChanged={handlePageChanged}
              onError={handleError}
              style={styles.pdf}
              page={currentPage}
              scale={1.0}
              minScale={0.5}
              maxScale={3.0}
              horizontal={false}
              spacing={10}
              enablePaging={true}
              enableRTL={false}
              enableAnnotationRendering={true}
              password=""
              renderActivityIndicator={() => (
                <ActivityIndicator color={theme.primary} size="large" />
              )}
            />
          )}
        </View>

        {/* Navigation Controls */}
        {totalPages > 1 && !isLoading && (
          <View style={[styles.controls, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
            <TouchableOpacity
              style={[
                styles.navButton,
                { backgroundColor: theme.primary },
                currentPage <= 1 && { opacity: 0.5 }
              ]}
              onPress={goToPreviousPage}
              disabled={currentPage <= 1}
            >
              <Ionicons name="chevron-back" size={20} color="white" />
              <Text style={styles.navButtonText}>Önceki</Text>
            </TouchableOpacity>

            <View style={styles.pageIndicator}>
              <Text style={[styles.pageText, { color: theme.text }]}>
                Sayfa {currentPage}
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.navButton,
                { backgroundColor: theme.primary },
                currentPage >= totalPages && { opacity: 0.5 }
              ]}
              onPress={goToNextPage}
              disabled={currentPage >= totalPages}
            >
              <Text style={styles.navButtonText}>Sonraki</Text>
              <Ionicons name="chevron-forward" size={20} color="white" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    paddingTop: 50, // Safe area için
  },
  headerLeft: {
    flex: 1,
    marginRight: 15,
  },
  fileName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  pageInfo: {
    fontSize: 14,
    fontWeight: '500',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pdfContainer: {
    flex: 1,
    position: 'relative',
  },
  pdf: {
    flex: 1,
    width: width,
    height: height,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    zIndex: 1,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: '500',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 80,
    justifyContent: 'center',
  },
  navButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
    marginHorizontal: 4,
  },
  pageIndicator: {
    flex: 1,
    alignItems: 'center',
  },
  pageText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FilePreview;