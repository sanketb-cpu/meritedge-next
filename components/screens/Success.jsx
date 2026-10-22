'use client';
import { Frame, ActionButton } from '../ui/Frame';
import { Confetti } from '../ui/kit';

export default function Success({ data, act, busy, navigate, close, toast }) {
  return (
    <Frame onClose={() => close('dashboard', 'Closed. Back to your dashboard.')}>
      <Confetti />
      <p className="lead">{data.lead}</p>
      <h1 className="big">{data.title} <span className="accent">{data.accent}</span></h1>
      <div className="chips">{data.chips.map((c) => <span className="chip" key={c}>{c}</span>)}</div>
      <div className="row">
        <ActionButton id="back" busy={busy} onClick={() => act('back', 'Loading', 600, () => navigate(data.next))}>{data.cta}</ActionButton>
        <ActionButton id="team" ghost onClick={() => toast('Team invites open in the full product')}>{data.secondary}</ActionButton>
      </div>
    </Frame>
  );
}
