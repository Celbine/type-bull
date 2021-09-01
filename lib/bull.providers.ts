import { Provider } from '@nestjs/common';
import * as Bull from "bull";

export function createBullProviders(
    queues?: Bull.Queue[],
): Provider[] {
  return (queues || []).map((queue) => ({
    provide: queue.name,
    useFactory: () => queue,
  }));
}
