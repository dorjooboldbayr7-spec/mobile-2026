import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView,
  KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

export function Shell({ children, onBack }) {
  return (
    <LinearGradient colors={['#0E1250', '#070A24', '#04061A']} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            {onBack && (
              <TouchableOpacity onPress={onBack} style={s.back}>
                <Ionicons name="arrow-back" size={22} color="#fff" />
              </TouchableOpacity>
            )}
            {children}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

export function Field({ icon, label, secure, ...rest }) {
  const [focus, setFocus] = useState(false);
  const [show, setShow] = useState(false);
  return (
    <View>
      {!!label && <Text style={s.label}>{label}</Text>}
      <View style={[s.wrap, focus && { borderColor: colors.primary }]}>
        <Ionicons name={icon} size={20} color={colors.muted} />
        <TextInput
          style={s.input}
          placeholderTextColor="#5A6190"
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={secure && !show}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          {...rest}
        />
        {secure && (
          <TouchableOpacity onPress={() => setShow(!show)}>
            <Ionicons name={show ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.muted} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

export function Btn({ title, onPress, loading, disabled }) {
  return (
    <TouchableOpacity
      style={[s.btn, (loading || disabled) && { opacity: 0.7 }]}
      activeOpacity={0.85}
      onPress={onPress}
      disabled={loading || disabled}
    >
      {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.btnText}>{title}</Text>}
    </TouchableOpacity>
  );
}

export function Seg({ value, onChange, options }) {
  return (
    <View style={s.seg}>
      {options.map(([k, name]) => (
        <TouchableOpacity key={k} style={[s.segItem, value === k && { backgroundColor: colors.primary }]} onPress={() => onChange(k)}>
          <Text style={{ color: value === k ? '#fff' : colors.muted, fontWeight: '700' }}>{name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export const Err = ({ text }) => (text ? <Text style={s.err}>{text}</Text> : null);

export const Title = ({ title, sub }) => (
  <View>
    <Text style={s.title}>{title}</Text>
    {!!sub && <Text style={s.sub}>{sub}</Text>}
  </View>
);

const s = StyleSheet.create({
  scroll: { paddingHorizontal: 24, paddingBottom: 30 },
  back: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', marginTop: 8, marginBottom: 18 },
  label: { color: '#C9CDEE', fontSize: 13, marginBottom: 8, marginTop: 14 },
  wrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 14, paddingHorizontal: 14, height: 54 },
  input: { flex: 1, color: '#fff', fontSize: 15, marginLeft: 10 },
  btn: { backgroundColor: colors.primary, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginTop: 22, shadowColor: colors.primary, shadowOpacity: 0.5, shadowRadius: 16, shadowOffset: { width: 0, height: 6 }, elevation: 8 },
  btnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  seg: { flexDirection: 'row', backgroundColor: colors.card, borderRadius: 14, borderWidth: 1, borderColor: colors.border, padding: 4, marginTop: 6 },
  segItem: { flex: 1, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  err: { color: colors.danger, marginTop: 12, fontSize: 13 },
  title: { color: '#fff', fontSize: 28, fontWeight: '800' },
  sub: { color: colors.muted, fontSize: 14, marginTop: 6, marginBottom: 14 },
});