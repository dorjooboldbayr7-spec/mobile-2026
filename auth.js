import AsyncStorage from '@react-native-async-storage/async-storage';

// DEMO_MODE = true: SMS/email service holbogdoogui tul code-iig app dotor haruulna.
// Jinhene email/SMS ilgeehdee sendCode() dotor Supabase/Firebase/Twilio-g holbono.
export const DEMO_MODE = true;

const USERS = 'playnex_users';
const SESSION = 'playnex_session';

export const isEmail = (v) => /^\S+@\S+\.\S+$/.test((v || '').trim());
export const isPhone = (v) => /^\+?\d{8,15}$/.test((v || '').trim().replace(/[\s-]/g, ''));
export const kind = (v) => (isEmail(v) ? 'email' : isPhone(v) ? 'phone' : null);
const norm = (v) => (v || '').trim().toLowerCase().replace(/[\s-]/g, '');

async function getUsers() {
  try {
    return JSON.parse(await AsyncStorage.getItem(USERS)) || {};
  } catch (e) {
    return {};
  }
}
const setUsers = (u) => AsyncStorage.setItem(USERS, JSON.stringify(u));

// ---------- Verification code ----------
let pending = null;

export function sendCode(target) {
  const code = String(Math.floor(100000 + Math.random() * 900000));
  pending = { target: norm(target), code, expires: Date.now() + 5 * 60 * 1000, tries: 0 };
  // TODO: end jinhene email/SMS ilgeene (jishee: supabase.auth.signInWithOtp)
  return code;
}
export const lastCode = () => (DEMO_MODE && pending ? pending.code : null);

export function checkCode(target, input) {
  if (!pending || pending.target !== norm(target)) return 'Code oldsongui. Dahin code avna uu.';
  if (Date.now() > pending.expires) return 'Code-iin hugatsaa duussan. Dahin code avna uu.';
  if (pending.tries >= 5) return 'Hetsuu olon udaa buruu oruulsan. Shine code avna uu.';
  if (input !== pending.code) {
    pending.tries += 1;
    return 'Buruu code baina.';
  }
  pending = null;
  return null;
}

// ---------- Accounts ----------
export async function userExists(id) {
  const u = await getUsers();
  return !!u[norm(id)];
}

export async function register({ name, id, password }) {
  const users = await getUsers();
  const key = norm(id);
  if (users[key] && users[key].verified) return 'Ene email/dugaar burtgeltei baina. Sign In hiine uu.';
  users[key] = { name: name.trim(), id: id.trim(), password, verified: false };
  await setUsers(users);
  return null;
}

export async function markVerified(id) {
  const users = await getUsers();
  const key = norm(id);
  if (!users[key]) return null;
  users[key].verified = true;
  await setUsers(users);
  return users[key];
}

export async function login(id, password) {
  const users = await getUsers();
  const u = users[norm(id)];
  if (!u || u.password !== password) return { error: 'Email/dugaar esvel nuuts ug buruu baina.' };
  if (!u.verified) return { error: 'unverified' };
  await AsyncStorage.setItem(SESSION, norm(id));
  return { user: u };
}

export async function resetPassword(id, password) {
  const users = await getUsers();
  const key = norm(id);
  if (!users[key]) return;
  users[key].password = password;
  await setUsers(users);
}

export async function currentUser() {
  try {
    const key = await AsyncStorage.getItem(SESSION);
    if (!key) return null;
    const users = await getUsers();
    return users[key] || null;
  } catch (e) {
    return null;
  }
}

export const logout = () => AsyncStorage.removeItem(SESSION);