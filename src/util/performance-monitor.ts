import { Request, Response, NextFunction } from 'express';

interface PerformanceMetrics {
  endpoint: string;
  method: string;
  responseTime: number;
  statusCode: number;
  timestamp: Date;
  userAgent?: string;
  ip?: string;
  authentication?: string;
}

interface EndpointStats {
  totalRequests: number;
  avgResponseTime: number;
  minResponseTime: number;
  maxResponseTime: number;
  errorCount: number;
  successCount: number;
  lastAccessed: Date;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private stats: Map<string, EndpointStats> = new Map();
  private maxMetricsHistory = 1000; // Keep last 1000 requests

  // Middleware to track performance
  trackPerformance = (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();
    const originalSend = res.send;

    res.send = function(data) {
      const responseTime = Date.now() - startTime;
      const endpoint = req.path;
      const method = req.method;
      const statusCode = res.statusCode;

      // Record metric
      const metric: PerformanceMetrics = {
        endpoint,
        method,
        responseTime,
        statusCode,
        timestamp: new Date(),
        userAgent: req.get('User-Agent'),
        ip: req.ip || req.socket.remoteAddress || '',
        authentication: req.headers['x-api-key'] ? 'API_KEY' : 
                       req.headers['authorization'] ? 'BEARER' : 'IP_WHITELIST'
      };

      performanceMonitor.recordMetric(metric);
      return originalSend.call(this, data);
    };

    next();
  };

  private recordMetric(metric: PerformanceMetrics) {
    // Add to metrics history
    this.metrics.push(metric);
    
    // Keep only last N metrics
    if (this.metrics.length > this.maxMetricsHistory) {
      this.metrics = this.metrics.slice(-this.maxMetricsHistory);
    }

    // Update endpoint stats
    const key = `${metric.method} ${metric.endpoint}`;
    const existing = this.stats.get(key);

    if (existing) {
      existing.totalRequests++;
      existing.avgResponseTime = ((existing.avgResponseTime * (existing.totalRequests - 1)) + metric.responseTime) / existing.totalRequests;
      existing.minResponseTime = Math.min(existing.minResponseTime, metric.responseTime);
      existing.maxResponseTime = Math.max(existing.maxResponseTime, metric.responseTime);
      existing.lastAccessed = metric.timestamp;
      
      if (metric.statusCode >= 400) {
        existing.errorCount++;
      } else {
        existing.successCount++;
      }
    } else {
      this.stats.set(key, {
        totalRequests: 1,
        avgResponseTime: metric.responseTime,
        minResponseTime: metric.responseTime,
        maxResponseTime: metric.responseTime,
        errorCount: metric.statusCode >= 400 ? 1 : 0,
        successCount: metric.statusCode < 400 ? 1 : 0,
        lastAccessed: metric.timestamp
      });
    }

    // Log slow requests
    if (metric.responseTime > 1000) {
      console.warn(`🐌 Slow request detected: ${metric.method} ${metric.endpoint} - ${metric.responseTime}ms`);
    }
  }

  // Get performance summary
  getSummary() {
    const now = new Date();
    const last24Hours = this.metrics.filter(m => 
      (now.getTime() - m.timestamp.getTime()) < 24 * 60 * 60 * 1000
    );

    const totalRequests = last24Hours.length;
    const errorRequests = last24Hours.filter(m => m.statusCode >= 400).length;
    const avgResponseTime = totalRequests > 0 ? 
      last24Hours.reduce((sum, m) => sum + m.responseTime, 0) / totalRequests : 0;

    return {
      summary: {
        totalRequests24h: totalRequests,
        errorRate: totalRequests > 0 ? (errorRequests / totalRequests * 100).toFixed(2) + '%' : '0%',
        avgResponseTime: Math.round(avgResponseTime) + 'ms',
        uptime: Math.floor(process.uptime()),
        timestamp: now.toISOString()
      },
      topEndpoints: this.getTopEndpoints(),
      recentMetrics: this.metrics.slice(-10),
      authenticationBreakdown: this.getAuthBreakdown()
    };
  }

  private getTopEndpoints() {
    return Array.from(this.stats.entries())
      .sort((a, b) => b[1].totalRequests - a[1].totalRequests)
      .slice(0, 10)
      .map(([endpoint, stats]) => ({
        endpoint,
        requests: stats.totalRequests,
        avgTime: Math.round(stats.avgResponseTime) + 'ms',
        errorRate: ((stats.errorCount / stats.totalRequests) * 100).toFixed(1) + '%',
        lastAccessed: stats.lastAccessed.toISOString()
      }));
  }

  private getAuthBreakdown() {
    const authCounts = { API_KEY: 0, BEARER: 0, IP_WHITELIST: 0 };
    this.metrics.forEach(m => {
      if (m.authentication && authCounts.hasOwnProperty(m.authentication)) {
        authCounts[m.authentication as keyof typeof authCounts]++;
      }
    });
    return authCounts;
  }

  // Get real-time stats
  getRealTimeStats() {
    const last5Min = this.metrics.filter(m => 
      (Date.now() - m.timestamp.getTime()) < 5 * 60 * 1000
    );

    return {
      requestsLast5Min: last5Min.length,
      avgResponseTimeLast5Min: last5Min.length > 0 ? 
        Math.round(last5Min.reduce((sum, m) => sum + m.responseTime, 0) / last5Min.length) : 0,
      errorsLast5Min: last5Min.filter(m => m.statusCode >= 400).length,
      activeEndpoints: new Set(last5Min.map(m => m.endpoint)).size
    };
  }

  // Export metrics for external monitoring
  exportMetrics() {
    return {
      metrics: this.metrics,
      stats: Object.fromEntries(this.stats),
      exported: new Date().toISOString()
    };
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Export middleware
export const performanceMiddleware = performanceMonitor.trackPerformance; 