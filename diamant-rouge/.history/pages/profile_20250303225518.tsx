// pages/profile.tsx

import { prisma } from "../lib/prisma";
import { getSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useWishlist } from "../contexts/WishlistContext";
import { useState } from "react";
import { Minus, Package, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ... your existing types like OrderPlus, WishlistItem, etc.

type ProfilePageProps = {
    orders: OrderPlus[];
    wishlist: WishlistItem[];
    locale: string;

    // Address and phone fields
    address: string | null;
    city: string | null;
    postalCode: string | null;
    country: string | null;
    phoneNumber: string | null;
};

export default function ProfilePage({
                                        orders,
                                        wishlist,
                                        locale,
                                        address: initialAddress,
                                        city: initialCity,
                                        postalCode: initialPostal,
                                        country: initialCountry,
                                        phoneNumber: initialPhone,
                                    }: ProfilePageProps) {
    const { removeFromWishlist } = useWishlist();
    const [wishlistItems, setWishlistItems] = useState(wishlist);

    // Address & phone state
    const [address, setAddress] = useState(initialAddress || "");
    const [city, setCity] = useState(initialCity || "");
    const [postalCode, setPostalCode] = useState(initialPostal || "");
    const [country, setCountry] = useState(initialCountry || "");
    const [phoneNumber, setPhoneNumber] = useState(initialPhone || "");

    const [updateMsg, setUpdateMsg] = useState("");

    async function handleRemoveFromWishlist(productId: number) {
        setWishlistItems((prev) => prev.filter((item) => item.productId !== productId));
        await removeFromWishlist(productId);
    }

    // Handle saving address & phone
    async function handleSaveAddress(e: React.FormEvent) {
        e.preventDefault();
        setUpdateMsg("");

        try {
            const res = await fetch("/api/user/update-address", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ address, city, postalCode, country, phoneNumber }),
            });
            if (res.ok) {
                setUpdateMsg("Informations mises à jour avec succès !");
            } else {
                setUpdateMsg("Erreur lors de la mise à jour des informations.");
            }
        } catch (error) {
            console.error("Update address/phone error:", error);
            setUpdateMsg("Erreur lors de la mise à jour des informations.");
        }
    }

    return (
        <main className="section-light p-8 min-h-screen">
            <h1 className="text-4xl font-serif mb-6 text-brandGold">Mon Profil</h1>

            {/* Address & Phone Section */}
            <section className="mb-10 bg-burgundy/10 p-4 rounded-lg shadow-luxury">
                <h2 className="text-3xl font-serif mb-4 text-brandGold">
                    Informations de Livraison
                </h2>
                <form onSubmit={handleSaveAddress} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Address */}
                    <div>
                        <label className="block text-sm text-platinumGray mb-1">Adresse</label>
                        <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="input-field w-full"
                        />
                    </div>

                    {/* City */}
                    <div>
                        <label className="block text-sm text-platinumGray mb-1">Ville</label>
                        <input
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="input-field w-full"
                        />
                    </div>

                    {/* Postal Code */}
                    <div>
                        <label className="block text-sm text-platinumGray mb-1">
                            Code Postal
                        </label>
                        <input
                            type="text"
                            value={postalCode}
                            onChange={(e) => setPostalCode(e.target.value)}
                            className="input-field w-full"
                        />
                    </div>

                    {/* Country */}
                    <div>
                        <label className="block text-sm text-platinumGray mb-1">Pays</label>
                        <input
                            type="text"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            className="input-field w-full"
                        />
                    </div>

                    {/* Phone Number */}
                    <div>
                        <label className="block text-sm text-platinumGray mb-1">
                            Numéro de Téléphone
                        </label>
                        <input
                            type="text"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="input-field w-full"
                        />
                    </div>

                    <div className="col-span-full mt-3">
                        <button type="submit" className="button-primary">
                            Enregistrer
                        </button>
                        {updateMsg && (
                            <p className="text-sm text-burgundy mt-2 font-semibold">
                                {updateMsg}
                            </p>
                        )}
                    </div>
                </form>
            </section>

            {/* Order History */}
            <section className="mb-10">
                <h2 className="text-3xl font-serif mb-4 text-brandGold">Order History</h2>
                {orders.length === 0 ? (
                    <p className="flex items-center gap-2 text-platinumGray">
                        <ShoppingBag className="text-brandGold" size={20} /> You have no orders yet.
                    </p>
                ) : (
                    <ul className="space-y-6">
                        {orders.map((order) => (
                            <li
                                key={order.id}
                                className="bg-burgundy/10 p-4 rounded-lg shadow-luxury relative text-richEbony"
                            >
                                <p>
                                    Order <strong>#{order.id}</strong> -{" "}
                                    <span className="text-brandGold">{order.status}</span>
                                </p>
                                <p>
                                    Total: <strong>€{order.totalAmount}</strong>
                                </p>
                                <p>
                                    Shipped To: {order.shippingAddress}, {order.city}{" "}
                                    {order.postalCode}, {order.country}
                                </p>
                                <p>Placed On: {new Date(order.createdAt).toLocaleString()}</p>

                                {order.trackingNumber && (
                                    <p className="flex items-center gap-2 text-sm text-platinumGray mt-1">
                                        <Package className="text-brandGold" size={18} />{" "}
                                        <strong>{order.trackingNumber}</strong>
                                    </p>
                                )}

                                <ul className="mt-3 space-y-1">
                                    {order.orderItems.map((item) => {
                                        const productName =
                                            item.product?.translations.find((t) => t.language === locale)?.name ||
                                            item.product?.translations.find((t) => t.language === "en")?.name ||
                                            item.product?.sku;

                                        return (
                                            <li key={item.id} className="pl-2 text-platinumGray">
                                                {productName} (Qty: {item.quantity}, Price: €{item.price})
                                            </li>
                                        );
                                    })}
                                </ul>
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            {/* Wishlist Section */}
            <section>
                <h2 className="text-3xl font-serif mb-4 text-brandGold">My Wishlist</h2>
                {wishlistItems.length === 0 ? (
                    <p className="flex items-center gap-2 text-platinumGray">
                        <ShoppingBag className="text-brandGold" size={20} /> Your wishlist is empty.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {wishlistItems.map(({ product }) => {
                                const productTranslation =
                                    product.translations.find((t) => t.language === locale) ||
                                    product.translations.find((t) => t.language === "en");

                                return (
                                    <motion.div
                                        key={product.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        transition={{ duration: 0.4 }}
                                        className="relative bg-burgundy/10 p-4 rounded-lg text-center shadow-luxury text-richEbony"
                                    >
                                        {/* ✅ Properly Positioned Remove Button */}
                                        <button
                                            onClick={() => handleRemoveFromWishlist(product.id)}
                                            className="absolute top-3 right-3 text-burgundy border border-burgundy p-1 rounded-full hover:bg-burgundy hover:text-brandIvory transition duration-300"
                                        >
                                            <Minus size={16} />
                                        </button>

                                        <Image
                                            src={
                                                product.images.length > 0
                                                    ? product.images[0]
                                                    : "/images/placeholder.jpg"
                                            }
                                            width={150}
                                            height={150}
                                            alt={productTranslation?.name || "Wishlist Product"}
                                            className="mx-auto rounded-md object-cover"
                                        />
                                        <h3 className="text-lg text-brandGold mt-2">
                                            {productTranslation?.name}
                                        </h3>
                                        <p className="text-platinumGray">
                                            €{parseFloat(product.basePrice).toFixed(2)}
                                        </p>

                                        <Link href={`/products/${product.id}`} passHref>
                                            <button className="mt-2 bg-brandGold text-richEbony px-4 py-2 rounded-full hover:bg-burgundy hover:text-brandIvory transition duration-300">
                                                View Product
                                            </button>
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                )}
            </section>
        </main>
    );
}

// Extend getServerSideProps
export async function getServerSideProps(context: any) {
    const session = await getSession(context);
    if (!session) {
        return { redirect: { destination: "/login", permanent: false } };
    }

    const userId = Number(session.user.id);
    const locale = context.locale || "en";

    try {
        // 🆕 Fetch user to get address & phone
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                address: true,
                city: true,
                postalCode: true,
                country: true,
                phoneNumber: true,
            },
        });

        // Orders
        const rawOrders = await prisma.order.findMany({
            where: { userId },
            include: {
                orderItems: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                sku: true,
                                images: true,
                                translations: {
                                    select: { language: true, name: true },
                                },
                            },
                        },
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        // Wishlist
        const rawWishlist = await prisma.wishlist.findMany({
            where: { userId },
            include: {
                product: {
                    select: {
                        id: true,
                        sku: true,
                        basePrice: true,
                        images: true,
                        translations: {
                            select: { language: true, name: true },
                        },
                    },
                },
            },
        });

        return {
            props: {
                orders: JSON.parse(JSON.stringify(rawOrders)),
                wishlist: JSON.parse(JSON.stringify(rawWishlist)),
                locale,
                address: user?.address || null,
                city: user?.city || null,
                postalCode: user?.postalCode || null,
                country: user?.country || null,
                phoneNumber: user?.phoneNumber || null,
            },
        };
    } catch (error) {
        console.error("❌ Profile SSR error:", error);
        return {
            props: {
                orders: [],
                wishlist: [],
                locale,
                address: null,
                city: null,
                postalCode: null,
                country: null,
                phoneNumber: null,
            },
        };
    }
}
