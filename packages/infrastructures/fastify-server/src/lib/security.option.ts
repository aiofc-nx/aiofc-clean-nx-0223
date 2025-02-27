/**
 * Referrer Policy 的可能值
 */
enum ReferrerPolicy {
  NO_REFERRER = 'no-referrer',
  NO_REFERRER_WHEN_DOWNGRADE = 'no-referrer-when-downgrade',
  ORIGIN = 'origin',
  ORIGIN_WHEN_CROSS_ORIGIN = 'origin-when-cross-origin',
  SAME_ORIGIN = 'same-origin',
  STRICT_ORIGIN = 'strict-origin',
  STRICT_ORIGIN_WHEN_CROSS_ORIGIN = 'strict-origin-when-cross-origin',
  UNSAFE_URL = 'unsafe-url',
}

// type ContentSecurityPolicyValue = string | string[];

/**
 * 默认的 CSP 配置
 * @description Content Security Policy 配置，用于防止 XSS 攻击
 */
const defaultCSPDirectives = {
  defaultSrc: ["'self'"],
  styleSrc: ["'self'", "'unsafe-inline'"],
  imgSrc: ["'self'", 'data:', 'https:'],
  scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
  connectSrc: ["'self'", 'https:', 'wss:'],
  fontSrc: ["'self'", 'data:', 'https:'],
  objectSrc: ["'none'"],
  mediaSrc: ["'self'"],
  frameSrc: ["'self'"],
} as const;

export function getHelmetConfig() {
  return {
    crossOriginResourcePolicy: true,
    contentSecurityPolicy:
      process.env['NODE_ENV'] === 'development' ? defaultCSPDirectives : false,
    referrerPolicy: {
      policy: ReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN,
    },
    hsts: {
      maxAge: 31536000, // 1 year
      includeSubDomains: true, // Optional: Include subdomains
      preload: true, // Optional: Indicate to browsers to preload HSTS
    },
    frameguard: {
      action: 'deny',
    },
  };
}
