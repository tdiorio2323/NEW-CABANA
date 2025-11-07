/**
 * Signup Page
 * New user registration with role selection
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../lib/store/authStore';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Label } from '../../../components/ui/Label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../../components/ui/Card';
import { toast } from '../../components/shared/Toast';
import type { UserRole } from '../../types';

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { signup, isLoading, error, clearError } = useAuthStore();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    displayName: '',
    role: 'fan' as UserRole,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    const success = await signup(formData);
    if (success) {
      toast.success('Account created successfully!');
      navigate('/feed');
    } else {
      toast.error(error || 'Signup failed');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="holographic-text text-5xl font-bold mb-2">CABANA</h1>
          <p className="text-gray-400">Join the exclusive community</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create Account</CardTitle>
            <CardDescription>Fill in the details to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Role Selection */}
              <div>
                <Label>Join as</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, role: 'fan' }))}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.role === 'fan'
                        ? 'border-[var(--brand-gold)] bg-[var(--brand-gold)]/10'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <div className="text-2xl mb-1">✨</div>
                    <div className="font-medium">Fan</div>
                    <div className="text-xs text-gray-400">Follow creators</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, role: 'creator' }))}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.role === 'creator'
                        ? 'border-[var(--brand-gold)] bg-[var(--brand-gold)]/10'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <div className="text-2xl mb-1">🎨</div>
                    <div className="font-medium">Creator</div>
                    <div className="text-xs text-gray-400">Share content</div>
                  </button>
                </div>
              </div>

              {/* Form Fields */}
              <div>
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="johndoe"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  This will be your unique @{formData.username || 'username'}
                </p>
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
                <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
              </div>

              {error && (
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <Button type="submit" variant="primary" className="w-full" disabled={isLoading}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-[var(--brand-gold)] hover:underline">
                Login
              </Link>
            </p>
          </CardFooter>
        </Card>

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
