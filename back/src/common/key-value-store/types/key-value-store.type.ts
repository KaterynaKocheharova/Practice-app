/**
 * A key-value store with per-key expiry. Callers depend on this interface, not
 * on Redis, so the backing store (Redis, Memcached, in-memory for tests, ...)
 * can be swapped by changing the provider for KEY_VALUE_STORE only.
 */
export interface IKeyValueStore {
  set(key: string, value: string, ttlMs: number): Promise<void>;

  get(key: string): Promise<string | undefined>;

  getDelete(key: string): Promise<string | undefined>;
}
