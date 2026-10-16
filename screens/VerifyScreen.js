import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Shell, Btn, Err, Title } from '../components/UI';
import { colors } from '../theme';
import { kind, sendCode, checkCode, lastCode } from '../auth';

export default function VerifyScreen({ id, onBack, onVerified }) {
  const [code, setCode] = useState('');
  const [err, setErr] = useState('');
  const [left, setLeft] = useState(30);
  const [demo, setDemo] = useState(lastCode());
  const [busy, setBusy] = useState(false);
  const ref = useRef(null);
  const via = kind(id) === 'email' ? 'email' : 'utas';

  useEffect(() => {
    if (left <= 0) return;
    const t = setTimeout(() => setLeft(left - 1), 1000);
    return () => clearTimeout(t);
  }, [left]);

  const submit = async (v) => {
    if (v.length < 6) return setErr('6 orontoi code-oo oruulna uu.');
    const e = checkCode(id, v);
    if (e) {
      setErr(e);
      setCode('');
      return;
    }
    setBusy(true);
    await onVerified();
    setBusy(false);
  };

  const onChange = (t) => {
    const d = t.replace(/\D/g, '').slice(0, 6);
    setCode(d);
    setErr('');
    if (d.length === 6) submit(d);
  };

  const resend = () => {
    if (left > 0) return;
    sendCode(id);
    setDemo(lastCode());
    setLeft(30);
    setErr('');
    setCode('');
  };

  return (
    <Shell onBack={onBack}>
      <Title title="Verify code" sub={'We sent a 6-digit code to your ' + via + ': ' + id} />

      {!!demo && (
        <View style={s.demo}>
          <Text style={s.demoT}>DEMO: SMS/email service holbogdoogui tul code-iig end haruullaa</Text>
          <Text style={s.demoC}>{demo}</Text>
        </View>
      )}

      <TouchableOpacity activeOpacity={1} onPress={() => ref.current && ref.current.focus()} style={s.boxes}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <View key={i} style={[s.box, code.length === i && { borderColor: colors.primary }]}>
            <Text style={s.digit}>{code[i] || ''}</Text>
          </View>
        ))}
        <TextInput
          ref={ref}
          value={code}
          onChangeText={onChange}
          maxLength={6}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          autoFocus
          caretHidden
          style={s.hidden}
        />
      </TouchableOpacity>

      <Err text={err} />
      <Btn title="Verify" onPress={() => submit(code)} loading={busy} />

      <TouchableOpacity onPress={resend} style={{ marginTop: 22, alignSelf: 'center' }}>
        <Text style={{ color: left > 0 ? colors.muted : '#7C7CFF', fontWeight: '600' }}>
          {left > 0 ? 'Resend code in ' + left + 's' : 'Resend code'}
        </Text>
      </TouchableOpacity>
    </Shell>
  );
}

const s = StyleSheet.create({
  demo: { backgroundColor: 'rgba(91,91,240,0.15)', borderColor: colors.primary, borderWidth: 1, borderRadius: 14, padding: 12, marginTop: 6, alignItems: 'center' },
  demoT: { color: '#C9CDEE', fontSize: 12, textAlign: 'center' },
  demoC: { color: '#fff', fontSize: 28, fontWeight: '800', letterSpacing: 6, marginTop: 4 },
  boxes: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 22 },
  box: { width: 46, height: 56, borderRadius: 12, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  digit: { color: '#fff', fontSize: 24, fontWeight: '700' },
  hidden: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, opacity: 0 },
});