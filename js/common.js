/**
 * 宠物MBTI - 公共功能模块
 * 包含：主题切换、加载动画、工具函数
 */

// ==================== 主题切换 ====================
const ThemeManager = {
  init() {
    // 检查保存的主题
    const savedTheme = localStorage.getItem('pet_mbti_theme');
    if (savedTheme) {
      this.applyTheme(savedTheme);
    } else {
      // 检测系统偏好
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.applyTheme(prefersDark ? 'dark' : 'light');
    }
    
    // 创建主题切换按钮
    this.createToggleButton();
  },
  
  applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    localStorage.setItem('pet_mbti_theme', theme);
  },
  
  toggle() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme(newTheme);
    return newTheme;
  },
  
  createToggleButton() {
    // 检查是否已存在
    if (document.querySelector('.theme-toggle')) return;
    
    const button = document.createElement('button');
    button.className = 'theme-toggle';
    button.innerHTML = this.getThemeIcon();
    button.title = '切换主题';
    button.addEventListener('click', () => {
      this.toggle();
      button.innerHTML = this.getThemeIcon();
    });
    
    document.body.appendChild(button);
  },
  
  getThemeIcon() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    return isDark ? '☀️' : '🌙';
  }
};

// ==================== 加载动画 ====================
const LoadingManager = {
  show(message = '加载中...') {
    // 检查是否已存在
    if (document.querySelector('.loading-overlay')) return;
    
    const overlay = document.createElement('div');
    overlay.className = 'loading-overlay';
    overlay.innerHTML = `
      <div class="loading-content">
        <div class="loading-spinner-large"></div>
        <p class="loading-message">${message}</p>
      </div>
    `;
    
    document.body.appendChild(overlay);
    
    // 添加样式
    if (!document.getElementById('loading-styles')) {
      const style = document.createElement('style');
      style.id = 'loading-styles';
      style.textContent = `
        .loading-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 248, 240, 0.95);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          animation: fadeIn 0.3s ease;
        }
        
        [data-theme="dark"] .loading-overlay {
          background: rgba(26, 26, 46, 0.95);
        }
        
        .loading-content {
          text-align: center;
        }
        
        .loading-spinner-large {
          width: 60px;
          height: 60px;
          border: 4px solid var(--bg-secondary);
          border-top-color: var(--primary-color);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        }
        
        .loading-message {
          color: var(--text-primary);
          font-size: 1.1rem;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `;
      document.head.appendChild(style);
    }
  },
  
  hide() {
    const overlay = document.querySelector('.loading-overlay');
    if (overlay) {
      overlay.style.animation = 'fadeOut 0.3s ease';
      setTimeout(() => overlay.remove(), 300);
    }
  },
  
  // 带延迟的加载（用于模拟计算过程）
  async withDelay(message, delay = 1500) {
    this.show(message);
    await new Promise(resolve => setTimeout(resolve, delay));
    this.hide();
  }
};

// ==================== 工具函数 ====================
const Utils = {
  // 防抖
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },
  
  // 节流
  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },
  
  // 复制到剪贴板
  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      // 降级方案
      const input = document.createElement('input');
      input.value = text;
      document.body.appendChild(input);
      input.select();
      const result = document.execCommand('copy');
      document.body.removeChild(input);
      return result;
    }
  },
  
  // 显示提示
  showToast(message, duration = 2000) {
    // 检查是否已存在
    if (document.querySelector('.toast-message')) return;
    
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.textContent = message;
    
    // 添加样式
    toast.style.cssText = `
      position: fixed;
      bottom: 80px;
      left: 50%;
      transform: translateX(-50%);
      background: var(--text-primary);
      color: var(--bg-color);
      padding: 12px 24px;
      border-radius: 25px;
      font-size: 0.9rem;
      z-index: 10000;
      animation: slideUp 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.animation = 'slideDown 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }
};

// ==================== 本地统计 ====================
const StatsManager = {
  // 记录测试次数
  recordTest(typeId) {
    const stats = this.getStats();
    stats[typeId] = (stats[typeId] || 0) + 1;
    stats.total = (stats.total || 0) + 1;
    localStorage.setItem('pet_mbti_stats', JSON.stringify(stats));
  },
  
  // 获取统计
  getStats() {
    return JSON.parse(localStorage.getItem('pet_mbti_stats') || '{}');
  },
  
  // 获取排行榜
  getRanking() {
    const stats = this.getStats();
    const ranking = Object.entries(stats)
      .filter(([key]) => key !== 'total')
      .map(([typeId, count]) => ({ typeId, count }))
      .sort((a, b) => b.count - a.count);
    return ranking;
  },
  
  // 获取某个类型的排名
  getRank(typeId) {
    const ranking = this.getRanking();
    const index = ranking.findIndex(item => item.typeId === typeId);
    return index >= 0 ? index + 1 : null;
  }
};

// ==================== 初始化 ====================
document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
});

// 导出模块（供其他脚本使用）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ThemeManager, LoadingManager, Utils, StatsManager };
}
