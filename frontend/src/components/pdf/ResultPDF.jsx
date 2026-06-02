import React from 'react';
import { Document, Page, Text, View, StyleSheet, Svg, Defs, LinearGradient, Stop, Rect } from '@react-pdf/renderer';

// Define styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    paddingBottom: 60,
    backgroundColor: '#f8fafc', // slate-50
    fontFamily: 'Helvetica',
  },
  headerBg: {
    position: 'relative',
    marginHorizontal: -30,
    marginTop: -30,
    paddingHorizontal: 30,
    paddingTop: 40,
    paddingBottom: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
  },
  headerBgGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  logoContainer: {
    flexDirection: 'column',
  },
  logo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 1,
  },
  logoSub: {
    fontSize: 10,
    color: '#f8fafc',
    marginTop: 2,
  },
  headerInfo: {
    alignItems: 'flex-end',
  },
  docTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  docDate: {
    fontSize: 10,
    color: '#f8fafc',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
    border: '1px solid #e2e8f0', // slate-200
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black', // teal-700
    marginBottom: 15,
    borderBottom: '1px solid #f1f5f9', // slate-100
    paddingBottom: 8,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  resultBox: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
  },
  lowRiskBox: { backgroundColor: '#ecfdf5', border: '1px solid #10b981' },
  medRiskBox: { backgroundColor: '#fffbeb', border: '1px solid #f59e0b' },
  highRiskBox: { backgroundColor: '#fef2f2', border: '1px solid #ef4444' },

  lowRiskText: { color: '#047857' },
  medRiskText: { color: '#b45309' },
  highRiskText: { color: '#b91c1c' },

  riskLabel: {
    fontSize: 10,
    color: '#64748b', // slate-500
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  riskValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statBox: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    marginLeft: 15,
  },
  statLabel: {
    fontSize: 10,
    color: '#64748b',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#334155', // slate-700
  },
  aiDesc: {
    fontSize: 11,
    color: '#475569', // slate-600
    lineHeight: 1.5,
    backgroundColor: '#f1f5f9',
    padding: 12,
    borderRadius: 6,
    borderLeft: '4px solid black',
  },

  // Top 3 section
  top3Container: {
    marginTop: 10,
  },
  top3Item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottom: '1px solid #f1f5f9',
  },
  top3Class: {
    fontSize: 11,
    color: '#334155',
    fontWeight: 'bold',
  },
  top3Prob: {
    fontSize: 11,
    color: 'black',
  },

  // Table for Symptoms
  table: {
    width: '100%',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #e2e8f0',
    paddingVertical: 8,
    paddingHorizontal: 5,
  },
  tableRowAlt: {
    backgroundColor: '#f8fafc',
  },
  tableColQ: {
    width: '65%',
    paddingRight: 15,
  },
  tableColA: {
    width: '35%',
  },
  tableTextQ: {
    fontSize: 10,
    color: '#475569',
    lineHeight: 1.4,
  },
  tableTextA: {
    fontSize: 10,
    color: '#0f766e',
    fontWeight: 'bold',
  },

  // Recommendations
  recIntro: {
    fontSize: 11,
    color: '#475569',
    marginBottom: 10,
  },
  recItem: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  recBullet: {
    width: 10,
    fontSize: 10,
    color: '#0f766e',
  },
  recText: {
    flex: 1,
    fontSize: 11,
    color: '#334155',
    lineHeight: 1.4,
  },

  footer: {
    position: 'absolute',
    bottom: 20,
    left: 30,
    right: 30,
    textAlign: 'center',
    borderTop: '1px solid #cbd5e1',
    paddingTop: 10,
  },
  footerText: {
    fontSize: 8,
    color: '#94a3b8',
    lineHeight: 1.3,
  },
});

const formatDiseaseName = (name) => {
  if (!name) return '';
  return name.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
};

