// Analytics and Performance Tracking

class AnalyticsTracker {
  constructor() {
    this.events = [];
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
    
    this.init();
  }
  
  init() {
    // Track page load performance
    this.trackPageLoad();
    
    // Track user interactions
    this.trackInteractions();
    
    // Track metrics performance
    this.trackMetricsPerformance();
    
    // Send analytics periodically
    this.startAnalyticsBatch();
  }
  
  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  trackPageLoad() {
    if (window.performance && window.performance.timing) {
      const timing = window.performance.timing;
      const loadTime = timing.loadEventEnd - timing.navigationStart;
      
      this.track('page_load', {
        loadTime,
        domReady: timing.domContentLoadedEventEnd - timing.navigationStart,
        resourcesLoaded: timing.loadEventEnd - timing.responseEnd
      });
    }
  }
  
  trackInteractions() {
    // Track button clicks
    document.addEventListener('click', (e) => {
      if (e.target.matches('button, .btn, .power-card')) {
        this.track('interaction', {
          type: 'click',
          element: e.target.tagName,
          text: e.target.textContent.trim().substring(0, 50),
          class: e.target.className
        });
      }
    });
    
    // Track focus events on important elements
    document.addEventListener('focusin', (e) => {
      if (e.target.matches('.power-card, .player-card')) {
        this.track('interaction', {
          type: 'focus',
          element: e.target.className
        });
      }
    });
    
    // Track scroll events (debounced)
    let scrollTimeout;
    document.addEventListener('scroll', (e) => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        this.track('interaction', {
          type: 'scroll',
          scrollDepth: this.getScrollDepth()
        });
      }, 500);
    });
  }
  
  trackMetricsPerformance() {
    // Monitor update performance
    const originalUpdateMetrics = window.dashboard?.updateMetrics;
    if (originalUpdateMetrics) {
      window.dashboard.updateMetrics = () => {
        const startTime = performance.now();
        originalUpdateMetrics.call(window.dashboard);
        const endTime = performance.now();
        
        this.track('performance', {
          type: 'metrics_update',
          duration: endTime - startTime
        });
      };
    }
  }
  
  track(eventType, data) {
    const event = {
      sessionId: this.sessionId,
      timestamp: Date.now(),
      eventType,
      data,
      context: {
        url: window.location.href,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        sessionDuration: Date.now() - this.startTime
      }
    };
    
    this.events.push(event);
    
    // Log to console in development
    if (window.location.hostname === 'localhost') {
      console.log('Analytics Event:', event);
    }
  }
  
  getScrollDepth() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollPercentage = (scrollTop + windowHeight) / documentHeight * 100;
    
    return Math.round(scrollPercentage);
  }
  
  startAnalyticsBatch() {
    // Send analytics every 30 seconds
    setInterval(() => {
      if (this.events.length > 0) {
        this.sendAnalytics();
      }
    }, 30000);
    
    // Send on page unload
    window.addEventListener('beforeunload', () => {
      this.sendAnalytics();
    });
  }
  
  sendAnalytics() {
    if (this.events.length === 0) return;
    
    const payload = {
      events: [...this.events],
      summary: this.generateSummary()
    };
    
    // Clear sent events
    this.events = [];
    
    // In production, this would send to analytics endpoint
    // For now, store in localStorage for debugging
    const analytics = JSON.parse(localStorage.getItem('dashboardAnalytics') || '[]');
    analytics.push(payload);
    
    // Keep only last 10 batches
    if (analytics.length > 10) {
      analytics.splice(0, analytics.length - 10);
    }
    
    localStorage.setItem('dashboardAnalytics', JSON.stringify(analytics));
  }
  
  generateSummary() {
    return {
      sessionId: this.sessionId,
      sessionDuration: Date.now() - this.startTime,
      totalEvents: this.events.length,
      eventTypes: this.events.reduce((acc, event) => {
        acc[event.eventType] = (acc[event.eventType] || 0) + 1;
        return acc;
      }, {})
    };
  }
}

// Performance Observer for monitoring render performance
class PerformanceMonitor {
  constructor() {
    this.metrics = {
      fps: [],
      renderTime: [],
      memoryUsage: []
    };
    
    this.init();
  }
  
