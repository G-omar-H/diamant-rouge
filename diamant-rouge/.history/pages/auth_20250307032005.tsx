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
        <div className="min-h-screen relative bg-gradient-to-br from-richEbony to-richEbony/95 overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 opacity-5">
                <Image 
                    src="/images/luxury-pattern.jpg" 
                    alt="Motif de luxe" 
                    fill 
                    className="object-cover" 
                    priority
                />
            </div>
            
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-brandGold/30 via-brandGold to-brandGold/30" />

            {/* Logo section */}
            <div className="relative pt-12 pb-6 text-center">
                <Link href="/">
                    <div className="inline-block">
                        <Image 
                            src="/images/diamant-rouge-logo.png" 
                            alt="Diamant Rouge" 
                            width={180} 
                            height={60} 
                            className="mx-auto" 
                        />
                    </div>
                </Link>
            </div>

            <main className="relative max-w-6xl mx-auto px-6 py-12 z-10">
                <div className="text-center mb-12">
                    <h1 className="font-serif text-3xl md:text-4xl text-white leading-tight tracking-wide">
                        Espace Client Privilégié
                    </h1>
                    <p className="mt-3 text-brandGold/90 font-light tracking-wider max-w-xl mx-auto">
                        Découvrez une expérience personnalisée et accédez à nos services exclusifs
                    </p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8 md:gap-16">
                    {/* ====== LOGIN SECTION ====== */}
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-10 rounded-sm">
                        <h2 className="font-serif text-2xl text-brandGold mb-8 after:content-[''] after:block after:w-12 after:h-[1px] after:bg-brandGold/30 after:mt-3">
                            Connexion
                        </h2>

                        {loginError && (
                            <div className="mb-6 py-3 px-4 bg-burgundy/10 border-l-2 border-burgundy">
                                <p className="text-burgundy text-sm">{loginError}</p>
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div>
                                <label className="block mb-2 text-sm text-white/80 font-medium">
                                    Adresse Email
                                </label>
                                <input
                                    type="email"
                                    className="w-full px-4 py-3 bg-transparent border border-white/20 focus:border-brandGold/40 focus:ring-1 focus:ring-brandGold/30 outline-none transition-all rounded-sm text-white"
                                    placeholder="votre@email.com"
                                    value={loginEmail}
                                    onChange={(e) => setLoginEmail(e.target.value)}
                                />
                            </div>
                            
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-sm text-white/80 font-medium">
                                        Mot de Passe
                                    </label>
                                    <Link href="/forgot-password" className="text-xs text-brandGold hover:text-brandGold/80 transition-colors">
                                        Mot de passe oublié?
                                    </Link>
                                </div>
                                <input
                                    type="password"
                                    className="w-full px-4 py-3 bg-transparent border border-white/20 focus:border-brandGold/40 focus:ring-1 focus:ring-brandGold/30 outline-none transition-all rounded-sm text-white"
                                    placeholder="••••••••"
                                    value={loginPassword}
                                    onChange={(e) => setLoginPassword(e.target.value)}
                                />
                            </div>

                            <button 
                                type="submit" 
                                className="w-full py-3 px-5 bg-gradient-to-r from-brandGold/90 to-brandGold text-richEbony font-medium tracking-wide hover:from-brandGold hover:to-brandGold/90 transition-all duration-300"
                            >
                                Se Connecter
                            </button>
                        </form>
                    </div>

                    {/* ====== SIGNUP SECTION ====== */}
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-10 rounded-sm">
                        <h2 className="font-serif text-2xl text-brandGold mb-8 after:content-[''] after:block after:w-12 after:h-[1px] after:bg-brandGold/30 after:mt-3">
                            Créer un Compte
                        </h2>

                        {signupError && (
                            <div className="mb-6 py-3 px-4 bg-burgundy/10 border-l-2 border-burgundy">
                                <p className="text-burgundy text-sm">{signupError}</p>
                            </div>
                        )}

                        <form onSubmit={handleSignUp} className="space-y-6">
                            <div>
                                <label className="block mb-2 text-sm text-white/80 font-medium">
                                    Nom Complet
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 bg-transparent border border-white/20 focus:border-brandGold/40 focus:ring-1 focus:ring-brandGold/30 outline-none transition-all rounded-sm text-white"
                                    placeholder="Prénom Nom"
                                    value={signupName}
                                    onChange={(e) => setSignupName(e.target.value)}
                                />
                            </div>
                            
                            <div>
                                <label className="block mb-2 text-sm text-white/80 font-medium">
                                    Adresse Email
                                </label>
                                <input
                                    type="email"
                                    className="w-full px-4 py-3 bg-transparent border border-white/20 focus:border-brandGold/40 focus:ring-1 focus:ring-brandGold/30 outline-none transition-all rounded-sm text-white"
                                    placeholder="votre@email.com"
                                    value={signupEmail}
                                    onChange={(e) => setSignupEmail(e.target.value)}
                                />
                            </div>
                            
                            <div>
                                <label className="block mb-2 text-sm text-white/80 font-medium">
                                    Mot de Passe
                                </label>
                                <input
                                    type="password"
                                    className="w-full px-4 py-3 bg-transparent border border-white/20 focus:border-brandGold/40 focus:ring-1 focus:ring-brandGold/30 outline-none transition-all rounded-sm text-white"
                                    placeholder="••••••••"
                                    value={signupPassword}
                                    onChange={(e) => setSignupPassword(e.target.value)}
                                />
                                <p className="mt-2 text-xs text-white/60">
                                    Minimum 8 caractères pour une sécurité optimale
                                </p>
                            </div>

                            <button 
                                type="submit"
                                className="w-full py-3 px-5 bg-transparent border border-brandGold/80 text-brandGold font-medium tracking-wide hover:bg-brandGold/10 transition-all duration-300"
                            >
                                Créer Votre Compte
                            </button>
                        </form>

                        <div className="mt-6 pt-6 border-t border-white/10">
                            <p className="text-white/60 text-sm text-center">
                                En créant votre compte, vous acceptez notre{" "}
                                <Link href="/privacy" className="text-brandGold hover:text-brandGold/80 transition-colors">
                                    politique de confidentialité
                                </Link>{" "}
                                et nos{" "}
                                <Link href="/terms" className="text-brandGold hover:text-brandGold/80 transition-colors">
                                    conditions d'utilisation
                                </Link>.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Premium Service Highlight */}
                <div className="mt-16 text-center">
                    <p className="text-white/70 text-sm tracking-wider uppercase">
                        Service Client Privilégié
                    </p>
                    <p className="mt-2 text-white/90">
                        Besoin d'assistance? Notre service client est à votre disposition
                    </p>
                    <div className="mt-4">
                        <Link href="/contact" className="inline-flex items-center text-brandGold border-b border-brandGold/30 hover:border-brandGold transition-all pb-0.5">
                            Contacter Notre Équipe
                            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                            </svg>
                        </Link>
                    </div>
                </div>
            </main>
            
           
        </div>
    );
}