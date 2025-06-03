import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Button, 
  TextField, 
  Alert, 
  CircularProgress
} from '@mui/material';
import { 
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
  type User
} from 'firebase/auth';
import { auth } from '../firebase/firebase.config';

interface ChangePasswordDialogProps {
  open: boolean;
  onClose: () => void;
}

const ChangePasswordDialog: React.FC<ChangePasswordDialogProps> = ({ open, onClose }) => {
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChangePassword = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      const user: User | null = auth.currentUser;
      
      if (!user || !user.email) {
        throw new Error('No authenticated user found');
      }

      const credential = EmailAuthProvider.credential(
        user.email, 
        currentPassword
      );
      
      // Reauthenticate user
      await reauthenticateWithCredential(user, credential);
      
      // Update password
      await updatePassword(user, newPassword);
      
      setSuccess('Password changed successfully!');
      setTimeout(onClose, 2000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Change Password</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}
        
        <TextField
          fullWidth
          label="Current Password"
          type="password"
          value={currentPassword}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
            setCurrentPassword(e.target.value)
          }
          sx={{ mb: 2, mt: 1 }}
          disabled={loading}
        />
        <TextField
          fullWidth
          label="New Password"
          type="password"
          value={newPassword}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
            setNewPassword(e.target.value)
          }
          disabled={loading}
        />
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button 
          onClick={onClose} 
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleChangePassword}
          disabled={loading}
          endIcon={loading && <CircularProgress size={20} />}
        >
          Change Password
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChangePasswordDialog;