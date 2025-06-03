import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, Button } from '@mui/material';
import { LineInput } from './lineInput';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebase.config';

interface LoginDialogProps {
  open: boolean;
  onClose: () => void;
  darkMode: boolean;
}

export const LoginDialog = ({ open, onClose, darkMode }: LoginDialogProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} PaperProps={{
      className: `rounded-lg ${darkMode ? 'bg-[#090909] text-white' : 'bg-white text-[#090909]'}`
    }}>
      <DialogTitle className={`text-center ${darkMode ? 'text-white' : 'text-black'}`}>
        Welcome Back
      </DialogTitle>
      <DialogContent className="space-y-6">
        {error && (
          <div className={`p-2 rounded ${darkMode ? 'bg-red-900' : 'bg-red-100'} text-center`}>
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <LineInput
              darkMode={darkMode}
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <LineInput
              darkMode={darkMode}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button 
            onClick={onClose}
            className={`${darkMode ? 'text-white' : 'text-black'}`}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleLogin}
            disabled={loading}
            className={`${darkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}`}
          >
            {loading ? 'Signing In...' : 'Login'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};