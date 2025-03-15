import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";

export default function AuthPage() {
    // ====== Login States ======
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [loginError, setLoginError] = useState("");

    // ====== Sign-Up States ======
    const [signupName, setSignupName] = useState("");
    const [signupEmail, setSignupEmail] = useState("");
    const [signupPassword, setSignupPassword] = useState("");
    const [signupError, setSignupError] = useState("");

    // Shared
    const router = useRouter();

    // ====== Handle Login ======
    async function handleLogin(e: FormEvent) {
        e.preventDefault();
        setLoginError("");

        const result = await signIn("credentials", {
            redirect: false,
            email: loginEmail,
            password: loginPassword,
        });

        if (result?.error) {
            setLoginError(result.error);
        } else {
            // If no error, redirect (e.g., to home)
            router.push("/");
        }
    }

    // ====== Handle SignUp ======
    async function handleSignUp(e: FormEvent) {
        e.preventDefault();
        setSignupError("");

        try {
            const response = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: signupName,
                    email: signupEmail,
                    password: signupPassword,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Échec de l'inscription");
            }

            // After successful signup, optionally redirect or auto-login
            router.push("/");
        } catch (error: any) {
            setSignupError(error.message || "Erreur lors de l'inscription");
        }
    }

  return (
    <>
      <Head>
        <title>{isLogin ? 'Connexion' : 'Créer un Compte'} | Diamant Rouge</title>
        <meta name="description" content="Accédez à votre compte Diamant Rouge" />
      </Head>

      <div className="min-h-screen flex bg-brandIvory">
        {/* Left side - Brand imagery */}
        <div className="hidden lg:flex lg:w-1/2 relative animate-fadeIn">
          <div className="absolute inset-0 bg-gold-gradient opacity-20"></div>
          <Image 
            src="/images/auth-luxury-image.jpg" 
            alt="Diamant Rouge Luxe" 
            layout="fill"
            objectFit="cover"
            className="image-luxury"
            priority
          />
          <div className="absolute inset-0 flex flex-col justify-center items-center p-12">
            <Image 
              src="/images/1/diamant-rouge-logo-full.svg" 
              alt="Diamant Rouge" 
              width={240} 
              height={120} 
              className="mb-8"
            />
            <h2 className="text-brandIvory text-5xl mb-6 font-serif text-center drop-shadow-lg">
              Un Luxe Exceptionnel <br />Vous Attend
            </h2>
            <p className="text-brandIvory text-xl text-center max-w-lg">
              Découvrez le summum du luxe et de la sophistication avec Diamant Rouge.
            </p>
          </div>
        </div>

        {/* Right side - Authentication form */}
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
                {isLogin ? 'Bienvenue' : 'Rejoignez Diamant Rouge'}
              </h1>
              <p className="text-platinumGray">
                {isLogin ? 'Connectez-vous pour accéder à votre compte' : 'Créez votre compte pour commencer votre expérience de luxe'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
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
                />
              </div>

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
                />
              </div>

              {isLogin && (
                <div className="flex items-center justify-end">
                  <Link href="/forgot-password" className="text-brandGold hover:text-burgundy transition-colors">
                    Mot de passe oublié ?
                  </Link>
                </div>
              )}

              <button type="submit" className="button-primary w-full">
                {isLogin ? 'Connexion' : 'Créer un Compte'}
              </button>

              <div className="border-t border-brandGold/30 pt-6 mt-6 text-center">
                <p className="mb-4 text-platinumGray">
                  {isLogin ? "Vous n'avez pas de compte ?" : "Vous avez déjà un compte ?"}
                </p>
                <button 
                  type="button" 
                  className="button-secondary w-full"
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin ? 'Créer un Compte' : 'Connexion'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}