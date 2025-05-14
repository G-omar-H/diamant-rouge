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

  // Get appointment ID from request
  const { id } = req.query;
  
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid appointment ID' });
  }
  
  const appointmentId = parseInt(id);
  
  // Handle GET request (get single appointment)
  if (req.method === 'GET') {
    try {
      const appointment = await prisma.appointment.findUnique({
        where: { id: appointmentId },
      });
      
      if (!appointment) {
        return res.status(404).json({ error: 'Appointment not found' });
      }
      
      return res.status(200).json(appointment);
    } catch (error) {
      console.error('Error fetching appointment:', error);
      return res.status(500).json({ error: 'An error occurred while fetching the appointment' });
    }
  }
  
  // Handle PUT request (update appointment)
  if (req.method === 'PUT') {
    try {
      const appointmentData = req.body;
      
      const updatedAppointment = await prisma.appointment.update({
        where: { id: appointmentId },
        data: appointmentData,
      });
      
      return res.status(200).json(updatedAppointment);
    } catch (error) {
      console.error('Error updating appointment:', error);
      return res.status(500).json({ error: 'An error occurred while updating the appointment' });
    }
  }
  
  // Handle DELETE request (delete appointment)
  if (req.method === 'DELETE') {
    try {
      await prisma.appointment.delete({
        where: { id: appointmentId },
      });
      
      return res.status(200).json({ success: true, message: 'Appointment deleted successfully' });
    } catch (error) {
      console.error('Error deleting appointment:', error);
      return res.status(500).json({ error: 'An error occurred while deleting the appointment' });
    }
  }
  
  // Method not allowed
  return res.status(405).json({ error: 'Method not allowed' });
} 