'use client';
import { useState } from 'react';
import { Frame, ActionButton } from '../ui/Frame';

export default function Setup({ flow, data, longAct, busy, navigate, back }) {
  const [jd, setJd] = useState(data.defaultJD);
  return (
    <Frame steps={flow.steps} step={data.step} onBack={back}>
      <h1 className="big sm">{data.title}<br /><span className="accent">{data.accent}</span></h1>
      <textarea className="field" rows={6} aria-label={data.label} value={jd} onChange={(e) => setJd(e.target.value)} />
      <ActionButton id="build" busy={busy} wide disabled={!jd.trim()}
        onClick={() => longAct('build', data.buildTitle, data.buildSteps, data.buildMs, () => navigate(data.next))}>{data.cta}</ActionButton>
      <span className="small">{data.hint}</span>
    </Frame>
  );
}
