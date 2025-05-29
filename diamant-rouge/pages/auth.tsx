import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Authentication() {
  const [mode, setMode] = useState('login'); // 'login', 'signup', or 'forgotPassword'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Form validation states
  const [emailValid, setEmailValid] = useState<boolean | null>(null);
  const [passwordValid, setPasswordValid] = useState<boolean | null>(null);
  const [nameValid, setNameValid] = useState<boolean | null>(null);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();
  
  // Extract redirect parameters
  const { redirect, action, productId, returnUrl } = router.query;

  // Set appropriate title based on action context
  const getContextTitle = () => {
    if (action === 'favorite') return 'pour sauvegarder vos favoris';
    if (action === 'cart') return 'pour accéder à votre panier';
    if (action === 'checkout') return 'pour finaliser votre commande';
    return '';
  };
  
  const contextTitle = getContextTitle();

  const isLogin = mode === 'login';
  const isSignup = mode === 'signup';
  const isForgotPassword = mode === 'forgotPassword';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    
    // Validate all fields before submission
    if (isSignup) {
      setNameValid(validateName(name));
      setEmailValid(validateEmail(email));
      setPasswordValid(validatePassword(password));
      
      if (!validateName(name) || !validateEmail(email) || !validatePassword(password)) {
        setError('Veuillez corriger les erreurs de formulaire avant de soumettre.');
        return;
      }
    } else if (isLogin) {
      setEmailValid(validateEmail(email));
      
      if (!validateEmail(email)) {
        setError('Veuillez entrer une adresse email valide.');
        return;
      }
    } else if (isForgotPassword) {
      setEmailValid(validateEmail(email));
      
      if (!validateEmail(email)) {
        setError('Veuillez entrer une adresse email valide.');
        return;
      }
    }
    
    setLoading(true);

    try {
      if (isLogin) {
        // Handle login with NextAuth
        const result = await signIn('credentials', {
          redirect: false,
          email,
          password,
          callbackUrl: '/',
          // Pass remember me option to NextAuth
          rememberMe: rememberMe
        });

        if (result?.error) {
          setError('Identifiants incorrects. Veuillez réessayer.');
        } else {
          // Handle post-login redirection with appropriate action
          handlePostAuthAction();
        }
      } else if (isSignup) {
        // Handle signup with our API
        if (!name) {
          setError('Veuillez saisir votre nom');
          setLoading(false);
          return;
        }

        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, name })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Une erreur est survenue lors de la création de votre compte');
        }

        // Auto login after successful signup
        const loginResult = await signIn('credentials', {
          redirect: false,
          email,
          password
        });

        if (loginResult?.error) {
          setError('Compte créé avec succès. Veuillez vous connecter.');
          setMode('login');
        } else {
          // Handle post-signup redirection with appropriate action
          handlePostAuthAction();
        }
      } else if (isForgotPassword) {
        // Handle forgot password request (unchanged)
        if (!email) {
          setError('Veuillez saisir votre adresse email');
          setLoading(false);
          return;
        }

        const response = await fetch('/api/auth/reset-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Une erreur est survenue lors de la réinitialisation du mot de passe');
        }

        setSuccessMessage('Instructions de réinitialisation envoyées à votre adresse email.');
      }
    } catch (err: unknown) {
      console.error('Authentication error:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  // Function to handle post-authentication actions
  const handlePostAuthAction = async () => {
    // Perform action based on query parameters
    if (action === 'favorite' && productId) {
      // Add product to favorites
      try {
        await fetch('/api/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId })
        });
        
        // Redirect to product page or favorites page
        router.push(returnUrl?.toString() || `/product/${productId}?added=favorite`);
      } catch (err) {
        console.error('Error adding to favorites:', err);
        router.push(returnUrl?.toString() || '/');
      }
    } 
    else if (action === 'cart' && productId) {
      // We don't need to add to cart here anymore since cart works with localStorage
      // Just redirect to cart page
      router.push('/cart');
    }
    else if (action === 'cart' && !productId) {
      // Just view cart if no product ID
      router.push('/cart');
    } 
    else if (action === 'checkout') {
      // Go to checkout
      router.push('/checkout');
    }
    else {
      // Default redirect if no specific action
      router.push(returnUrl?.toString() || '/');
    }
  };

  // Email validation function
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password validation - at least 8 chars with one number
  const validatePassword = (password: string): boolean => {
    return password.length >= 8 && /\d/.test(password);
  };

  // Name validation - at least 3 chars
  const validateName = (name: string): boolean => {
    return name.length >= 3;
  };

  // Handle email input changes with validation
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    
    // Only validate if there's some input or if field was previously validated
    if (value.length > 0 || emailValid !== null) {
      setEmailValid(validateEmail(value));
    }
  };

  // Handle password input changes with validation
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    
    // Only validate if there's some input or if field was previously validated
    if (value.length > 0 || passwordValid !== null) {
      setPasswordValid(validatePassword(value));
    }
  };

  // Handle name input changes with validation
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    
    // Only validate if there's some input or if field was previously validated
    if (value.length > 0 || nameValid !== null) {
      setNameValid(validateName(value));
    }
  };

  const switchMode = (newMode: string) => {
    // Clear form fields when switching modes for better user experience
    if (newMode === 'signup' && mode === 'login') {
      // Keep email when switching from login to signup as a convenience
      setNameValid(null);
    } else if (newMode === 'login' && mode === 'signup') {
      // Keep email when switching from signup to login as a convenience
    } else if (newMode === 'forgotPassword') {
      // Keep email when switching to forgot password
      setPassword('');
      setPasswordValid(null);
    } else if (newMode === 'login' && mode === 'forgotPassword') {
      // Keep email when returning to login from forgot password
      setPasswordValid(null);
    }
    
    setMode(newMode);
    setError('');
    setSuccessMessage('');
  };

  return (
    <>
      <Head>
        <title>
          {isLogin ? 'Connexion' : isSignup ? 'Créer un Compte' : 'Mot de Passe Oublié'} | Diamant Rouge
        </title>
        <meta name="description" content="Accédez à votre compte Diamant Rouge" />
      </Head>

      <div className="min-h-screen flex bg-brandIvory">
        {/* Left side - Brand imagery */}
        <div className="hidden lg:flex lg:w-1/2 relative animate-fadeIn">
          <div className="absolute inset-0 bg-gold-gradient opacity-20"></div>
          <Image 
            src="/images/close-up-texture-cream.jpg" 
            alt="Diamant Rouge Luxe" 
            layout="fill"
            objectFit="cover"
            className="image-luxury"
            priority
          />
          <div className="absolute inset-0 flex flex-col justify-center items-center p-12">
            {/* Logo with ivory backdrop */}
            <div className="bg-brandIvory bg-opacity-90 p-6 rounded-xl mb-8">
              <Image 
                src="/images/1/diamant-rouge-logo-full.svg" 
                alt="Diamant Rouge" 
                width={240} 
                height={120} 
              />
            </div>
            
            {/* Context-aware messaging */}
            <h2 className="text-brandIvory text-5xl mb-6 font-serif text-center drop-shadow-lg">
              {action ? 'Un moment privilégié' : 'Un Luxe Exceptionnel'} <br />
              {action ? 'vous attend' : 'Vous Attend'}
            </h2>
            <p className="text-brandIvory text-xl text-center max-w-lg">
              {action ? 
                `Connectez-vous ${contextTitle} et profiter pleinement de l'univers Diamant Rouge.` : 
                'Découvrez le summum du luxe et de la sophistication avec Diamant Rouge.'}
            </p>
          </div>
        </div>

        {/* Right side - Authentication form with context-aware messaging */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16">
          <div className="w-full max-w-md animate-slideIn">
            <div className="text-center mb-10">
              <div className="block lg:hidden mb-8">
                <Image 
                  src="/images/1/diamant-rouge-logo-full.svg" 
                  alt="Diamant Rouge" 
                  width={180} 
                  height={90} 
                />
              </div>
              <h1 className="text-4xl font-serif mb-3">
                {isLogin ? 'Bienvenue' : isSignup ? 'Rejoignez Diamant Rouge' : 'Réinitialisation du Mot de Passe'}
              </h1>
              
              {/* Context-aware subtitle */}
              <p className="text-platinumGray">
                {action ? (
                  isLogin ? 
                    `Connectez-vous ${contextTitle}` : 
                    `Créez votre compte ${contextTitle}`
                ) : (
                  isLogin ? 'Connectez-vous pour accéder à votre compte' : 
                  isSignup ? 'Créez votre compte pour commencer votre expérience de luxe' :
                  'Entrez votre adresse email pour réinitialiser votre mot de passe'
                )}
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-300 text-red-800 rounded-lg p-4 mb-6 text-sm">
                {error}
              </div>
            )}

            {successMessage && (
              <div className="bg-green-50 border border-green-300 text-green-800 rounded-lg p-4 mb-6 text-sm">
                {successMessage}
              </div>
            )}

            {successMessage && (
              <div className="bg-green-50 border border-green-300 text-green-800 rounded-lg p-4 mb-6 text-sm">
                {successMessage}
              </div>
            )}

            <AnimatePresence mode="wait">
              <motion.form 
                key={mode}
                onSubmit={handleSubmit} 
                className="space-y-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}>
              {isSignup && (
                <div>
                  <label htmlFor="name" className="block text-brandGold font-medium mb-2">Nom Complet</label>
                  <div className="relative">
                    <motion.input 
                      type="text" 
                      id="name" 
                      value={name}
                      onChange={handleNameChange}
                      className={`input-field w-full ${nameValid === false ? 'border-red-400' : nameValid === true ? 'border-green-400' : ''}`} 
                      required 
                      placeholder="Entrez votre nom (3 caractères minimum)"
                      disabled={loading}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      onBlur={() => name && setNameValid(validateName(name))}
                    />
                    {nameValid === true && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"/>
                        </svg>
                      </span>
                    )}
                  </div>
                  {nameValid === false && name.length > 0 && (
                    <p className="text-red-500 text-xs mt-1">Le nom doit contenir au moins 3 caractères</p>
                  )}
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-brandGold font-medium mb-2">Adresse Email</label>
                <div className="relative">
                  <motion.input 
                    type="email" 
                    id="email" 
                    value={email}
                    onChange={handleEmailChange}
                    className={`input-field w-full ${emailValid === false ? 'border-red-400' : emailValid === true ? 'border-green-400' : ''}`} 
                    required 
                    placeholder="Entrez votre email"
                    disabled={loading}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    onBlur={() => email && setEmailValid(validateEmail(email))}
                  />
                  {emailValid === true && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"/>
                      </svg>
                    </span>
                  )}
                </div>
                {emailValid === false && email.length > 0 && (
                  <p className="text-red-500 text-xs mt-1">Veuillez entrer une adresse email valide</p>
                )}
              </div>

              {!isForgotPassword && (
                <div>
                  <label htmlFor="password" className="block text-brandGold font-medium mb-2">Mot de Passe</label>
                  <div className="relative">
                    <motion.input 
                      type="password" 
                      id="password" 
                      value={password}
                      onChange={handlePasswordChange}
                      className={`input-field w-full ${passwordValid === false ? 'border-red-400' : passwordValid === true ? 'border-green-400' : ''}`} 
                      required 
                      placeholder="Entrez votre mot de passe (8 caractères min.)"
                      disabled={loading}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      onBlur={() => password && setPasswordValid(validatePassword(password))}
                    />
                    {passwordValid === true && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"/>
                        </svg>
                      </span>
                    )}
                  </div>
                  {passwordValid === false && password.length > 0 && (
                    <p className="text-red-500 text-xs mt-1">Le mot de passe doit contenir au moins 8 caractères et un chiffre</p>
                  )}
                </div>
              )}

              {isLogin && !successMessage && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 text-brandGold focus:ring-brandGold border-brandGold/30 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-platinumGray cursor-pointer hover:text-brandGold transition-colors">
                      Se souvenir de moi
                    </label>
                  </div>
                  <button 
                    type="button"
                    onClick={() => switchMode('forgotPassword')}
                    className="text-brandGold hover:text-burgundy transition-colors"
                  >
                    Mot de passe oublié ?
                  </button>
                </div>
              )}

              <button 
                type="submit" 
                className={`button-primary w-full ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {isLogin ? 'Connexion en cours...' : 
                     isSignup ? 'Création en cours...' : 
                     'Traitement en cours...'}
                  </span>
                ) : (
                  isLogin ? 'Connexion' : 
                  isSignup ? 'Créer un Compte' : 
                  'Réinitialiser le mot de passe'
                )}
              </button>

              <div className="border-t border-brandGold/30 pt-6 mt-6 text-center">
                {isForgotPassword ? (
                  <button 
                    type="button" 
                    className="button-secondary w-full"
                    onClick={() => switchMode('login')}
                    disabled={loading}
                  >
                    Retour à la connexion
                  </button>
                ) : (
                  <>
                    <p className="mb-4 text-platinumGray">
                      {isLogin ? "Vous n'avez pas de compte ?" : "Vous avez déjà un compte ?"}
                    </p>
                    <button 
                      type="button" 
                      className="button-secondary w-full"
                      onClick={() => switchMode(isLogin ? 'signup' : 'login')}
                      disabled={loading}
                    >
                      {isLogin ? 'Créer un Compte' : 'Connexion'}
                    </button>
                  </>
                )}
              </div>
            </motion.form>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
}