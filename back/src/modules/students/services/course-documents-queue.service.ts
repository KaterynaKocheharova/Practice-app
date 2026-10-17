import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import type { Queue } from 'bullmq';

import { studentsConfig } from '../config';
import type { PurgeCourseDocumentJobData } from '../types';

const { COURSE_DOCUMENTS } = studentsConfig;

@Injectable()
export class CourseDocumentsQueueService {
  private readonly logger = new Logger(CourseDocumentsQueueService.name);

  constructor(
    @InjectQueue(COURSE_DOCUMENTS.QUEUE.NAME)
    private readonly courseDocumentsQueue: Queue<PurgeCourseDocumentJobData>,
  ) {}

  async enqueuePurgeCourseDocument(documentId: string): Promise<void> {
    try {
      await this.courseDocumentsQueue.add(
        COURSE_DOCUMENTS.JOBS.PURGE_COURSE_DOCUMENT,
        { documentId },
        COURSE_DOCUMENTS.JOB_OPTIONS,
      );
    } catch (error) {
      this.logger.error(
        `Failed to enqueue ${COURSE_DOCUMENTS.QUEUE.NAME}/${COURSE_DOCUMENTS.JOBS.PURGE_COURSE_DOCUMENT}`,
        (error as Error).stack,
      );
      throw error;
    }
  }
}
