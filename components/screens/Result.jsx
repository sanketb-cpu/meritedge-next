'use client';
import { Frame, ActionButton } from '../ui/Frame';
import { CountUp } from '../ui/kit';

export default function Result({ flow, data, act, busy, navigate, back, answer }) {
  const r = answer === false ? data.wrong : data.right;
  return (
    <Frame steps={flow.steps} step={data.step} onBack={back}>
      <p className="lead">{r.lead}</p>
      <h1 className="big"><CountUp value={r.score} /> <span className="accent">/ {data.outOf}</span></h1>
      <p className="sub">{r.why}</p>
      <span style={{ fontSize: 17, fontWeight: 600 }}>{data.line}</span>
      <ActionButton id="next" busy={busy} wide onClick={() => act('next', 'Loading', 600, () => navigate(data.next))}>{data.cta}</ActionButton>
    </Frame>
  );
}
