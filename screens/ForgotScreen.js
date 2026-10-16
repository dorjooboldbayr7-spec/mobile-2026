import React, { useState } from 'react';
import { Shell, Field, Btn, Seg, Err, Title } from '../components/UI';
import { isEmail, isPhone, userExists } from '../auth';

export default function ForgotScreen({ onBack, onNext }) {
  const [method, setMethod] = useState('email');
  const [id, setId] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const go = async () => {
    setErr('');
    if (method === 'email' && !isEmail(id)) return setErr('Email hayagaa zuv oruulna uu.');
    if (method === 'phone' && !isPhone(id)) return setErr('Utasnii dugaaraa zuv oruulna uu.');
    setLoading(true);
    const ok = await userExists(id);
    setLoading(false);
    if (!ok) return setErr('Ene email/dugaaraar burtgeltei hereglegch oldsongui.');
    onNext(id);
  };

  return (
    <Shell onBack={onBack}>
      <Title title="Forgot password" sub="We will send a verification code to reset it" />
      <Seg value={method} onChange={(m) => { setMethod(m); setId(''); }} options={[['email', 'Email'], ['phone', 'Phone']]} />
      <Field
        icon={method === 'email' ? 'mail-outline' : 'call-outline'}
        placeholder={method === 'email' ? 'you@example.com' : '99112233'}
        keyboardType={method === 'email' ? 'email-address' : 'phone-pad'}
        value={id}
        onChangeText={setId}
      />
      <Err text={err} />
      <Btn title="Send code" onPress={go} loading={loading} />
    </Shell>
  );
}