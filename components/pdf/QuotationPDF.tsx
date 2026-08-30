import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { formatNPRPrice } from '@/lib/utils/priceFormatter';

// Register fonts if needed
// Font.register({ family: 'Inter', src: '/fonts/Inter-Regular.ttf' });

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 12,
    color: '#333'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
    borderBottomWidth: 2,
    borderBottomColor: '#c1291A',
    paddingBottom: 10
  },
  headerLeft: {
    flexDirection: 'column'
  },
  title: {
    fontSize: 24,
    color: '#c1291A',
    fontWeight: 'bold'
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4
  },
  headerRight: {
    textAlign: 'right'
  },
  section: {
    marginBottom: 20
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    backgroundColor: '#f3f4f6',
    padding: 5
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  label: {
    fontWeight: 'bold',
    color: '#555'
  },
  value: {
    color: '#111'
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    color: '#888',
    fontSize: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10
  }
});

interface QuotationProps {
  vehicleName: string;
  vehicleVariant: number;
  customerName?: string;
  financeDetails?: {
    downpaymentAmount: number;
    loanAmount: number;
    insuranceAmount: number;
    registrationCharge: number;
    totalInitialPayment: number;
    interestRate: number;
    tenureMonths: number;
    emi: number;
  };
}

export const QuotationPDF: React.FC<QuotationProps> = ({ 
  vehicleName, 
  vehicleVariant, 
  customerName, 
  financeDetails 
}) => {
  const date = new Date().toLocaleDateString();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* Header - Letterhead */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>Society Enterprises Pvt. Ltd.</Text>
            <Text style={styles.subtitle}>Authorized Dealer: Syakar Trading Company</Text>
            <Text style={{ marginTop: 2 }}>Goarkha Department Building, Ganga Nagari, Damak-05</Text>
            <Text>Phone: 9801615250</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>QUOTATION</Text>
            <Text style={{ marginTop: 5 }}>Date: {date}</Text>
            {customerName && <Text style={{ marginTop: 5 }}>For: {customerName}</Text>}
          </View>
        </View>

        {/* Vehicle Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vehicle Information</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Model Name</Text>
            <Text style={styles.value}>{vehicleName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Ex-Showroom Price</Text>
            <Text style={styles.value}>{formatNPRPrice(vehicleVariant)}</Text>
          </View>
        </View>

        {/* Finance Info (if applicable) */}
        {financeDetails && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Finance Estimation</Text>
            
            <View style={styles.row}>
              <Text style={styles.label}>Downpayment</Text>
              <Text style={styles.value}>{formatNPRPrice(financeDetails.downpaymentAmount)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Insurance ({financeDetails.tenureMonths === 12 ? '1 Year' : '2 Years'})</Text>
              <Text style={styles.value}>{formatNPRPrice(financeDetails.insuranceAmount)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Registration Charge</Text>
              <Text style={styles.value}>{formatNPRPrice(financeDetails.registrationCharge)}</Text>
            </View>
            <View style={[styles.row, { backgroundColor: '#f9fafb', padding: 8, marginTop: 5 }]}>
              <Text style={[styles.label, { color: '#c1291A' }]}>Total Initial Payment</Text>
              <Text style={[styles.value, { fontWeight: 'bold' }]}>{formatNPRPrice(financeDetails.totalInitialPayment)}</Text>
            </View>

            <View style={{ marginTop: 15 }} />

            <View style={styles.row}>
              <Text style={styles.label}>Loan Amount</Text>
              <Text style={styles.value}>{formatNPRPrice(financeDetails.loanAmount)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Tenure</Text>
              <Text style={styles.value}>{financeDetails.tenureMonths} Months</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Interest Rate</Text>
              <Text style={styles.value}>{financeDetails.interestRate.toFixed(2)}% (Flat)</Text>
            </View>
            <View style={[styles.row, { backgroundColor: '#f9fafb', padding: 8, marginTop: 5 }]}>
              <Text style={[styles.label, { color: '#c1291A' }]}>Monthly EMI</Text>
              <Text style={[styles.value, { fontWeight: 'bold' }]}>{formatNPRPrice(financeDetails.emi)}</Text>
            </View>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text>This is a system-generated quotation and is subject to change without prior notice.</Text>
          <Text>Values are estimated and may vary based on final RTO and Insurance calculations.</Text>
        </View>
      </Page>
    </Document>
  );
};
