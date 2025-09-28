# Praktyki Bezpieczeństwa ECM Digital

## Wprowadzenie

ECM Digital implementuje kompleksowe praktyki bezpieczeństwa na każdym etapie rozwoju i wdrażania projektów. Nasze podejście opiera się na zasadzie "Security by Design", co oznacza, że bezpieczeństwo jest uwzględniane od samego początku procesu projektowego.

## Secure Development Lifecycle (SDL)

### 1. Planowanie Bezpieczeństwa

#### Threat Modeling
- **STRIDE Analysis** - Identyfikacja zagrożeń (Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege)
- **Attack Tree Analysis** - Mapowanie możliwych ścieżek ataków
- **Risk Assessment** - Ocena prawdopodobieństwa i wpływu zagrożeń
- **Security Requirements** - Definicja wymagań bezpieczeństwa

#### Wybór Technologii
- **Secure Frameworks** - Wykorzystanie sprawdzonych, bezpiecznych frameworków
- **Updated Dependencies** - Regularne aktualizacje zależności
- **Security Libraries** - Implementacja dedykowanych bibliotek bezpieczeństwa
- **Cryptographic Standards** - Stosowanie aktualnych standardów kryptograficznych

### 2. Bezpieczne Kodowanie

#### Input Validation
```javascript
// Comprehensive input validation
const validator = require('validator');
const DOMPurify = require('dompurify');

class InputValidator {
  static validateEmail(email) {
    if (!email || typeof email !== 'string') {
      throw new Error('Email is required and must be a string');
    }
    
    if (!validator.isEmail(email)) {
      throw new Error('Invalid email format');
    }
    
    if (email.length > 254) {
      throw new Error('Email too long');
    }
    
    return validator.normalizeEmail(email);
  }
  
  static validatePassword(password) {
    if (!password || typeof password !== 'string') {
      throw new Error('Password is required');
    }
    
    // Minimum 8 characters, at least one uppercase, lowercase, number, and special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    
    if (!passwordRegex.test(password)) {
      throw new Error('Password must be at least 8 characters with uppercase, lowercase, number, and special character');
    }
    
    return password;
  }
  
  static sanitizeHtml(input) {
    if (!input || typeof input !== 'string') {
      return '';
    }
    
    return DOMPurify.sanitize(input, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
      ALLOWED_ATTR: []
    });
  }
  
  static validateNumeric(value, min = null, max = null) {
    const num = parseFloat(value);
    
    if (isNaN(num)) {
      throw new Error('Value must be a number');
    }
    
    if (min !== null && num < min) {
      throw new Error(`Value must be at least ${min}`);
    }
    
    if (max !== null && num > max) {
      throw new Error(`Value must be at most ${max}`);
    }
    
    return num;
  }
}
```

#### SQL Injection Prevention
```javascript
// Secure database queries
const mysql = require('mysql2/promise');

class SecureDatabase {
  constructor(config) {
    this.pool = mysql.createPool({
      ...config,
      ssl: {
        rejectUnauthorized: true
      },
      acquireTimeout: 60000,
      timeout: 60000,
      reconnect: true
    });
  }
  
  async executeQuery(query, params = []) {
    const connection = await this.pool.getConnection();
    
    try {
      // Always use prepared statements
      const [results] = await connection.execute(query, params);
      return results;
    } catch (error) {
      logger.error('Database query error:', {
        error: error.message,
        query: query.substring(0, 100), // Log only first 100 chars
        timestamp: new Date().toISOString()
      });
      throw error;
    } finally {
      connection.release();
    }
  }
  
  async getUserById(userId) {
    const query = 'SELECT id, email, first_name, last_name, created_at FROM users WHERE id = ? AND active = 1';
    const results = await this.executeQuery(query, [userId]);
    return results[0] || null;
  }
  
  async createUser(userData) {
    const { email, passwordHash, firstName, lastName } = userData;
    
    const query = `
      INSERT INTO users (email, password_hash, first_name, last_name, created_at) 
      VALUES (?, ?, ?, ?, NOW())
    `;
    
    const result = await this.executeQuery(query, [email, passwordHash, firstName, lastName]);
    return result.insertId;
  }
  
  async updateUserLastLogin(userId) {
    const query = 'UPDATE users SET last_login = NOW() WHERE id = ?';
    await this.executeQuery(query, [userId]);
  }
}
```

