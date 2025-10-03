// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Button, Avatar, AvatarFallback, AvatarImage, useToast } from '@/components/ui';
// @ts-ignore;
import { LogOut, User, Smartphone } from 'lucide-react';

export default function Login(props) {
  const {
    $w,
    style
  } = props;
  const {
    toast
  } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  // 检查当前用户登录状态
  useEffect(() => {
    const currentUser = $w.auth.currentUser;
    if (currentUser && currentUser.userId) {
      setIsLoggedIn(true);
      setUserInfo({
        nickName: currentUser.nickName || currentUser.name,
        avatarUrl: currentUser.avatarUrl,
        userId: currentUser.userId
      });
    }
  }, [$w.auth.currentUser]);

  // 微信授权登录
  const handleWechatLogin = async () => {
    setIsLoading(true);
    try {
      // 模拟微信授权登录过程
      // 在实际小程序中，这里会调用 wx.login() 和 wx.getUserProfile()
      await new Promise(resolve => setTimeout(resolve, 1500));

      // 模拟获取用户信息
      const mockUserInfo = {
        nickName: '微信用户',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
        userId: 'wechat_user_' + Date.now()
      };
      setUserInfo(mockUserInfo);
      setIsLoggedIn(true);
      toast({
        title: "登录成功",
        description: "欢迎回来，" + mockUserInfo.nickName + "！"
      });
    } catch (error) {
      toast({
        title: "登录失败",
        description: error.message || "请重试",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 退出登录
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserInfo(null);
    toast({
      title: "已退出登录",
      description: "期待您的再次使用"
    });
  };
  return <div style={style} className="min-h-screen bg-gradient-to-br from-green-50 to-white flex flex-col items-center justify-center p-6">
          <div className="w-full max-w-md space-y-8">
            {/* Logo 和标题 */}
            <div className="text-center space-y-4">
              <div className="mx-auto w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
                <Smartphone className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">欢迎使用</h1>
              <p className="text-gray-600">安全便捷的微信授权登录</p>
            </div>

            {/* 登录状态展示 */}
            {isLoggedIn ? <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
                <div className="text-center space-y-4">
                  <div className="mx-auto">
                    <Avatar className="w-24 h-24 mx-auto">
                      <AvatarImage src={userInfo?.avatarUrl} alt={userInfo?.nickName} />
                      <AvatarFallback className="w-24 h-24 text-2xl">
                        <User className="w-12 h-12" />
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900">{userInfo?.nickName}</h2>
                    <p className="text-gray-500 text-sm mt-1">ID: {userInfo?.userId}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Button onClick={handleLogout} variant="outline" className="w-full h-12 text-base border-gray-300 hover:bg-gray-50">
                    <LogOut className="w-5 h-5 mr-2" />
                    退出登录
                  </Button>
                </div>
              </div> : <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-xl font-semibold text-gray-900">微信授权登录</h2>
                  <p className="text-gray-600 text-sm">点击下方按钮，使用微信账号快速登录</p>
                </div>
                
                <div className="space-y-3">
                  <Button onClick={handleWechatLogin} disabled={isLoading} className="w-full h-12 bg-green-500 hover:bg-green-600 text-white text-base font-medium">
                    {isLoading ? <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        登录中...
                      </div> : <div className="flex items-center justify-center">
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.285 1.79-1.72 1.428-2.687 3.72-1.78 6.22.943 2.452 3.666 4.229 6.886 4.229.827 0 1.622-.12 2.367-.336a.722.722 0 0 1 .598.082l1.586.928a.272.272 0 0 0 .14.045c.134 0 .24-.11.24-.246 0-.06-.023-.12-.038-.177l-.326-1.234a.492.492 0 0 1 .178-.554C23.026 18.48 24 16.86 24 15.07c0-3.277-2.932-5.947-6.677-6.197a7.53 7.53 0 0 0-.385-.015zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z" />
                        </svg>
                        微信授权登录
                      </div>}
                  </Button>
                </div>
                
                <div className="text-center">
                  <p className="text-xs text-gray-500">
                    登录即表示同意
                    <a href="#" className="text-green-500 hover:text-green-600 mx-1">用户协议</a>
                    和
                    <a href="#" className="text-green-500 hover:text-green-600 mx-1">隐私政策</a>
                  </p>
                </div>
              </div>}

            {/* 底部说明 */}
            <div className="text-center space-y-2">
              <p className="text-xs text-gray-500">
                本应用使用微信安全授权，保护您的隐私安全
              </p>
              <div className="flex items-center justify-center space-x-2 text-xs text-gray-400">
                <span>安全认证</span>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>;
}