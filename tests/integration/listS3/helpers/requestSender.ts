import * as supertest from 'supertest';

export class GetS3RequestSender {
  public constructor(private readonly app: Express.Application) {}

  public async getResource(): Promise<supertest.Response> {
    return supertest.agent(this.app).get('/getS3').set('Content-Type', 'application/json');
  }

  public async getList(): Promise<supertest.Response> {
    return supertest.agent(this.app).post('/getS3').set('Content-Type', 'application/json');
  }
}
