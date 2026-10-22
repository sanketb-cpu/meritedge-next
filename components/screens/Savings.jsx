'use client';
import { useState } from 'react';
import { Frame, ActionButton } from '../ui/Frame';

export default function Savings({ flow, data, act, busy, navigate, back }) {
  const [cands, setCands] = useState(data.default);
  const hours = Math.round((cands * data.minutesPerScreen / 60) * data.automationShare);
  return (
    <Frame steps={flow.steps} step={data.step} onBack={back}>
      <p className="lead">{data.lead}</p>
      <h1 className="big">{hours} {data.unit} <span className="accent">{data.accent}</span></h1>
      <div className="slider">
        <label htmlFor="cands">{data.sliderLabel}</label>
        <input id="cands" type="range" min={data.min} max={data.max} step={data.stepSize} value={cands} onChange={(e) => setCands(Number(e.target.value))} />
        <b>{cands} {data.sliderSuffix}</b>
      </div>
      <div className="proof">{data.proofText}
        <button type="button" aria-label={data.proofText} onClick={() => act('proof', 'Loading', 500, () => navigate(data.proofTarget))}>→</button>
      </div>
      <ActionButton id="next" busy={busy} wide onClick={() => act('next', 'Loading', 600, () => navigate(data.next))}>{data.cta}</ActionButton>
    </Frame>
  );
}
