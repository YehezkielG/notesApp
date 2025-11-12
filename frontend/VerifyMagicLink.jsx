import React, { useEffect, useState } from 'react';

export default function VerifyMagicLink() {
  const [result, setResult] = useState('Verifying...');
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (!token) {
      setResult('Missing token');
      return;
    }
    fetch(`/auth/verify?token=${encodeURIComponent(token)}`)
      .then(r => r.json())
      .then(j => setResult(j.ok ? `Logged in as ${j.email}` : j.error))
      .catch(() => setResult('Network error'));
  }, []);

  return <div>{result}</div>;
}
