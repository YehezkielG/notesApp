import React, { useState } from 'react';

export default function RequestMagicLink() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);

  async function submit(e) {
    e.preventDefault();
    setStatus('Sending...');
    const r = await fetch('/auth/magic-link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const j = await r.json();
    setStatus(j.ok ? 'Check your email for the magic link.' : j.error);
  }

  return (
    <form onSubmit={submit}>
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <button type="submit">Send magic link</button>
      {status && <div>{status}</div>}
    </form>
  );
}
