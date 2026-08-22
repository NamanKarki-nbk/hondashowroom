// Basic in-memory rate limiter using Map
// Note: In a production distributed environment (e.g., Vercel Serverless/Edge), 
// you would typically use Upstash Redis or Vercel KV for this.

type RateLimitRecord = {
  count: number;
  resetTime: number;
};

const limits = new Map<string, RateLimitRecord>();

export function rateLimit(ip: string, limit: number = 10, windowMs: number = 60000) {
  const now = Date.now();
  const record = limits.get(ip);

  if (!record || now > record.resetTime) {
    // New record or expired window
    limits.set(ip, {
      count: 1,
      resetTime: now + windowMs
    });
    return { success: true, remaining: limit - 1 };
  }

  if (record.count >= limit) {
    return { success: false, remaining: 0 };
  }

  record.count++;
  return { success: true, remaining: limit - record.count };
}

// Optional: clean up expired limits periodically to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  limits.forEach((value, key) => {
    if (now > value.resetTime) {
      limits.delete(key);
    }
  });
}, 5 * 60 * 1000); // Clean up every 5 mins
