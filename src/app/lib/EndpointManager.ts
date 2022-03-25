import WebServer from '../WebServer';

export type IEndpoint = {
  url: string;
  method: string;
  description: string;
};

export default class EndpointManager {
  private static endpoints: IEndpoint[] = [];

  static registerEndpoint(url: string, method: string, description: string) {
    EndpointManager.endpoints.push({
      url,
      method,
      description,
    });
    EndpointManager.endpoints.sort((a: IEndpoint, b: IEndpoint) => {
      return a.url.localeCompare(b.url);
    });
  }

  static getEndpoints(): IEndpoint[] {
    return EndpointManager.endpoints;
  }
}
