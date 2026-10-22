'use client';
import { useState } from 'react';
import { Icon } from '../ui/kit';
import { fill, firstName } from '@/lib/format';

export default function Dashboard({ data, navigate, act, busy, user, invited, toast }) {
  const [banner, setBanner] = useState(!!invited);
  const nx = data.next;
  const name = user ? firstName(user.name) : data.defaultName;
  const isBusy = busy && busy.id === 'invite';
  const today = invited
    ? [{ time: 'Just now', text: `Invited ${invited.name} to "Junior Python Full-Stack Developer"`, status: 'Sent', color: '#34D399' }, ...data.today]
    : data.today;
  const pct = (data.dna.have / data.dna.need) * 100;
  const soon = () => toast('That opens in the full product');

  return (
    <div className="dash">
      <aside className="side">
        <div className="head"><span>{data.sidebarLabel}</span><em>{data.badge}</em></div>
        {data.nav.map((n) => (
          <button key={n.label} className={'nav' + (n.active ? ' on' : '')} onClick={n.active ? undefined : soon}>
            <Icon name={n.icon} color={n.active ? '#fff' : '#8E8EA6'} />{n.label}{n.tag && <span className="tag">{n.tag}</span>}
          </button>
        ))}
        <div className="trialbox">
          <div className="t">{data.trial.title}<span>{data.trial.days} days</span></div>
          <div className="seg">{Array.from({ length: data.trial.days }, (_, i) => <i key={i} className={i < data.trial.used ? 'on' : ''} />)}</div>
          <p>{data.trial.text}</p>
          <button onClick={soon}>{data.trial.cta}</button>
        </div>
        {data.footerLinks.map((l) => (
          <button key={l.label} className="nav" style={{ fontSize: 14 }} onClick={soon}><Icon name={l.icon} color="#8E8EA6" size={17} />{l.label}</button>
        ))}
      </aside>

      <main className="main">
        {banner && invited && (
          <div className="okban" role="status">
            <span className="m">✓</span>
            <div><b>{data.invitedBanner.title}</b><small>{fill(data.invitedBanner.text, { candidate: invited.name, contact: invited.contact })}</small></div>
            <button aria-label="Dismiss" onClick={() => setBanner(false)}>✕</button>
          </div>
        )}
        <div className="greet">
          <div><small>{data.greetingSmall}</small><h2>{fill(data.greeting, { name })} <span>{data.greetingAccent}</span></h2></div>
          <div className="tools"><span><Icon name="search" color="#8E8EA6" size={16} />Search</span><span><Icon name="bell" color="#C4B5FD" /></span></div>
        </div>

        <div className="nextcard">
          <div className="txt">
            <span className="eyebrow">{nx.eyebrow}</span>
            <h3>{nx.title}</h3>
            <p>{nx.sub}</p>
            <div className="steps">
              {nx.steps.map((s) => {
                const d = s.done || (invited && s.doneLabel);
                return <div key={s.label} className={'st' + (d ? ' done' : '')}><i>{d ? '✓' : ''}</i>{d && s.doneLabel ? s.doneLabel : s.label}</div>;
              })}
            </div>
          </div>
          <button className="whitebtn" onClick={() => act('invite', 'Loading', 700, () => navigate(nx.target))}>
            {isBusy ? <><span className="spin" style={{ borderColor: 'rgba(42,26,94,.3)', borderTopColor: '#2A1A5E' }} />Loading…</> : <><Icon name="send" color="#7C3AED" />{nx.cta}</>}
          </button>
        </div>

        <div className="kpis">
          {data.stats.map((s) => (
            <div key={s.label} className="kpi"><span className="ic" style={{ background: s.color }}><Icon name={s.icon} color="#fff" size={20} /></span><div><b>{s.value}</b><span>{s.label}</span></div></div>
          ))}
        </div>

        <div className="lower">
          <div className="today">
            <span className="lbl">{data.todayLabel}</span>
            {today.map((t) => (
              <div key={t.time + t.text} className="trow">
                <span className="dot" style={{ background: t.color }} />
                <span className="time">{t.time}</span>
                <span style={{ fontSize: 16 }}>{t.text}</span>
                <span className="status" style={{ color: t.color, borderColor: t.status === 'Done' ? '#2A2A3A' : '#1F6F55' }}>{t.status}</span>
              </div>
            ))}
          </div>
          <div className="dna">
            <div className="ring" style={{ background: `conic-gradient(#8B5CF6 0 ${pct}%, #2A2A3A ${pct}% 100%)` }}>
              <div><b>{data.dna.have}/{data.dna.need}</b><small>candidates</small></div>
            </div>
            <div><h4>{data.dna.title}</h4><p>{data.dna.text}</p><em>{data.dna.unlock}</em></div>
          </div>
        </div>
      </main>
    </div>
  );
}
