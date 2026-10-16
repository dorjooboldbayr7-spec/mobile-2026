import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Shell, Field, Btn, Err, Title } from '../components/UI';
import Logo from '../components/Logo';
import { colors } from '../theme';
import { kind, login } from '../auth';

export default function LoginScreen({ onBack, onSuccess, onSignUp, onForgot, onNeedVerify, prefill, notice }) {
  const [id, setId] = useState(prefill || '');
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const go = async () => {
    setErr('');
    if (!kind(id)) return setErr('Email esvel utasnii dugaaraa zuv oruulna uu.');
    if (!pw) return setErr('Nuuts ugee oruulna uu.');
    setLoading(true);
    const r = await login(id, pw);
    setLoading(false);
    if (r.error === 'unverified') return onNeedVerify(id);
    if (r.error) return setErr(r.error);
    onSuccess(r.user);
  };

  const soon = (n) => Alert.alert(n, 'Udahgui nemegdene.');

  return (
    <Shell onBack={onBack}>
      <View style={{ alignItems: 'center', marginBottom: 26 }}><Logo size={44} /></View>
      <Title title="Welcome back" sub="Sign in to continue watching live sports" />
      {!!notice && (
        <View style={s.notice}><Text style={s.noticeT}>{notice}</Text></View>
      )}
      <Field icon="person-outline" label="Email or phone" placeholder="you@example.com / 99112233" keyboardType="email-address" value={id} onChangeText={setId} />
      <Field icon="lock-closed-outline" label="Password" placeholder="********" secure value={pw} onChangeText={setPw} />
      <TouchableOpacity style={{ alignSelf: 'flex-end', marginTop: 12 }} onPress={onForgot}>
        <Text style={s.link}>Forgot password?</Text>
      </TouchableOpacity>
      <Err text={err} />
      <Btn title="Sign In" onPress={go} loading={loading} />

      <View style={s.divRow}><View style={s.line} /><Text style={s.or}>or continue with</Text><View style={s.line} /></View>
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <TouchableOpacity style={s.social} onPress={() => soon('Google')}><Text style={s.socialText}>Google</Text></TouchableOpacity>
        <TouchableOpacity style={s.social} onPress={() => soon('Apple')}><Text style={s.socialText}>Apple</Text></TouchableOpacity>
      </View>

      <Text style={s.footer}>
        Don't have an account? <Text style={s.link} onPress={onSignUp}>Sign Up</Text>
      </Text>
    </Shell>
  );
}

const s = StyleSheet.create({
  notice: { backgroundColor: 'rgba(46,200,120,0.15)', borderColor: '#2EC878', borderWidth: 1, borderRadius: 12, padding: 12, marginBottom: 4 },
  noticeT: { color: '#7DF0B0', fontSize: 13 },
  link: { color: '#7C7CFF', fontWeight: '600', fontSize: 13 },
  divRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 24 },
  line: { flex: 1, height: 1, backgroundColor: colors.border },
  or: { color: colors.muted, marginHorizontal: 12, fontSize: 12 },
  social: { flex: 1, height: 50, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 14 },
  socialText: { color: '#fff', fontWeight: '600' },
  footer: { color: colors.muted, textAlign: 'center', marginTop: 26, fontSize: 13 },
});