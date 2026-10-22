'use client';
import { useState } from 'react';
import { Frame, ActionButton } from '../ui/Frame';

export default function Invite({ data, act, busy, navigate, back, user, startSignup, setInvited, toast }) {
  const [name, setName] = useState(data.defaultName);
  const [contact, setContact] = useState(data.defaultContact);
  const send = () => {
    const cand = { name: name.trim() || 'your candidate', contact: contact.trim() };
    if (user) {
      act('send', 'Sending', 900, () => { setInvited(cand); navigate(data.next); toast('Invitation sent to ' + cand.name); });
    } else {
      act('send', 'One moment', 500, () => startSignup(cand));
    }
  };
  return (
    <Frame onClose={back}>
      <p className="lead">{data.lead}</p>
      <h1 className="big md">{data.title} <span className="accent">{data.accent}</span></h1>
      <div className="row" style={{ maxWidth: 760 }}>
        <input className="field" aria-label={data.nameLabel} value={name} onChange={(e) => setName(e.target.value)} />
        <input className="field" aria-label={data.contactLabel} value={contact} onChange={(e) => setContact(e.target.value)} />
      </div>
      <ActionButton id="send" busy={busy} onClick={send}>{data.cta}</ActionButton>
      <span className="small">{data.hint}</span>
    </Frame>
  );
}
