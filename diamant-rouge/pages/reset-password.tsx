import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function ResetPassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const router = useRouter();

    useEffect(() => {
        // Get token from URL query parameter when router is ready
        if (router.isReady) {
            const { token: urlToken } = router.query;
            if (urlToken && typeof urlToken === 'string') {
                setToken(urlToken);
            }
        }
    }, [router.isReady, router.query]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        
        // Basic validation
        if (!password || !confirmPassword) {
            setError('Veuillez remplir tous les champs.');
            return;
        }
        
        if (password !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas.');
            return;
        }
        
        if (password.length < 8) {
            setError('Le mot de passe doit contenir au moins 8 caractères.');
            return;
        }
        
        setLoading(true);
        
        try {
            // Call API to reset password with token
            const response = await fetch('/api/auth/update-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Une erreur est survenue');
            }
            
            setSuccess('Votre mot de passe a été réinitialisé avec succès. Vous allez être redirigé vers la page de connexion.');
            
            // Redirect to login page after 3 seconds
            setTimeout(() => {
                router.push('/auth');
            }, 3000);
            
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Une erreur est survenue lors de la réinitialisation du mot de passe');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Head>
                <title>Réinitialiser votre mot de passe | Diamant Rouge</title>
                <meta name="description" content="Réinitialiser votre mot de passe Diamant Rouge" />
            </Head>

            <div className="min-h-screen flex bg-brandIvory">
                <div className="w-full max-w-md mx-auto flex flex-col justify-center p-8">
                    <div className="text-center mb-8">
                        <Link href="/">
                            <Image 
                                src="/images/1/diamant-rouge-logo-full.svg" 
                                alt="Diamant Rouge" 
                                width={200} 
                                height={100} 
                                className="mx-auto mb-6"
                            />
                        </Link>
                        <h1 className="text-3xl font-serif mb-2">Réinitialiser votre mot de passe</h1>
                        <p className="text-platinumGray">Entrez votre nouveau mot de passe</p>
                    </div>
                    
                    {error && (
                        <div className="bg-red-50 border border-red-300 text-red-800 rounded-lg p-4 mb-6 text-sm">
                            {error}
                        </div>
                    )}
                    
                    {success && (
                        <div className="bg-green-50 border border-green-300 text-green-800 rounded-lg p-4 mb-6 text-sm">
                            {success}
                        </div>
                    )}
                    
                    {!token ? (
                        <div className="bg-amber-50 border border-amber-300 text-amber-800 rounded-lg p-4">
                            Lien de réinitialisation invalide. Veuillez demander une nouvelle réinitialisation de mot de passe.
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="password" className="block text-brandGold font-medium mb-2">
                                    Nouveau mot de passe
                                </label>
                                <input 
                                    id="password"
                                    type="password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="input-field w-full"
                                    placeholder="Entrez votre nouveau mot de passe" 
                                    required
                                    disabled={loading}
                                />
                            </div>
                            
                            <div>
                                <label htmlFor="confirmPassword" className="block text-brandGold font-medium mb-2">
                                    Confirmer le mot de passe
                                </label>
                                <input 
                                    id="confirmPassword"
                                    type="password" 
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="input-field w-full" 
                                    placeholder="Confirmez votre nouveau mot de passe"
                                    required
                                    disabled={loading}
                                />
                            </div>
                            
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
                                        Traitement en cours...
                                    </span>
                                ) : (
                                    "Réinitialiser le mot de passe"
                                )}
                            </button>
                            
                            <div className="text-center mt-4">
                                <Link href="/auth" className="text-brandGold hover:text-burgundy transition-colors">
                                    Retour à la page de connexion
                                </Link>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </>
    );
}