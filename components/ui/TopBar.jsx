'use client';
import { initials } from '@/lib/format';

export default function TopBar({ brand, user, onLogo, onLogout }) {
  return (
    <header className="chrome">
      <button onClick={onLogo} style={{ background: 'none', border: 0, padding: 0 }} aria-label="Back to start">
        <img className="logo" src={brand.logo} alt={brand.company} />
      </button>
      <span className="spacer" />
      {user && (
        <div className="user">
          <span className="av">{initials(user.name)}</span>
          <span className="who"><b>{user.name}</b><small>{user.email}</small></span>
          <button type="button" className="btn ghost" style={{ minHeight: 38, padding: '0 14px', fontSize: 14 }} onClick={onLogout}>Log out</button>
        </div>
      )}
    </header>
  );
}
