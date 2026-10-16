import React, { useEffect, useRef } from 'react';
import { View, Text, Image, Animated, Easing, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { IMG } from '../images';

export default function SplashScreen({ onDone }) {
  const flip = useRef(new Animated.Value(0)).current; // 3D orson
  const tilt = useRef(new Animated.Value(0)).current; // 3D huvirah
  const glow = useRef(new Animated.Value(0)).current; // gerel
  const ring = useRef(new Animated.Value(0)).current; // ireg
  const text = useRef(new Animated.Value(0)).current;
  const out = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(tilt, { toValue: 1, duration: 1400, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(tilt, { toValue: 0, duration: 1400, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(glow, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(glow, { toValue: 0, duration: 900, useNativeDriver: true }),
      ])
    ).start();
    Animated.loop(Animated.timing(ring, { toValue: 1, duration: 4000, easing: Easing.linear, useNativeDriver: true })).start();

    Animated.sequence([
      Animated.timing(flip, { toValue: 1, duration: 1200, easing: Easing.out(Easing.back(1.5)), useNativeDriver: true }),
      Animated.timing(text, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.delay(900),
      Animated.timing(out, { toValue: 0, duration: 350, useNativeDriver: true }),
    ]).start(() => onDone && onDone());
  }, []);

  const rotY = flip.interpolate({ inputRange: [0, 1], outputRange: ['-100deg', '0deg'] });
  const rotX = flip.interpolate({ inputRange: [0, 1], outputRange: ['35deg', '0deg'] });
  const scale = flip.interpolate({ inputRange: [0, 1], outputRange: [0.2, 1] });
  const tiltY = tilt.interpolate({ inputRange: [0, 1], outputRange: ['-14deg', '14deg'] });
  const tiltX = tilt.interpolate({ inputRange: [0, 1], outputRange: ['6deg', '-6deg'] });
  const spin = ring.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const spinBack = ring.interpolate({ inputRange: [0, 1], outputRange: ['360deg', '0deg'] });
  const glowScale = glow.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1.25] });
  const glowOp = glow.interpolate({ inputRange: [0, 1], outputRange: [0.25, 0.6] });
  const textY = text.interpolate({ inputRange: [0, 1], outputRange: [16, 0] });

  return (
    <LinearGradient colors={['#0E1250', '#070A24', '#04061A']} style={s.container}>
      <Animated.View style={[s.center, { opacity: out }]}>
        <View style={s.stage}>
          <Animated.View style={[s.glow, { opacity: glowOp, transform: [{ scale: glowScale }] }]} />
          <Animated.View style={[s.ring, { opacity: flip, transform: [{ rotate: spin }] }]} />
          <Animated.View style={[s.ring2, { opacity: flip, transform: [{ rotate: spinBack }] }]} />

          <Animated.View style={{ transform: [{ perspective: 900 }, { rotateY: rotY }, { rotateX: rotX }, { scale }] }}>
            <Animated.View style={{ transform: [{ perspective: 900 }, { rotateY: tiltY }, { rotateX: tiltX }] }}>
              <Image source={{ uri: IMG.logo }} style={s.logo} resizeMode="contain" />
            </Animated.View>
          </Animated.View>
        </View>

        <Animated.View style={{ opacity: text, transform: [{ translateY: textY }], alignItems: 'center' }}>
          <Text style={s.name}>Playnex</Text>
          <Text style={s.tag}>Live Sports. Anytime. Anywhere.</Text>
        </Animated.View>
      </Animated.View>
    </LinearGradient>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  stage: { width: 280, height: 280, alignItems: 'center', justifyContent: 'center' },
  logo: { width: 150, height: 150 },
  glow: { position: 'absolute', width: 230, height: 230, borderRadius: 115, backgroundColor: '#5B5BF0' },
  ring: { position: 'absolute', width: 250, height: 250, borderRadius: 125, borderWidth: 2, borderColor: 'rgba(124,124,255,0.7)', borderStyle: 'dashed' },
  ring2: { position: 'absolute', width: 210, height: 210, borderRadius: 105, borderWidth: 1.5, borderColor: 'rgba(59,130,246,0.6)' },
  name: { color: '#fff', fontSize: 40, fontWeight: '800', marginTop: 10 },
  tag: { color: '#8A90B8', fontSize: 14, marginTop: 8 },
});