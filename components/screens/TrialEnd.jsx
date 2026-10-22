'use client';
import { Frame, ActionButton } from '../ui/Frame';
import { CountUp } from '../ui/kit';

export default function TrialEnd({ data, act, busy, navigate, close, toast }) {
  return (
    <Frame onClose={() => close('dashboard', data.closeToast)}>
      <p className="lead">{data.lead}</p>
      <h1 className="big"><CountUp value={data.number} /> <span className="accent">{data.accent}</span></h1>
      <p className="sub">{data.sub}</p>
      <div className="chips">{data.chips.map((c) => <span className="chip" key={c}>{c}</span>)}</div>
      <div className="row">
        <ActionButton id="keep" busy={busy} onClick={() => act('keep', 'Loading', 600, () => navigate(data.next))}>{data.cta}</ActionButton>
        <ActionButton id="plans" ghost onClick={() => toast('Plan comparison opens in the full product')}>{data.secondary}</ActionButton>
      </div>
    </Frame>
  );
}
