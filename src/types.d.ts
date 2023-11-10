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
      [key: string]: unknown;
    };
  }

  type CourseTaskAdditionalParams = {
    task?: {
      body?: {
        question?: string;
      };
      meta?: {
        asJSON?: boolean;
      };
    };
    answer?: {
      meta?: {
        asJSON?: boolean;
      };
    };
  };

  type UnknowRecord = {
    title: string;
    url: string;
    info: string;
    date: string;
  };
}

type Person = {
  imie: string;
  nazwisko: string;
  wiek: number;
  o_mnie: string;
  ulubiona_postac_z_kapitana_bomby: string;
  ulubiony_serial: string;
  ulubiony_film: string;
  ulubiony_kolor: string;
};
