import { Request, Response, NextFunction } from 'express';

const MAX_REQUEST_SIZE = '1mb'; // Set the maximum request size limit

export const sizeLimit = (req: Request, res: Response, next: NextFunction) => {
    const contentLength = req.headers['content-length'];

    if (contentLength && parseInt(contentLength) > parseSize(MAX_REQUEST_SIZE)) {
        return res.status(413).json({ error: 'Payload too large' });
    }

    next();
};

const parseSize = (size: string): number => {
    const units = {
        kb: 1024,
        mb: 1024 * 1024,
        gb: 1024 * 1024 * 1024,
    };

    const match = size.match(/^(\d+)(kb|mb|gb)$/);
    if (match) {
        const value = parseInt(match[1]);
        const unit = match[2];
        return value * units[unit];
    }

    return 0; // Default to 0 if the size format is incorrect
};