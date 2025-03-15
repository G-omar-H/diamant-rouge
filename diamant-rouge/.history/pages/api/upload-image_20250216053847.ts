import type { NextApiRequest, NextApiResponse } from "next";
import formidable, { File } from "formidable";
import fs from "fs";
import path from "path";
import { jwtVerify } from "jose";

interface DecodedPayload {
    id: string;
    role: string;
    email: string;
}

// Disable Next.js default body parser
export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log('--- ADMIN IMAGE UPLOAD ROUTE START ---');

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    // ✅ Extract and verify admin token
    const rawCookie = req.headers.cookie || '';
    let match = rawCookie.match(/next-auth\.session-token=([^;]+)/);
    if (!match) {
        match = rawCookie.match(/__Secure-next-auth\.session-token=([^;]+)/);
        if (!match) {
            console.log('No session token found. Returning 401...');
            return res.status(401).json({ error: 'Not authorized. No token found.' });
        }
    }

    const tokenStr = decodeURIComponent(match[1]);

    try {
        const secret = process.env.NEXTAUTH_SECRET || '';
        const { payload: decoded } = await jwtVerify(tokenStr, new TextEncoder().encode(secret));
        console.log('✅ Token decoded =>', decoded);
        const payload = decoded as unknown as DecodedPayload;

        if (payload.role !== 'admin') {
            console.log('❌ User is not admin. Returning 401...');
            return res.status(401).json({ error: 'Not authorized.' });
        }
    } catch (err) {
        console.log('❌ Token verification failed:', err);
        return res.status(401).json({ error: 'Not authorized. Invalid token.' });
    }

    try {
        // ✅ Define upload directory
        const uploadDir = path.join(process.cwd(), "public/uploads");

        // Ensure the directory exists
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // ✅ Correctly initialize Formidable
        const form = formidable({
            uploadDir, // Set upload directory explicitly
            keepExtensions: true,
            maxFileSize: 100 * 1024 * 1024, // 100MB limit
            multiples: false,
        });

        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error("❌ File upload error:", err);
                return res.status(500).json({ error: "File upload failed" });
            }

            // ✅ Ensure a file exists and has a valid name
            const fileArray = Array.isArray(files.file) ? files.file : [files.file]; // Handle single or multiple files
            const file: File | undefined = fileArray[0];

            if (!file || !file.filepath) {
                console.error("❌ No file received.");
                return res.status(400).json({ error: "No file uploaded" });
            }

            // ✅ Generate a unique filename if `newFilename` is missing
            const fileExtension = path.extname(file.originalFilename || "");
            const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}${fileExtension}`;
            const newFilePath = path.join(uploadDir, uniqueFilename);

            // ✅ Move file to the correct location
            fs.renameSync(file.filepath, newFilePath);

            const fileUrl = `/uploads/${uniqueFilename}`;
            console.log("✅ File uploaded successfully:", fileUrl);

            return res.status(200).json({ imageUrl: fileUrl });
        });
    } catch (error) {
        console.error("❌ Upload API Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
