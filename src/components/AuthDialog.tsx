import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Tabs, 
  Tab, 
  Box, 
  Typography, 
  CircularProgress, 
  Alert, 
  Divider
} from '@mui/material';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithPopup,
  sendEmailVerification,
  type UserCredential
} from 'firebase/auth';
import { auth, db, googleProvider } from '../firebase/firebase.config';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import GoogleIcon from '@mui/icons-material/Google';

interface AuthDialogProps {
  open: boolean;
  onClose: () => void;
  isLogin: boolean;
  darkMode: boolean;
}

const AuthDialog: React.FC<AuthDialogProps> = ({ open, onClose, darkMode }) => {
  const [tabValue, setTabValue] = useState<number>(0);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showResetDialog, setShowResetDialog] = useState<boolean>(false);
  const [resetEmail, setResetEmail] = useState<string>('');

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setError(null);
    setSuccess(null);
  };

  const handleLogin = async (): Promise<void> => {
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async (): Promise<void> => {
    try {
      setLoading(true);
      const result: UserCredential = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          createdAt: new Date()
        });
      }
      
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (): Promise<void> => {
    try {
      setLoading(true);
      const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      await sendEmailVerification(userCredential.user);
      
      await setDoc(doc(db, "users", userCredential.user.uid), {
        name: name,
        email: email,
        createdAt: new Date(),
        emailVerified: false
      });
      
      setSuccess('Account created successfully! Please check your email for verification.');
      setTabValue(0);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (): Promise<void> => {
    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, resetEmail);
      setSuccess('Password reset email sent! Check your inbox.');
      setShowResetDialog(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Line-style input component
  const LineInput = ({ 
    type = "text", 
    value, 
    onChange, 
    placeholder,
    disabled = false
  }: {
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
    disabled?: boolean;
  }) => (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={`
        w-full py-3 px-1 bg-transparent border-b 
        ${darkMode 
          ? 'border-white text-white placeholder-gray-300 focus:border-blue-400' 
          : 'border-gray-400 text-black placeholder-gray-500 focus:border-blue-600'
        }
        focus:outline-none transition-colors
      `}
    />
  );

  return (
    <>
      {/* Main Auth Dialog */}
      <Dialog 
        open={open} 
        onClose={onClose} 
        maxWidth="xs" 
        fullWidth
        PaperProps={{
          className: darkMode ? 'bg-[#121212]' : 'bg-white'
        }}
      >
        <DialogTitle className={darkMode ? 'text-white' : 'text-black'}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            variant="fullWidth"
            textColor={darkMode ? 'secondary' : 'primary'}
            indicatorColor={darkMode ? 'secondary' : 'primary'}
          >
            <Tab label="Login" className={darkMode ? 'text-white' : 'text-black'} />
            <Tab label="Sign Up" className={darkMode ? 'text-white' : 'text-black'} />
          </Tabs>
        </DialogTitle>
        
        <DialogContent>
          {error && (
            <Alert 
              severity="error" 
              sx={{ mb: 2 }}
              className={darkMode ? 'bg-red-900' : 'bg-red-100'}
            >
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert 
              severity="success" 
              sx={{ mb: 2 }}
              className={darkMode ? 'bg-green-900' : 'bg-green-100'}
            >
              {success}
            </Alert>
          )}

          {tabValue === 0 && (
            <Box sx={{ mt: 2 }} className="space-y-6">
              <LineInput
                type="email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                placeholder="Email"
                disabled={loading}
              />
              <LineInput
                type="password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                placeholder="Password"
                disabled={loading}
              />
              <Typography 
                variant="body2" 
                sx={{ mt: 1, textAlign: 'right', cursor: 'pointer' }}
                className={darkMode ? 'text-gray-300' : 'text-gray-600'}
                onClick={() => setShowResetDialog(true)}
              >
                Forgot password?
              </Typography>
            </Box>
          )}

          {tabValue === 1 && (
            <Box sx={{ mt: 2 }} className="space-y-6">
              <LineInput
                type="text"
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                placeholder="Full Name"
                disabled={loading}
              />
              <LineInput
                type="email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                placeholder="Email"
                disabled={loading}
              />
              <LineInput
                type="password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                placeholder="Password"
                disabled={loading}
              />
            </Box>
          )}

          <Divider sx={{ my: 3 }} className={darkMode ? 'bg-gray-700' : 'bg-gray-300'}>
            <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>OR</span>
          </Divider>

          <Button
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleSignIn}
            sx={{ mb: 2 }}
            disabled={loading}
            className={darkMode ? 
              'text-white border-white hover:bg-gray-800' : 
              'text-black border-gray-400 hover:bg-gray-100'
            }
          >
            Continue with Google
          </Button>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={onClose} 
            disabled={loading}
            className={darkMode ? 'text-white' : 'text-black'}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={tabValue === 0 ? handleLogin : handleSignup}
            disabled={loading}
            endIcon={loading && <CircularProgress size={20} />}
            className={darkMode ? 
              'bg-white text-black hover:bg-gray-200' : 
              'bg-black text-white hover:bg-gray-800'
            }
          >
            {tabValue === 0 ? 'Login' : 'Sign Up'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog 
        open={showResetDialog} 
        onClose={() => setShowResetDialog(false)} 
        maxWidth="xs" 
        fullWidth
        PaperProps={{
          className: darkMode ? 'bg-[#121212]' : 'bg-white'
        }}
      >
        <DialogTitle className={darkMode ? 'text-white' : 'text-black'}>
          Reset Password
        </DialogTitle>
        <DialogContent>
          <Typography 
            variant="body2" 
            gutterBottom 
            sx={{ mb: 2 }} 
            className={darkMode ? 'text-gray-300' : 'text-gray-600'}
          >
            Enter your email address and we'll send you a link to reset your password.
          </Typography>
          <LineInput
            type="email"
            value={resetEmail}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setResetEmail(e.target.value)}
            placeholder="Email"
            disabled={loading}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => setShowResetDialog(false)} 
            disabled={loading}
            className={darkMode ? 'text-white' : 'text-black'}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleResetPassword}
            disabled={loading}
            endIcon={loading && <CircularProgress size={20} />}
            className={darkMode ? 
              'bg-white text-black hover:bg-gray-200' : 
              'bg-black text-white hover:bg-gray-800'
            }
          >
            Send Reset Link
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AuthDialog;