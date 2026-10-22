'use client';
import { useEffect, useRef, useState } from 'react';
import { Frame, ActionButton } from '../ui/Frame';
import { blast } from '../ui/kit';

export default function Countdown({ flow, data, act, busy, navigate, back, toast }) {
  const [n, setN] = useState(data.seconds);
  const [tick, setTick] = useState(0);
  const numRef = useRef(null);
  const done = n === 0;

  useEffect(() => {
    if (n <= 0) return;
    const t = setTimeout(() => { setN(n - 1); setTick((x) => x + 1); }, 1000);
    return () => clearTimeout(t);
  }, [n]);

  useEffect(() => {
    if (!done) return;
    const r = numRef.current?.getBoundingClientRect();
    if (r) blast(r.left + r.width / 2, r.top + r.height / 2);
    toast(data.toast);
    const t = setTimeout(() => navigate(data.next), data.autoNextMs);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  return (
    <Frame steps={flow.steps} step={data.step} onBack={back}>
      <p className="lead">{done ? data.doneLead : data.lead}</p>
      <h1 className="big">
        <span ref={numRef} key={tick} className="cd pop">{String(n).padStart(2, '0')}</span>{' '}
        <span className="accent">{done ? data.doneWord : data.unit}</span>
      </h1>
      <div className="compare">
        <div className="old"><span className="num">{data.compare.manual.value}</span><span><b>{data.compare.manual.title}</b><small>{data.compare.manual.sub}</small></span></div>
        <div className="new"><span className="num">{data.compare.ai.value}</span><span><b>{data.compare.ai.title}</b><small style={{ color: '#DDD6FE' }}>{data.compare.ai.sub}</small></span></div>
      </div>
      <p className="sub" style={{ fontSize: 18 }}>{data.line}</p>
      <div className="chips">{data.chips.map((c) => <span className="chip" key={c}>{c}</span>)}</div>
      <ActionButton id="next" busy={busy} wide onClick={() => act('next', 'Loading', 500, () => navigate(data.next))}>{data.cta}</ActionButton>
    </Frame>
  );
}
