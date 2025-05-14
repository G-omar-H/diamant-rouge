import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma'; // adjust path as needed
import bcrypt from 'bcryptjs';

export default async function signupHandler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Méthode non autorisée' });
    }

    const { email, password, name } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email ou mot de passe manquant' });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        return res.status(409).json({ error: 'Cette adresse email est déjà utilisée' });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Create new user
    try {
        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashed,
                name: name || '',
                // role defaults to 'customer' from Prisma schema
            },
        });
        return res.status(201).json({ message: 'Utilisateur créé avec succès', userId: newUser.id });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Une erreur s'est produite lors de la création de l'utilisateur" });
    }
}
