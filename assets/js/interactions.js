// UI Interactions and User Experience Enhancements

// Bottom navigation functions
function viewAnalytics() {
  const analyticsSection = document.querySelector('.power-grid');
  if (analyticsSection) {
    analyticsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    showToast('📊 Scrolled to Analytics Section', 'info');
  }
}

function suggestBreak() {
  const sessionTime = document.querySelector('.score-value[data-metric="session-time"]')?.textContent || '00:00:00';
  const modal = createModal(
    '⏸️ Break Suggestion',
    `Team has been in session for ${sessionTime}. Consider a 5-10 minute break to maintain engagement and focus.`,
    [
      { 
        text: 'Suggest Now', 
        action: () => { 
          showToast('✅ Break suggestion sent to team', 'success'); 
          closeModal(); 
        },
        primary: true
      },
      { 
        text: 'Schedule for Later', 
        action: () => { 
          showToast('📅 Break scheduled for 5 minutes', 'info'); 
          closeModal(); 
        }
      },
      { 
        text: 'Cancel', 
        action: closeModal 
      }
    ]
  );
  document.body.appendChild(modal);
}

function exportReport() {
  showToast('📄 Generating report...', 'info');
  
  // Add loading state to button
  const exportBtn = event.target;
  exportBtn.classList.add('loading');
  exportBtn.disabled = true;
  
  setTimeout(() => {
    window.location.href = '/api/export';
    showToast('✅ Report downloaded successfully', 'success');
    exportBtn.classList.remove('loading');
    exportBtn.disabled = false;
  }, 1000);
}

function openPreferences() {
  const modal = createModal(
    '⚙️ Dashboard Preferences',
    'Configure your dashboard settings:',
    [
      { 
        text: 'Auto-refresh: ON', 
        action: () => showToast('🔄 Auto-refresh toggled', 'info'),
        toggle: true
      },
      { 
        text: 'Notifications: ON', 
        action: () => showToast('🔔 Notifications toggled', 'info'),
        toggle: true
      },
      { 
        text: 'Dark Mode: OFF', 
        action: () => {
          document.body.classList.toggle('dark-mode');
          showToast('🌙 Theme toggled', 'info');
        },
        toggle: true
      },
      { 
        text: 'Close', 
        action: closeModal,
        primary: true
      }
    ]
  );
  document.body.appendChild(modal);
}

// Intervention functions
function executeIntervention() {
  const button = event.target;
  const interventionText = button.closest('.intervention-item').querySelector('.intervention-text').textContent;
  
  showToast('✅ Intervention message sent', 'success');
  
  // Visual feedback
  button.style.background = 'var(--color-normal)';
  button.textContent = 'Sent ✓';
  button.disabled = true;
  
  // Log intervention
  logIntervention({
    type: 'facilitation',
    message: interventionText,
    timestamp: new Date().toISOString()
  });
  
  setTimeout(() => {
    button.style.background = '';
    button.textContent = 'Execute';
    button.disabled = false;
  }, 3000);
}

function showAlternative() {
  const alternatives = [
    {
      text: '"Tom, we\'d love to hear your perspective on this."',
      targetParticipant: 'Tom',
      type: 'engagement'
    },
    {
      text: '"Let\'s take a moment for everyone to share their thoughts."',
      targetParticipant: 'All',
      type: 'inclusive'
    },
    {
      text: '"Sarah, great points. How do others feel about this approach?"',
      targetParticipant: 'Sarah',
      type: 'redirect'
    },
    {
      text: '"Maya, you seemed to have a reaction to that. What are your thoughts?"',
      targetParticipant: 'Maya',
      type: 'observe'
    }
  ];
  
  const currentIndex = parseInt(sessionStorage.getItem('alternativeIndex') || '0');
  const alternative = alternatives[currentIndex % alternatives.length];
  
  const modal = createModal(
    '💬 Alternative Suggestions',
    `
      <p><strong>Type:</strong> ${alternative.type}</p>
      <p><strong>Target:</strong> ${alternative.targetParticipant}</p>
      <p style="font-style: italic; color: var(--color-primary); margin-top: var(--spacing-md);">
        "${alternative.text}"
      </p>
    `,
    [
      { 
        text: 'Use This', 
        action: () => { 
          showToast('✅ Alternative suggestion sent', 'success'); 
          logIntervention({
            type: 'alternative',
            message: alternative.text,
            target: alternative.targetParticipant
          });
          closeModal(); 
        },
        primary: true
      },
      { 
        text: 'Show Another', 
        action: () => { 
          sessionStorage.setItem('alternativeIndex', String(currentIndex + 1));
          closeModal(); 
          setTimeout(showAlternative, 100); 
        }
      },
      { 
        text: 'Cancel', 
        action: closeModal 
      }
    ]
  );
  document.body.appendChild(modal);
}

