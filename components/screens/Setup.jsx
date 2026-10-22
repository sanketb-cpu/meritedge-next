'use client';
import { useState } from 'react';
import { Frame, ActionButton } from '../ui/Frame';

export default function Setup({ flow, data, longAct, busy, navigate, back }) {
  const [jd, setJd] = useState(data.defaultJD);
  const [domain, setDomain] = useState(data.defaultDomain);
  const [role, setRole] = useState(data.defaultRole);
  return (
    <Frame steps={flow.steps} step={data.step} onBack={back} className="setup-screen">
      <h1 className="big sm">{data.title}<br /><span className="accent">{data.accent}</span></h1>
      <div className="setup-details">
        <label>
          <span>{data.domainLabel}</span>
          <input className="field" list="domain-options" placeholder={data.domainPlaceholder} value={domain} onChange={(e) => setDomain(e.target.value)} />
          <datalist id="domain-options">
            {data.domainOptions.map((option) => <option key={option} value={option} />)}
          </datalist>
        </label>
        <label>
          <span>{data.roleLabel}</span>
          <select className="field" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="">{data.rolePlaceholder}</option>
            {data.roleOptions.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </label>
      </div>
      <textarea className="field" rows={6} aria-label={data.label} value={jd} onChange={(e) => setJd(e.target.value)} />
      <ActionButton id="build" busy={busy} wide disabled={!jd.trim() || !domain.trim() || !role}
        onClick={() => longAct('build', data.buildTitle, data.buildSteps, data.buildMs, () => navigate(data.next))}>{data.cta}</ActionButton>
      <span className="small">{data.hint}</span>
    </Frame>
  );
}
