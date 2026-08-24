import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    padding: 40,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 40,
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
  documentTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#CC0000',
    textTransform: 'uppercase',
  },
  dateText: {
    fontSize: 10,
    color: '#888888',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    backgroundColor: '#f5f5f5',
    padding: 6,
    marginBottom: 10,
    color: '#1a1a1a',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 11,
    color: '#555555',
  },
  value: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eeeeee',
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  totalValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#CC0000',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: '#eeeeee',
    paddingTop: 20,
  },
  footerNote: {
    fontSize: 9,
    color: '#888888',
    lineHeight: 1.5,
  }
});

interface QuotationPDFProps {
  data: {
    customerName: string;
    phone: string;
    bikeModel: string;
    basePrice: number;
    downPayment: number;
    loanAmount: number;
    emiAmount: number;
    tenureMonths: number;
    interestRate: number;
    validUntil: Date;
  };
}

const QuotationPDF = ({ data }: QuotationPDFProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View>
          <Text style={styles.brandName}>HONDA SHOWROOM</Text>
          <Text style={styles.tagline}>Goarkha Department Building, Ganga Nagari, Damak-05, Jhapa</Text>
          <Text style={styles.tagline}>9801615250 | info@damakhonda.com.np</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.documentTitle}>Digital Quotation</Text>
          <Text style={styles.dateText}>Date: {new Date().toLocaleDateString()}</Text>
          <Text style={styles.dateText}>Valid Until: {data.validUntil.toLocaleDateString()}</Text>
        </View>
      </View>

      <View style={{ marginBottom: 20 }}>
        <Text style={styles.sectionTitle}>Customer Details</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{data.customerName}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Phone:</Text>
          <Text style={styles.value}>{data.phone}</Text>
        </View>
      </View>

      <View style={{ marginBottom: 20 }}>
        <Text style={styles.sectionTitle}>Vehicle Details</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Model:</Text>
          <Text style={styles.value}>{data.bikeModel}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Base Price (incl. VAT):</Text>
          <Text style={styles.value}>NPR {data.basePrice.toLocaleString()}</Text>
        </View>
      </View>

      <View style={{ marginBottom: 20 }}>
        <Text style={styles.sectionTitle}>Finance & EMI Breakdown</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Down Payment:</Text>
          <Text style={styles.value}>NPR {data.downPayment.toLocaleString()}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Loan Amount:</Text>
          <Text style={styles.value}>NPR {data.loanAmount.toLocaleString()}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Interest Rate (Flat):</Text>
          <Text style={styles.value}>{data.interestRate}% p.a.</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Tenure:</Text>
          <Text style={styles.value}>{data.tenureMonths} Months</Text>
        </View>
        
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Monthly EMI:</Text>
          <Text style={styles.totalValue}>NPR {Math.round(data.emiAmount).toLocaleString()}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerNote}>
          Terms & Conditions:{'\n'}
          1. This quotation is valid until the specified 'Valid Until' date.{'\n'}
          2. Final loan approval is subject to credit assessment and verification by the financing partner.{'\n'}
          3. Prices are subject to change without prior notice in case of manufacturer price revisions or tax changes.{'\n'}
          4. Registration, insurance, and handling charges are extra at actuals unless specified otherwise.
        </Text>
      </View>
    </Page>
  </Document>
);

export default QuotationPDF;
