'use client';
import { Frame, ActionButton } from '../ui/Frame';

export default function Welcome({ flow, data, act, busy, navigate }) {
  return (
    <Frame>
      <img src={flow.brand.logo} alt={flow.brand.company} style={{ height: 52, width: 'auto' }} />
      <h1 className="big">{data.title}<br /><span className="accent">{data.accent}</span></h1>
      <p className="sub">{data.sub}</p>
      <ActionButton id="start" busy={busy} wide onClick={() => act('start', 'Loading', 600, () => navigate(data.next))}>{data.cta}</ActionButton>
    </Frame>
  );
}
