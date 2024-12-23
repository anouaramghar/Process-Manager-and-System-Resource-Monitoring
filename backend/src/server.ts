import express from 'express';
import cors from 'cors';
import * as si from 'systeminformation';
import { getDiskStats } from './routes/diskStats';

const app = express();
const port = 3002;

// Configure CORS with specific options
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Get all processes
app.get('/api/processes', async (req, res) => {
    try {
        const [processes, currentLoad, mem] = await Promise.all([
            si.processes(),
            si.currentLoad(),
            si.mem()
        ]);
        
        const processesWithStats = processes.list.map((process) => {
            // Map Windows process states to our frontend status
            let status: 'running' | 'stopped' | 'paused' = 'running'; // Default to running for Windows
            
            // In Windows, most active processes will not have an explicit state
            // We'll consider them running unless specifically marked otherwise
            if (process.state) {
                switch (process.state.toLowerCase()) {
                    
                    case 'dead':
                        status = 'stopped';
                        break;
                    
                    case 'waiting':
                        status = 'paused';
                        break;
                    default:
                        status = 'running';
                }
            }

            // Calculate memory in MB
            const memoryInMB = (process.memRss || 0) / (1024 * 1024);
            // Calculate memory percentage
            const memoryPercentage = mem.total ? ((process.memRss || 0) / mem.total) * 100 : 0;

            // Debug log
            console.log(`Process ${process.name}: Raw memRss=${process.memRss}, MB=${memoryInMB}, Percentage=${memoryPercentage}`);

            return {
                id: process.pid.toString(),
                name: process.name,
                cpu: Number((process.cpu || 0).toFixed(1)),
                memory: Number(memoryInMB.toFixed(1)), // MB with 1 decimal place
                memoryPercentage: Number(memoryPercentage.toFixed(1)), // Percentage with 1 decimal place
                status,
                uptime: formatProcessUptime(process.started)
            };
        });
        
        res.json(processesWithStats);
    } catch (error) {
        console.error('Error fetching processes:', error);
        res.status(500).json({ error: 'Failed to fetch processes' });
    }
});

// Format uptime from process start time
function formatProcessUptime(started: string | number | undefined): string {
    try {
        if (!started) return 'unknown';
        
        // Convert string timestamp to number if necessary
        const startTime = typeof started === 'string' ? Date.parse(started) : started;
        if (isNaN(startTime)) return 'unknown';

        const uptime = Date.now() - startTime;
        const hours = Math.floor(uptime / (1000 * 60 * 60));
        const minutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));
        
        if (hours > 24) {
            const days = Math.floor(hours / 24);
            return `${days}d ${hours % 24}h`;
        }
        return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
    } catch {
        return 'unknown';
    }
}

// Get system stats
app.get('/api/system-stats', async (req, res) => {
    try {
        const [cpu, mem, graphics] = await Promise.all([
            si.currentLoad(),
            si.mem(),
            si.graphics()
        ]);

        // Get GPU usage using nvidia-smi for NVIDIA GPU
        let gpuUsage = 0;
        try {
            const { exec } = require('child_process');
            // Query both GPU utilization and memory utilization
            const nvidiaSmiCommand = 'nvidia-smi --query-gpu=utilization.gpu,memory.used,memory.total --format=csv,noheader,nounits';
            
            const getGpuUsage = () => new Promise((resolve) => {
                exec(nvidiaSmiCommand, (error: any, stdout: string) => {
                    if (!error && stdout) {
                        const [utilization, memoryUsed, memoryTotal] = stdout.trim().split(',').map(Number);
                        console.log('NVIDIA GPU Stats:', { utilization, memoryUsed, memoryTotal });
                        
                        // Use GPU utilization if available, otherwise calculate from memory
                        if (!isNaN(utilization)) {
                            resolve(utilization);
                        } else if (!isNaN(memoryUsed) && !isNaN(memoryTotal) && memoryTotal > 0) {
                            resolve((memoryUsed / memoryTotal) * 100);
                        } else {
                            resolve(0);
                        }
                    } else {
                        console.error('nvidia-smi error:', error);
                        resolve(0);
                    }
                });
            });

            gpuUsage = await getGpuUsage() as number;
            console.log('GPU Usage from nvidia-smi:', gpuUsage);
        } catch (error) {
            console.error('Error getting GPU usage:', error);
        }

        res.json({
            cpu: {
                usage: Number(cpu.currentLoad.toFixed(1))
            },
            memory: {
                used: mem.used,
                total: mem.total,
                usagePercentage: Number(((mem.used / mem.total) * 100).toFixed(1))
            },
            gpu: {
                usage: Number(gpuUsage.toFixed(1))
            }
        });
    } catch (error) {
        console.error('Error fetching system stats:', error);
        res.status(500).json({ error: 'Failed to fetch system stats' });
    }
});

// Add disk stats endpoint
app.get('/api/disk-stats', getDiskStats);

// Kill process
app.post('/api/processes/:pid/kill', async (req, res) => {
    try {
        const { pid } = req.params;
        const { exec } = require('child_process');
        
        // Windows command to kill process
        exec(`taskkill /F /PID ${pid}`, (error: any, stdout: string, stderr: string) => {
            if (error) {
                if (error.message.includes('Access is denied')) {
                    res.status(403).json({ error: 'Access denied. Try running as administrator.' });
                } else {
                    res.status(500).json({ error: 'Failed to kill process' });
                }
                return;
            }
            res.json({ message: 'Process killed successfully' });
        });
    } catch (error) {
        console.error('Error killing process:', error);
        res.status(500).json({ error: 'Failed to kill process' });
    }
});

app.listen(port, () => {
    console.log(`Backend server running at http://localhost:${port}`);
});
