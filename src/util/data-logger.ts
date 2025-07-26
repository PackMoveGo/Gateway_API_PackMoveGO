import fs from 'fs';
import path from 'path';

interface LogEntry {
  timestamp: string;
  endpoint: string;
  method: string;
  userAgent: string;
  ip: string;
  requestData?: any;
  responseData?: any;
  statusCode: number;
  responseTime: number;
  mobile: boolean;
  origin?: string;
}

class DataLogger {
  private logFile: string;
  private consoleOutput: boolean;

  constructor() {
    this.logFile = path.join(__dirname, '../../logs/data-flow.log');
    this.consoleOutput = process.env.NODE_ENV === 'development' || process.env.DEBUG === 'true';
    
    // Ensure logs directory exists
    const logsDir = path.dirname(this.logFile);
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }
  }

  logRequest(req: any, res: any, responseData?: any, responseTime?: number) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      endpoint: req.path,
      method: req.method,
      userAgent: req.headers['user-agent'] || 'Unknown',
      ip: req.ip || req.socket.remoteAddress || 'Unknown',
      requestData: this.extractRequestData(req),
      responseData: responseData,
      statusCode: res.statusCode,
      responseTime: responseTime || 0,
      mobile: this.isMobile(req.headers['user-agent']),
      origin: req.headers.origin || req.headers['origin']
    };

    this.writeLog(entry);
    this.consoleLog(entry);
  }

  private extractRequestData(req: any) {
    return {
      query: req.query,
      body: req.body,
      headers: {
        'user-agent': req.headers['user-agent'],
        'origin': req.headers.origin,
        'referer': req.headers.referer,
        'accept': req.headers.accept,
        'content-type': req.headers['content-type']
      },
      params: req.params
    };
  }

  private isMobile(userAgent: string): boolean {
    if (!userAgent) return false;
    return userAgent.includes('Mobile') || 
           userAgent.includes('iPhone') || 
           userAgent.includes('Android') || 
           userAgent.includes('iPad');
  }

  private writeLog(entry: LogEntry) {
    const logLine = JSON.stringify(entry, null, 2) + '\n---\n';
    fs.appendFileSync(this.logFile, logLine);
  }

  private consoleLog(entry: LogEntry) {
    if (!this.consoleOutput) return;

    console.log('\n📊 === DATA FLOW LOG ===');
    console.log(`🕒 Timestamp: ${entry.timestamp}`);
    console.log(`🌐 Endpoint: ${entry.method} ${entry.endpoint}`);
    console.log(`📱 Mobile: ${entry.mobile ? 'Yes' : 'No'}`);
    console.log(`👤 User-Agent: ${entry.userAgent.substring(0, 80)}`);
    console.log(`🌍 Origin: ${entry.origin || 'None'}`);
    console.log(`📡 IP: ${entry.ip}`);
    console.log(`⏱️ Response Time: ${entry.responseTime}ms`);
    console.log(`📊 Status Code: ${entry.statusCode}`);

    if (entry.requestData) {
      console.log('\n📥 REQUEST DATA:');
      console.log(JSON.stringify(entry.requestData, null, 2));
    }

    if (entry.responseData) {
      console.log('\n📤 RESPONSE DATA:');
      if (typeof entry.responseData === 'object') {
        console.log(JSON.stringify(entry.responseData, null, 2));
      } else {
        console.log(entry.responseData);
      }
    }

    console.log('================================\n');
  }

  logDataLoad(endpoint: string, data: any) {
    const entry = {
      timestamp: new Date().toISOString(),
      type: 'DATA_LOAD',
      endpoint,
      data: data,
      dataSize: JSON.stringify(data).length
    };

    console.log('\n📦 === DATA LOAD LOG ===');
    console.log(`🕒 Timestamp: ${entry.timestamp}`);
    console.log(`📂 Endpoint: ${entry.endpoint}`);
    console.log(`📏 Data Size: ${entry.dataSize} bytes`);
    console.log(`📊 Data Type: ${typeof data}`);
    
    if (Array.isArray(data)) {
      console.log(`📋 Array Length: ${data.length}`);
      if (data.length > 0) {
        console.log(`📝 First Item:`, data[0]);
      }
    } else if (typeof data === 'object') {
      console.log(`🔑 Object Keys:`, Object.keys(data));
      console.log(`📝 Sample Data:`, data);
    }
    
    console.log('================================\n');
  }

  logError(endpoint: string, error: any, req?: any) {
    const entry = {
      timestamp: new Date().toISOString(),
      type: 'ERROR',
      endpoint,
      error: error.message || error,
      stack: error.stack,
      request: req ? {
        method: req.method,
        path: req.path,
        userAgent: req.headers['user-agent'],
        ip: req.ip
      } : null
    };

    console.log('\n❌ === ERROR LOG ===');
    console.log(`🕒 Timestamp: ${entry.timestamp}`);
    console.log(`🌐 Endpoint: ${entry.endpoint}`);
    console.log(`💥 Error: ${entry.error}`);
    if (entry.request) {
      console.log(`📡 Request: ${entry.request.method} ${entry.request.path}`);
      console.log(`👤 User-Agent: ${entry.request.userAgent}`);
      console.log(`🌍 IP: ${entry.request.ip}`);
    }
    console.log('================================\n');
  }
}

export const dataLogger = new DataLogger(); 