import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const Navigate = useNavigate();

    async function logIn() {
        try {
            await signInWithEmailAndPassword(getAuth(), username, password);
            Navigate('/');
        } catch (e: unknown) {
            if (e instanceof Error) {
                setError(e.message);
            } else {
                console.error('An unknown error occurred:', e);
            }
        }
    }

    return (
        <div className="login-page">
            <h1>Login</h1>
            <form onSubmit={(e) => { e.preventDefault(); logIn(); }} className="login-form">
                <div className="form-group">
                    <label htmlFor="username">Email:</label>
                    <input
                        id="username"
                        placeholder='Enter your email'
                        type="email"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        id="password"
                        placeholder='Enter your password'
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p className="error">{error}</p>}
                <button type="submit">Login</button>
                <p className="signup-link">
                    Don't have an account? <Link to="/create-account">Create one here</Link>
                </p>
            </form>
        </div>
    );
}