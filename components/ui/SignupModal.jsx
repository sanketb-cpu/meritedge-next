'use client';
import { useEffect, useRef, useState } from 'react';
import { Icon } from './kit';
import { fill, firstName } from '@/lib/format';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const newCode = (len) => String(Math.floor(10 ** (len - 1) + Math.random() * 9 * 10 ** (len - 1)));

function Stepper({ steps, at }) {
  return (
    <div className="sust">
      {steps.map((s, i) => (
        <span key={s.title} style={{ display: 'contents' }}>
          <div className={'sus' + (i < at ? ' done' : i === at ? ' now' : '')}>
            <span>{i < at ? '✓' : i + 1}</span>
            <div><b>{i + 1}. {s.title}</b><small>{s.sub}</small></div>
          </div>
          {i < steps.length - 1 && <i />}
        </span>
      ))}
    </div>
  );
}

export default function SignupModal({ config: c, logo, candidate, onClose, onDone, onBar, onBarDone, toast }) {
  const [stage, setStage] = useState('form');
  const [form, setForm] = useState({ name: '', email: '', company: '' });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [shake, setShake] = useState(0);
  const [code, setCode] = useState('');
  const [digits, setDigits] = useState(Array(c.otpLength).fill(''));
  const [otpErr, setOtpErr] = useState('');
  const [left, setLeft] = useState(c.resendSeconds);
  const [fillPct, setFillPct] = useState(0);
  const inputs = useRef([]);
  const firstField = useRef(null);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => { if (stage === 'form') firstField.current?.focus(); if (stage === 'otp') inputs.current[0]?.focus(); }, [stage]);

  useEffect(() => {
    if (stage !== 'otp' || left <= 0) return;
    const t = setTimeout(() => setLeft(left - 1), 1000);
    return () => clearTimeout(t);
  }, [stage, left]);

  const doShake = () => setShake((s) => s + 1);

  const submit = (e) => {
    e.preventDefault();
    const v = { name: form.name.trim(), email: form.email.trim(), company: form.company.trim() };
    const er = {};
    if (v.name.length < 2) er.name = c.errors.name;
    if (!EMAIL.test(v.email)) er.email = c.errors.email;
    else if (new RegExp('@(' + c.blockedDomains.join('|') + ')\\.', 'i').test(v.email)) er.email = c.errors.personal;
    if (v.company.length < 2) er.company = c.errors.company;
    setErrors(er);
    if (Object.keys(er).length) { doShake(); return; }
    setForm(v); setBusy(true); onBar(900);
    setTimeout(() => { onBarDone(); setBusy(false); startOtp(); }, 900);
  };

  const startOtp = () => { setCode(newCode(c.otpLength)); setDigits(Array(c.otpLength).fill('')); setOtpErr(''); setLeft(c.resendSeconds); setStage('otp'); };

  const verify = (value) => {
    if (busy) return;
    setBusy(true); onBar(800);
    setTimeout(() => {
      onBarDone(); setBusy(false);
      if (value !== code) {
        setOtpErr(c.errors.otp); doShake(); setDigits(Array(c.otpLength).fill('')); inputs.current[0]?.focus(); return;
      }
      setStage('done');
      requestAnimationFrame(() => setFillPct(100));
      onBar(1300);
      setTimeout(() => { onBarDone(); onDone(form); }, 1400);
    }, 800);
  };

  const setDigit = (i, raw) => {
    const d = raw.replace(/\D/g, '').slice(-1);
    const next = [...digits]; next[i] = d; setDigits(next); setOtpErr('');
    if (d && i < c.otpLength - 1) inputs.current[i + 1]?.focus();
    if (next.join('').length === c.otpLength) verify(next.join(''));
  };
  const onPaste = (e) => {
    const t = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, c.otpLength);
    if (!t) return; e.preventDefault();
    const next = Array(c.otpLength).fill('').map((_, j) => t[j] || ''); setDigits(next);
    inputs.current[Math.min(t.length, c.otpLength - 1)]?.focus();
    if (t.length === c.otpLength) verify(t);
  };

  const field = (k, type = 'text', auto) => (
    <label className={errors[k] ? 'bad' : ''}>
      {c.fields[k]}
      <input ref={k === 'name' ? firstField : undefined} name={k} type={type} autoComplete={auto} placeholder={c.placeholders[k]}
        value={form[k]} onChange={(e) => { setForm({ ...form, [k]: e.target.value }); setErrors({ ...errors, [k]: undefined }); }}
        aria-invalid={!!errors[k]} />
      {errors[k] && <em className="err">{errors[k]}</em>}
    </label>
  );

  return (
    <div className="overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div key={shake} className={'subox' + (shake ? ' shake' : '')} role="dialog" aria-modal="true" aria-label="Create your account">
        <div className="suhead"><img src={logo} alt="Otomeyt AI" /><button type="button" className="sux" aria-label="Close" onClick={onClose}>✕</button></div>
        <div className="subody">
          {stage === 'form' && (<>
            <Stepper steps={c.steps} at={0} />
            <div className="suhero"><span className="suicon"><Icon name="gift2" color="#fff" size={26} /></span><div><h3>{c.title}</h3><p>{c.sub}</p></div></div>
            <div className="superks">{c.perks.map((p) => <div key={p.title}><span className="tick">✓</span><div><b>{p.title}</b><small>{p.sub}</small></div></div>)}</div>
            <form className="suform" noValidate onSubmit={submit}>
              {field('name', 'text', 'name')}
              {field('email', 'email', 'email')}
              {field('company', 'text', 'organization')}
              <button className="sub-btn" type="submit" disabled={busy}>{busy ? <><span className="spin" />Creating your account…</> : c.cta}</button>
              <p className="fine">{c.fine}</p>
              <p className="demo">{c.demo}</p>
            </form>
          </>)}

          {stage === 'otp' && (<>
            <Stepper steps={c.steps} at={1} />
            <div className="suhero"><span className="suicon"><Icon name="mail" color="#fff" size={26} /></span><div><h3>{c.otpTitle}</h3><p>{c.otpSub} <b>{form.email}</b>.</p></div></div>
            <div className="suotp" onPaste={onPaste}>
              {digits.map((d, i) => (
                <input key={i} ref={(el) => (inputs.current[i] = el)} inputMode="numeric" maxLength={1} aria-label={`Digit ${i + 1}`}
                  className={otpErr ? 'bad' : ''} value={d} onChange={(e) => setDigit(i, e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Backspace' && !d && i > 0) { inputs.current[i - 1]?.focus(); setDigit(i - 1, ''); } }} />
              ))}
            </div>
            {otpErr && <em className="err" role="alert" style={{ textAlign: 'center' }}>{otpErr}</em>}
            <div className="suhint">Demo code: <b>{code}</b></div>
            <button className="sub-btn" type="button" disabled={busy || digits.join('').length !== c.otpLength} onClick={() => verify(digits.join(''))}>
              {busy ? <><span className="spin" />Verifying…</> : c.verify}
            </button>
            <div className="sures">
              {left > 0 ? `Resend code in ${left}s` : <button className="linkbtn" onClick={() => { toast('New code sent (demo)'); startOtp(); }}>Resend code</button>}
              {' · '}<button className="linkbtn" onClick={() => setStage('form')}>Change email</button>
            </div>
          </>)}

          {stage === 'done' && (<>
            <Stepper steps={c.steps} at={2} />
            <div className="sudone">
              <span className="okmark">✓</span>
              <h3>{fill(c.doneTitle, { name: firstName(form.name) })}</h3>
              <p>{fill(c.doneSub, { candidate: candidate.name })}</p>
              <div className="ovbar"><i style={{ width: fillPct + '%', transition: 'width 1.3s ease' }} /></div>
            </div>
          </>)}
        </div>
      </div>
    </div>
  );
}
