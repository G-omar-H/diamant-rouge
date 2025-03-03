import { useCart } from "../contexts/CartContext";
import Link from "next/link";
import Image from "next/image";

export default function CartPage() {
    const { cart, removeFromCart, clearCart } = useCart();

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    if (cart.length === 0) {
        return (
            <main className="section-light p-8 text-center min-h-screen">
                <h1 className="text-4xl font-serif text-brandGold mb-4">Your Cart</h1>
                <p className="text-platinumGray">Your cart is currently empty.</p>
                <Link href="/" className="text-brandGold hover:underline">
                    Continue Shopping
                </Link>
            </main>
        );
    }

    return (
        <main className="section-light p-8 max-w-3xl mx-auto min-h-screen">
            <h1 className="text-4xl font-serif text-brandGold mb-6">Your Cart</h1>

            <ul className="space-y-6">
                {cart.map((item) => (
                    <li
                        key={item.productId}
                        className="bg-burgundy/10 p-4 rounded-lg flex items-center gap-4 shadow-luxury"
                    >
                        <Image
                            src={item.image || "/images/placeholder.jpg"}
                            width={100}
                            height={100}
                            alt={item.name}
                            className="rounded-lg object-cover"
                            onError={(e) => (e.currentTarget.src = "/images/placeholder.jpg")}
                        />
                        <div className="flex-1">
                            <p className="text-xl font-semibold text-richEbony">{item.name}</p>
                            <p className="text-sm text-platinumGray">SKU: {item.sku}</p>
                            <p className="text-sm text-platinumGray">Qty: {item.quantity}</p>
                        </div>
                        <div className="flex flex-col items-end">
                            <p className="text-lg font-bold text-brandGold">
                                €{(item.price * item.quantity).toFixed(2)}
                            </p>
                            <button
                                onClick={() => removeFromCart(item.productId)}
                                className="text-burgundy hover:text-brandGold transition mt-2"
                            >
                                Remove
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            <div className="text-right mt-8">
                <p className="text-2xl font-bold text-brandGold mb-4">
                    Total: €{total.toFixed(2)}
                </p>
                <button
                    onClick={clearCart}
                    className="bg-burgundy hover:bg-brandGold text-brandIvory px-6 py-3 rounded-full mr-4 transition duration-300"
                >
                    Clear Cart
                </button>
                <Link href="/checkout">
                    <button className="bg-brandGold hover:bg-burgundy text-richEbony px-6 py-3 rounded-full transition duration-300">
                        Proceed to Checkout
                    </button>
                </Link>
            </div>
        </main>
    );
}
