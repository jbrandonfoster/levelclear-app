'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function LandingPage() {
  const router = useRouter();
  const [isSignup, setIsSignup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Signup failed');
      }

      // Auto-login after signup
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.ok) {
        router.push('/dashboard/challenge');
      } else {
        setError('Login failed after signup');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.ok) {
        router.push('/dashboard/challenge');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16 max-w-2xl mx-auto w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 tracking-tight">
            The <span className="text-accent-gold">60+1</span> Day Challenge
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed mb-8">
            60 days to build the foundation. Then every single day after that…{' '}
            <span className="text-accent-gold">just one more.</span>
          </p>
        </div>

        {/* Brand Message */}
        <div className="bg-dark-card border border-dark-border rounded-lg p-8 mb-12 max-w-lg">
          <p className="text-gray-300 leading-relaxed">
            This is for the person who looks fine from the outside but knows
            something is off. You didn't hit rock bottom. You hit a ceiling.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-6 mb-12 w-full max-w-sm">
          <div className="bg-dark-card rounded-lg p-6 text-center border border-dark-border">
            <div className="text-3xl font-bold text-accent-gold mb-2">2,847</div>
            <p className="text-gray-400 text-sm">Active Members</p>
          </div>
          <div className="bg-dark-card rounded-lg p-6 text-center border border-dark-border">
            <div className="text-3xl font-bold text-accent-gold mb-2">100K+</div>
            <p className="text-gray-400 text-sm">Days Completed</p>
          </div>
        </div>

        {/* Auth Section */}
        <div className="w-full max-w-sm">
          <form
            onSubmit={isSignup ? handleSignup : handleLogin}
            className="space-y-4"
          >
            {isSignup && (
              <input
                type="text"
                name="name"
                placeholder="Username"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            )}

            <input
              type="email"
              name="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleInputChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />

            {isSignup && (
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
            )}

            {error && (
              <div className="bg-red-900/20 border border-red-700/50 text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full"
            >
              {isLoading
                ? 'Loading...'
                : isSignup
                  ? 'Start Your Journey'
                  : 'Continue'}
            </button>
          </form>

          <div className="text-center mt-6">
            <button
              onClick={() => {
                setIsSignup(!isSignup);
                setError('');
                setFormData({
                  name: '',
                  email: '',
                  password: '',
                  confirmPassword: '',
                });
              }}
              className="text-gray-400 hover:text-accent-gold transition-colors text-sm"
            >
              {isSignup
                ? 'Already have an account? Log in'
                : 'New here? Create an account'}
            </button>
          </div>
        </div>

        {/* Free Access Message */}
        <p className="text-gray-500 text-sm mt-8 text-center">
          Free access. No credit card required. No judgment.
        </p>
      </div>
    </div>
  );
}
