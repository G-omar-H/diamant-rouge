import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getSession } from 'next-auth/react';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests for creating appointments
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get user session directly from the server (more reliable than client-side session)
    const session = await getServerSession(req, res, authOptions);
    
    if (!session || !session.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    // Get the user from database to get their contact details
    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
      },
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Get appointment data from request body
    const {
      appointmentDate,
      appointmentTime,
      location,
      appointmentType,
      guestCount,
      preferences,
      specialRequests,
    } = req.body;

    // Basic validation
    if (!appointmentDate || !appointmentTime || !location || !appointmentType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Map appointment type to label and duration
    const typeDetails = {
      discovery: { label: "Découverte des Collections", duration: "90" },
      bespoke: { label: "Création Sur-Mesure", duration: "120" },
      bridal: { label: "Collection Nuptiale", duration: "90" },
      investment: { label: "Joaillerie d'Investissement", duration: "120" },
    };
    
    const appointmentTypeKey = appointmentType as keyof typeof typeDetails;

    // Map location to type
    const locationLabel = location === 'casablanca' ? 'Showroom Casablanca' : 'Consultation Virtuelle';

    // Create appointment in database
    const appointment = await prisma.appointment.create({
      data: {
        clientName: user.name || 'Client',
        clientEmail: user.email,
        clientPhone: user.phoneNumber || '',
        appointmentDate,
        appointmentTime,
        duration: typeDetails[appointmentTypeKey]?.duration || "90",
        status: 'PENDING',
        location,
        locationType: locationLabel,
        appointmentType,
        appointmentTypeLabel: typeDetails[appointmentTypeKey]?.label || "",
        guestCount: parseInt(guestCount) || 1,
        preferences: preferences || '',
        specialRequests: specialRequests || '',
        userId: user.id,
      },
    });

    // TODO: Send confirmation email to client and notification to admin
    // This could be implemented with a service like SendGrid, Mailgun, etc.

    // Return success with the created appointment
    return res.status(201).json({ 
      success: true, 
      message: 'Appointment created successfully', 
      appointment
    });

  } catch (error) {
    console.error('Error creating appointment:', error);
    return res.status(500).json({ error: 'An error occurred while creating the appointment' });
  }
} 