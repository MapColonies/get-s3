import jsLogger from '@map-colonies/js-logger';
import { trace } from '@opentelemetry/api';
import httpStatusCodes from 'http-status-codes';

import { getApp } from '../../../src/app';
import { SERVICES } from '../../../src/common/constants';
import { GetS3RequestSender } from './helpers/requestSender';

describe('getS3', function () {
  let requestSender: GetS3RequestSender;
  beforeEach(function () {
    const app = getApp({
      override: [
        { token: SERVICES.LOGGER, provider: { useValue: jsLogger({ enabled: false }) } },
        { token: SERVICES.TRACER, provider: { useValue: trace.getTracer('testTracer') } },
      ],
      useChild: true,
    });
    requestSender = new GetS3RequestSender(app);
  });

  describe('Happy Path', function () {
    it('should return 200 status code and the resource', async function () {
      const response = await requestSender.getResource();

      expect(response.status).toBe(httpStatusCodes.OK);
    });
    it('should return 200 status code and create the resource', async function () {
      const response = await requestSender.getList();

      expect(response.status).toBe(httpStatusCodes.CREATED);
    });
  });
  describe('Bad Path', function () {
    // All requests with status code of 400
  });
  describe('Sad Path', function () {
    // All requests with status code 4XX-5XX
  });
});
