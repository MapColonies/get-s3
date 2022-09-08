import { Router } from 'express';
import { FactoryFunction } from 'tsyringe';
import { GetS3Controller } from '../controllers/getS3Controller';

const getS3RouterFactory: FactoryFunction<Router> = (dependencyContainer) => {
  const router = Router();
  const controller = dependencyContainer.resolve(GetS3Controller);

  router.get('/:modelPath', controller.getList);

  return router;
};

export const GET_S3_ROUTER_SYMBOL = Symbol('getS3RouterFactory');

export { getS3RouterFactory };
