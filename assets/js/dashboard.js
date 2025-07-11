// Dashboard Core Functionality
class MeetingAnalyticsDashboard {
  constructor() {
    this.config = {
      updateInterval: 5000, // 5 seconds
      alertThresholds: {
        speakingTime: 50, // Alert if one person speaks >50%
        engagement: 30, // Alert if engagement <30%
        interruptions: 5, // Alert if interruptions >5 per 5min
        sentiment: 60 // Alert if negative sentiment >60%
      }
    };
    
    this.state = {
      sessionTime: 0,
      participants: [],
      metrics: {},
      alerts: []
    };
    
    this.init();
  }
  
  init() {
    this.initializeEventListeners();
    this.startSessionTimer();
    this.startMetricsUpdate();
    this.applyVisualHierarchy();
  }
  
  initializeEventListeners() {
    // Power card interactions
    document.querySelectorAll('.power-card').forEach(card => {
      card.addEventListener('click', (e) => this.handlePowerCardClick(e));
      card.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          this.handlePowerCardClick(e);
        }
      });
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
    
    // Responsive sidebar
    this.initializeResponsiveSidebar();
  }
  
  handlePowerCardClick(e) {
    const card = e.currentTarget;
    const metric = card.dataset.metric;
    
    // Add micro-interaction
    card.classList.add('micro-bounce');
    setTimeout(() => card.classList.remove('micro-bounce'), 200);
    
    // Show detailed view
    this.showMetricDetail(metric);
  }
  
  showMetricDetail(metric) {
    const detailData = this.getMetricDetail(metric);
    const modal = this.createDetailModal(metric, detailData);
    document.body.appendChild(modal);
  }
  
  getMetricDetail(metric) {
    // Simulate fetching detailed data
    const details = {
      'speaking-time': {
        title: 'Speaking Time Analysis',
        data: {
          'Last 5 min': { Sarah: '85%', Tom: '10%', Maya: '3%', James: '2%' },
          'Last 10 min': { Sarah: '73%', Tom: '12%', Maya: '8%', James: '7%' },
          'Session Total': { Sarah: '68%', Tom: '15%', Maya: '10%', James: '7%' }
        }
      },
      'engagement': {
        title: 'Engagement Metrics',
        data: {
          'Eye Contact': '34% average',
          'Active Listening': '41% of participants',
          'Note Taking': '2 participants',
          'Screen Sharing': 'Not active'
        }
      }
    };
    
    return details[metric] || { title: 'Metric Detail', data: {} };
  }
  
  createDetailModal(metric, data) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal">
        <h3 style="margin: 0 0 var(--spacing-lg) 0;">${data.title}</h3>
        <div class="metric-detail-grid">
          ${Object.entries(data.data).map(([key, value]) => `
            <div class="metric-detail-item">
              <span class="metric-detail-label">${key}</span>
              <span class="metric-detail-value">${typeof value === 'object' ? JSON.stringify(value) : value}</span>
            </div>
          `).join('')}
        </div>
        <button class="btn btn-primary" onclick="this.closest('.modal-overlay').remove()">Close</button>
      </div>
    `;
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });
    
    return modal;
  }
  
  applyVisualHierarchy() {
    // Apply status-based visual hierarchy
    this.updateStatusIndicators();
    
    // Highlight critical metrics
    this.highlightCriticalMetrics();
    
    // Apply pattern recognition helpers
    this.applyPatternRecognition();
  }
  
  updateStatusIndicators() {
    // Update player cards based on status
    document.querySelectorAll('.player-card').forEach(card => {
      const stats = this.getPlayerStats(card);
      
      if (stats.speakingTime > 50) {
        card.classList.add('status-warning');
      } else if (stats.engagement < 30) {
        card.classList.add('status-critical');
      }
    });
    
    // Update power cards based on thresholds
    document.querySelectorAll('.power-card').forEach(card => {
      const value = this.getCardValue(card);
      const threshold = this.getCardThreshold(card);
      
      if (value > threshold) {
        card.classList.add('warning');
      }
    });
  }
  
  highlightCriticalMetrics() {
    // Add visual emphasis to critical values
    document.querySelectorAll('.stat-value, .power-value').forEach(element => {
      const value = parseFloat(element.textContent);
      const metric = element.closest('[data-metric]')?.dataset.metric;
      
      if (this.isCriticalValue(metric, value)) {
        element.classList.add('critical');
        element.closest('.stat-box, .power-card')?.classList.add('critical-alert');
      }
    });
  }
  
  applyPatternRecognition() {
    // Add trend indicators
    document.querySelectorAll('[data-trend]').forEach(element => {
      const trend = element.dataset.trend;
      element.classList.add(`trend-${trend}`);
    });
    
    // Add comparison markers
    document.querySelectorAll('[data-baseline]').forEach(element => {
      const current = parseFloat(element.textContent);
      const baseline = parseFloat(element.dataset.baseline);
      
      if (current > baseline * 1.2) {
        element.classList.add('above-baseline');
      } else if (current < baseline * 0.8) {
        element.classList.add('below-baseline');
      }
    });
  }
  
  startSessionTimer() {
    setInterval(() => {
      this.state.sessionTime++;
      this.updateSessionTime();
    }, 1000);
  }
  
  updateSessionTime() {
    const hours = Math.floor(this.state.sessionTime / 3600);
    const minutes = Math.floor((this.state.sessionTime % 3600) / 60);
    const seconds = this.state.sessionTime % 60;
    
    const timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    
    const sessionTimeElement = document.querySelector('.score-value[data-metric="session-time"]');
    if (sessionTimeElement) {
      sessionTimeElement.textContent = timeString;
    }
  }
  
  startMetricsUpdate() {
    // Initial update
    this.updateMetrics();
    
    // Regular updates
    setInterval(() => {
      this.updateMetrics();
    }, this.config.updateInterval);
  }
  
  updateMetrics() {
    // Simulate real-time data updates
    this.simulateDataUpdate();
    
    // Update visual indicators
    this.applyVisualHierarchy();
    
    // Check for alerts
    this.checkAlertConditions();
  }
  
  simulateDataUpdate() {
    // Add subtle variations to metrics
    const elements = document.querySelectorAll('[data-live-update]');
    elements.forEach(element => {
      const currentValue = parseFloat(element.textContent) || 0;
      const variation = (Math.random() - 0.5) * 5; // ±2.5% variation
      const newValue = Math.max(0, Math.min(100, currentValue + variation));
      
      if (element.dataset.format === 'percentage') {
        element.textContent = `${Math.round(newValue)}%`;
      } else {
        element.textContent = Math.round(newValue);
      }
      
      // Add fresh data indicator
      element.classList.add('data-fresh');
      setTimeout(() => element.classList.remove('data-fresh'), 3000);
    });
  }
  
  checkAlertConditions() {
    const alerts = [];
    
    // Check speaking time imbalance
    const speakingTimeValue = parseFloat(document.querySelector('[data-metric="speaking-time-max"]')?.textContent) || 0;
    if (speakingTimeValue > this.config.alertThresholds.speakingTime) {
      alerts.push({
        type: 'speaking-imbalance',
        severity: 'warning',
        message: 'Speaking time heavily dominated by one participant'
      });
    }
    
    // Check engagement levels
    const engagementValue = parseFloat(document.querySelector('[data-metric="engagement"]')?.textContent) || 0;
    if (engagementValue < this.config.alertThresholds.engagement) {
      alerts.push({
        type: 'low-engagement',
        severity: 'critical',
        message: 'Team engagement below critical threshold'
      });
    }
    
    // Display alerts
    this.displayAlerts(alerts);
  }
  
  displayAlerts(alerts) {
    alerts.forEach(alert => {
      if (!this.state.alerts.find(a => a.type === alert.type)) {
        this.state.alerts.push(alert);
        this.showAlert(alert);
      }
    });
  }
  
  showAlert(alert) {
    const alertElement = document.createElement('div');
    alertElement.className = `alert alert-${alert.severity}`;
    alertElement.innerHTML = `
      <span class="alert-icon">${alert.severity === 'critical' ? '⚠️' : '⚡'}</span>
      <span class="alert-message">${alert.message}</span>
      <button class="alert-close" onclick="this.parentElement.remove()">×</button>
    `;
    
    // Add to floating HUD or create alert container
    const hudElement = document.querySelector('.floating-hud');
    if (hudElement) {
      hudElement.appendChild(alertElement);
      setTimeout(() => alertElement.remove(), 10000); // Auto-remove after 10s
    }
  }
  
  handleKeyboardShortcuts(e) {
    // Alt + A: View Analytics
    if (e.altKey && e.key === 'a') {
      e.preventDefault();
      viewAnalytics();
    }
    
    // Alt + B: Suggest Break
    if (e.altKey && e.key === 'b') {
      e.preventDefault();
      suggestBreak();
    }
    
    // Alt + E: Export Report
    if (e.altKey && e.key === 'e') {
      e.preventDefault();
      exportReport();
    }
    
    // Escape: Close modals
    if (e.key === 'Escape') {
      this.closeAllModals();
    }
  }
  
  closeAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(modal => modal.remove());
  }
  
  initializeResponsiveSidebar() {
    // Add swipe gestures for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });
    
    document.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe();
    });
  }
  
  handleSwipe() {
    // Implement swipe navigation for mobile
  }
  
  // Helper methods
  getPlayerStats(card) {
    // Extract stats from card elements
    return {
      speakingTime: parseFloat(card.querySelector('[data-stat="speaking-time"]')?.textContent) || 0,
      engagement: parseFloat(card.querySelector('[data-stat="engagement"]')?.textContent) || 0
    };
  }
  
  getCardValue(card) {
    const valueElement = card.querySelector('.power-value');
    return parseFloat(valueElement?.textContent) || 0;
  }
  
  getCardThreshold(card) {
    const metric = card.dataset.metric;
    return this.config.alertThresholds[metric] || 50;
  }
  
  isCriticalValue(metric, value) {
    const thresholds = {
      'speaking-time': value > 70,
      'engagement': value < 30,
      'interruptions': value > 5,
      'sentiment-negative': value > 60
    };
    
    return thresholds[metric] || false;
  }
}

// Initialize dashboard when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.dashboard = new MeetingAnalyticsDashboard();
});