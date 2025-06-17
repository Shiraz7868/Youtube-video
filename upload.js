// ================== UPLOAD.JS ka Code ==================
import { promises as fs } from 'fs';
import path from 'path';
export default async function handler(req, res) {
    if (req.method !== 'POST') { return res.status(405).json({ message: 'Only POST allowed' }); }
    try {
        const { image } = req.body;
        if (!image) { return res.status(400).json({ message: 'No image data' }); }
        const base64Data = image.replace(/^data:image\/jpeg;base64,/, "");
        const filename = `capture_${Date.now()}.jpeg`;
        const dirPath = path.join('/tmp', 'uploads');
        const filePath = path.join(dirPath, filename);
        await fs.mkdir(dirPath, { recursive: true });
        await fs.writeFile(filePath, base64Data, 'base64');
        res.status(200).json({ message: `Image ${filename} uploaded.` });
    } catch (error) { res.status(500).json({ message: 'Server Error' }); }
}