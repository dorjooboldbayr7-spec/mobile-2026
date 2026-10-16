import React, { useState } from 'react';
import { Shell, Field, Btn, Err, Title } from '../components/UI';

export default function ResetScreen({ onBack, onSave }) {
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const go = async () => {
    setErr('');
    if (pw.length < 6) return setErr('Nuuts ug 6-aas deesh temdegt baih ystoi.');
    if (pw !== pw2) return setErr('Nuuts ug hoyor taarahgui baina.');
    setLoading(true);
    await onSave(pw);
    setLoading(false);
  };

  return (
    <Shell onBack={onBack}>
      <Title title="New password" sub="Choose a new password for your account" />
      <Field icon="lock-closed-outline" label="New password" placeholder="At least 6 characters" secure value={pw} onChangeText={setPw} />
      <Field icon="lock-closed-outline" label="Confirm password" placeholder="Repeat password" secure value={pw2} onChangeText={setPw2} />
      <Err text={err} />
      <Btn title="Save password" onPress={go} loading={loading} />
    </Shell>
  );
}