import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import React from 'react';

export default function Authentication() {
  const [mode, setMode] = useState('login'); // 'login', 'signup', or 'forgotPassword'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
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
    setLoading(true);

    try {
      if (isLogin) {
        // Handle login with NextAuth
        const result = await signIn('credentials', {
          redirect: false,
          email,
          password
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

  const switchMode = (newMode: string) => {
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

            <form onSubmit={handleSubmit} className="space-y-6">
              {isSignup && (
                <div>
                  <label htmlFor="name" className="block text-brandGold font-medium mb-2">Nom Complet</label>
                  <input 
                    type="text" 
                    id="name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field w-full" 
                    required 
                    placeholder="Entrez votre nom"
                    disabled={loading}
                  />
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-brandGold font-medium mb-2">Adresse Email</label>
                <input 
                  type="email" 
                  id="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field w-full" 
                  required 
                  placeholder="Entrez votre email"
                  disabled={loading}
                />
              </div>

              {!isForgotPassword && (
                <div>
                  <label htmlFor="password" className="block text-brandGold font-medium mb-2">Mot de Passe</label>
                  <input 
                    type="password" 
                    id="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field w-full" 
                    required 
                    placeholder="Entrez votre mot de passe"
                    disabled={loading}
                  />
                </div>
              )}

              {isLogin && !successMessage && (
                <div className="flex items-center justify-end">
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
            </form>
          </div>
        </div>
      </div>
    </>
  );
}