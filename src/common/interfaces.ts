export interface IConfig {
  get: <T>(setting: string) => T;
  has: (setting: string) => boolean;
}

export interface OpenApiConfig {
  filePath: string;
  basePath: string;
  jsonPath: string;
  uiPath: string;
}

export interface PathParams {
  modelPath: string;
}

export interface ModelSize extends Object {
  size: number;
}

export interface ModelKey extends Object {
  key: string;
}
