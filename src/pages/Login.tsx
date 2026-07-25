import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Briefcase, Mail, Lock, User as UserIcon, Terminal } from 'lucide-react';
import { signInWithGoogle, loginWithEmail, registerWithEmail, devLogin } from '../services/auth';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });

  const handleDevLogin = async () => {
    try {
      setLoading(true);
      await devLogin();
      toast.success('Logged in as Dev User');
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Dev login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
      toast.success('Login successful');
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      if (isRegistering) {
        await registerWithEmail(formData.email, formData.password, formData.name);
        toast.success('Account created. An administrator will assign your role.');
      } else {
        await loginWithEmail(formData.email, formData.password);
        toast.success('Welcome back!');
      }
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3f4f6] p-4 font-sans selection:bg-[#2563eb]/20">
      <Card className="w-full max-w-md shadow-2xl border-[#e5e7eb] bg-white rounded-2xl overflow-hidden transition-all duration-300">
        <CardHeader className="space-y-2 text-center pb-8 pt-12">
          <div className="flex justify-center mb-6">
            <div className="p-5 bg-[#2563eb]/10 rounded-3xl rotate-3 hover:rotate-0 transition-transform duration-300">
              <Briefcase className="h-12 w-12 text-[#2563eb]" />
            </div>
          </div>
          <CardTitle className="text-3xl font-black tracking-tight text-[#111827]">
            {isRegistering ? 'Request Access' : 'DSBC Civil'}
          </CardTitle>
          <CardDescription className="text-[11px] font-bold text-[#6b7280] uppercase tracking-[0.2em]">
            {isRegistering ? 'Create an account — an admin will assign your role' : 'Enterprise Construction ERP Platform'}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-8 px-10 pb-12">
          {/* Sign-in flow: Google only. Email/password + Sign In button
              are shown only when the user toggles into the "Request
              Access" (registration) flow below, since creating a new
              account still needs email + password. */}
          {isRegistering && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-[#374151]">Full Name</Label>
                <div className="relative group">
                  <UserIcon className="absolute left-3 top-3 h-4 w-4 text-[#9ca3af] group-focus-within:text-[#2563eb] transition-colors" />
                  <Input
                    id="name"
                    placeholder="John Doe"
                    className="pl-10 h-11 bg-[#f9fafb] border-[#e5e7eb] focus:bg-white transition-all"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-[#374151]">Email Address</Label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-[#9ca3af] group-focus-within:text-[#2563eb] transition-colors" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className="pl-10 h-11 bg-[#f9fafb] border-[#e5e7eb] focus:bg-white transition-all"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-[#374151]">Password</Label>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-[#9ca3af] group-focus-within:text-[#2563eb] transition-colors" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10 h-11 bg-[#f9fafb] border-[#e5e7eb] focus:bg-white transition-all"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                    disabled={loading}
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full h-11 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold uppercase tracking-widest text-xs transition-all shadow-lg shadow-[#2563eb]/20 active:scale-[0.98]"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing</span>
                  </div>
                ) : 'Request Access'}
              </Button>
            </form>
          )}

          {isRegistering && (
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-[#e5e7eb]" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-[0.3em] font-black">
                <span className="bg-white px-4 text-[#9ca3af]">
                  Or
                </span>
              </div>
            </div>
          )}

          <Button
            variant="outline"
            onClick={handleGoogleLogin}
            className="w-full h-11 text-xs font-bold uppercase tracking-widest border-[#e5e7eb] hover:bg-[#f9fafb] transition-all shadow-sm group"
            disabled={loading}
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              className="mr-3 h-4 w-4 group-hover:scale-110 transition-transform"
              referrerPolicy="no-referrer"
            />
            Continue with Google
          </Button>

          {/* Dev login: only shown in development mode AND when VITE_ENABLE_DEV_LOGIN is set */}
          {import.meta.env.DEV && import.meta.env.VITE_ENABLE_DEV_LOGIN === 'true' && (
            <div className="space-y-4 pt-2">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-amber-100" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em] font-black">
                  <span className="bg-white px-4 text-amber-600">
                    Development Only
                  </span>
                </div>
              </div>
              <Button
                variant="secondary"
                onClick={handleDevLogin}
                className="w-full h-11 gap-2 bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-100 font-bold uppercase tracking-widest text-[10px]"
                disabled={loading}
              >
                <Terminal className="h-4 w-4" />
                Dev Login (Project Manager)
              </Button>
            </div>
          )}

          <div className="text-center space-y-4">
            <button
              type="button"
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-xs text-[#2563eb] hover:underline font-bold uppercase tracking-wider"
            >
              {isRegistering ? 'Already have an account? Sign In' : "Need an account? Request Access"}
            </button>
            <div className="pt-4 border-t border-[#f3f4f6]">
              <p className="text-[10px] text-[#9ca3af] leading-relaxed uppercase tracking-tighter font-medium">
                Authorized Personnel Only. <br />
                System access is monitored and logged.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
