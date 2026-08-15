import { addFavoriteMover, removeFavoriteMover } from "@/lib/api/favorites";

export class StaleFavoriteRequestError extends Error {
  constructor() {
    super("찜 요청이 실행되기 전에 세션이 변경되어 폐기되었습니다.");
    this.name = "StaleFavoriteRequestError";
  }
}

interface FavoriteMoverRequest<AuthScope extends string> {
  moverId: string;
  nextIsFavorite: boolean;
  authScope: AuthScope;
  getCurrentAuthScope: () => AuthScope;
}

const favoriteRequestQueues = new Map<string, Promise<unknown>>();
const favoriteOptimisticQueues = new Map<string, Promise<unknown>>();
const latestFavoriteRequestIds = new Map<string, number>();

let favoriteRequestId = 0;

function getFavoriteQueueKey(authScope: string, moverId: string): string {
  return `${authScope}:${moverId}`;
}

function runSerialized<T>(
  queues: Map<string, Promise<unknown>>,
  key: string,
  task: () => Promise<T>,
): Promise<T> {
  const previous = queues.get(key) ?? Promise.resolve();
  const run = previous.catch(() => undefined).then(task);
  const tail = run.then(
    () => undefined,
    () => undefined,
  );

  queues.set(key, tail);

  void tail.finally(() => {
    if (queues.get(key) === tail) {
      queues.delete(key);
    }
  });

  return run;
}

export function enqueueFavoriteRequest<AuthScope extends string>(
  request: FavoriteMoverRequest<AuthScope>,
) {
  const { moverId, nextIsFavorite, authScope, getCurrentAuthScope } = request;

  const queueKey = getFavoriteQueueKey(authScope, moverId);

  return runSerialized(favoriteRequestQueues, queueKey, async () => {
    if (getCurrentAuthScope() !== authScope) {
      throw new StaleFavoriteRequestError();
    }

    return nextIsFavorite ? addFavoriteMover(moverId) : removeFavoriteMover(moverId);
  });
}

export function runFavoriteOptimisticQueue<T>(
  authScope: string,
  moverId: string,
  task: () => Promise<T>,
): Promise<T> {
  return runSerialized(favoriteOptimisticQueues, getFavoriteQueueKey(authScope, moverId), task);
}

export function createFavoriteRequestId(): number {
  favoriteRequestId += 1;
  return favoriteRequestId;
}

export function setLatestFavoriteRequestId(
  authScope: string,
  moverId: string,
  requestId: number,
): void {
  latestFavoriteRequestIds.set(getFavoriteQueueKey(authScope, moverId), requestId);
}

export function isLatestFavoriteRequest(
  authScope: string,
  moverId: string,
  requestId: number,
): boolean {
  return latestFavoriteRequestIds.get(getFavoriteQueueKey(authScope, moverId)) === requestId;
}

export function clearLatestFavoriteRequestId(authScope: string, moverId: string): void {
  latestFavoriteRequestIds.delete(getFavoriteQueueKey(authScope, moverId));
}
