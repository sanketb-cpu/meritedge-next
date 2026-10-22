'use client';

/** Common screen frame: optional step bar, watermark, back / close buttons */
export function Frame({ steps, step, onBack, onClose, className = '', children }) {
  return (
    <section className={'screen' + (typeof step === 'number' ? ' has-progress' : '') + (className ? ' ' + className : '')}>
      {typeof step === 'number' && (
        <>
          <nav className="stepbar" aria-label="Setup progress">
            {steps.map((s, i) => (
              <span key={s} style={{ display: 'contents' }}>
                <span className={i <= step ? 'on' : ''} aria-current={i === step ? 'step' : undefined}>{s}</span>
                {i < steps.length - 1 && <i className={i < step ? 'on' : ''}>›</i>}
              </span>
            ))}
            <span className="lang">English ⌄</span>
          </nav>
          <div className="progress"><div style={{ width: (step + 1) * 20 + '%' }} /></div>
        </>
      )}
      <div className="wm" aria-hidden="true" />
      {onBack && <button className="back" onClick={onBack} style={typeof step === 'number' ? { top: 96 } : undefined}>← Back</button>}
      {onClose && <button className="close" onClick={onClose} aria-label="Close">✕</button>}
      <div className="center">{children}</div>
    </section>
  );
}

export function ProgressNav({ steps, step }) {
  if (typeof step !== 'number') return null;
  return (
    <div className="progress-nav">
      <nav className="stepbar" aria-label="Setup progress">
        {steps.map((s, i) => (
          <span key={s} style={{ display: 'contents' }}>
            <span className={i <= step ? 'on' : ''} aria-current={i === step ? 'step' : undefined}>{s}</span>
            {i < steps.length - 1 && <i className={i < step ? 'on' : ''}>{'\u203a'}</i>}
          </span>
        ))}
        <span className="lang">English {'\u2304'}</span>
      </nav>
      <div className="progress"><div style={{ width: (step + 1) * 20 + '%' }} /></div>
    </div>
  );
}

/** Primary / ghost button that shows a spinner while its action runs */
export function ActionButton({ id, busy, onClick, children, ghost, wide, style, disabled }) {
  const isBusy = busy && busy.id === id;
  return (
    <button type="button" className={'btn' + (ghost ? ' ghost' : '') + (wide ? ' wide' : '') + (isBusy ? ' busy' : '')}
      onClick={onClick} disabled={disabled} style={style} aria-busy={isBusy || undefined}>
      {isBusy ? (<><span className="spin" aria-hidden="true" />{busy.label}…</>) : children}
    </button>
  );
}
