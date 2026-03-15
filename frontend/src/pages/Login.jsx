import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const { login, loading, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('admin@reelradar.local');
  const [password, setPassword] = useState('ReelRadar@123');
  const [error, setError] = useState('');

  if (isAuthenticated) {
    return <Navigate to="/favorites" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const result = await login(email.trim(), password);

    if (!result.ok) {
      setError(result.message);
    }
  };

  return (
    <section className="login-page">
      <div className="login-panel">
        <h1 className="login-title">Sign In</h1>
        <p className="login-subtitle">Access your personal My List and favorites.</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="login-label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            className="login-input"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label className="login-label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            className="login-input"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          {error && <p className="login-error">{error}</p>}

          <button className="login-submit" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </section>
  );
}

export default Login;
