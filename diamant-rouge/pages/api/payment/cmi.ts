import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import querystring from 'querystring';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { orderId, amount, customerEmail } = req.body;

        if (!orderId || !amount || !customerEmail) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }

        const merchantId = process.env.CMI_MERCHANT_ID;
        const secretKey = process.env.CMI_SECRET_KEY;
        const paymentUrl = process.env.CMI_PAYMENT_URL;
        const successUrl = process.env.CMI_SUCCESS_URL;
        const failureUrl = process.env.CMI_FAILURE_URL;

        if (!merchantId || !secretKey || !paymentUrl || !successUrl || !failureUrl) {
            return res.status(500).json({ error: 'Missing CMI configuration' });
        }

        const requestData = {
            MID: merchantId,
            ORDERID: orderId,
            AMOUNT: amount.toFixed(2),
            CURRENCY: '504', // 504 = Moroccan Dirham (MAD)
            LANGUAGE: 'en',
            EMAIL: customerEmail,
            SUCCESSURL: successUrl,
            FAILUREURL: failureUrl,
            TXNTYPE: 'Sale',
            PAYMENTTYPE: 'CreditCard',
            HASH: '',
        };

        // 🔐 Generate Secure Hash Signature
        const hashString = Object.values(requestData).join('|');
        const hash = crypto.createHmac('sha512', secretKey).update(hashString).digest('hex');
        requestData.HASH = hash;

        // 🔄 Redirect to CMI Payment Page
        const redirectUrl = `${paymentUrl}?${querystring.stringify(requestData)}`;

        res.status(200).json({ redirectUrl });

    } catch (error: any) {
        console.error('CMI Payment Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
