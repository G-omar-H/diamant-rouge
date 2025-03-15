import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

export default function Authentication() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle authentication logic here
  };

  return (
    <>
      <Head>
        <title>{isLogin ? 'Sign In' : 'Create Account'} | Diamant Rouge</title>
        <meta name="description" content="Access your Diamant Rouge luxury account" />
      </Head>

      <div className="min-h-screen flex bg-brandIvory">
        {/* Left side - Brand imagery */}
        <div className="hidden lg:flex lg:w-1/2 relative animate-fadeIn">
          <div className="absolute inset-0 bg-gold-gradient opacity-20"></div>
          <Image 
            src="/images/auth-luxury-image.jpg" 
            alt="Diamant Rouge Luxury" 
            layout="fill"
            objectFit="cover"
            className="image-luxury"
            priority
          />
          <div className="absolute inset-0 flex flex-col justify-center items-center p-12">
            <Image 
              src="/images/1/diamant-rouge-logo-full.png" 
              alt="Diamant Rouge" 
              width={240} 
              height={120} 
              className="mb-8"
            />
            <h2 className="text-brandIvory text-5xl mb-6 font-serif text-center drop-shadow-lg">
              Exceptional Luxury <br />Awaits You
            </h2>
            <p className="text-brandIvory text-xl text-center max-w-lg">
              Experience the epitome of luxury and sophistication with Diamant Rouge.
            </p>
          </div>
        </div>

        {/* Right side - Authentication form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16">
          <div className="w-full max-w-md animate-slideIn">
            <div className="text-center mb-10">
              <div className="block lg:hidden mb-8">
                <Image 
                  src="/images/logo.png" 
                  alt="Diamant Rouge" 
                  width={180} 
                  height={90} 
                />
              </div>
              <h1 className="text-4xl font-serif mb-3">
                {isLogin ? 'Welcome Back' : 'Join Diamant Rouge'}
              </h1>
              <p className="text-platinumGray">
                {isLogin ? 'Sign in to access your account' : 'Create your account to begin your luxury experience'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div>
                  <label htmlFor="name" className="block text-brandGold font-medium mb-2">Full Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field w-full" 
                    required 
                    placeholder="Enter your name"
                  />
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-brandGold font-medium mb-2">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field w-full" 
                  required 
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-brandGold font-medium mb-2">Password</label>
                <input 
                  type="password" 
                  id="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field w-full" 
                  required 
                  placeholder="Enter your password"
                />
              </div>

              {isLogin && (
                <div className="flex items-center justify-end">
                  <Link href="/forgot-password" className="text-brandGold hover:text-burgundy transition-colors">
                    Forgot password?
                  </Link>
                </div>
              )}

              <button type="submit" className="button-primary w-full">
                {isLogin ? 'Sign In' : 'Create Account'}
              </button>

              <div className="border-t border-brandGold/30 pt-6 mt-6 text-center">
                <p className="mb-4 text-platinumGray">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                </p>
                <button 
                  type="button" 
                  className="button-secondary w-full"
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin ? 'Create Account' : 'Sign In'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}