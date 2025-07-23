import React, { useState } from 'react';
import axios from 'axios';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
export default function ForgotPasswordModal({ open, onClose }) {
    const [step, setStep] = useState('email');
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const handleForgot = async () => {
        var _a, _b;
        setLoading(true);
        setError('');
        try {
            await axios.post('/api/auth/forgot-password', { email });
            setStep('reset');
        }
        catch (err) {
            setError(((_b = (_a = err.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || 'Failed to send code.');
        }
        finally {
            setLoading(false);
        }
    };
    const handleReset = async () => {
        var _a, _b;
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            await axios.post('/api/auth/reset-password', { email, code, newPassword });
            setSuccess('Password reset successful!');
            setTimeout(() => {
                onClose();
                setStep('email');
                setEmail('');
                setCode('');
                setNewPassword('');
                setConfirmPassword('');
                setSuccess('');
            }, 1500);
        }
        catch (err) {
            setError(((_b = (_a = err.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || 'Failed to reset password.');
        }
        finally {
            setLoading(false);
        }
    };
    return (<Dialog open={open} onOpenChange={onClose}>
      <div className="p-6 w-full max-w-md mx-auto bg-background rounded-lg shadow-lg">
        {step === 'email' && (<>
            <h2 className="text-xl font-bold mb-4">Forgot Password</h2>
            <Input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} className="mb-4"/>
            {error && <div className="text-red-500 mb-2">{error}</div>}
            <Button onClick={handleForgot} loading={loading} className="w-full">Send Code</Button>
          </>)}
        {step === 'reset' && (<>
            <h2 className="text-xl font-bold mb-4">Reset Password</h2>
            <Input type="text" placeholder="Verification Code" value={code} onChange={e => setCode(e.target.value)} className="mb-2"/>
            <Input type="password" placeholder="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="mb-2"/>
            <Input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="mb-2"/>
            {error && <div className="text-red-500 mb-2">{error}</div>}
            {success && <div className="text-green-500 mb-2">{success}</div>}
            <Button onClick={handleReset} loading={loading} className="w-full">Reset Password</Button>
          </>)}
      </div>
    </Dialog>);
}