#### Authentication & Authorization
```javascript
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const rateLimit = require('express-rate-limit');

class AuthenticationService {
  constructor() {
    this.saltRounds = 12;
    this.jwtSecret = process.env.JWT_SECRET;
    this.jwtExpiry = '24h';
  }
  
  async hashPassword(password) {
    return await bcrypt.hash(password, this.saltRounds);
  }
  
  async verifyPassword(password, hash) {
    return await bcrypt.compare(password, hash);
  }
  
  generateToken(payload) {
    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.jwtExpiry,
      issuer: 'ecm-digital',
      audience: 'ecm-digital-users'
    });
  }
  
  verifyToken(token) {
    try {
      return jwt.verify(token, this.jwtSecret, {
        issuer: 'ecm-digital',
        audience: 'ecm-digital-users'
      });
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }
  
  // Rate limiting for login attempts
  createLoginLimiter() {
    return rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 5, // 5 attempts per window
      message: 'Too many login attempts, please try again later',
      standardHeaders: true,
      legacyHeaders: false,
      handler: (req, res) => {
        logger.warn('Rate limit exceeded for login', {
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          timestamp: new Date().toISOString()
        });
        
        res.status(429).json({
          error: 'Too many login attempts',
          retryAfter: Math.round(req.rateLimit.resetTime / 1000)
        });
      }
    });
  }
}

// Middleware for authentication
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  try {
    const authService = new AuthenticationService();
    const decoded = authService.verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
}

// Role-based authorization
function requireRole(roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    next();
  };
}
```

### 3. Testowanie Bezpieczeństwa

#### Static Application Security Testing (SAST)
```javascript
// ESLint security rules configuration
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:security/recommended'
  ],
  plugins: ['security'],
  rules: {
    'security/detect-object-injection': 'error',
    'security/detect-non-literal-regexp': 'error',
    'security/detect-unsafe-regex': 'error',
    'security/detect-buffer-noassert': 'error',
    'security/detect-child-process': 'error',
    'security/detect-disable-mustache-escape': 'error',
    'security/detect-eval-with-expression': 'error',
    'security/detect-no-csrf-before-method-override': 'error',
    'security/detect-non-literal-fs-filename': 'error',
    'security/detect-non-literal-require': 'error',
    'security/detect-possible-timing-attacks': 'error',
    'security/detect-pseudoRandomBytes': 'error'
  }
};
```

#### Dynamic Application Security Testing (DAST)
```javascript
// Automated security testing with Jest
const request = require('supertest');
const app = require('../app');

describe('Security Tests', () => {
  
  test('Should prevent SQL injection in login', async () => {
    const maliciousPayload = {
      email: "admin@test.com' OR '1'='1",
      password: "password"
    };
    
    const response = await request(app)
      .post('/api/auth/login')
      .send(maliciousPayload);
    
    expect(response.status).toBe(401);
    expect(response.body.error).toBeDefined();
  });
  
  test('Should prevent XSS in user input', async () => {
    const maliciousPayload = {
      name: '<script>alert("XSS")</script>',
      email: 'test@example.com'
    };
    
    const response = await request(app)
      .post('/api/users')
      .send(maliciousPayload)
      .set('Authorization', 'Bearer valid-token');
    
    expect(response.status).toBe(400);
    expect(response.body.error).toContain('Invalid characters');
  });
  
  test('Should enforce rate limiting', async () => {
    const requests = [];
    
    // Make 6 requests (limit is 5)
    for (let i = 0; i < 6; i++) {
      requests.push(
        request(app)
          .post('/api/auth/login')
          .send({ email: 'test@example.com', password: 'wrong' })
      );
    }
    
    const responses = await Promise.all(requests);
    const lastResponse = responses[responses.length - 1];
    
    expect(lastResponse.status).toBe(429);
  });
  
  test('Should require authentication for protected routes', async () => {
    const response = await request(app)
      .get('/api/users/profile');
    
    expect(response.status).toBe(401);
  });
  
  test('Should validate JWT tokens properly', async () => {
    const response = await request(app)
      .get('/api/users/profile')
      .set('Authorization', 'Bearer invalid-token');
    
    expect(response.status).toBe(403);
  });
});
```

### 4. Bezpieczne Wdrożenie

