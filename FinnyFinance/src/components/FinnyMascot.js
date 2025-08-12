import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  interpolate,
} from 'react-native-reanimated';
import { COLORS } from '../constants/colors';

const FinnyMascot = ({ 
  size = 120, 
  mood = 'happy', // happy, excited, worried, sad
  message = '',
  shouldAnimate = true 
}) => {
  const bounceValue = useSharedValue(0);
  const blinkValue = useSharedValue(0);
  const rotateValue = useSharedValue(0);

  useEffect(() => {
    if (shouldAnimate) {
      // Animação de balanço suave
      bounceValue.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 2000 }),
          withTiming(0, { duration: 2000 })
        ),
        -1,
        true
      );

      // Animação de piscar
      blinkValue.value = withRepeat(
        withSequence(
          withTiming(0, { duration: 3000 }),
          withTiming(1, { duration: 100 }),
          withTiming(0, { duration: 100 })
        ),
        -1,
        false
      );

      // Rotação suave baseada no humor
      if (mood === 'excited') {
        rotateValue.value = withRepeat(
          withSequence(
            withTiming(5, { duration: 500 }),
            withTiming(-5, { duration: 500 }),
            withTiming(0, { duration: 500 })
          ),
          -1,
          false
        );
      }
    }
  }, [shouldAnimate, mood]);

  const animatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(bounceValue.value, [0, 1], [0, -10]);
    const scale = interpolate(bounceValue.value, [0, 1], [1, 1.05]);
    const rotate = `${rotateValue.value}deg`;

    return {
      transform: [
        { translateY },
        { scale },
        { rotate }
      ]
    };
  });

  const eyeStyle = useAnimatedStyle(() => {
    const scaleY = interpolate(blinkValue.value, [0, 1], [1, 0.1]);
    return {
      transform: [{ scaleY }]
    };
  });

  const getMoodColor = () => {
    switch (mood) {
      case 'excited': return COLORS.accent;
      case 'worried': return '#FF9500';
      case 'sad': return '#FF6B6B';
      default: return COLORS.primary;
    }
  };

  const getMoodExpression = () => {
    switch (mood) {
      case 'excited': return '😄';
      case 'worried': return '😰';
      case 'sad': return '😢';
      default: return '😊';
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[animatedStyle, { width: size, height: size }]}>
        <View style={[styles.foxBody, { 
          width: size, 
          height: size * 0.8, 
          backgroundColor: getMoodColor() 
        }]}>
          {/* Orelhas */}
          <View style={[styles.ear, styles.leftEar, { 
            width: size * 0.25, 
            height: size * 0.3,
            backgroundColor: getMoodColor()
          }]} />
          <View style={[styles.ear, styles.rightEar, { 
            width: size * 0.25, 
            height: size * 0.3,
            backgroundColor: getMoodColor()
          }]} />
          
          {/* Rosto */}
          <View style={[styles.face, { 
            width: size * 0.7, 
            height: size * 0.6,
            top: size * 0.15
          }]}>
            {/* Olhos */}
            <Animated.View style={[styles.eye, styles.leftEye, eyeStyle, {
              width: size * 0.08,
              height: size * 0.08,
            }]} />
            <Animated.View style={[styles.eye, styles.rightEye, eyeStyle, {
              width: size * 0.08,
              height: size * 0.08,
            }]} />
            
            {/* Focinho */}
            <View style={[styles.snout, {
              width: size * 0.15,
              height: size * 0.1,
              top: size * 0.25
            }]} />
            
            {/* Expressão emoji sobreposta */}
            <Text style={[styles.expression, { fontSize: size * 0.3 }]}>
              {getMoodExpression()}
            </Text>
          </View>
          
          {/* Cauda */}
          <View style={[styles.tail, {
            width: size * 0.4,
            height: size * 0.15,
            backgroundColor: getMoodColor(),
            right: -size * 0.2,
            top: size * 0.3
          }]} />
        </View>
      </Animated.View>
      
      {/* Mensagem do Finny */}
      {message ? (
        <View style={styles.speechBubble}>
          <Text style={styles.messageText}>{message}</Text>
          <View style={styles.speechTail} />
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  foxBody: {
    borderRadius: 60,
    position: 'relative',
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  ear: {
    position: 'absolute',
    borderRadius: 20,
    top: -10,
  },
  leftEar: {
    left: 15,
    transform: [{ rotate: '-20deg' }],
  },
  rightEar: {
    right: 15,
    transform: [{ rotate: '20deg' }],
  },
  face: {
    position: 'absolute',
    backgroundColor: COLORS.white,
    borderRadius: 40,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eye: {
    position: 'absolute',
    backgroundColor: '#333',
    borderRadius: 50,
  },
  leftEye: {
    left: '25%',
    top: '30%',
  },
  rightEye: {
    right: '25%',
    top: '30%',
  },
  snout: {
    position: 'absolute',
    backgroundColor: '#333',
    borderRadius: 10,
    alignSelf: 'center',
  },
  tail: {
    position: 'absolute',
    borderRadius: 10,
    transform: [{ rotate: '45deg' }],
  },
  expression: {
    position: 'absolute',
    top: '20%',
  },
  speechBubble: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 16,
    maxWidth: 280,
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    position: 'relative',
  },
  speechTail: {
    position: 'absolute',
    top: -8,
    alignSelf: 'center',
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: COLORS.white,
  },
  messageText: {
    fontSize: 14,
    color: COLORS.darkGray,
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: '500',
  },
});

export default FinnyMascot;