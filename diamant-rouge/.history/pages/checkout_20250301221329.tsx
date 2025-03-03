// pages/checkout.tsx (Example name)

import { useCart } from "../contexts/CartContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { prisma } from "../lib/prisma";
import { jwtVerify } from "jose";

type CheckoutProps = {
    userId: number | null;
    userAddress?: string;
    userCity?: string;
    userPostalCode?: string;
    userCountry?: string;
};

export default function CheckoutPage({
                                         userId,
                                         userAddress,
                                         userCity,
                                         userPostalCode,
                                         userCountry,
                                     }: CheckoutProps) {
    const { cart, clearCart } = useCart();
    const [checkoutComplete, setCheckoutComplete] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // Payment method state
    const [paymentMethod, setPaymentMethod] = useState<"CMI" | "COD" | "">("");

    // ─────────────────────────────────────────────────
    // 1) Shipping Option => "STORE", "PROFILE", or "NEW"
    // ─────────────────────────────────────────────────
    const [shippingOption, setShippingOption] = useState<"STORE" | "PROFILE" | "NEW" | "">("");

    // We'll store the final shipping address data here
    const [shippingAddress, setShippingAddress] = useState("");
    const [city, setCity] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [country, setCountry] = useState("");

    // The store’s address for in-store pickup
    const storeAddress = "Diamant Rouge Boutique, 123 Rue de la Joaillerie, Casablanca";

    // Calculate cart total
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // ─────────────────────────────────────────────────
    // 2) Whenever user chooses "PROFILE", fill in from user data
    //    If user chooses "STORE", we set address to store's address
    //    If "NEW", we let them fill it out manually (fields remain blank)
    // ─────────────────────────────────────────────────
    useEffect(() => {
        if (shippingOption === "STORE") {
            setShippingAddress(storeAddress);
            setCity("Casablanca");
            setPostalCode("20000");
            setCountry("Maroc");
        } else if (shippingOption === "PROFILE") {
            // Use user’s DB address if available
            setShippingAddress(userAddress || "");
            setCity(userCity || "");
            setPostalCode(userPostalCode || "");
            setCountry(userCountry || "");
        } else if (shippingOption === "NEW") {
            setShippingAddress("");
            setCity("");
            setPostalCode("");
            setCountry("");
        }
    }, [shippingOption]);

    // ─────────────────────────────────────────────────
    // 3) Handle Checkout
    // ─────────────────────────────────────────────────
    async function handleCheckout() {
        setLoading(true);
        setError("");

        // Basic validations
        if (!paymentMethod) {
            setError("⚠ Veuillez sélectionner un mode de paiement.");
            setLoading(false);
            return;
        }
        if (!shippingOption) {
            setError("⚠ Veuillez sélectionner une option de livraison.");
            setLoading(false);
            return;
        }

        // If shipping is "STORE", we already set the store’s address in state.
        // If shipping is "PROFILE", we used the user’s address from DB.
        // If shipping is "NEW", the user must fill out all fields:
        if (shippingOption === "NEW") {
            if (!shippingAddress || !city || !postalCode || !country) {
                setError("⚠ Veuillez remplir tous les champs pour la livraison.");
                setLoading(false);
                return;
            }
        }

        try {
            if (paymentMethod === "CMI") {
                // Simulate or call your /api/payment/cmi route
                const res = await fetch("/api/payment/cmi", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        orderId: Date.now().toString(),
                        amount: total,
                        customerEmail: "customer@example.com", // Replace with actual email from user
                    }),
                });

                const data = await res.json();
                if (data.redirectUrl) {
                    window.location.href = data.redirectUrl;
                } else {
                    setError("⚠ Erreur lors du paiement. Veuillez réessayer.");
                }
            } else {
                // Place order for COD or any other payment method
                const res = await fetch("/api/order/place-order", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        cart,
                        paymentMethod,
                        shippingAddress,
                        city,
                        postalCode,
                        country,
                    }),
                });

                const data = await res.json();
                if (!res.ok) {
                    setError(data.error || "⚠ Échec de la commande.");
                    return;
                }
                clearCart();
                setCheckoutComplete(true);
            }
        } catch (err) {
            console.error(err);
            setError("⚠ Une erreur est survenue lors du traitement de votre commande.");
        } finally {
            setLoading(false);
        }
    }

    // ─────────────────────────────────────────────────
    // 4) Render States
    // ─────────────────────────────────────────────────
    if (checkoutComplete) {
        return (
            <main className="section-light p-8 text-center min-h-screen">
                <h1 className="text-4xl font-serif text-brandGold mb-4">Merci!</h1>
                <p className="text-platinumGray">Votre commande a bien été passée.</p>
                <button
                    className="mt-4 bg-burgundy hover:bg-brandGold text-brandIvory px-6 py-3 rounded-full transition duration-300"
                    onClick={() => router.push("/profile")}
                >
                    Voir Mes Commandes
                </button>
            </main>
        );
    }

    if (cart.length === 0) {
        return (
            <main className="section-light p-8 text-center min-h-screen">
                <h1 className="text-4xl font-serif text-brandGold mb-4">Checkout</h1>
                <p className="text-platinumGray">Votre panier est vide.</p>
                <button
                    className="mt-4 bg-brandGold text-richEbony px-6 py-3 rounded-full hover:bg-burgundy hover:text-brandIvory transition duration-300"
                    onClick={() => router.push("/")}
                >
                    Continuer vos Achats
                </button>
            </main>
        );
    }

    return (
        <main className="section-light p-8 max-w-2xl mx-auto min-h-screen">
            <h1 className="text-4xl font-serif text-brandGold mb-6">Checkout</h1>
            <div className="mb-4">
                <p className="text-2xl font-bold text-brandGold">
                    Total: {total.toFixed(2)} MAD
                </p>
            </div>

            {/* ─────────────────────────────────────────────────
          Shipping Options (STORE, PROFILE, NEW)
      ───────────────────────────────────────────────── */}
            <div className="mb-8">
                <label className="block text-lg font-semibold text-richEbony mb-2">
                    Mode de Livraison
                </label>
                <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2">
                        <input
                            type="radio"
                            name="shippingOption"
                            value="STORE"
                            checked={shippingOption === "STORE"}
                            onChange={() => setShippingOption("STORE")}
                        />
                        <span>Retrait en Boutique (Casablanca)</span>
                    </label>

                    {userId ? (
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="shippingOption"
                                value="PROFILE"
                                checked={shippingOption === "PROFILE"}
                                onChange={() => setShippingOption("PROFILE")}
                            />
                            <span>
                Utiliser Mon Adresse de Profil
                                {userAddress ? (
                                    <em className="text-sm text-platinumGray ml-2">
                                        ({userAddress}, {userCity}, {userPostalCode}, {userCountry})
                                    </em>
                                ) : (
                                    <em className="text-sm text-burgundy ml-2">
                                        (Aucune adresse enregistrée)
                                    </em>
                                )}
              </span>
                        </label>
                    ) : null}

                    <label className="flex items-center gap-2">
                        <input
                            type="radio"
                            name="shippingOption"
                            value="NEW"
                            checked={shippingOption === "NEW"}
                            onChange={() => setShippingOption("NEW")}
                        />
                        <span>Entrer une Nouvelle Adresse</span>
                    </label>
                </div>
            </div>

            {/* Only show address fields if shippingOption === "NEW" */}
            {shippingOption === "NEW" && (
                <div>
                    <div className="mb-4 space-y-2">
                        <label className="block text-lg font-semibold text-richEbony">
                            Adresse
                        </label>
                        <input
                            className="w-full p-3 text-richEbony rounded-lg border border-brandGold focus:ring focus:ring-brandGold transition"
                            value={shippingAddress}
                            onChange={(e) => setShippingAddress(e.target.value)}
                            placeholder="Entrez votre adresse"
                        />
                    </div>
                    <div className="mb-4 space-y-2 flex gap-4">
                        <div className="flex-1">
                            <label className="block text-lg font-semibold text-richEbony">
                                Ville
                            </label>
                            <input
                                className="w-full p-3 text-richEbony rounded-lg border border-brandGold focus:ring focus:ring-brandGold transition"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                placeholder="Entrez la ville"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-lg font-semibold text-richEbony">
                                Code Postal
                            </label>
                            <input
                                className="w-full p-3 text-richEbony rounded-lg border border-brandGold focus:ring focus:ring-brandGold transition"
                                value={postalCode}
                                onChange={(e) => setPostalCode(e.target.value)}
                                placeholder="Entrez le code postal"
                            />
                        </div>
                    </div>
                    <div className="mb-6 space-y-2">
                        <label className="block text-lg font-semibold text-richEbony">
                            Pays
                        </label>
                        <input
                            className="w-full p-3 text-richEbony rounded-lg border border-brandGold focus:ring focus:ring-brandGold transition"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            placeholder="Entrez le pays"
                        />
                    </div>
                </div>
            )}

            {/* ─────────────────────────────────────────────────
          Payment Method
      ───────────────────────────────────────────────── */}
            <div className="mb-6">
                <label className="block text-lg font-semibold text-richEbony mb-2">
                    Mode de Paiement
                </label>
                <div className="flex gap-4">
                    <button
                        className={`px-6 py-3 rounded-full transition duration-300 ${
                            paymentMethod === "CMI"
                                ? "bg-brandGold text-richEbony"
                                : "bg-burgundy/20 text-richEbony hover:bg-burgundy/40"
                        }`}
                        onClick={() => setPaymentMethod("CMI")}
                    >
                        Carte de Crédit (CMI)
                    </button>
                    <button
                        className={`px-6 py-3 rounded-full transition duration-300 ${
                            paymentMethod === "COD"
                                ? "bg-brandGold text-richEbony"
                                : "bg-burgundy/20 text-richEbony hover:bg-burgundy/40"
                        }`}
                        onClick={() => setPaymentMethod("COD")}
                    >
                        Paiement à la Livraison
                    </button>
                </div>
            </div>

            {error && <p className="text-burgundy text-lg mb-4">{error}</p>}

            <button
                onClick={handleCheckout}
                disabled={loading}
                className="bg-burgundy hover:bg-brandGold text-brandIvory px-6 py-3 rounded-full font-medium transition w-full duration-300"
            >
                {loading ? "Traitement..." : "Confirmer & Payer"}
            </button>
        </main>
    );
}