#### Infrastructure as Code Security
```yaml
# Secure Docker configuration
version: '3.8'
services:
  app:
    build: .
    user: "1001:1001"  # Non-root user
    read_only: true    # Read-only filesystem
    tmpfs:
      - /tmp
      - /var/tmp
    cap_drop:
      - ALL
    cap_add:
      - NET_BIND_SERVICE
    security_opt:
      - no-new-privileges:true
    environment:
      - NODE_ENV=production
    networks:
      - app-network
    depends_on:
      - db
    restart: unless-stopped
    
  db:
    image: postgres:14-alpine
    user: "999:999"
    read_only: true
    tmpfs:
      - /tmp
      - /var/run/postgresql
    environment:
      - POSTGRES_DB_FILE=/run/secrets/postgres_db
      - POSTGRES_USER_FILE=/run/secrets/postgres_user
      - POSTGRES_PASSWORD_FILE=/run/secrets/postgres_password
    secrets:
      - postgres_db
      - postgres_user
      - postgres_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
    internal: true

volumes:
  postgres_data:
    driver: local

secrets:
  postgres_db:
    external: true
  postgres_user:
    external: true
  postgres_password:
    external: true
```

#### Kubernetes Security
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: secure-app
  labels:
    app: secure-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: secure-app
  template:
    metadata:
      labels:
        app: secure-app
    spec:
      serviceAccountName: secure-app-sa
      securityContext:
        runAsNonRoot: true
        runAsUser: 1001
        runAsGroup: 1001
        fsGroup: 1001
        seccompProfile:
          type: RuntimeDefault
      containers:
      - name: app
        image: ecm-digital/secure-app:latest
        ports:
        - containerPort: 3000
        securityContext:
          allowPrivilegeEscalation: false
          readOnlyRootFilesystem: true
          capabilities:
            drop:
            - ALL
            add:
            - NET_BIND_SERVICE
        resources:
          limits:
            memory: "512Mi"
            cpu: "500m"
          requests:
            memory: "256Mi"
            cpu: "250m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
        env:
        - name: NODE_ENV
          value: "production"
        - name: DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: password
        volumeMounts:
        - name: tmp
          mountPath: /tmp
        - name: cache
          mountPath: /app/cache
      volumes:
      - name: tmp
        emptyDir: {}
      - name: cache
        emptyDir: {}
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: secure-app-sa
automountServiceAccountToken: false
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: secure-app-netpol
spec:
  podSelector:
    matchLabels:
      app: secure-app
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: ingress-nginx
    ports:
    - protocol: TCP
      port: 3000
  egress:
  - to:
    - namespaceSelector:
        matchLabels:
          name: database
    ports:
    - protocol: TCP
      port: 5432
```

## Monitoring i Incident Response

### Security Monitoring

#### Centralized Logging
```javascript
const winston = require('winston');
const { ElasticsearchTransport } = require('winston-elasticsearch');

// Security-focused logger configuration
const securityLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
    winston.format.metadata()
  ),
  defaultMeta: { 
    service: 'ecm-digital-security',
    environment: process.env.NODE_ENV 
  },
  transports: [
    new winston.transports.File({ 
      filename: 'logs/security.log',
      level: 'warn'
    }),
    new ElasticsearchTransport({
      level: 'info',
      clientOpts: {
        node: process.env.ELASTICSEARCH_URL,
        auth: {
          username: process.env.ELASTICSEARCH_USER,
          password: process.env.ELASTICSEARCH_PASS
        }
      },
      index: 'security-logs'
    })
  ]
});

class SecurityEventLogger {
  static logAuthenticationAttempt(success, details) {
    const event = {
      event_type: 'authentication_attempt',
      success: success,
      user_id: details.userId,
      ip_address: details.ip,
      user_agent: details.userAgent,
      timestamp: new Date().toISOString()
    };
    
    if (success) {
      securityLogger.info('Authentication successful', event);
    } else {
      securityLogger.warn('Authentication failed', {
        ...event,
        failure_reason: details.reason
      });
    }
  }
  
  static logSuspiciousActivity(activity, details) {
    securityLogger.warn('Suspicious activity detected', {
      event_type: 'suspicious_activity',
      activity_type: activity,
      details: details,
      ip_address: details.ip,
      user_agent: details.userAgent,
      timestamp: new Date().toISOString()
    });
  }
  
  static logSecurityViolation(violation, details) {
    securityLogger.error('Security violation', {
      event_type: 'security_violation',
      violation_type: violation,
      severity: details.severity || 'high',
      details: details,
      timestamp: new Date().toISOString()
    });
  }
  
