import React, { useState } from 'react';
import styles from './Login.module.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await new Promise(r => setTimeout(r, 400));
      alert('登录成功 (模拟)');
    } catch (err: any) {
      setError(err.message || '登录失败');
    }
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.title}>登录</div>
      <form onSubmit={submit}>
        <label className={styles.field}>
          用户名
          <input className={styles.input} value={username} onChange={e => setUsername(e.target.value)} />
        </label>
        <label className={styles.field}>
          密码
          <input className={styles.input} type="password" value={password} onChange={e => setPassword(e.target.value)} />
        </label>
        {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
        <button className={styles.btn} type="submit">登录</button>
      </form>
    </div>
  );
}