const ResultPDF = ({ result, summaryData }) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const getRiskStyle = (level) => {
    switch (level) {
      case 'HIGH': return { box: styles.highRiskBox, text: styles.highRiskText, label: 'High Risk' };
      case 'MODERATE': return { box: styles.medRiskBox, text: styles.medRiskText, label: 'Moderate Risk' };
      default: return { box: styles.lowRiskBox, text: styles.lowRiskText, label: 'Low Risk' };
    }
  };

  const safeResult = result || {};
  const riskStyle = getRiskStyle(safeResult.riskLevel);
  const confidence = safeResult.kepercayaan || 'N/A';
  const prediction = formatDiseaseName(safeResult.prediksi);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Modern Header */}
        <View style={styles.headerBg}>
          <Svg width="600" height="200" style={styles.headerBgGradient}>
            <Defs>
              <LinearGradient id="headerGrad" x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0" stopColor="#3b82f6" />
                <Stop offset="1" stopColor="#10b981" />
              </LinearGradient>
            </Defs>
            <Rect x="0" y="0" width="600" height="200" fill="url('#headerGrad')" />
          </Svg>
          <View style={styles.headerTop}>
            <View style={styles.logoContainer}>
              <Text style={styles.logo}>GastroCare</Text>
              <Text style={styles.logoSub}>Intelligent Digestive Health</Text>
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.docTitle}>Assessment Report</Text>
              <Text style={styles.docDate}>{currentDate}</Text>
            </View>
          </View>
        </View>

        {/* Main Result Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Diagnostic Overview</Text>

          <View style={styles.resultRow}>
            <View style={[styles.resultBox, riskStyle.box]}>
              <Text style={styles.riskLabel}>Overall Risk Level</Text>
              <Text style={[styles.riskValue, riskStyle.text]}>{riskStyle.label}</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Primary Finding</Text>
              <Text style={styles.statValue}>{prediction || 'Unknown'}</Text>
            </View>

            {safeResult.score !== undefined && (
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Severity Score</Text>
                <Text style={styles.statValue}>{safeResult.score} / {safeResult.totalPossible}</Text>
              </View>
            )}
          </View>

          <Text style={styles.aiDesc}>
            {safeResult.peringatan ? `Kindly Note: ${safeResult.peringatan}\n` : ''}
            Our health analysis indicates a {riskStyle.label.toLowerCase()} based on the symptoms you shared, with a confidence level of {confidence}.
            {safeResult.recommendation ? `\n\n${safeResult.recommendation}` : ''}
          </Text>

          {/* Top 3 Predictions if available */}
          {safeResult.top3 && safeResult.top3.length > 0 && (
            <View style={styles.top3Container}>
              <Text style={{ fontSize: 10, color: '#64748b', marginTop: 10, marginBottom: 5, textTransform: 'uppercase' }}>
                Other Possible Conditions
              </Text>
              {safeResult.top3.map((item, idx) => (
                <View key={idx} style={styles.top3Item}>
                  <Text style={styles.top3Class}>{idx + 1}. {formatDiseaseName(item.kelas)}</Text>
                  <Text style={styles.top3Prob}>{item.probabilitas}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Detailed Symptoms Table */}
        {summaryData && summaryData.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Symptom Questionnaire</Text>
            <View style={styles.table}>
              {summaryData.map((item, index) => (
                <View key={index} style={[styles.tableRow, index % 2 === 0 ? styles.tableRowAlt : {}]}>
                  <View style={styles.tableColQ}>
                    <Text style={styles.tableTextQ}>{item.question}</Text>
                  </View>
                  <View style={styles.tableColA}>
                    <Text style={styles.tableTextA}>{item.answer}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Actionable Recommendations */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Steps for Your Comfort & Well-being</Text>
          <Text style={styles.recIntro}>
            {safeResult.habits?.title || 'Suggested lifestyle modifications to improve your digestive health:'}
          </Text>

          {safeResult.habits?.items?.length > 0 ? (
            safeResult.habits.items.map((item, index) => (
              <View key={index} style={styles.recItem}>
                <Text style={styles.recBullet}>•</Text>
                <Text style={styles.recText}>{item}</Text>
              </View>
            ))
          ) : (
            <>
              <View style={styles.recItem}>
                <Text style={styles.recBullet}>•</Text>
                <Text style={styles.recText}>Maintain a balanced diet and avoid common trigger foods (spicy, acidic).</Text>
              </View>
              <View style={styles.recItem}>
                <Text style={styles.recBullet}>•</Text>
                <Text style={styles.recText}>Consider consulting a gastroenterologist for a comprehensive evaluation.</Text>
              </View>
            </>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            GastroCare Health Assessment • Generated on {currentDate}
          </Text>
          <Text style={styles.footerText}>
            Disclaimer: This report is an initial guide based on AI technology to help you understand your condition. It does not replace a formal diagnosis from a doctor. We highly recommend consulting a healthcare professional for a proper medical evaluation and treatment.
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default ResultPDF;
