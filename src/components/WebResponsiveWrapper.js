import React, { useEffect } from 'react';
import { View, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function WebResponsiveWrapper({ children }) {
  const { width } = useWindowDimensions();
  const { theme, isDark } = useTheme();

  const isWeb = Platform.OS === 'web';
  const isLargeScreen = width >= 768;

  useEffect(() => {
    if (isWeb && typeof document !== 'undefined') {
      const existingStyle = document.getElementById('research-cell-web-styles');
      if (!existingStyle) {
        const style = document.createElement('style');
        style.id = 'research-cell-web-styles';
        style.textContent = `
          html, body, #root {
            height: 100%;
            width: 100%;
            margin: 0;
            padding: 0;
            background-color: #060913;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            overflow-x: hidden;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          }
          * {
            box-sizing: border-box;
          }
          /* Custom Web Scrollbar */
          ::-webkit-scrollbar {
            width: 7px;
            height: 7px;
          }
          ::-webkit-scrollbar-track {
            background: transparent;
          }
          ::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.16);
            border-radius: 4px;
          }
          ::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.32);
          }
          /* Clickable cursor pointer for web */
          button, [role="button"], a {
            cursor: pointer !important;
          }
        `;
        document.head.appendChild(style);
      }
    }
  }, [isWeb]);

  if (!isWeb || !isLargeScreen) {
    return <View style={styles.nativeRoot}>{children}</View>;
  }

  return (
    <View style={[styles.webOuterContainer, { backgroundColor: isDark ? '#060913' : '#F1F5F9' }]}>
      <View
        style={[
          styles.webInnerContainer,
          {
            backgroundColor: theme.bg,
            borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
          },
        ]}
      >
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  nativeRoot: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  webOuterContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  webInnerContainer: {
    flex: 1,
    width: '100%',
    maxWidth: 1120,
    height: '100%',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
});
