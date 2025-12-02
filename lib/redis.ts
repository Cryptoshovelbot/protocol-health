import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function getCached<T>(key: string): Promise<T | null> {
  try {
    const cached = await redis.get(key);
    return cached as T | null;
  } catch (error) {
    console.error('Cache get error:', error);
    return null;
  }
}

export async function setCached(key: string, value: any, ttl: number = 3600): Promise<void> {
  try {
    await redis.set(key, JSON.stringify(value), {
      ex: ttl,
    });
  } catch (error) {
    console.error('Cache set error:', error);
  }
}

export async function deleteCached(key: string): Promise<void> {
  try {
    await redis.del(key);
  } catch (error) {
    console.error('Cache delete error:', error);
  }
}

export default redis;
