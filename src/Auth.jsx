import React, { useState } from 'react';
import { supabase } from './supabaseClient';

export default function Auth() {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage('가입 요청이 완료되었습니다. 이메일 확인이 필요한 경우 메일함을 확인하세요.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (error) {
      setMessage(error?.message || '로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, background: '#fff' }}>
      <div style={{ width: '100%', maxWidth: 360 }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 30, marginBottom: 8, color: '#111' }}>데일리 플래너</h1>
        <p style={{ color: '#8C8C8C', fontSize: 13, marginBottom: 24 }}>PC와 휴대폰에서 같은 일정을 사용하세요.</p>
        <form onSubmit={submit}>
          <input value={email} onChange={e => setEmail(e.target.value)} type="email" required placeholder="이메일" style={{ width: '100%', boxSizing: 'border-box', padding: '12px 14px', border: '1px solid #DEDEDE', borderRadius: 12, marginBottom: 10 }} />
          <input value={password} onChange={e => setPassword(e.target.value)} type="password" required minLength={6} placeholder="비밀번호 (6자 이상)" style={{ width: '100%', boxSizing: 'border-box', padding: '12px 14px', border: '1px solid #DEDEDE', borderRadius: 12, marginBottom: 12 }} />
          <button disabled={loading} style={{ width: '100%', padding: 13, border: 0, borderRadius: 12, background: '#111', color: '#fff', fontWeight: 600 }}>
            {loading ? '처리 중…' : mode === 'login' ? '로그인' : '회원가입'}
          </button>
        </form>
        {message && <p style={{ color: '#D32F2F', fontSize: 12, lineHeight: 1.5, marginTop: 12 }}>{message}</p>}
        <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setMessage(''); }} style={{ marginTop: 18, background: 'none', border: 0, color: '#666', fontSize: 12 }}>
          {mode === 'login' ? '처음 사용하시나요? 회원가입' : '이미 계정이 있나요? 로그인'}
        </button>
      </div>
    </div>
  );
}
