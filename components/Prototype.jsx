'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ProgressOverlay } from './ui/kit';
import TopBar from './ui/TopBar';
import SignupModal from './ui/SignupModal';
import Welcome from './screens/Welcome';
import Savings from './screens/Savings';
import Setup from './screens/Setup';
import Countdown from './screens/Countdown';
import TryIt from './screens/TryIt';
import Result from './screens/Result';
import Invite from './screens/Invite';
import Dashboard from './screens/Dashboard';
import TrialEnd from './screens/TrialEnd';
import Checkout from './screens/Checkout';
import Success from './screens/Success';

const SCREENS = { welcome: Welcome, savings: Savings, setup: Setup, countdown: Countdown, tryIt: TryIt, result: Result, invite: Invite, dashboard: Dashboard, trialEnd: TrialEnd, checkout: Checkout, success: Success };
const STORE = 'meritedge_user';

export default function Prototype({ flow }) {
  const [screen, setScreen] = useState(flow.start);
  const [history, setHistory] = useState([]);
  const [busy, setBusy] = useState(null);
  const [overlay, setOverlay] = useState(null);
  const [toastMsg, setToastMsg] = useState('');
  const [user, setUser] = useState(null);
  const [answer, setAnswer] = useState(null);
  const [invited, setInvited] = useState(null);
  const [signup, setSignup] = useState(null);
  const barRef = useRef(null);
  const toastTimer = useRef(null);

  useEffect(() => {
    try { const u = JSON.parse(localStorage.getItem(STORE) || 'null'); if (u) setUser(u); } catch (_) {}
  }, []);

  const saveUser = (u) => {
    setUser(u);
    try { u ? localStorage.setItem(STORE, JSON.stringify(u)) : localStorage.removeItem(STORE); } catch (_) {}
  };

  const toast = useCallback((m) => {
    setToastMsg(m); clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(''), 2200);
  }, []);

  const bar = (ms) => {
    const b = barRef.current; if (!b) return;
    b.style.transition = 'none'; b.style.width = '0'; b.style.opacity = '1';
    requestAnimationFrame(() => { b.style.transition = `width ${ms}ms cubic-bezier(.3,.7,.3,1)`; b.style.width = '92%'; });
  };
  const barDone = () => {
    const b = barRef.current; if (!b) return;
    b.style.transition = 'width .2s'; b.style.width = '100%';
    setTimeout(() => { b.style.opacity = '0'; }, 250);
  };

  const navigate = useCallback((to, { replace = false } = {}) => {
    setHistory((h) => (replace ? h : [...h, screen]));
    setScreen(to);
    window.scrollTo(0, 0);
  }, [screen]);

  /** Button with a spinner + top progress bar, then run `then` */
  const act = (id, label, ms, then) => {
    if (busy) return;
    setBusy({ id, label }); bar(ms);
    setTimeout(() => { barDone(); setBusy(null); then(); }, ms);
  };

  /** Step-by-step progress window, then run `then` */
  const longAct = (id, title, steps, ms, then) => {
    if (busy) return;
    setBusy({ id, label: title }); bar(ms + 300);
    setTimeout(() => setOverlay({ title, steps, ms, then: () => { barDone(); setOverlay(null); setBusy(null); then(); } }), 250);
  };

  const back = () => {
    setHistory((h) => { const prev = h[h.length - 1]; if (prev) setScreen(prev); return h.slice(0, -1); });
  };

  const close = (to, msg) => {
    bar(350);
    setTimeout(() => { barDone(); if (msg) toast(msg); navigate(to); }, 350);
  };

  const logout = () => {
    saveUser(null); setInvited(null); setHistory([]); setScreen(flow.start); toast('You have been logged out'); window.scrollTo(0, 0);
  };

  const Screen = SCREENS[screen];
  const ctx = { flow, data: flow.screens[screen], navigate, act, longAct, busy, back, close, toast, blastReady: true, user, answer, setAnswer, invited, setInvited,
    startSignup: (cand) => setSignup(cand) };

  const showUser = user && ['dashboard', 'trialEnd', 'checkout', 'success'].includes(screen);

  return (
    <>
      <div id="topbar" ref={barRef} style={{ width: 0, opacity: 0 }} />
      <TopBar brand={flow.brand} user={showUser ? user : null} onLogo={() => { setHistory([]); setScreen(flow.start); }} onLogout={logout} />
      <div key={screen}>
        <Screen {...ctx} />
      </div>
      {overlay && <ProgressOverlay title={overlay.title} steps={overlay.steps} ms={overlay.ms} onDone={overlay.then} />}
      {signup && (
        <SignupModal
          config={flow.signup}
          logo={flow.brand.logo}
          candidate={signup}
          onClose={() => setSignup(null)}
          onBar={bar}
          onBarDone={barDone}
          onDone={(u) => { saveUser(u); setInvited(signup); setSignup(null); navigate(flow.screens.invite.next); toast('Invitation sent to ' + signup.name); }}
          toast={toast}
        />
      )}
      {toastMsg && <div className="toast" role="status">{toastMsg}</div>}
    </>
  );
}
