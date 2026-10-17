import { Processor } from '@nestjs/bullmq';
import type { Job } from 'bullmq';

import { LoggedWorkerHost } from 'src/queue';
import { studentsConfig } from '../config';
import { CourseDocumentDeletionService } from '../services/course-document-deletion.service';
import type { PurgeCourseDocumentJobData } from '../types';

const { COURSE_DOCUMENTS } = studentsConfig;

@Processor(COURSE_DOCUMENTS.QUEUE.NAME)
export class CourseDocumentsProcessor extends LoggedWorkerHost {
  constructor(
    private readonly courseDocumentDeletionService: CourseDocumentDeletionService,
  ) {
    super();
  }

  async process(job: Job<PurgeCourseDocumentJobData>): Promise<void> {
    if (job.name !== COURSE_DOCUMENTS.JOBS.PURGE_COURSE_DOCUMENT) {
      throw new Error(`Unsupported course documents job: ${job.name}`);
    }

    await this.courseDocumentDeletionService.purgeCourseDocument(
      job.data.documentId,
    );
  }
}
