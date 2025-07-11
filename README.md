# Meeting Analytics Dashboard - Heroku Deployment

## Quick Deploy to Heroku

### Prerequisites
- Heroku CLI installed
- Git installed
- Heroku account

### Deployment Steps

1. **Login to Heroku:**
   ```bash
   heroku login
   ```

2. **Create Heroku App:**
   ```bash
   heroku create your-dashboard-name
   ```

3. **Deploy:**
   ```bash
   git push heroku master
   ```

4. **Open your dashboard:**
   ```bash
   heroku open
   ```

### Alternative: One-Click Deploy

You can also deploy this to Heroku with one click using this button:

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

### Files Included

- `index.html` - The main dashboard HTML file
- `server.js` - Simple Express server to serve the dashboard
- `package.json` - Node.js dependencies and scripts
- `Procfile` - Heroku process configuration

### Local Development

To run locally:

```bash
npm install
npm start
```

The dashboard will be available at `http://localhost:3000`

### Dashboard Features

- Professional flat design with consistent color palette
- Real-time meeting analytics visualization
- Behavioral insights and participation metrics
- Enterprise-ready interface
- Responsive design for all screen sizes

### Color Palette

- Primary: #3b82f6 (Blue)
- Text Dark: #374151 (Dark Gray)
- Text Light: #6b7280 (Medium Gray)
- Background: #ffffff (White)
- Section Background: #f8fafc (Light Gray)