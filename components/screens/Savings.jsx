'use client';
import { useState } from 'react';
import { Frame, ActionButton } from '../ui/Frame';

export default function Savings({ flow, data, act, busy, navigate, back }) {
  const [cands, setCands] = useState(data.default);
  const hours = Math.round((cands * data.minutesPerScreen / 60) * data.automationShare);
  return (
    <Frame steps={flow.steps} step={data.step} onBack={back} className="savings-screen">
      <h1 className="big">{data.title}<br /><span className="accent">{data.headlineAccent}</span></h1>
      <p className="lead">{data.lead} {hours} {data.unit} {data.accent}</p>
      <div className="slider">
        <label htmlFor="cands">{data.sliderLabel}</label>
        <input id="cands" type="range" min={data.min} max={data.max} step={data.stepSize} value={cands} onChange={(e) => setCands(Number(e.target.value))} />
        <b>{cands} {data.sliderSuffix}</b>
      </div>
      <ActionButton id="next" busy={busy} wide onClick={() => act('next', 'Loading', 600, () => navigate(data.next))}>{data.cta}</ActionButton>
    </Frame>
  );
}
