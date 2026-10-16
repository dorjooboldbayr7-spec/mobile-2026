import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { Shell, Field, Btn, Seg, Err, Title } from '../components/UI';
import { colors } from '../theme';
import { isEmail, isPhone, register } from '../auth';

export default function SignUpScreen({ onBack, onNext, onSignIn }) {
  const [name, setName] = useState('');
  const [method, setMethod] = useState('email');
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const go = async () => {
    setErr('');
    if (name.trim().length < 2) return setErr('Ner-ee oruulna uu.');
    if (method === 'email' && !isEmail(id)) return setErr('Email hayagaa zuv oruulna uu.');
    if (method === 'phone' && !isPhone(id)) return setErr('Utasnii dugaaraa zuv oruulna uu (8+ orontoi).');
    if (pw.length < 6) return setErr('Nuuts ug 6-aas deesh temdegt baih ystoi.');
    if (pw !== pw2) return setErr('Nuuts ug hoyor taarahgui baina.');
    setLoading(true);
    const e = await register({ name, id, password: pw });
    setLoading(false);
    if (e) return setErr(e);
    onNext(id);
  };

  return (
    <Shell onBack={onBack}>
      <Title title="Create account" sub="Join Playnex and never miss a game" />
      <Field icon="person-outline" label="Full name" placeholder="Your name" autoCapitalize="words" value={name} onChangeText={setName} />
      <Text style={{ color: '#C9CDEE', fontSize: 13, marginTop: 14 }}>Verify with</Text>
      <Seg value={method} onChange={(m) => { setMethod(m); setId(''); }} options={[['email', 'Email'], ['phone', 'Phone']]} />
      <Field
        icon={method === 'email' ? 'mail-outline' : 'call-outline'}
        placeholder={method === 'email' ? 'you@example.com' : '99112233'}
        keyboardType={method === 'email' ? 'email-address' : 'phone-pad'}
        value={id}
        onChangeText={setId}
      />
      <Field icon="lock-closed-outline" label="Password" placeholder="At least 6 characters" secure value={pw} onChangeText={setPw} />
      <Field icon="lock-closed-outline" label="Confirm password" placeholder="Repeat password" secure value={pw2} onChangeText={setPw2} />
      <Err text={err} />
      <Btn title="Send verification code" onPress={go} loading={loading} />
      <View style={{ height: 22 }} />
      <Text style={{ color: colors.muted, textAlign: 'center', fontSize: 13 }}>
        Already have an account? <Text style={{ color: '#7C7CFF', fontWeight: '600' }} onPress={onSignIn}>Sign In</Text>
      </Text>
    </Shell>
  );
}