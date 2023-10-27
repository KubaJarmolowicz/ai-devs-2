declare namespace AIDevsAPI {
  type BaseResponse = {
    code: number;
    msg: string;
  };

  namespace FetchToken {
    type Request = {
      apikey: string;
    };
    type Response = BaseResponse & {
      token?: string;
    };
  }

  namespace FetchTask {
    type Response = BaseResponse & {
      [key as string]: unknown;
    };
  }
}
