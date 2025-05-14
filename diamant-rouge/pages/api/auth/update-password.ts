import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

export default async function updatePasswordHandler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Méthode non autorisée' });
    }

    const { token, password } = req.body;

    if (!token || !password) {
        return res.status(400).json({ error: 'Token et mot de passe requis' });
    }

    try {
        // Find user with this token that hasn't expired
        const user = await prisma.user.findFirst({
            where: { 
                resetToken: token,
                resetTokenExpiry: { gt: new Date() } // Token must not be expired
            }
        });

        if (!user) {
            return res.status(400).json({ 
                error: 'Token invalide ou expiré. Veuillez demander une nouvelle réinitialisation.'
            });
        }

        // Hash new password
        const hashedPassword = await hash(password, 10);

        // Update user password and clear reset token
        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null
            }
        });

        return res.status(200).json({ 
            message: 'Mot de passe réinitialisé avec succès'
        });
    } catch (error) {
        console.error('Password update error:', error);
        return res.status(500).json({ 
            error: 'Une erreur est survenue. Veuillez réessayer.'
        });
    }
}