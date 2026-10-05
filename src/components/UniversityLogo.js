import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { COLORS } from '../theme/colors';
import { FONTS } from '../theme/fonts';

const DHSGSU_LOGO = require('../assets/dhsgsu_logo.png');

export default function UniversityLogo({ 
  size = 80, 
  color = COLORS.gold, 
  showText = false,
  showGlow = true 
}) {
  return (
    <View style={styles.outerContainer}>
      <View
        style={[
          styles.logoWrapper,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor: color,
            shadowColor: showGlow ? color : 'transparent',
          },
        ]}
      >
        <Image
          source={DHSGSU_LOGO}
          style={{
            width: size * 0.96,
            height: size * 0.96,
            borderRadius: (size * 0.96) / 2,
          }}
          resizeMode="contain"
        />
      </View>

      {showText && (
        <View style={styles.textCol}>
          <Text style={styles.hindiTitle}>डॉक्टर हरीसिंह गौर विश्वविद्यालय, सागर</Text>
          <Text style={styles.title}>DR. HARISINGH GOUR</Text>
          <Text style={[styles.sub, { color }]}>VISHWAVIDYALAYA, SAGAR (M.P.)</Text>
          <Text style={styles.naac}>A Central University • Estd. 1946 • NAAC 'A' Grade</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrapper: {
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
    overflow: 'hidden',
  },
  textCol: {
    alignItems: 'center',
    marginTop: 10,
  },
  hindiTitle: {
    fontFamily: FONTS.headingBold,
    fontSize: 13,
    color: '#F59E0B',
    textAlign: 'center',
    marginBottom: 2,
    letterSpacing: 0.3,
  },
  title: {
    fontFamily: FONTS.headingBold,
    fontSize: 15,
    color: '#FFF',
    letterSpacing: 1.2,
    textAlign: 'center',
  },
  sub: {
    fontFamily: FONTS.headingBold,
    fontSize: 11,
    letterSpacing: 0.8,
    marginTop: 2,
    textAlign: 'center',
  },
  naac: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 9,
    color: '#94A3B8',
    marginTop: 4,
    textAlign: 'center',
    letterSpacing: 0.4,
  },
});