  static logDataAccess(userId, resource, action) {
    securityLogger.info('Data access', {
      event_type: 'data_access',
      user_id: userId,
      resource: resource,
      action: action,
      timestamp: new Date().toISOString()
    });
  }
}
```

#### Real-time Threat Detection
```javascript
const EventEmitter = require('events');

class ThreatDetectionEngine extends EventEmitter {
  constructor() {
    super();
    this.suspiciousIPs = new Map();
    this.failedAttempts = new Map();
    this.rateLimits = new Map();
  }
  
  analyzeRequest(req) {
    const ip = req.ip;
    const userAgent = req.get('User-Agent');
    const path = req.path;
    
    // Check for suspicious patterns
    this.checkSQLInjection(req);
    this.checkXSSAttempts(req);
    this.checkPathTraversal(req);
    this.checkBruteForce(ip);
    this.checkAbnormalBehavior(ip, userAgent, path);
  }
  
  checkSQLInjection(req) {
    const sqlPatterns = [
      /(\%27)|(\')|(\-\-)|(\%23)|(#)/i,
      /((\%3D)|(=))[^\n]*((\%27)|(\')|(\-\-)|(\%3B)|(;))/i,
      /\w*((\%27)|(\'))((\%6F)|o|(\%4F))((\%72)|r|(\%52))/i,
      /((\%27)|(\'))union/i
    ];
    
    const checkString = JSON.stringify(req.body) + req.url;
    
    for (const pattern of sqlPatterns) {
      if (pattern.test(checkString)) {
        this.emit('threat', {
          type: 'sql_injection',
          severity: 'high',
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          payload: checkString.substring(0, 200)
        });
        break;
      }
    }
  }
  
  checkXSSAttempts(req) {
    const xssPatterns = [
      /<script[^>]*>.*?<\/script>/gi,
      /<iframe[^>]*>.*?<\/iframe>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi
    ];
    
    const checkString = JSON.stringify(req.body) + req.url;
    
    for (const pattern of xssPatterns) {
      if (pattern.test(checkString)) {
        this.emit('threat', {
          type: 'xss_attempt',
          severity: 'medium',
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          payload: checkString.substring(0, 200)
        });
        break;
      }
    }
  }
  
  checkPathTraversal(req) {
    const traversalPatterns = [
      /\.\.\//g,
      /\.\.\\/g,
      /%2e%2e%2f/gi,
      /%2e%2e%5c/gi
    ];
    
    for (const pattern of traversalPatterns) {
      if (pattern.test(req.url)) {
        this.emit('threat', {
          type: 'path_traversal',
          severity: 'high',
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          path: req.url
        });
        break;
      }
    }
  }
  
  checkBruteForce(ip) {
    const attempts = this.failedAttempts.get(ip) || 0;
    
    if (attempts > 10) {
      this.emit('threat', {
        type: 'brute_force',
        severity: 'high',
        ip: ip,
        attempts: attempts
      });
    }
  }
  
  recordFailedAttempt(ip) {
    const attempts = this.failedAttempts.get(ip) || 0;
    this.failedAttempts.set(ip, attempts + 1);
    
    // Clean up old entries
    setTimeout(() => {
      this.failedAttempts.delete(ip);
    }, 15 * 60 * 1000); // 15 minutes
  }
}

// Initialize threat detection
const threatDetector = new ThreatDetectionEngine();

threatDetector.on('threat', (threat) => {
  SecurityEventLogger.logSecurityViolation(threat.type, threat);
  
  // Auto-block high severity threats
  if (threat.severity === 'high') {
    blockIP(threat.ip, threat.type);
  }
});
```

### Incident Response Procedures

#### Automated Response System
```javascript
class IncidentResponseSystem {
  constructor() {
    this.activeIncidents = new Map();
    this.responseTeam = [
      'security@ecm-digital.com',
      'admin@ecm-digital.com'
    ];
  }
  
  async handleSecurityIncident(incident) {
    const incidentId = this.generateIncidentId();
    
    // Log incident
    SecurityEventLogger.logSecurityViolation('security_incident', {
      incident_id: incidentId,
      ...incident
    });
    
    // Classify incident
    const classification = this.classifyIncident(incident);
    
    // Execute response based on classification
    switch (classification.severity) {
      case 'critical':
        await this.handleCriticalIncident(incidentId, incident);
        break;
      case 'high':
        await this.handleHighSeverityIncident(incidentId, incident);
        break;
      case 'medium':
        await this.handleMediumSeverityIncident(incidentId, incident);
        break;
      default:
        await this.handleLowSeverityIncident(incidentId, incident);
    }
    
    this.activeIncidents.set(incidentId, {
      ...incident,
      classification,
      status: 'active',
      created_at: new Date().toISOString()
    });
    
    return incidentId;
  }
  
  async handleCriticalIncident(incidentId, incident) {
    // Immediate containment
    if (incident.ip) {
      await this.blockIP(incident.ip, 'critical_incident');
    }
    
    // Notify security team immediately
    await this.notifySecurityTeam(incidentId, incident, 'CRITICAL');
    
    // Activate incident response team
    await this.activateIncidentResponse(incidentId);
    
    // Consider system shutdown if necessary
    if (incident.type === 'data_breach' || incident.type === 'system_compromise') {
      await this.considerSystemShutdown(incident);
    }
  }
  
  async handleHighSeverityIncident(incidentId, incident) {
    // Block suspicious IP
    if (incident.ip) {
      await this.blockIP(incident.ip, 'high_severity_incident');
    }
    
    // Notify security team
    await this.notifySecurityTeam(incidentId, incident, 'HIGH');
    
    // Increase monitoring
    await this.increaseMonitoring(incident);
  }
  
  async notifySecurityTeam(incidentId, incident, severity) {
    const message = {
      subject: `[${severity}] Security Incident ${incidentId}`,
      body: `
        Security incident detected:
        
        Incident ID: ${incidentId}
        Type: ${incident.type}
        Severity: ${severity}
        Time: ${new Date().toISOString()}
        
        Details:
        ${JSON.stringify(incident, null, 2)}
        
        Immediate action may be required.
      `,
      recipients: this.responseTeam
    };
    
    // Send notifications (email, Slack, SMS for critical)
    await this.sendNotification(message);
    
    if (severity === 'CRITICAL') {
      await this.sendSMSAlert(incidentId, incident);
    }
  }
  
  classifyIncident(incident) {
    const rules = {
      'data_breach': { severity: 'critical', priority: 1 },
      'system_compromise': { severity: 'critical', priority: 1 },
      'sql_injection': { severity: 'high', priority: 2 },
      'brute_force': { severity: 'high', priority: 2 },
      'xss_attempt': { severity: 'medium', priority: 3 },
      'path_traversal': { severity: 'high', priority: 2 },
      'suspicious_activity': { severity: 'medium', priority: 3 }
    };
    
    return rules[incident.type] || { severity: 'low', priority: 4 };
  }
  
  generateIncidentId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `INC-${timestamp}-${random}`.toUpperCase();
  }
}
```

## Backup i Disaster Recovery

### Automated Backup System
```bash
#!/bin/bash

# Comprehensive backup script
set -euo pipefail

# Configuration
BACKUP_DIR="/backups"
S3_BUCKET="ecm-digital-backups"
RETENTION_DAYS=30
ENCRYPTION_KEY_FILE="/etc/backup/encryption.key"

# Logging
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a /var/log/backup.log
}

error_exit() {
    log "ERROR: $1"
    exit 1
}

# Create timestamped backup directory
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_PATH="$BACKUP_DIR/$TIMESTAMP"
mkdir -p "$BACKUP_PATH"

log "Starting backup process - $TIMESTAMP"

# Database backup
log "Backing up databases..."
pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME | gzip > "$BACKUP_PATH/database.sql.gz" || error_exit "Database backup failed"

# Application files backup
log "Backing up application files..."
tar -czf "$BACKUP_PATH/application.tar.gz" \
    --exclude='node_modules' \
    --exclude='*.log' \
    --exclude='tmp/*' \
    /var/www/html || error_exit "Application backup failed"

# Configuration backup
log "Backing up configurations..."
tar -czf "$BACKUP_PATH/config.tar.gz" \
    /etc/nginx \
    /etc/ssl \
    /etc/systemd/system/app.service || error_exit "Configuration backup failed"

# Encrypt backups
log "Encrypting backup files..."
for file in "$BACKUP_PATH"/*.{gz,tar.gz}; do
    if [[ -f "$file" ]]; then
        gpg --cipher-algo AES256 --compress-algo 1 --s2k-mode 3 \
            --s2k-digest-algo SHA512 --s2k-count 65536 \
            --symmetric --output "$file.gpg" \
            --batch --passphrase-file "$ENCRYPTION_KEY_FILE" "$file" || error_exit "Encryption failed for $file"
        rm "$file"  # Remove unencrypted file
    fi
done

# Upload to S3
log "Uploading to S3..."
aws s3 sync "$BACKUP_PATH" "s3://$S3_BUCKET/backups/$TIMESTAMP/" \
    --storage-class STANDARD_IA \
    --server-side-encryption AES256 || error_exit "S3 upload failed"

# Verify backup integrity
log "Verifying backup integrity..."
aws s3 ls "s3://$S3_BUCKET/backups/$TIMESTAMP/" --recursive | grep -q "database.sql.gz.gpg" || error_exit "Database backup verification failed"
aws s3 ls "s3://$S3_BUCKET/backups/$TIMESTAMP/" --recursive | grep -q "application.tar.gz.gpg" || error_exit "Application backup verification failed"

# Cleanup old local backups
log "Cleaning up old local backups..."
find "$BACKUP_DIR" -type d -name "20*" -mtime +7 -exec rm -rf {} + 2>/dev/null || true

# Cleanup old S3 backups
log "Cleaning up old S3 backups..."
aws s3 ls "s3://$S3_BUCKET/backups/" | while read -r line; do
    backup_date=$(echo "$line" | awk '{print $2}' | cut -d'_' -f1)
    if [[ -n "$backup_date" ]]; then
        backup_timestamp=$(date -d "$backup_date" +%s 2>/dev/null || echo 0)
        current_timestamp=$(date +%s)
        age_days=$(( (current_timestamp - backup_timestamp) / 86400 ))
        
        if [[ $age_days -gt $RETENTION_DAYS ]]; then
            folder_name=$(echo "$line" | awk '{print $2}')
            log "Deleting old backup: $folder_name"
            aws s3 rm "s3://$S3_BUCKET/backups/$folder_name" --recursive
        fi
    fi
done

# Health check
log "Performing backup health check..."
BACKUP_SIZE=$(du -sh "$BACKUP_PATH" | cut -f1)
log "Backup completed successfully. Size: $BACKUP_SIZE"

# Send notification
curl -X POST "$SLACK_WEBHOOK_URL" \
    -H 'Content-type: application/json' \
    --data "{\"text\":\"✅ Backup completed successfully - $TIMESTAMP (Size: $BACKUP_SIZE)\"}" || log "Failed to send Slack notification"

log "Backup process completed successfully"
```

### Disaster Recovery Plan
```yaml
# Disaster Recovery Playbook
disaster_recovery:
  rto: 4 hours  # Recovery Time Objective
  rpo: 1 hour   # Recovery Point Objective
  
  scenarios:
    - name: "Complete Infrastructure Failure"
      severity: "critical"
      procedures:
        - assess_damage
        - activate_dr_team
        - provision_new_infrastructure
        - restore_from_backup
        - validate_functionality
        - redirect_traffic
        - monitor_performance
        
    - name: "Database Corruption"
      severity: "high"
      procedures:
        - isolate_corrupted_database
        - provision_new_database_instance
        - restore_latest_backup
        - validate_data_integrity
        - update_application_config
        - resume_operations
        
    - name: "Security Breach"
      severity: "critical"
      procedures:
        - isolate_compromised_systems
        - preserve_evidence
        - assess_breach_scope
        - notify_stakeholders
        - restore_clean_backup
        - implement_additional_security
        - monitor_for_reoccurrence

  team_contacts:
    - role: "DR Coordinator"
      primary: "+48 XXX XXX XXX"
      secondary: "dr-coordinator@ecm-digital.com"
    - role: "Technical Lead"
      primary: "+48 XXX XXX XXX"
      secondary: "tech-lead@ecm-digital.com"
    - role: "Security Officer"
      primary: "+48 XXX XXX XXX"
      secondary: "security@ecm-digital.com"

  infrastructure:
    primary_region: "eu-central-1"
    dr_region: "eu-west-1"
    backup_locations:
      - "s3://ecm-digital-backups-primary"
      - "s3://ecm-digital-backups-dr"
    
  testing_schedule:
    full_dr_test: "quarterly"
    backup_restore_test: "monthly"
    communication_test: "monthly"
```

---

*Ostatnia aktualizacja: Styczeń 2025*
*Wersja dokumentu: 1.0*