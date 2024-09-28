export class BaseResponse<T> {
  public success?: boolean;
  public errorCode?: string;
  public data?: T;
}

// 

