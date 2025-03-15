import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import { sendPasswordResetEmail } from '../../../lib/email';

const prisma = new PrismaClient();

export default async function resetPasswordHandler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email address is required' });
    }

    try {
        // Check if user exists
        const user = await prisma.user.findUnique({ where: { email } });
        
        if (!user) {
            // For security, don't reveal that email doesn't exist
            return res.status(200).json({ 
                message: 'Si votre email existe dans notre système, vous recevrez un lien de réinitialisation.' 
            });
        }

        // Generate reset token and expiration (6 hours from now)
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 6 * 60 * 60 * 1000); // 6 hours

        // Save token to database
        await prisma.user.update({
            where: { id: user.id },
            data: { 
                resetToken,
                resetTokenExpiry
            }
        });

        // Generate reset URL (frontend page that will handle reset)
        const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;
        
        // Send email with reset instructions
        try {
            await sendPasswordResetEmail({
                to: user.email,
                name: user.name || 'Client',
                resetUrl
            });
        } catch (emailError) {
            console.error('Error sending password reset email:', emailError);
            return res.status(500).json({ error: 'Erreur lors de l\'envoi de l\'email. Veuillez réessayer.' });
        }

        // Return success
        return res.status(200).json({ 
            message: 'Instructions de réinitialisation envoyées à votre adresse email.'
        });
    } catch (error) {
        console.error('Password reset error:', error);
        return res.status(500).json({ 
            error: 'Une erreur est survenue. Veuillez réessayer plus tard.' 
        });
    }
}