// ================== GET-IMAGES.JS ka Code ==================
import { promises as fs } from 'fs';
import path from 'path';
export default async function handler(req, res) {
    const dirPath = path.join('/tmp', 'uploads');
    const { file } = req.query;
    if (file) {
        try {
            const filePath = path.join(dirPath, file);
            const imageBuffer = await fs.readFile(filePath);
            res.setHeader('Content-Type', 'image/jpeg');
            return res.send(imageBuffer);
        } catch (error) { return res.status(404).json({ message: 'Image not found.' }); }
    }
    try {
        await fs.access(dirPath);
        const files = await fs.readdir(dirPath);
        const sortedFiles = files.filter(f => f.endsWith('.jpeg')).sort((a, b) => b.localeCompare(a));
        res.status(200).json({ images: sortedFiles });
    } catch (error) {
        if (error.code === 'ENOENT') { return res.status(200).json({ images: [] }); }
        res.status(500).json({ message: 'Server Error' });
    }
}