// Enhanced Toast System
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span class="toast-message">${message}</span>
    <button class="toast-close" onclick="this.parentElement.classList.remove('show'); setTimeout(() => this.parentElement.remove(), 300)">×</button>
  `;
  
  // Style based on type
  const typeStyles = {
    success: { background: 'var(--color-normal)', icon: '✅' },
    info: { background: 'var(--color-info)', icon: 'ℹ️' },
    warning: { background: 'var(--color-warning)', icon: '⚠️' },
    error: { background: 'var(--color-critical)', icon: '❌' }
  };
  
  toast.style.background = typeStyles[type]?.background || typeStyles.info.background;
  
  document.body.appendChild(toast);
  
  // Animate in
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });
  
  // Auto remove
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Enhanced Modal System
function createModal(title, content, buttons) {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-labelledby', 'modal-title');
  modal.setAttribute('aria-modal', 'true');
  
  const modalContent = document.createElement('div');
  modalContent.className = 'modal';
  modalContent.innerHTML = `
    <h3 id="modal-title" style="margin: 0 0 var(--spacing-lg) 0; color: var(--color-text-primary);">${title}</h3>
    <div class="modal-content" style="margin-bottom: var(--spacing-lg); color: var(--color-text-secondary); line-height: 1.6;">
      ${content}
    </div>
    <div class="modal-actions" style="display: flex; gap: var(--spacing-md); flex-wrap: wrap;">
      ${buttons.map((btn, index) => `
        <button 
          class="btn ${btn.primary ? 'btn-primary' : 'btn-secondary'} ${btn.toggle ? 'btn-toggle' : ''}"
          onclick="(${btn.action.toString()})()"
          ${index === 0 ? 'autofocus' : ''}
        >
          ${btn.text}
        </button>
      `).join('')}
    </div>
  `;
  
  modal.appendChild(modalContent);
  
  // Close on backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  
  // Trap focus
  trapFocus(modal);
  
  return modal;
}

function closeModal() {
  const modals = document.querySelectorAll('.modal-overlay');
  modals.forEach(modal => {
    modal.classList.add('closing');
    setTimeout(() => modal.remove(), 200);
  });
}

// Focus Management
function trapFocus(element) {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];
  
  element.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    }
  });
  
  // Focus first element
  firstFocusable?.focus();
}

// Logging System
function logIntervention(intervention) {
  const logs = JSON.parse(localStorage.getItem('interventionLogs') || '[]');
  logs.push({
    ...intervention,
    timestamp: new Date().toISOString()
  });
  
  // Keep only last 50 logs
  if (logs.length > 50) {
    logs.splice(0, logs.length - 50);
  }
  
  localStorage.setItem('interventionLogs', JSON.stringify(logs));
  
  // Update UI if log viewer is open
  updateLogViewer();
}

function updateLogViewer() {
  const logViewer = document.querySelector('.log-viewer');
  if (logViewer) {
    const logs = JSON.parse(localStorage.getItem('interventionLogs') || '[]');
    logViewer.innerHTML = logs.map(log => `
      <div class="log-entry">
        <span class="log-time">${new Date(log.timestamp).toLocaleTimeString()}</span>
        <span class="log-type">${log.type}</span>
        <span class="log-message">${log.message}</span>
      </div>
    `).join('');
  }
}

// Accessibility Enhancements
document.addEventListener('DOMContentLoaded', function() {
  // Add skip navigation link
  const skipNav = document.createElement('a');
  skipNav.className = 'skip-nav';
  skipNav.href = '#main-content';
  skipNav.textContent = 'Skip to main content';
  document.body.insertBefore(skipNav, document.body.firstChild);
  
  // Announce dynamic updates to screen readers
  const announcer = document.createElement('div');
  announcer.className = 'sr-announcer';
  announcer.setAttribute('aria-live', 'polite');
  announcer.setAttribute('aria-atomic', 'true');
  document.body.appendChild(announcer);
  
  // Remove disabled state from visually styled buttons
  document.querySelectorAll('button[disabled]').forEach(btn => {
    btn.setAttribute('tabindex', '-1');
    btn.setAttribute('aria-disabled', 'true');
  });
  
  // Enhance Export button accessibility
  const exportBtn = document.querySelector('[onclick="exportReport()"]');
  if (exportBtn) {
    exportBtn.setAttribute('aria-label', 'Export meeting analytics report as JSON file');
    exportBtn.style.cursor = 'pointer';
  }
});

// Keyboard Navigation Enhancements
document.addEventListener('keydown', function(e) {
  // Escape closes modals
  if (e.key === 'Escape') {
    closeModal();
  }
  
  // Arrow key navigation for power cards
  if (e.target.classList.contains('power-card')) {
    const cards = Array.from(document.querySelectorAll('.power-card'));
    const currentIndex = cards.indexOf(e.target);
    let nextIndex;
    
    switch(e.key) {
      case 'ArrowRight':
        nextIndex = (currentIndex + 1) % cards.length;
        break;
      case 'ArrowLeft':
        nextIndex = (currentIndex - 1 + cards.length) % cards.length;
        break;
      case 'ArrowDown':
        nextIndex = Math.min(currentIndex + 4, cards.length - 1);
        break;
      case 'ArrowUp':
        nextIndex = Math.max(currentIndex - 4, 0);
        break;
    }
    
    if (nextIndex !== undefined) {
      e.preventDefault();
      cards[nextIndex].focus();
    }
  }
});

// Screen Reader Announcements
function announce(message) {
  const announcer = document.querySelector('.sr-announcer');
  if (announcer) {
    announcer.textContent = message;
    // Clear after announcement
    setTimeout(() => {
      announcer.textContent = '';
    }, 1000);
  }
}

// Export enhanced functions to global scope
window.viewAnalytics = viewAnalytics;
window.suggestBreak = suggestBreak;
window.exportReport = exportReport;
window.openPreferences = openPreferences;
window.executeIntervention = executeIntervention;
window.showAlternative = showAlternative;
window.showToast = showToast;
window.closeModal = closeModal;
window.announce = announce;