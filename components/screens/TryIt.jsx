'use client';
import { useState } from 'react';
import { Frame } from '../ui/Frame';

export default function TryIt({ flow, data, act, navigate, back, setAnswer }) {
  const [picked, setPicked] = useState(null);
  const choose = (o) => {
    if (picked) return;
    setPicked(o.id); setAnswer(o.correct);
    act('opt', 'Scoring', 700, () => navigate(data.next));
  };
  return (
    <Frame steps={flow.steps} step={data.step} onBack={back}>
      <p className="lead">{data.lead}</p>
      <h1 className="big sm" style={{ maxWidth: 900, lineHeight: 1.1 }}>{data.question} <span className="accent">{data.accent}</span></h1>
      <div className="options" role="radiogroup">
        {data.options.map((o) => (
          <button key={o.id} type="button" role="radio" aria-checked={picked === o.id} className={'option' + (picked === o.id ? ' on' : '')} onClick={() => choose(o)}>
            <b style={{ color: '#A78BFA', marginRight: 14 }}>{o.id}.</b>{o.code}
          </button>
        ))}
      </div>
      <span className="small">{data.hint}</span>
    </Frame>
  );
}
