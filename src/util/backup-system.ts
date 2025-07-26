import fs from 'fs/promises';
import path from 'path';
import { performanceMonitor } from './performance-monitor';

interface BackupData {
  timestamp: string;
  version: string;
  environment: string;
  data: {
    performanceMetrics: any;
    configuration: any;
    systemStats: any;
  };
}

class BackupSystem {
  private backupDir = path.join(process.cwd(), 'backups');
  private maxBackups = 10; // Keep last 10 backups

  constructor() {
    this.ensureBackupDirectory();
  }

  private async ensureBackupDirectory() {
    try {
      await fs.access(this.backupDir);
    } catch {
      await fs.mkdir(this.backupDir, { recursive: true });
      console.log('📁 Created backup directory:', this.backupDir);
    }
  }

  // Create a comprehensive backup
  async createBackup(): Promise<string> {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `backup-${timestamp}.json`;
      const filepath = path.join(this.backupDir, filename);

      const backupData: BackupData = {
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        data: {
          performanceMetrics: performanceMonitor.exportMetrics(),
          configuration: this.getConfiguration(),
          systemStats: this.getSystemStats()
        }
      };

      await fs.writeFile(filepath, JSON.stringify(backupData, null, 2));
      
      // Clean up old backups
      await this.cleanupOldBackups();
      
      console.log('💾 Backup created successfully:', filename);
      return filename;
    } catch (error) {
      console.error('❌ Backup creation failed:', error);
      throw error;
    }
  }

  private getConfiguration() {
    return {
      nodeEnv: process.env.NODE_ENV,
      port: process.env.PORT,
      corsOrigins: process.env.CORS_ORIGIN,
      apiKeyEnabled: process.env.API_KEY_ENABLED,
      
      timestamp: new Date().toISOString()
    };
  }

  private getSystemStats() {
    const memUsage = process.memoryUsage();
    return {
      uptime: process.uptime(),
      memory: {
        rss: Math.round(memUsage.rss / 1024 / 1024),
        heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
        heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
        external: Math.round(memUsage.external / 1024 / 1024)
      },
      cpu: process.cpuUsage(),
      platform: process.platform,
      nodeVersion: process.version,
      timestamp: new Date().toISOString()
    };
  }

  private async cleanupOldBackups() {
    try {
      const files = await fs.readdir(this.backupDir);
      const backupFiles = files
        .filter(file => file.startsWith('backup-') && file.endsWith('.json'))
        .sort()
        .reverse(); // Most recent first

      if (backupFiles.length > this.maxBackups) {
        const filesToDelete = backupFiles.slice(this.maxBackups);
        
        for (const file of filesToDelete) {
          await fs.unlink(path.join(this.backupDir, file));
          console.log('🗑️ Deleted old backup:', file);
        }
      }
    } catch (error) {
      console.error('❌ Backup cleanup failed:', error);
    }
  }

  // Get list of available backups
  async getBackupList(): Promise<string[]> {
    try {
      const files = await fs.readdir(this.backupDir);
      return files
        .filter(file => file.startsWith('backup-') && file.endsWith('.json'))
        .sort()
        .reverse();
    } catch (error) {
      console.error('❌ Failed to get backup list:', error);
      return [];
    }
  }

  // Restore from backup (returns the backup data)
  async restoreBackup(filename: string): Promise<BackupData | null> {
    try {
      const filepath = path.join(this.backupDir, filename);
      const data = await fs.readFile(filepath, 'utf-8');
      const backupData: BackupData = JSON.parse(data);
      
      console.log('📥 Backup loaded successfully:', filename);
      return backupData;
    } catch (error) {
      console.error('❌ Backup restore failed:', error);
      return null;
    }
  }

  // Schedule automatic backups
  startAutoBackup(intervalHours: number = 24) {
    const intervalMs = intervalHours * 60 * 60 * 1000;
    
    // Create initial backup
    this.createBackup().catch(console.error);
    
    // Schedule recurring backups
    setInterval(async () => {
      try {
        await this.createBackup();
        console.log('🔄 Scheduled backup completed');
      } catch (error) {
        console.error('❌ Scheduled backup failed:', error);
      }
    }, intervalMs);
    
    console.log(`🕒 Auto-backup scheduled every ${intervalHours} hours`);
  }

  // Export backup data for external storage
  async exportBackup(filename: string): Promise<Buffer | null> {
    try {
      const filepath = path.join(this.backupDir, filename);
      const data = await fs.readFile(filepath);
      return data;
    } catch (error) {
      console.error('❌ Backup export failed:', error);
      return null;
    }
  }
}

// Singleton instance
export const backupSystem = new BackupSystem();

// Auto-start backups in production
if (process.env.NODE_ENV === 'production') {
  backupSystem.startAutoBackup(12); // Every 12 hours in production
} else {
  backupSystem.startAutoBackup(24); // Daily in development
} 