import React, { useState } from 'react';
import { Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SplashScreen from './screens/SplashScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import ForgotScreen from './screens/ForgotScreen';
import VerifyScreen from './screens/VerifyScreen';
import ResetScreen from './screens/ResetScreen';
import HomeScreen from './screens/HomeScreen';
import { currentUser, logout, sendCode, markVerified, resetPassword } from './auth';

export default function App() {
  const [screen, setScreen] = useState('splash');
  const [user, setUser] = useState(null);
  const [ctx, setCtx] = useState({ id: '', mode: 'signup' });
  const [prefill, setPrefill] = useState('');
  const [notice, setNotice] = useState('');

  const afterSplash = async () => {
    const u = await currentUser();
    if (u) {
      setUser(u);
      setScreen('home');
    } else setScreen('welcome');
  };

  const startVerify = (id, mode) => {
    sendCode(id);
    setCtx({ id, mode });
    setScreen('verify');
  };

  const goLogin = () => {
    setNotice('');
    setScreen('login');
  };

  let content;
  if (screen === 'splash') {
    content = <SplashScreen onDone={afterSplash} />;
  } else if (screen === 'welcome') {
    content = <WelcomeScreen onGetStarted={goLogin} onSignIn={goLogin} />;
  } else if (screen === 'login') {
    content = (
      <LoginScreen
        prefill={prefill}
        notice={notice}
        onBack={() => setScreen('welcome')}
        onSignUp={() => {
          setNotice('');
          setScreen('signup');
        }}
        onForgot={() => {
          setNotice('');
          setScreen('forgot');
        }}
        onNeedVerify={(id) => startVerify(id, 'signup')}
        onSuccess={(u) => {
          setNotice('');
          setPrefill('');
          setUser(u);
          setScreen('home');
        }}
      />
    );
  } else if (screen === 'signup') {
    content = <SignUpScreen onBack={goLogin} onSignIn={goLogin} onNext={(id) => startVerify(id, 'signup')} />;
  } else if (screen === 'forgot') {
    content = <ForgotScreen onBack={goLogin} onNext={(id) => startVerify(id, 'reset')} />;
  } else if (screen === 'verify') {
    content = (
      <VerifyScreen
        id={ctx.id}
        onBack={() => setScreen(ctx.mode === 'reset' ? 'forgot' : 'signup')}
        onVerified={async () => {
          if (ctx.mode === 'reset') {
            setScreen('reset');
          } else {
            await markVerified(ctx.id);
            setPrefill(ctx.id);
            setNotice('Amjilttai batalgaajlaa! Odoo Sign In hiine uu.');
            setScreen('login');
          }
        }}
      />
    );
  } else if (screen === 'reset') {
    content = (
      <ResetScreen
        onBack={goLogin}
        onSave={async (pw) => {
          await resetPassword(ctx.id, pw);
          setPrefill(ctx.id);
          setNotice('Nuuts ug shinechlegdlee. Odoo Sign In hiine uu.');
          setScreen('login');
        }}
      />
    );
  } else {
    content = (
      <HomeScreen
        user={user}
        onLogout={async () => {
          await logout();
          setUser(null);
          setScreen('welcome');
        }}
      />
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      {content}
    </SafeAreaProvider>
  );
}