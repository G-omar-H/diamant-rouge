// pages/auth.tsx
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

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
                throw new Error(data.error || "Failed to sign up");
            }

            // After successful signup, optionally redirect or auto-login
            router.push("/");
        } catch (error: any) {
            setSignupError(error.message || "Error signing up");
        }
    }

    return (
        <main className="section-light min-h-screen flex items-center justify-center px-6 py-12">
            {/* Outer Container with more open spacing */}
            <div className="w-full max-w-6xl flex flex-col md:flex-row md:space-x-16 space-y-12 md:space-y-0">

                {/* ====== LOGIN SECTION ====== */}
                <div className="flex-1 flex flex-col">
                    <h2 className="text-3xl font-serif text-brandGold mb-6">Sign In</h2>

                    {loginError && (
                        <p className="mb-4 text-burgundy font-semibold">{loginError}</p>
                    )}

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="block mb-1 font-medium text-richEbony">Email</label>
                            <input
                                type="email"
                                className="input-field w-full"
                                placeholder="name@domain.com"
                                value={loginEmail}
                                onChange={(e) => setLoginEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium text-richEbony">Password</label>
                            <input
                                type="password"
                                className="input-field w-full"
                                placeholder="********"
                                value={loginPassword}
                                onChange={(e) => setLoginPassword(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="button-primary w-full font-medium mt-3">
                            Sign In
                        </button>
                    </form>
                </div>

                {/* ====== SIGNUP SECTION ====== */}
                {/* A simple vertical line to separate, if you want even more openness remove the line entirely */}
                <div className="hidden md:block w-[1px] bg-platinumGray/40 mx-6" />

                <div className="flex-1 flex flex-col">
                    <h2 className="text-3xl font-serif text-brandGold mb-6">Create an Account</h2>

                    {signupError && (
                        <p className="mb-4 text-burgundy font-semibold">{signupError}</p>
                    )}

                    <form onSubmit={handleSignUp} className="space-y-5">
                        <div>
                            <label className="block mb-1 font-medium text-richEbony">Full Name</label>
                            <input
                                type="text"
                                className="input-field w-full"
                                value={signupName}
                                onChange={(e) => setSignupName(e.target.value)}
                                placeholder="Your Name"
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium text-richEbony">Email</label>
                            <input
                                type="email"
                                className="input-field w-full"
                                value={signupEmail}
                                onChange={(e) => setSignupEmail(e.target.value)}
                                placeholder="name@domain.com"
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium text-richEbony">Password</label>
                            <input
                                type="password"
                                className="input-field w-full"
                                value={signupPassword}
                                onChange={(e) => setSignupPassword(e.target.value)}
                                placeholder="********"
                            />
                        </div>
                        <button type="submit" className="button-secondary w-full font-medium mt-3">
                            Sign Up
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}
