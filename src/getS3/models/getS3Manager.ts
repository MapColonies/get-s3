// import { NodeHttpHandler } from '@aws-sdk/node-http-handler';
import { Logger } from '@map-colonies/js-logger';
import { IConfig } from 'config';
import { inject, injectable } from 'tsyringe';
import { S3Client } from '@aws-sdk/client-s3';
import PgBoss from 'pg-boss';
import { SERVICES } from '../../common/constants';
import { getKeyFromQueue, getSizeOfModel } from '../../common/functions/queue';
import { getDataS3 } from '../../common/functions/getFromS3';
import { postFromS3ToS3 } from '../../common/functions/postFromS3ToS3';

@injectable()
export class GetS3Manager {
  private readonly s3Client: S3Client = new S3Client({
    endpoint: this.config.get<string>('s3.endPoint'),
    forcePathStyle: this.config.get('s3.forcePathStyle'),
    credentials: {
      accessKeyId: this.config.get<string>('s3.awsAccessKeyId'),
      secretAccessKey: this.config.get('s3.awsSecretAccessKey'),
    },
    // requestHandler: new NodeHttpHandler({ connectionTimeout: 3000 }),
    maxAttempts: 3,
  });

  private readonly boss = new PgBoss(this.config.get<string>('postgres'));

  public constructor(@inject(SERVICES.LOGGER) private readonly logger: Logger, @inject(SERVICES.CONFIG) private readonly config: IConfig) {
    this.boss.on('error', (error) => console.error(error));
  }

  public async getListManager(model: string): Promise<string> {
    try {
      this.logger.info({
        msg: 'Getting the model',
        model: model,
        bucket: this.config.get<string>('s3.bucket'),
      });

      await this.boss.start();

      let currentNumOfFiles = 0;
      let expectedNumOfFiles = null;
      let isGotModelSize = false;

      // const interval = setInterval(function(){
      //   logger.info({
      //       msg: 'Posted file in s3',
      //       model: model,
      //       key: key,
      //     });

      // }, this.config.get<string>('timeInterval'))

      while (expectedNumOfFiles != currentNumOfFiles) {
        let key = await getKeyFromQueue(this.boss, model);
        while (key) {
          const data = await getDataS3(this.s3Client, key);
          await postFromS3ToS3(this.s3Client, key, data);

          currentNumOfFiles++;

          key = await getKeyFromQueue(this.boss, model);
        }
        if (!isGotModelSize) {
          expectedNumOfFiles = await getSizeOfModel(this.boss, model);
          if (expectedNumOfFiles) {
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            if (expectedNumOfFiles == -1) {
              return 'Problems with list';
            }
            isGotModelSize = true;
          }
        }
      }

      this.logger.info({
        msg: 'Successfully got the size of model in queue',
        model: model,
        bucket: this.config.get<string>('s3.bucket'),
        numOfFiles: currentNumOfFiles,
      });

      return 'Got Data';
    } catch (e) {
      this.logger.error({ msg: 'Failed to get the files from S3', e });
      throw e;
    }
  }
}
