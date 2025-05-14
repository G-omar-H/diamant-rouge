import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getSession } from 'next-auth/react';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check authentication
  const session = await getSession({ req });
  
  if (!session || session.user.role !== 'admin') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Handle GET requests (list appointments)
  if (req.method === 'GET') {
    try {
      // Get query parameters for filtering
      const { status, date, type, location } = req.query;
      
      // Build filter conditions
      const where: any = {};
      
      if (status && status !== 'all') {
        where.status = status;
      }
      
      if (date) {
        where.appointmentDate = date;
      }
      
      if (type && type !== 'all') {
        where.appointmentType = type;
      }
      
      if (location && location !== 'all') {
        where.location = location;
      }
      
      // Get appointments from database
      const appointments = await prisma.appointment.findMany({
        where,
        orderBy: {
          createdAt: 'desc',
        },
      });
      
      return res.status(200).json(appointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      return res.status(500).json({ error: 'An error occurred while fetching appointments' });
    }
  }
  
  // Handle POST requests (create appointment from admin)
  if (req.method === 'POST') {
    try {
      const appointmentData = req.body;
      
      // Basic validation
      if (!appointmentData.clientName || !appointmentData.appointmentDate || !appointmentData.appointmentTime) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      
      // Create appointment
      const appointment = await prisma.appointment.create({
        data: appointmentData,
      });
      
      return res.status(201).json(appointment);
    } catch (error) {
      console.error('Error creating appointment:', error);
      return res.status(500).json({ error: 'An error occurred while creating the appointment' });
    }
  }
  
  // Method not allowed
  return res.status(405).json({ error: 'Method not allowed' });
} 