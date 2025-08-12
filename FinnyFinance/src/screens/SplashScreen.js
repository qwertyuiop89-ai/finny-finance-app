import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  runOnJS,
} from 'react-native-reanimated';
import FinnyMascot from '../components/FinnyMascot';
import { COLORS } from '../constants/colors';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ onFinish }) => {
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.5);
  const finnyOpacity = useSharedValue(0);
  const finnyTranslateY = useSharedValue(50);
  const titleOpacity = useSharedValue(0);
  const subtitleOpacity = useSharedValue(0);

  useEffect(() => {
    // Sequência de animações
    logoOpacity.value = withTiming(1, { duration: 800 });
    logoScale.value = withTiming(1, { duration: 800 });

    finnyOpacity.value = withDelay(400, withTiming(1, { duration: 600 }));
    finnyTranslateY.value = withDelay(400, withTiming(0, { duration: 600 }));

    titleOpacity.value = withDelay(800, withTiming(1, { duration: 500 }));
    subtitleOpacity.value = withDelay(1000, withTiming(1, { duration: 500 }));

    // Finalizar splash após 3 segundos
    const timer = setTimeout(() => {
      if (onFinish) {
        onFinish();
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: logoOpacity.value,
      transform: [{ scale: logoScale.value }],
    };
  });

  const finnyAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: finnyOpacity.value,
      transform: [{ translateY: finnyTranslateY.value }],
    };
  });

  const titleAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: titleOpacity.value,
    };
  });

  const subtitleAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: subtitleOpacity.value,
    };
  });

  return (
    <View style={styles.container}>
      {/* Background Gradient Effect */}
      <View style={styles.backgroundGradient} />
      
      {/* Logo Section */}
      <View style={styles.logoSection}>
        <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
          {/* Logo Minimalista */}
          <View style={styles.logo}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>F</Text>
            </View>
          </View>
        </Animated.View>

        {/* Mascote Finny */}
        <Animated.View style={[styles.finnyContainer, finnyAnimatedStyle]}>
          <FinnyMascot
            size={120}
            mood="excited"
            message=""
            shouldAnimate={true}
          />
        </Animated.View>
      </View>

      {/* Text Section */}
      <View style={styles.textSection}>
        <Animated.Text style={[styles.title, titleAnimatedStyle]}>
          Finny Finance
        </Animated.Text>
        
        <Animated.Text style={[styles.subtitle, subtitleAnimatedStyle]}>
          Organize suas finanças com diversão
        </Animated.Text>
      </View>

      {/* Loading Indicator */}
      <View style={styles.loadingSection}>
        <View style={styles.loadingBar}>
          <Animated.View style={[styles.loadingFill, logoAnimatedStyle]} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.primary,
    opacity: 0.9,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 60,
  },
  logoContainer: {
    marginBottom: 30,
  },
  logo: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  finnyContainer: {
    alignItems: 'center',
  },
  textSection: {
    alignItems: 'center',
    marginBottom: 80,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.white,
    opacity: 0.9,
    textAlign: 'center',
    lineHeight: 22,
  },
  loadingSection: {
    position: 'absolute',
    bottom: 80,
    width: width * 0.6,
  },
  loadingBar: {
    height: 4,
    backgroundColor: COLORS.white + '30',
    borderRadius: 2,
    overflow: 'hidden',
  },
  loadingFill: {
    height: '100%',
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: 2,
  },
});

export default SplashScreen;