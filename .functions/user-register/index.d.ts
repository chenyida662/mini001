
    interface UserInfo {
      _id?: string;
      phone: string;
      username: string;
      status: string;
      createdAt?: string;
      [key: string]: any;
    }

    type EventAction = 
      | 'register'
      | 'sendVerificationCode'
      | 'verifyCode';

    interface RegisterData {
      phone: string;
      verificationCode: string;
      username: string;
      password: string;
      [key: string]: any;
    }

    interface SendVerificationCodeData {
      phone: string;
    }

    interface VerifyCodeData {
      phone: string;
      code: string;
    }

    interface CloudFunctionEvent {
      action: EventAction;
      data: 
        | RegisterData
        | SendVerificationCodeData
        | VerifyCodeData;
    }

    interface CloudFunctionResult {
      success: boolean;
      userInfo?: UserInfo | null;
      message: string;
      code?: string;
    }

    export declare function main(event: CloudFunctionEvent, context: any): Promise<CloudFunctionResult>;
  