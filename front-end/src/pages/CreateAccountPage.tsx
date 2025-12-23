import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

export default function CreateAccountPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const Navigate = useNavigate();

    async function createAccount() {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      try {
          await createUserWithEmailAndPassword(getAuth(), username, password);
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
            <h1>Create Account</h1>
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
            <div>
                <label>Confirm Password:</label>
                <input
                    placeholder='Confirm password'
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
            </div>            
            {error && <p className="error">{error}</p>}
            <button onClick={createAccount}>Create Account</button>
            <Link to="/login">Already have an account? Login  here</Link>
        </div>
    );
}
