import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Logo from '../components/Logo';
import { MATCHES, HIGHLIGHTS } from '../data';
import { colors } from '../theme';

const LIVE = '#E5384F';

export default function HomeScreen({ user, onLogout }) {
  const [sp, setSp] = useState('For You');
  const [toast, setToast] = useState('');
  const say = (t) => {
    setToast(t);
    setTimeout(() => setToast(''), 1500);
  };
  const feat = MATCHES[0];
  const live = MATCHES.filter((m) => m.live && (sp === 'For You' || m.sp === sp));
  const first = (user && user.name ? user.name : 'Fan').split(' ')[0];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={s.pad} showsVerticalScrollIndicator={false}>
        <View style={s.head}>
          <Logo size={38} />
          <TouchableOpacity onPress={onLogout} style={s.out}>
            <Ionicons name="log-out-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={s.hi}>Hi, {first}</Text>
        <Text style={s.sub}>Live sports. Anytime. Anywhere.</Text>

        <View style={s.chips}>
          {['For You', 'Football', 'Basketball'].map((x) => (
            <TouchableOpacity key={x} onPress={() => setSp(x)} style={[s.chip, sp === x && { backgroundColor: colors.primary, borderColor: colors.primary }]}>
              <Text style={{ color: sp === x ? '#fff' : colors.muted, fontWeight: sp === x ? '700' : '400' }}>{x}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={s.feat}>
          <View style={s.badge}><Text style={s.badgeT}>LIVE 68'</Text></View>
          <Text style={{ color: '#D7DAFF', marginTop: 8 }}>{feat.lg}</Text>
          <Text style={s.score}>{feat.hs} - {feat.as}</Text>
          <Text style={{ color: '#fff' }}>{feat.h} vs {feat.a}</Text>
          <TouchableOpacity style={s.watch} onPress={() => say('Udahgui nemegdene')}>
            <Text style={{ color: colors.primary, fontWeight: '700' }}>Watch Live</Text>
          </TouchableOpacity>
        </View>

        <Text style={s.h2}>Live Matches</Text>
        {live.map((m) => (
          <TouchableOpacity key={m.id} style={s.row} onPress={() => say('Udahgui nemegdene')}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.muted, fontSize: 12 }}>{m.lg}</Text>
              <Text style={s.team}>{m.h}</Text>
              <Text style={s.team}>{m.a}</Text>
            </View>
            <View style={{ marginRight: 14 }}>
              <Text style={s.sc}>{m.hs}</Text>
              <Text style={s.sc}>{m.as}</Text>
            </View>
            <Text style={{ color: LIVE, fontWeight: '700', fontSize: 12 }}>LIVE</Text>
          </TouchableOpacity>
        ))}

        <Text style={s.h2}>Top Highlights</Text>
        {HIGHLIGHTS.slice(0, 2).map((h) => (
          <TouchableOpacity key={h.id} style={s.row} onPress={() => say('Udahgui nemegdene')}>
            <View style={[s.thumb, { backgroundColor: h.c }]}><Ionicons name="play" size={22} color="#fff" /></View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={s.team}>{h.t}</Text>
              <Text style={{ color: colors.muted, fontSize: 12 }}>{h.m} - {h.d}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {!!toast && <View style={s.toast}><Text style={{ color: '#fff', fontSize: 13 }}>{toast}</Text></View>}

      <View style={s.tabs}>
        {[['Home', 'home'], ['Matches', 'grid'], ['Highlights', 'play-circle'], ['News', 'newspaper'], ['Profile', 'person']].map(([n, ic], i) => (
          <TouchableOpacity key={n} style={s.tab} onPress={() => i > 0 && say('Udahgui nemegdene')}>
            <Ionicons name={i === 0 ? ic : ic + '-outline'} size={22} color={i === 0 ? colors.primary : colors.muted} />
            <Text style={{ color: i === 0 ? colors.primary : colors.muted, fontSize: 10, marginTop: 2 }}>{n}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  pad: { padding: 20, paddingBottom: 30 },
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  out: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  hi: { color: '#fff', fontSize: 26, fontWeight: '800', marginTop: 18 },
  sub: { color: colors.muted, fontSize: 14, marginBottom: 14 },
  chips: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  chip: { borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 7 },
  feat: { backgroundColor: colors.primary, borderRadius: 18, padding: 20, alignItems: 'center' },
  badge: { backgroundColor: LIVE, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 },
  badgeT: { color: '#fff', fontSize: 11, fontWeight: '800' },
  score: { color: '#fff', fontSize: 44, fontWeight: '800' },
  watch: { backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 22, paddingVertical: 11, marginTop: 12 },
  h2: { color: '#fff', fontSize: 17, fontWeight: '700', marginTop: 22, marginBottom: 10 },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 14, padding: 13, marginBottom: 8 },
  team: { color: '#fff', fontWeight: '600', fontSize: 15 },
  sc: { color: '#fff', fontWeight: '800', fontSize: 18, textAlign: 'right' },
  thumb: { width: 76, height: 52, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  toast: { position: 'absolute', bottom: 80, alignSelf: 'center', backgroundColor: '#1B2150', paddingHorizontal: 16, paddingVertical: 9, borderRadius: 12 },
  tabs: { flexDirection: 'row', backgroundColor: colors.card, borderTopWidth: 1, borderTopColor: colors.border, paddingVertical: 6 },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 4 },
});