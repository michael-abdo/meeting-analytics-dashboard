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

- Professional flat design with enhanced visual hierarchy
- Real-time meeting analytics with pattern recognition
- Behavioral insights with status-based color coding
- AI-powered intervention suggestions
- Live transcript with bias detection
- Performance monitoring and analytics tracking
- Responsive design for all screen sizes

### Enhanced Visual Hierarchy

The dashboard now features an improved visual system designed for real-time monitoring:

#### File Structure
```
deploy-dashboard/
├── index.html          # Main dashboard with minimal inline styles
├── assets/
│   ├── css/
│   │   ├── base.css       # CSS variables, resets, typography
│   │   ├── layout.css     # Grid systems and responsive layouts
│   │   ├── components.css # UI component styles
│   │   └── theme.css      # Visual enhancements and animations
│   └── js/
│       ├── dashboard.js   # Core dashboard functionality
│       ├── interactions.js # User interactions and UI feedback
│       └── analytics.js   # Performance tracking and analytics
├── server.js           # Express server with asset serving
└── package.json        # Dependencies
```

#### Color System

Semantic color coding for quick pattern recognition:
- **Critical** (#dc2626): Immediate attention required
- **Warning** (#f59e0b): Monitoring recommended  
- **Caution** (#f97316): Potential issue developing
- **Normal** (#10b981): Within expected parameters
- **Info** (#0284c7): Informational updates
- **Primary** (#3b82f6): Primary actions and focus

#### Key Enhancements

1. **Visual Priority Indicators**
   - Critical metrics pulse subtly to draw attention
   - Warning states use color intensity variations
   - Trend indicators (↑↓→) for quick pattern recognition
   - Data freshness animations

2. **Improved Information Density**
   - Visual grouping with subtle borders and spacing
   - Hierarchical typography scale
   - Enhanced contrast for critical values
   - Comparison markers for baseline metrics

3. **Accessibility Features**
   - Skip navigation links
   - Enhanced keyboard navigation with arrow keys
   - Screen reader announcements for dynamic updates
   - WCAG AA compliant color contrasts
   - Focus management for modal dialogs

4. **Performance Optimizations**
   - Modular CSS/JS architecture
   - CSS custom properties for theming
   - Real-time FPS and memory monitoring
   - Efficient DOM update mechanisms