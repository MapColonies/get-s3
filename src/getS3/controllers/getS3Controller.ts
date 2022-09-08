import { HttpError } from '@map-colonies/error-express-handler';
import { Logger } from '@map-colonies/js-logger';
import { Meter } from '@map-colonies/telemetry';
import { BoundCounter } from '@opentelemetry/api-metrics';
import { RequestHandler } from 'express';
import httpStatus from 'http-status-codes';
import { injectable, inject } from 'tsyringe';
import { SERVICES } from '../../common/constants';
import { PathNotExists } from '../../common/errors';
import { PathParams } from '../../common/interfaces';
import { GetS3Manager } from '../models/getS3Manager';

type GetListHandler = RequestHandler<PathParams, string>;

@injectable()
export class GetS3Controller {
  private readonly createdListCounter: BoundCounter;

  public constructor(
    @inject(SERVICES.LOGGER) private readonly logger: Logger,
    @inject(GetS3Manager) private readonly manager: GetS3Manager,
    @inject(SERVICES.METER) private readonly meter: Meter
  ) {
    this.createdListCounter = meter.createCounter('created_resource');
  }

  public getList: GetListHandler = async (req, res, next) => {
    try {
      const { modelPath } = req.params;
      const response = await this.manager.getListManager(modelPath);
      this.createdListCounter.add(1);
      return res.status(httpStatus.CREATED).json(response);
    } catch (error) {
      if (error instanceof PathNotExists) {
        (error as HttpError).status = httpStatus.BAD_REQUEST;
      }
      return next(error);
    }
  };
}
