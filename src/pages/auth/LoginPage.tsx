/**
 * Login Page
 * Allows users to log in or quick-switch to demo personas
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../lib/store/authStore';
import { DEMO_CREDENTIALS } from '../../lib/mock/fixtures';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Label } from '../../../components/ui/Label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../../components/ui/Card';
import { toast } from '../../components/shared/Toast';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    const success = await login({ email, password });
    if (success) {
      toast.success('Welcome back!');
      navigate('/feed');
    } else {
      toast.error(error || 'Login failed');
    }
  };

  const handleDemoLogin = async (demoKey: keyof typeof DEMO_CREDENTIALS) => {
    const demo = DEMO_CREDENTIALS[demoKey];
    const success = await login({ email: demo.email, password: demo.password });
    if (success) {
      toast.success(`Logged in as ${demo.persona.name}`);
      navigate('/feed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-5xl">
        <div className="text-center mb-8">
          <h1 className="holographic-text text-5xl font-bold mb-2">CABANA</h1>
          <p className="text-gray-400">Luxury Nightlife & Creator Platform</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Login Form */}
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>Enter your credentials to access your account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>

                {error && (
                  <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                <Button type="submit" variant="primary" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>
              </form>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-gray-400">
                Don't have an account?{' '}
                <Link to="/signup" className="text-[var(--brand-gold)] hover:underline">
                  Sign up
                </Link>
              </p>
            </CardFooter>
          </Card>

          {/* Demo Personas */}
          <Card>
            <CardHeader>
              <CardTitle>Demo Mode</CardTitle>
              <CardDescription>Quick login as a demo persona for testing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleDemoLogin('SOPHIA')}
                disabled={isLoading}
              >
                <img
                  src={DEMO_CREDENTIALS.SOPHIA.persona.avatar}
                  alt="Sophia"
                  className="w-8 h-8 rounded-full mr-3"
                />
                <div className="text-left">
                  <div className="font-medium">Sophia (Creator)</div>
                  <div className="text-xs text-gray-400">2.5K subscribers, Icon tier</div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleDemoLogin('MARCUS')}
                disabled={isLoading}
              >
                <img
                  src={DEMO_CREDENTIALS.MARCUS.persona.avatar}
                  alt="Marcus"
                  className="w-8 h-8 rounded-full mr-3"
                />
                <div className="text-left">
                  <div className="font-medium">Marcus (Creator)</div>
                  <div className="text-xs text-gray-400">892 subscribers, Creator tier</div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleDemoLogin('EMMA')}
                disabled={isLoading}
              >
                <img
                  src={DEMO_CREDENTIALS.EMMA.persona.avatar}
                  alt="Emma"
                  className="w-8 h-8 rounded-full mr-3"
                />
                <div className="text-left">
                  <div className="font-medium">Emma (Fan)</div>
                  <div className="text-xs text-gray-400">Following 12 creators</div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleDemoLogin('ALEX')}
                disabled={isLoading}
              >
                <img
                  src={DEMO_CREDENTIALS.ALEX.persona.avatar}
                  alt="Alex"
                  className="w-8 h-8 rounded-full mr-3"
                />
                <div className="text-left">
                  <div className="font-medium">Alex (Admin)</div>
                  <div className="text-xs text-gray-400">Platform administrator</div>
                </div>
              </Button>
            </CardContent>
            <CardFooter>
              <p className="text-xs text-gray-500">
                All demo accounts use password: <code className="text-[var(--brand-gold)]">demo123</code>
              </p>
            </CardFooter>
          </Card>
        </div>

        {/* Back to Landing */}
        <div className="text-center mt-6">
          <Link to="/" className="text-gray-400 hover:text-white transition-colors">
            ← Back to landing page
          </Link>
        </div>
      </div>
    </div>
  );
};
