
    interface UserInfo {
      _id?: string;
      username: string;
      [key: string]: any;
    }

    interface CloudFunctionEvent {
      username: string;
      password: string;
    }

    interface CloudFunctionResult {
      success: boolean;
      userInfo: UserInfo | null;
      message: string;
    }

    export declare function main(event: CloudFunctionEvent, context: any): Promise<CloudFunctionResult>;
  