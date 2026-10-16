import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet, TextInput,
  KeyboardAvoidingView, Platform, Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { MATCHES, HIGHLIGHTS } from '../data';

const DARK = { bg: '#070A24', card: '#10153A', line: '#232A5C', ink: '#EEF0FF', sub: '#8A90B8', acc: '#5B5BF0' };
const LIGHT = { bg: '#F3F4FB', card: '#FFFFFF', line: '#E1E3F2', ink: '#14183A', sub: '#6A7096', acc: '#5B5BF0' };
const LIVE = '#E5384F';

const label = (m) => (m.live ? (m.sp === 'Basketball' ? m.q : m.t + "'") : m.ft ? 'FT' : m.time);
const sv = (id, k) => ((id * 13 + k * 7) % 9) + 2;

export default function MainApp({ user, onLogout }) {
  const [dark, setDark] = useState(true);
  const [tab, setTab] = useState('home');
  const [mid, setMid] = useState(null);
  const [sp, setSp] = useState('All');
  const [day, setDay] = useState(0);
  const [fav, setFav] = useState([]);
  const [matches, setMatches] = useState(MATCHES);
  const [play, setPlay] = useState(true);
  const [chat, setChat] = useState({});
  const [msg, setMsg] = useState('');
  const [toast, setToast] = useState('');
  const c = dark ? DARK : LIGHT;
  const playRef = useRef(true);
  playRef.current = play;

  // Live score tick: 5 sec tutamd
  useEffect(() => {
    const id = setInterval(() => {
      if (!playRef.current) return;
      setMatches((ms) =>
        ms.map((m) => {
          if (!m.live) return m;
          const n = { ...m };
          if (m.sp === 'Football') {
            if (n.t < 90) n.t += 1;
            if (Math.random() < 0.1) (Math.random() < 0.5 ? n.hs++ : n.as++);
          } else if (Math.random() < 0.6) {
            Math.random() < 0.5 ? (n.hs += 2) : (n.as += 2);
          }
          return n;
        })
      );
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const say = (t) => {
    setToast(t);
    setTimeout(() => setToast(''), 1600);
  };
  const toggleFav = (id) =>
    setFav((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));

  const Chip = ({ text, on, onPress }) => (
    <TouchableOpacity
      onPress={onPress}
      style={[st.chip, { backgroundColor: on ? c.acc : c.card, borderColor: on ? c.acc : c.line }]}
    >
      <Text style={{ color: on ? '#fff' : c.sub, fontWeight: on ? '700' : '400' }}>{text}</Text>
    </TouchableOpacity>
  );

  const Chips = () => (
    <View style={st.chips}>
      {['All', 'Football', 'Basketball'].map((x) => (
        <Chip key={x} text={x} on={sp === x} onPress={() => setSp(x)} />
      ))}
    </View>
  );

  const MatchRow = ({ m }) => (
    <TouchableOpacity
      style={[st.row, { backgroundColor: c.card, borderColor: c.line }]}
      onPress={() => { setMid(m.id); setPlay(true); }}
    >
      <View style={{ flex: 1 }}>
        <Text style={{ color: c.sub, fontSize: 12 }}>{m.lg}</Text>
        <Text style={{ color: c.ink, fontWeight: '600', fontSize: 15 }}>{m.h}</Text>
        <Text style={{ color: c.ink, fontWeight: '600', fontSize: 15 }}>{m.a}</Text>
      </View>
      {(m.live || m.ft) && (
        <View style={{ marginRight: 14 }}>
          <Text style={{ color: c.ink, fontWeight: '800', fontSize: 18, textAlign: 'right' }}>{m.hs}</Text>
          <Text style={{ color: c.ink, fontWeight: '800', fontSize: 18, textAlign: 'right' }}>{m.as}</Text>
        </View>
      )}
      <Text style={{ color: m.live ? LIVE : c.sub, fontWeight: '700', fontSize: 12 }}>
        {m.live ? 'LIVE ' : ''}{label(m)}
      </Text>
    </TouchableOpacity>
  );

  const HlRow = ({ h }) => {
    const on = fav.includes(h.id);
    return (
      <View style={[st.row, { backgroundColor: c.card, borderColor: c.line }]}>
        <TouchableOpacity
          style={[st.thumb, { backgroundColor: h.c }]}
          onPress={() => say('Playing: ' + h.t)}
        >
          <Ionicons name="play" size={22} color="#fff" />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={{ color: c.ink, fontWeight: '600' }}>{h.t}</Text>
          <Text style={{ color: c.sub, fontSize: 12 }}>{h.m} - {h.d}</Text>
        </View>
        <TouchableOpacity onPress={() => toggleFav(h.id)}>
          <Ionicons name={on ? 'star' : 'star-outline'} size={24} color={on ? '#F2B01E' : c.sub} />
        </TouchableOpacity>
      </View>
    );
  };

  const Title = ({ t, s }) => (
    <View style={{ marginBottom: 14 }}>
      <Text style={{ color: c.ink, fontSize: 28, fontWeight: '800' }}>{t}</Text>
      {!!s && <Text style={{ color: c.sub, fontSize: 14 }}>{s}</Text>}
    </View>
  );

  const H2 = ({ t }) => (
    <Text style={{ color: c.ink, fontSize: 17, fontWeight: '700', marginTop: 20, marginBottom: 10 }}>{t}</Text>
  );

  // ---------- Detail ----------
  const renderDetail = () => {
    const m = matches.find((x) => x.id === mid);
    const fb = m.sp === 'Football';
    const names = fb
      ? ['Shots on target', 'Total shots', 'Corners', 'Fouls', 'Yellow cards']
      : ['Rebounds', 'Assists', 'Steals', 'Turnovers', 'Blocks'];
    const p = 50 + ((m.id * 7) % 20);
    const msgs = chat[m.id] || [['FootballFan23', 'What a goal!'], ['GoalMachine', 'This game is insane!']];
    const send = () => {
      const v = msg.trim();
      if (!v) return;
      const id = m.id;
      setChat((x) => ({ ...x, [id]: [...(x[id] || msgs), ['You', v]] }));
      setMsg('');
      setTimeout(() => {
        const reply = ['Great call!', 'Ha, true.', 'Unreal match.'][Math.floor(Math.random() * 3)];
        setChat((x) => ({ ...x, [id]: [...(x[id] || []), ['MessiForever', reply]] }));
      }, 1300);
    };
    return (
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={st.pad} keyboardShouldPersistTaps="handled">
          <TouchableOpacity onPress={() => setMid(null)} style={[st.back, { backgroundColor: c.card, borderColor: c.line }]}>
            <Ionicons name="arrow-back" size={20} color={c.ink} />
          </TouchableOpacity>
          <View style={{ height: 14 }} />
          <Title t={m.h + ' vs ' + m.a} s={m.lg} />

          <View style={st.pitch}>
            {m.live && (
              <View style={st.liveBadge}><Text style={st.liveTxt}>LIVE {label(m)}</Text></View>
            )}
            <TouchableOpacity style={st.pp} onPress={() => setPlay(!play)}>
              <Ionicons name={play ? 'pause' : 'play'} size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={st.board}>
            <Text style={{ color: c.ink, flex: 1, textAlign: 'center' }}>{m.h}</Text>
            <Text style={{ color: c.ink, fontSize: 36, fontWeight: '800' }}>
              {m.hs == null ? '-' : m.hs} : {m.as == null ? '-' : m.as}
            </Text>
            <Text style={{ color: c.ink, flex: 1, textAlign: 'center' }}>{m.a}</Text>
          </View>

          <View style={[st.box, { backgroundColor: c.card, borderColor: c.line }]}>
            {fb && (
              <View>
                <View style={st.sr}>
                  <Text style={{ color: c.ink, fontWeight: '700' }}>{p}%</Text>
                  <Text style={{ color: c.sub }}>Possession</Text>
                  <Text style={{ color: c.ink, fontWeight: '700' }}>{100 - p}%</Text>
                </View>
                <View style={st.bar}>
                  <View style={{ flex: p, backgroundColor: c.acc }} />
                  <View style={{ flex: 100 - p, backgroundColor: LIVE }} />
                </View>
              </View>
            )}
            {names.map((n, i) => (
              <View key={n} style={st.sr}>
                <Text style={{ color: c.ink, fontWeight: '700' }}>{sv(m.id, i)}</Text>
                <Text style={{ color: c.sub }}>{n}</Text>
                <Text style={{ color: c.ink, fontWeight: '700' }}>{sv(m.id + 3, i)}</Text>
              </View>
            ))}
          </View>

          <View style={[st.box, { backgroundColor: c.card, borderColor: c.line, marginTop: 12 }]}>
            <Text style={{ color: c.ink, fontWeight: '700', marginBottom: 8 }}>Live chat</Text>
            {msgs.map((x, i) => (
              <Text key={i} style={{ color: c.ink, marginBottom: 6 }}>
                <Text style={{ color: c.acc, fontWeight: '700' }}>{x[0]} </Text>{x[1]}
              </Text>
            ))}
            <View style={{ flexDirection: 'row', marginTop: 8 }}>
              <TextInput
                style={[st.input, { color: c.ink, borderColor: c.line }]}
                placeholder="Type a message..."
                placeholderTextColor={c.sub}
                value={msg}
                onChangeText={setMsg}
                onSubmitEditing={send}
                maxLength={120}
              />
              <TouchableOpacity style={[st.send, { backgroundColor: c.acc }]} onPress={send}>
                <Ionicons name="send" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  };

  // ---------- Tabs ----------
  const renderHome = () => {
    const f = matches[0];
    const L = matches.filter((m) => m.live && (sp === 'All' || m.sp === sp));
    return (
      <ScrollView contentContainerStyle={st.pad}>
        <Title t="Home" s="Live sports. Anytime. Anywhere." />
        <Chips />
        <View style={[st.feat, { backgroundColor: c.acc }]}>
          <View style={st.liveBadge}><Text style={st.liveTxt}>LIVE {label(f)}</Text></View>
          <Text style={{ color: '#fff', marginTop: 8 }}>{f.lg}</Text>
          <Text style={{ color: '#fff', fontSize: 44, fontWeight: '800' }}>{f.hs} - {f.as}</Text>
          <Text style={{ color: '#fff' }}>{f.h} vs {f.a}</Text>
          <TouchableOpacity style={st.watch} onPress={() => { setMid(f.id); setPlay(true); }}>
            <Text style={{ color: c.acc, fontWeight: '700' }}>Watch Live</Text>
          </TouchableOpacity>
        </View>
        <H2 t="Live matches" />
        {L.length === 0 && <Text style={{ color: c.sub }}>No live matches for this sport right now.</Text>}
        {L.map((m) => <MatchRow key={m.id} m={m} />)}
        <H2 t="Top highlights" />
        {HIGHLIGHTS.slice(0, 2).map((h) => <HlRow key={h.id} h={h} />)}
      </ScrollView>
    );
  };

  const renderMatches = () => {
    const A = matches.filter((m) => m.day === day && (sp === 'All' || m.sp === sp));
    return (
      <ScrollView contentContainerStyle={st.pad}>
        <Title t="Matches" s="Scores and fixtures" />
        <View style={st.chips}>
          <Chip text="Today" on={day === 0} onPress={() => setDay(0)} />
          <Chip text="Tomorrow" on={day === 1} onPress={() => setDay(1)} />
        </View>
        <Chips />
        {A.length === 0 && <Text style={{ color: c.sub }}>No matches found.</Text>}
        {A.map((m) => <MatchRow key={m.id} m={m} />)}
      </ScrollView>
    );
  };

  const renderHl = () => (
    <ScrollView contentContainerStyle={st.pad}>
      <Title t="Highlights" s="Never miss the best moments" />
      {HIGHLIGHTS.map((h) => <HlRow key={h.id} h={h} />)}
    </ScrollView>
  );

  const renderMe = () => {
    const F = HIGHLIGHTS.filter((h) => fav.includes(h.id));
    return (
      <ScrollView contentContainerStyle={st.pad}>
        <Title t="Profile" s="Your account" />
        <View style={[st.box, { backgroundColor: c.card, borderColor: c.line, flexDirection: 'row', alignItems: 'center' }]}>
          <View style={[st.ava, { backgroundColor: c.acc }]}>
            <Text style={{ color: '#fff', fontSize: 24, fontWeight: '800' }}>{(user || '?').charAt(0).toUpperCase()}</Text>
          </View>
          <View style={{ marginLeft: 14, flex: 1 }}>
            <Text style={{ color: c.ink, fontWeight: '700' }}>{user}</Text>
            <Text style={{ color: c.sub, fontSize: 13 }}>{F.length} saved highlights</Text>
          </View>
        </View>
        <H2 t="My favorites" />
        {F.length === 0 && <Text style={{ color: c.sub }}>Tap the star on a highlight to save it here.</Text>}
        {F.map((h) => <HlRow key={h.id} h={h} />)}
        <View style={[st.box, { backgroundColor: c.card, borderColor: c.line, marginTop: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
          <Text style={{ color: c.ink }}>Dark mode</Text>
          <Switch value={dark} onValueChange={setDark} trackColor={{ true: c.acc }} />
        </View>
        <TouchableOpacity style={st.logout} onPress={onLogout}>
          <Text style={{ color: '#fff', fontWeight: '700' }}>Log out</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  };

  const TABS = [
    ['home', 'Home', 'home'],
    ['matches', 'Matches', 'grid'],
    ['hl', 'Highlights', 'play-circle'],
    ['me', 'Profile', 'person'],
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.bg }}>
      <View style={{ flex: 1 }}>
        {mid != null ? renderDetail()
          : tab === 'home' ? renderHome()
          : tab === 'matches' ? renderMatches()
          : tab === 'hl' ? renderHl()
          : renderMe()}
        {!!toast && (
          <View style={st.toast}><Text style={{ color: '#fff', fontSize: 13 }}>{toast}</Text></View>
        )}
      </View>
      <View style={[st.tabs, { backgroundColor: c.card, borderTopColor: c.line }]}>
        {TABS.map(([k, name, icon]) => {
          const on = tab === k && mid == null;
          return (
            <TouchableOpacity key={k} style={st.tab} onPress={() => { setTab(k); setMid(null); }}>
              <Ionicons name={on ? icon : icon + '-outline'} size={22} color={on ? c.acc : c.sub} />
              <Text style={{ color: on ? c.acc : c.sub, fontSize: 11, marginTop: 2 }}>{name}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  pad: { padding: 20, paddingBottom: 30 },
  chips: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  chip: { borderWidth: 1, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 7 },
  row: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 14, padding: 13, marginBottom: 8 },
  thumb: { width: 76, height: 52, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  feat: { borderRadius: 18, padding: 20, alignItems: 'center' },
  liveBadge: { backgroundColor: LIVE, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 },
  liveTxt: { color: '#fff', fontSize: 11, fontWeight: '800' },
  watch: { backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 22, paddingVertical: 11, marginTop: 12 },
  back: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  pitch: { height: 180, borderRadius: 16, backgroundColor: '#1F6B3A', borderWidth: 2, borderColor: '#2E8A50', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  pp: { width: 54, height: 54, borderRadius: 27, backgroundColor: 'rgba(0,0,0,0.55)', alignItems: 'center', justifyContent: 'center' },
  board: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  box: { borderWidth: 1, borderRadius: 14, padding: 14 },
  sr: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  bar: { flexDirection: 'row', height: 8, borderRadius: 4, overflow: 'hidden', marginBottom: 8 },
  input: { flex: 1, borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, height: 44 },
  send: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginLeft: 8 },
  ava: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  logout: { backgroundColor: LIVE, borderRadius: 14, height: 50, alignItems: 'center', justifyContent: 'center', marginTop: 14 },
  tabs: { flexDirection: 'row', borderTopWidth: 1, paddingVertical: 6 },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 4 },
  toast: { position: 'absolute', bottom: 16, alignSelf: 'center', backgroundColor: '#1B2150', paddingHorizontal: 16, paddingVertical: 9, borderRadius: 12 },
});