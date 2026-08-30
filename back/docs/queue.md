# Queue Architecture

The application uses `@nestjs/bullmq` with a global Redis connection and feature-level queues.

## Adding a New Queue

1. Add the queue name to `QUEUE_NAMES` in `src/queue/constants/queue-names.constant.ts`.

2. In the owning feature module, register the queue:

```ts
BullModule.registerQueue({ name: QUEUE_NAMES.YOUR_QUEUE })
```

3. Add feature-level job name constants, for example:

```ts
export const YOUR_JOB_NAMES = {
  DO_WORK: 'do-work',
} as const;
```

4. Add a feature queue service that injects the queue with `@InjectQueue(QUEUE_NAMES.YOUR_QUEUE)` and exposes enqueue methods.

5. Add a feature processor with `@Processor(QUEUE_NAMES.YOUR_QUEUE)` and extend `WorkerHost`.

6. Export only the feature queue service from the feature module unless another module needs lower-level queue internals.

Use the existing mail queue implementation as the reference pattern:

- `src/modules/mail/mail.module.ts`
- `src/modules/mail/services/mail-queue.service.ts`
- `src/modules/mail/processors/mail.processor.ts`
- `src/modules/mail/constants/mail-job-names.constant.ts`
- `src/modules/mail/types/mail-job.ts`