  init() {
    // Monitor FPS
    this.monitorFPS();
    
    // Monitor memory usage if available
    this.monitorMemory();
    
    // Monitor long tasks
    this.monitorLongTasks();
  }
  
  monitorFPS() {
    let lastTime = performance.now();
    let frames = 0;
    
    const measureFPS = () => {
      frames++;
      const currentTime = performance.now();
      
      if (currentTime >= lastTime + 1000) {
        const fps = Math.round((frames * 1000) / (currentTime - lastTime));
        this.metrics.fps.push(fps);
        
        // Keep only last 60 measurements
        if (this.metrics.fps.length > 60) {
          this.metrics.fps.shift();
        }
        
        // Warn if FPS drops below 30
        if (fps < 30) {
          console.warn(`Low FPS detected: ${fps}`);
        }
        
        frames = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(measureFPS);
    };
    
    requestAnimationFrame(measureFPS);
  }
  
  monitorMemory() {
    if (performance.memory) {
      setInterval(() => {
        const memoryInfo = {
          usedJSHeapSize: Math.round(performance.memory.usedJSHeapSize / 1048576), // MB
          totalJSHeapSize: Math.round(performance.memory.totalJSHeapSize / 1048576),
          jsHeapSizeLimit: Math.round(performance.memory.jsHeapSizeLimit / 1048576)
        };
        
        this.metrics.memoryUsage.push(memoryInfo);
        
        // Keep only last 60 measurements
        if (this.metrics.memoryUsage.length > 60) {
          this.metrics.memoryUsage.shift();
        }
        
        // Warn if memory usage is high
        const usagePercentage = (memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit) * 100;
        if (usagePercentage > 80) {
          console.warn(`High memory usage: ${usagePercentage.toFixed(2)}%`);
        }
      }, 5000); // Check every 5 seconds
    }
  }
  
  monitorLongTasks() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.duration > 50) {
            console.warn('Long task detected:', {
              duration: entry.duration,
              startTime: entry.startTime,
              name: entry.name
            });
            
            // Track long task
            window.analyticsTracker?.track('performance', {
              type: 'long_task',
              duration: entry.duration
            });
          }
        });
      });
      
      try {
        observer.observe({ entryTypes: ['longtask'] });
      } catch (e) {
        // Long task monitoring not supported
      }
    }
  }
  
  getMetricsSummary() {
    return {
      averageFPS: this.calculateAverage(this.metrics.fps),
      minFPS: Math.min(...this.metrics.fps),
      maxFPS: Math.max(...this.metrics.fps),
      currentMemory: this.metrics.memoryUsage[this.metrics.memoryUsage.length - 1],
      performanceScore: this.calculatePerformanceScore()
    };
  }
  
  calculateAverage(array) {
    if (array.length === 0) return 0;
    return array.reduce((a, b) => a + b, 0) / array.length;
  }
  
  calculatePerformanceScore() {
    const avgFPS = this.calculateAverage(this.metrics.fps);
    const fpsScore = Math.min(avgFPS / 60 * 100, 100); // 60 FPS = 100%
    
    if (performance.memory) {
      const lastMemory = this.metrics.memoryUsage[this.metrics.memoryUsage.length - 1];
      const memoryScore = (1 - (lastMemory.usedJSHeapSize / lastMemory.jsHeapSizeLimit)) * 100;
      return Math.round((fpsScore + memoryScore) / 2);
    }
    
    return Math.round(fpsScore);
  }
}

// Initialize analytics when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.analyticsTracker = new AnalyticsTracker();
  window.performanceMonitor = new PerformanceMonitor();
  
  // Add performance metrics to HUD if exists
  setInterval(() => {
    const hudElement = document.querySelector('.floating-hud');
    if (hudElement && !document.querySelector('.hud-performance')) {
      const perfMetrics = window.performanceMonitor.getMetricsSummary();
      const perfElement = document.createElement('div');
      perfElement.className = 'hud-item hud-performance';
      perfElement.innerHTML = `
        <span class="hud-label">Performance</span>
        <span class="hud-value">${perfMetrics.performanceScore}%</span>
      `;
      hudElement.appendChild(perfElement);
    }
  }, 5000);
});