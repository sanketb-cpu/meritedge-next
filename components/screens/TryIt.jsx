'use client';
import { useState } from 'react';
import { Frame, ActionButton } from '../ui/Frame';
import { CountUp } from '../ui/kit';

export default function TryIt({ flow, data, act, busy, navigate, back, setAnswer, startSignup, user }) {
  const [picked, setPicked] = useState(null);
  const [scored, setScored] = useState(false);
  const result = flow.screens.result;
  const selected = data.options.find((o) => o.id === picked);
  const feedback = scored ? (selected?.correct ? result.right : result.wrong) : null;

  const choose = (o) => {
    if (picked) return;
    setPicked(o.id); setAnswer(o.correct);
    act('opt', 'Scoring', 700, () => setScored(true));
  };

  const openInvite = () => {
    act('invite', 'Loading', 600, () => {
      navigate(data.next);
      if (!user) {
        const invite = flow.screens.invite;
        startSignup({ name: invite.defaultName, contact: invite.defaultContact });
      }
    });
  };

  return (
    <Frame steps={flow.steps} step={data.step} onBack={back} className={'try-it-screen' + (scored ? ' scored' : '')}>
      <p className="lead">{data.lead}</p>
      <h1 className="big sm" style={{ maxWidth: 900, lineHeight: 1.1 }}>{data.question} <span className="accent">{data.accent}</span></h1>
      <div className={'try-it-answer-layout' + (scored ? ' scored' : '')}>
        <div className="options" role="radiogroup">
          {data.options.map((o) => (
            <button key={o.id} type="button" role="radio" aria-checked={picked === o.id} disabled={!!picked} className={'option' + (picked === o.id ? ' on' : '') + (scored && o.correct ? ' correct' : '') + (scored && picked === o.id && !o.correct ? ' wrong' : '')} onClick={() => choose(o)}>
              <b style={{ color: '#A78BFA', marginRight: 14 }}>{o.id}.</b>{o.code}
            </button>
          ))}
        </div>
        {feedback && (
          <div className={'answer-feedback ' + (selected.correct ? 'good' : 'needs-work')} role="status">
            <span className="answer-status">{selected.correct ? 'Correct' : 'Wrong'}</span>
            <p className="lead">{feedback.lead}</p>
            <h2 className="feedback-score"><CountUp value={feedback.score} /> <span>/ {result.outOf}</span></h2>
            <p className="sub">{feedback.why}</p>
            <p className="feedback-line">{result.line}</p>
            <ActionButton id="invite" busy={busy} wide onClick={openInvite}>{data.feedbackCta}</ActionButton>
          </div>
        )}
      </div>
      {!scored && <span className="small">{data.hint}</span>}
    </Frame>
  );
}
