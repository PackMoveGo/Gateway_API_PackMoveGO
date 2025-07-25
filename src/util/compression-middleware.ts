import { Request, Response, NextFunction } from 'express';
import zlib from 'zlib';

interface CompressionStats {
  totalRequests: number;
  compressedResponses: number;
  bytesOriginal: number;
  bytesCompressed: number;
  avgCompressionRatio: number;
}

class CompressionManager {
  private stats: CompressionStats = {
    totalRequests: 0,
    compressedResponses: 0,
    bytesOriginal: 0,
    bytesCompressed: 0,
    avgCompressionRatio: 0
  };

  // Check if content should be compressed
  private shouldCompress(req: Request, contentType: string, contentLength: number): boolean {
    // Skip if client doesn't accept compression
    const acceptEncoding = req.headers['accept-encoding'] || '';
    if (!acceptEncoding.includes('gzip') && !acceptEncoding.includes('deflate')) {
      return false;
    }

    // Skip small responses (< 1KB)
    if (contentLength < 1024) {
      return false;
    }

    // Compress text-based content types
    const compressibleTypes = [
      'application/json',
      'application/javascript',
      'text/html',
      'text/css',
      'text/plain',
      'text/xml',
      'application/xml'
    ];

    return compressibleTypes.some(type => contentType.includes(type));
  }

  // Compression middleware
  compressionMiddleware = (req: Request, res: Response, next: NextFunction) => {
    this.stats.totalRequests++;

    const originalSend = res.send;
    const originalJson = res.json;

    res.send = function(data) {
      const contentType = res.get('Content-Type') || 'text/html';
      const originalSize = Buffer.byteLength(data, 'utf8');

      if (compressionManager.shouldCompress(req, contentType, originalSize)) {
        try {
          const compressed = zlib.gzipSync(data);
          const compressedSize = compressed.length;
          
          // Update stats
          compressionManager.updateStats(originalSize, compressedSize);
          
          res.set({
            'Content-Encoding': 'gzip',
            'Content-Length': compressedSize.toString(),
            'X-Original-Size': originalSize.toString(),
            'X-Compressed-Size': compressedSize.toString(),
            'X-Compression-Ratio': ((1 - compressedSize / originalSize) * 100).toFixed(1) + '%'
          });

          return originalSend.call(this, compressed);
        } catch (error) {
          console.warn('Compression failed:', error);
          return originalSend.call(this, data);
        }
      } else {
        return originalSend.call(this, data);
      }
    };

    res.json = function(data) {
      const jsonString = JSON.stringify(data);
      const originalSize = Buffer.byteLength(jsonString, 'utf8');

      if (compressionManager.shouldCompress(req, 'application/json', originalSize)) {
        try {
          const compressed = zlib.gzipSync(jsonString);
          const compressedSize = compressed.length;
          
          // Update stats
          compressionManager.updateStats(originalSize, compressedSize);
          
          res.set({
            'Content-Type': 'application/json',
            'Content-Encoding': 'gzip',
            'Content-Length': compressedSize.toString(),
            'X-Original-Size': originalSize.toString(),
            'X-Compressed-Size': compressedSize.toString(),
            'X-Compression-Ratio': ((1 - compressedSize / originalSize) * 100).toFixed(1) + '%'
          });

          return originalSend.call(this, compressed);
        } catch (error) {
          console.warn('JSON compression failed:', error);
          return originalJson.call(this, data);
        }
      } else {
        return originalJson.call(this, data);
      }
    };

    next();
  };

  private updateStats(originalSize: number, compressedSize: number) {
    this.stats.compressedResponses++;
    this.stats.bytesOriginal += originalSize;
    this.stats.bytesCompressed += compressedSize;
    this.stats.avgCompressionRatio = ((this.stats.bytesOriginal - this.stats.bytesCompressed) / this.stats.bytesOriginal) * 100;
  }

  getStats() {
    const compressionRate = this.stats.totalRequests > 0 ? 
      (this.stats.compressedResponses / this.stats.totalRequests * 100).toFixed(2) : '0';

    return {
      ...this.stats,
      compressionRate: compressionRate + '%',
      bytesSaved: this.stats.bytesOriginal - this.stats.bytesCompressed,
      avgCompressionRatio: this.stats.avgCompressionRatio.toFixed(2) + '%'
    };
  }
}

// Singleton instance
export const compressionManager = new CompressionManager();

// Export middleware
export const compressionMiddleware = compressionManager.compressionMiddleware; 