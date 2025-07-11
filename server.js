const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the current directory
app.use(express.static(__dirname));

// Serve assets directory
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Route to serve the dashboard
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Analytics route
app.get('/analytics', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Preferences route
app.get('/preferences', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Export report endpoint
app.get('/api/export', (req, res) => {
    const reportData = {
        timestamp: new Date().toISOString(),
        session: {
            duration: "02:45:12",
            participants: 4,
            totalSpeakingTime: "73% Sarah, 12% Tom, 8% Maya, 7% James"
        },
        insights: {
            dominanceBehavior: "Sarah: High participation detected",
            engagementTrend: "78% → 41% (declining)",
            interruptionCount: 7,
            sentimentFlow: "67% Negative trending"
        }
    };
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="meeting-analytics-report.json"');
    res.json(reportData);
});

// 404 handler - styled error page
app.use((req, res) => {
    res.status(404).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Page Not Found - Meeting Analytics</title>
            <style>
                body { 
                    font-family: 'Inter', sans-serif; 
                    background: #f8fafc; 
                    color: #374151; 
                    margin: 0; 
                    padding: 40px; 
                    text-align: center; 
                }
                .container { 
                    max-width: 600px; 
                    margin: 0 auto; 
                    background: #ffffff; 
                    padding: 40px; 
                    border-radius: 4px; 
                    border: 1px solid #e5e7eb; 
                }
                h1 { color: #3b82f6; margin-bottom: 20px; }
                .btn { 
                    background: #3b82f6; 
                    color: white; 
                    padding: 12px 24px; 
                    text-decoration: none; 
                    border-radius: 4px; 
                    display: inline-block; 
                    margin-top: 20px; 
                }
                .btn:hover { background: #2563eb; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>404 - Page Not Found</h1>
                <p>The page you're looking for doesn't exist.</p>
                <a href="/" class="btn">Return to Dashboard</a>
            </div>
        </body>
        </html>
    `);
});

app.listen(PORT, () => {
    console.log(`Meeting Analytics Dashboard running on port ${PORT}`);
});