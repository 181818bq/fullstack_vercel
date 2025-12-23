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
            Navigate('/'); // Redirect to home page on successful login
            // Redirect or show success message
        } catch (e: unknown) {
            if (e instanceof Error) {
                // Handle specific error messages if needed
                setError(e.message);
            } else {
                console.error('An unknown error occurred:', e);
            }
        }
    }

    return (
        <div>
            <h1>Login</h1>
            <div>
                <label>Username:</label>
                <input
                    placeholder='Username'
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Password:</label>
                <input
                    placeholder='Password'
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            {error && <p className="error">{error}</p>}
            <button onClick={logIn}>Login</button>
            <Link to="/create-account">Don't have an account? Create one here</Link>
        </div>
    );
}