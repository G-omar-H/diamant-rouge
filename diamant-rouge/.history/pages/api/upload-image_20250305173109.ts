import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Disable the default body parser to handle form data
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public/uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const form = formidable({
      uploadDir,
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024, // 5MB limit
    });

    return new Promise((resolve, reject) => {
      form.parse(req, async (err, fields, files) => {
        if (err) {
          console.error("Upload error:", err);
          res.status(500).json({ error: "Échec de l'upload" });
          return resolve(undefined);
        }

        try {
          const imageFiles = Array.isArray(files.images) ? files.images : [files.images];
          const urls: string[] = [];

          // Process each uploaded file
          for (const file of imageFiles) {
            if (!file) continue;
            
            // Generate a unique filename
            const uniqueFilename = `${uuidv4()}${path.extname(file.originalFilename || '')}`;
            const newPath = path.join(uploadDir, uniqueFilename);
            
            // Rename file to use the unique name
            fs.renameSync(file.filepath, newPath);
            
            // Create public URL
            const publicUrl = `/uploads/${uniqueFilename}`;
            urls.push(publicUrl);
          }

          res.status(200).json({ urls });
          return resolve(undefined);
        } catch (error) {
          console.error("File processing error:", error);
          res.status(500).json({ error: "Erreur de traitement des fichiers" });
          return resolve(undefined);
        }
      });
    });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}