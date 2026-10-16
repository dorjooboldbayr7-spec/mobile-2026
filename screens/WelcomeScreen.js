import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Logo from '../components/Logo';
import { IMG, SIZE } from '../images';
import { colors } from '../theme';

const wOf = (key, h) => (h * SIZE[key].w) / SIZE[key].h;

export default function WelcomeScreen({ onGetStarted, onSignIn }) {
  const { width } = useWindowDimensions();
  const cw = width - 48;
  const hR = 290, hK = 250, hL = 300;
  return (
    <LinearGradient colors={['#0E1250', '#070A24', '#04061A']} style={styles.container}>
      <View style={styles.streak} />
      <SafeAreaView style={styles.safe}>
        <View style={styles.top}>
          <Logo size={50} />
          <Text style={styles.tagline}>Live Sports. Anytime. Anywhere.</Text>
        </View>

        <View style={styles.hero}>
          <Image source={{ uri: IMG.ronaldo }} style={[styles.img, { left: -8, width: wOf('ronaldo', hR), height: hR }]} resizeMode="contain" />
          <Image source={{ uri: IMG.kobe }} style={[styles.img, { right: -14, width: wOf('kobe', hK), height: hK }]} resizeMode="contain" />
          <Image
            source={{ uri: IMG.lebron }}
            style={[styles.img, { left: cw / 2 - wOf('lebron', hL) / 2, width: wOf('lebron', hL), height: hL, zIndex: 2 }]}
            resizeMode="contain"
          />
          <LinearGradient colors={['rgba(7,10,36,0)', '#070A24']} style={styles.fade} pointerEvents="none" />
        </View>

        <View style={styles.bottom}>
          <TouchableOpacity style={styles.button} activeOpacity={0.85} onPress={onGetStarted}>
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
          <Text style={styles.signinText}>
            Already have an account?{' '}
            <Text style={styles.signinLink} onPress={onSignIn}>Sign In</Text>
          </Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1, justifyContent: 'space-between', paddingHorizontal: 24 },
  streak: { position: 'absolute', right: -80, top: 220, width: 160, height: 500, backgroundColor: 'rgba(91,91,240,0.35)', transform: [{ rotate: '35deg' }] },
  top: { alignItems: 'center', marginTop: 40 },
  tagline: { color: colors.muted, fontSize: 14, marginTop: 14 },
  hero: { height: 330 },
  img: { position: 'absolute', bottom: 0 },
  fade: { position: 'absolute', left: -24, right: -24, bottom: 0, height: 70, zIndex: 3 },
  bottom: { marginBottom: 24 },
  button: { backgroundColor: colors.primary, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', shadowColor: colors.primary, shadowOpacity: 0.5, shadowRadius: 16, shadowOffset: { width: 0, height: 6 }, elevation: 8 },
  buttonText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  signinText: { color: colors.muted, textAlign: 'center', marginTop: 18, fontSize: 13 },
  signinLink: { color: '#7C7CFF', fontWeight: '600' },
});