/* --------------------------------------------------------------------
   ✅ getServerSideProps: Manually parse token, fetch user’s address
-------------------------------------------------------------------- */
export const getServerSideProps: GetServerSideProps = async (context) => {
    // 1) Parse token from cookies
    const rawCookie = context.req.headers.cookie || "";
    let match = rawCookie.match(/next-auth\.session-token=([^;]+)/);
    if (!match) {
        match = rawCookie.match(/__Secure-next-auth\.session-token=([^;]+)/);
        if (!match) {
            console.log("❌ No session token found. Redirecting to login.");
            return {
                redirect: {
                    destination: "/login",
                    permanent: false,
                },
            };
        }
    }
    const tokenStr = decodeURIComponent(match[1]);

    // 2) Verify token with jose
    let userId: number | null = null;
    try {
        const secret = process.env.NEXTAUTH_SECRET || "";
        const { payload: decoded } = await jwtVerify(
            tokenStr,
            new TextEncoder().encode(secret)
        );

        console.log("✅ Token decoded:", decoded);
        if (typeof decoded !== "object" || !decoded.id) {
            throw new Error("Invalid token payload structure.");
        }
        userId = Number(decoded.id);
    } catch (err) {
        console.error("❌ Token verification failed:", err);
        return {
            redirect: {
                destination: "/login",
                permanent: false,
            },
        };
    }

    // 3) Fetch user’s address fields if we have a valid userId
    try {
        const user = await prisma.user.findUnique({
            where: { iuserIdd: userId },
            select: {
                address: true,
                city: true,
                postalCode: true,
                country: true,
            },
        });

        return {
            props: {
                userId,
                userAddress: user?.address || "",
                userCity: user?.city || "",
                userPostalCode: user?.postalCode || "",
                userCountry: user?.country || "",
            },
        };
    } catch (err) {
        console.error("❌ Error fetching user address:", err);
        // If something goes wrong, user can still checkout with "NEW" or "STORE" options
        return {
            props: {
                userId,
                userAddress: "",
                userCity: "",
                userPostalCode: "",
                userCountry: "",
            },
        };
    }
};
