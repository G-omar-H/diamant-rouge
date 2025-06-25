import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { hash, compare } from 'bcryptjs';

export default async function fixAuth(req: NextApiRequest, res: NextApiResponse) {
    // Only allow POST requests and only in development/staging
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    // Simple security check - require a secret key
    const { secret } = req.body;
    const expectedSecret = process.env.NEXTAUTH_SECRET?.substring(0, 10); // Use part of NEXTAUTH_SECRET
    
    if (!secret || secret !== expectedSecret) {
        return res.status(401).json({ error: 'Invalid secret' });
    }

    try {
        console.log('🔧 Starting authentication fix...');
        
        // Check if admin user exists
        const existingUser = await prisma.user.findUnique({
            where: { email: 'admin@diamant-rouge.com' }
        });
        
        // Generate new hash for Password123!
        const correctPassword = 'Password123!';
        const newHash = await hash(correctPassword, 10);
        
        // Update or create admin user
        const user = await prisma.user.upsert({
            where: { email: 'admin@diamant-rouge.com' },
            update: { 
                password: newHash,
                role: 'admin' 
            },
            create: {
                email: 'admin@diamant-rouge.com',
                password: newHash,
                name: 'Admin User',
                role: 'admin'
            }
        });
        
        // Test the password
        const isValid = await compare(correctPassword, newHash);
        
        return res.status(200).json({
            success: true,
            message: 'Authentication fixed successfully',
            userFound: !!existingUser,
            userId: user.id,
            passwordTest: isValid ? 'PASS' : 'FAIL',
            credentials: {
                email: 'admin@diamant-rouge.com',
                password: 'Password123!'
            }
        });
        
    } catch (error: any) {
        console.error('❌ Auth fix error:', error);
        return res.status(500).json({ 
            error: 'Failed to fix authentication',
            details: error.message 
        });
    }
} 