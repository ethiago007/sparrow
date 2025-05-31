import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, Button } from '@mui/material';
import { LineInput } from './lineInput';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebase.config';

interface SignupDialogProps {
  open: boolean;
  onClose: () => void;
  darkMode: boolean;
}

export const SignupDialog = ({ open, onClose, darkMode }: SignupDialogProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    try {
      setLoading(true);
      await createUserWithEmailAndPassword(auth, email, password);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} PaperProps={{
      className: `rounded-lg ${darkMode ? 'bg-[#090909] text-white' : 'bg-white text-[#090909]'}`
    }}>
      <DialogTitle className={`text-center ${darkMode ? 'text-white' : 'text-black'}`}>
        Create Account
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
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
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
            onClick={handleSignup}
            disabled={loading}
            className={`${darkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}`}
          >
            {loading ? 'Creating...' : 'Sign Up'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};