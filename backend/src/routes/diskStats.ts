import { Request, Response } from 'express';
import si from 'systeminformation';

export const getDiskStats = async (_req: Request, res: Response) => {
  try {
    const fsSize = await si.fsSize();
    
    const diskStats = fsSize.map(fs => ({
      device: fs.fs,
      mountpoint: fs.mount,
      size: fs.size,
      used: fs.used,
      available: fs.size - fs.used,
      usagePercentage: fs.use
    }));

    res.json(diskStats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch disk statistics' });
  }
};
