import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';

// Register font (optional, using default Helvetica for now)
// Font.register({ family: 'Inter', src: '...' });

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    padding: 40,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    borderBottomWidth: 2,
    borderBottomColor: '#CC0000',
    paddingBottom: 20,
  },
  brandName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  tagline: {
    fontSize: 10,
    color: '#666666',
    marginTop: 4,
  },
  titleSection: {
    marginBottom: 20,
  },
  vehicleName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textTransform: 'uppercase',
  },
  vehicleVariant: {
    fontSize: 20,
    color: '#CC0000',
    marginTop: 8,
    fontWeight: 'bold',
  },
  specsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 30,
    borderTopWidth: 1,
    borderTopColor: '#eeeeee',
    paddingTop: 20,
  },
  specItem: {
    width: '50%',
    marginBottom: 15,
  },
  specLabel: {
    fontSize: 10,
    color: '#888888',
    textTransform: 'uppercase',
  },
  specValue: {
    fontSize: 14,
    color: '#1a1a1a',
    fontWeight: 'bold',
    marginTop: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: '#eeeeee',
    paddingTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: {
    fontSize: 10,
    color: '#888888',
  }
});

interface BrochurePDFProps {
  vehicle: {
    model: string;
    brand: string;
    basePrice: number;
    year: number;
    type: string;
    engineSize?: string;
    mileage?: string;
  };
}

const BrochurePDF = ({ vehicle }: BrochurePDFProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View>
          <Text style={styles.brandName}>HONDA SHOWROOM</Text>
          <Text style={styles.tagline}>Official Dealership - Society Enterprises</Text>
        </View>
        <View>
          <Text style={{ fontSize: 12, color: '#CC0000', fontWeight: 'bold' }}>PREMIUM SELECTION</Text>
        </View>
      </View>

      <View style={styles.titleSection}>
        <Text style={styles.vehicleName}>{vehicle.brand} {vehicle.model}</Text>
        <Text style={styles.vehicleVariant}>NPR {vehicle.basePrice.toLocaleString()}</Text>
      </View>

      <View style={{ height: 250, backgroundColor: '#f8f9fa', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
        <Text style={{ color: '#cccccc' }}>[ Vehicle Image Placeholder ]</Text>
      </View>

      <View style={styles.specsGrid}>
        <View style={styles.specItem}>
          <Text style={styles.specLabel}>Brand</Text>
          <Text style={styles.specValue}>{vehicle.brand}</Text>
        </View>
        <View style={styles.specItem}>
          <Text style={styles.specLabel}>Model</Text>
          <Text style={styles.specValue}>{vehicle.model}</Text>
        </View>
        <View style={styles.specItem}>
          <Text style={styles.specLabel}>Year</Text>
          <Text style={styles.specValue}>{vehicle.year}</Text>
        </View>
        <View style={styles.specItem}>
          <Text style={styles.specLabel}>Type</Text>
          <Text style={styles.specValue}>{vehicle.type}</Text>
        </View>
        {vehicle.engineSize && (
          <View style={styles.specItem}>
            <Text style={styles.specLabel}>Engine Displacement</Text>
            <Text style={styles.specValue}>{vehicle.engineSize}</Text>
          </View>
        )}
        {vehicle.mileage && (
          <View style={styles.specItem}>
            <Text style={styles.specLabel}>Fuel Efficiency</Text>
            <Text style={styles.specValue}>{vehicle.mileage}</Text>
          </View>
        )}
      </View>

      <View style={{ marginTop: 30 }}>
        <Text style={{ fontSize: 12, lineHeight: 1.5, color: '#444' }}>
          This official brochure is generated for your reference. Prices are subject to change based on current market rates and taxes. Visit our showroom for a physical inspection and test ride.
        </Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Generated on: {new Date().toLocaleDateString()}</Text>
        <Text style={styles.footerText}>Contact: 9801615250 | info@damakhonda.com.np</Text>
      </View>
    </Page>
  </Document>
);

export default BrochurePDF;
