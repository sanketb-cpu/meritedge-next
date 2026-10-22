'use client';
import { useState } from 'react';
import { Frame, ActionButton } from '../ui/Frame';

export default function Checkout({ data, longAct, busy, navigate, close, toast }) {
  const [method, setMethod] = useState(data.defaultMethod);
  return (
    <Frame onClose={() => close('dashboard', 'Closed. Back to your dashboard.')}>
      <p className="lead">{data.lead}</p>
      <h1 className="big md">{data.title} <span className="accent">{data.accent}</span></h1>
      <div className="card" style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}><b style={{ fontSize: 18 }}>{data.price}</b><span style={{ fontSize: 14, color: '#B4B4C8' }}>{data.priceSub}</span></span>
        <button type="button" className="linkbtn" style={{ fontSize: 14, fontWeight: 700 }} onClick={() => toast('Plan options open in the full product')}>{data.changePlan}</button>
      </div>
      <div className="methods" role="radiogroup" aria-label="Payment method">
        {data.methods.map((m) => (
          <button key={m.id} type="button" role="radio" aria-checked={method === m.id} className={'method' + (method === m.id ? ' on' : '')} onClick={() => setMethod(m.id)}>
            <b>{m.name}</b><span>{m.sub}</span>
          </button>
        ))}
      </div>
      <ActionButton id="pay" busy={busy} onClick={() => longAct('pay', data.payTitle, data.paySteps, data.payMs, () => navigate(data.next))}>{data.cta}</ActionButton>
      <span className="small">{data.hint}</span>
    </Frame>
  );
}
