import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { prisma } from '../../lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2025-02-24.acacia', // Updated to the correct API version format
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const { cartItems } = req.body;
            // cartItems: [{ productId, name, sku, price, quantity }]

            // Optional: Validate cart items, fetch updated prices from DB, etc.
            const lineItems = cartItems.map((item: any) => ({
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: item.name,
                    },
                    unit_amount: Math.round(item.price * 100), // Stripe in cents
                },
                quantity: item.quantity,
            }));

            // Create Stripe Checkout Session
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: lineItems,
                mode: 'payment',
                success_url: `${req.headers.origin}/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${req.headers.origin}/cart`,
            });

            res.status(200).json({ sessionId: session.id });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error creating checkout session.' });
        }
    } else {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
    }
}