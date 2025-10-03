// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Button, Input, Avatar, AvatarFallback, AvatarImage, useToast } from '@/components/ui';
// @ts-ignore;
import { LogOut, User, Lock, Eye, EyeOff, ArrowLeft, Smartphone } from 'lucide-react';

export default function Login(props) {
  const {
    $w,
    style
  } = props;
  const {
    toast
  } = useToast();

  // 表单状态
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  // UI状态
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  // 检查当前用户登录状态
  useEffect(() => {
    const currentUser = $w.auth.currentUser;
    if (currentUser && currentUser.userId) {
      setIsLoggedIn(true);
      setUserInfo({
        username: currentUser.name || currentUser.nickName,
        avatarUrl: currentUser.avatarUrl,
        userId: currentUser.userId
      });
    }
  }, [$w.auth.currentUser]);

  // 处理输入变化
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 验证表单
  const validateForm = () => {
    if (!formData.username) {
      toast({
        title: "请输入用户名",
        description: "用户名不能为空",
        variant: "destructive"
      });
      return false;
    }
    if (!formData.password) {
      toast({
        title: "请输入密码",
        description: "密码不能为空",
        variant: "destructive"
      });
      return false;
    }
    if (formData.password.length < 6) {
      toast({
        title: "密码长度不足",
        description: "密码至少需要6位字符",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  // 处理登录
  const handleLogin = async () => {
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      // 调用云开发登录接口
      const tcb = await $w.cloud.getCloudInstance();
      const result = await tcb.callFunction({
        name: 'user-login',
        data: {
          username: formData.username,
          password: formData.password
        }
      });
      if (result.result && result.result.success) {
        const userData = result.result.data;
        setUserInfo({
          username: userData.username || userData.name,
          avatarUrl: userData.avatarUrl,
          userId: userData.userId || userData._id
        });
        setIsLoggedIn(true);
        toast({
          title: "登录成功",
          description: `欢迎回来，${userData.username || userData.name}！`
        });

        // 清空表单
        setFormData({
          username: '',
          password: ''
        });
      } else {
        throw new Error(result.result?.message || '登录失败');
      }
    } catch (error) {
      console.error('登录失败:', error);
      toast({
        title: "登录失败",
        description: error.message || "用户名或密码错误，请重试",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 处理退出登录
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserInfo(null);
    toast({
      title: "已退出登录",
      description: "期待您的再次使用"
    });
  };

  // 处理键盘事件
  const handleKeyPress = e => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };
  return <div style={style} className="min-h-screen bg-gradient-to-br from-green-50 to-white flex flex-col">
      {/* 顶部导航 */}
      <div className="bg-white shadow-sm">
        <div className="max-w-md mx-auto px-6 py-4 flex items-center">
          <Button variant="ghost" size="sm" onClick={() => $w.utils.navigateBack()} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold text-gray-900 ml-2">用户登录</h1>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="flex-1 max-w-md mx-auto w-full px-6 py-8">
        {/* Logo 和标题 */}
        <div className="text-center space-y-4 mb-8">
          <div className="mx-auto w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
            <Smartphone className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">欢迎登录</h2>
          <p className="text-gray-600">请输入您的账号信息</p>
        </div>

        {/* 登录状态展示 */}
        {isLoggedIn ? <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
            <div className="text-center space-y-4">
              <div className="mx-auto">
                <Avatar className="w-24 h-24 mx-auto border-4 border-green-100">
                  <AvatarImage src={userInfo?.avatarUrl} alt={userInfo?.username} />
                  <AvatarFallback className="w-24 h-24 text-2xl bg-green-100 text-green-600">
                    <User className="w-12 h-12" />
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-semibold text-gray-900">{userInfo?.username}</h3>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <p className="text-sm text-gray-500">已登录</p>
                </div>
                <p className="text-gray-400 text-xs">ID: {userInfo?.userId}</p>
              </div>
            </div>
            
            <div className="space-y-3 pt-4">
              <Button onClick={handleLogout} variant="outline" className="w-full h-12 text-base border-gray-300 hover:bg-gray-50 hover:text-gray-700 transition-colors">
                <LogOut className="w-5 h-5 mr-2" />
                退出登录
              </Button>
            </div>
          </div> : <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
            {/* 登录表单 */}
            <div className="space-y-4">
              {/* 用户名输入 */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">用户名</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input type="text" placeholder="请输入用户名" value={formData.username} onChange={e => handleInputChange('username', e.target.value)} onKeyPress={handleKeyPress} className="pl-10 h-12 border-gray-300 focus:border-green-500 focus:ring-green-500" />
                </div>
              </div>

              {/* 密码输入 */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">密码</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input type={showPassword ? 'text' : 'password'} placeholder="请输入密码" value={formData.password} onChange={e => handleInputChange('password', e.target.value)} onKeyPress={handleKeyPress} className="pl-10 pr-10 h-12 border-gray-300 focus:border-green-500 focus:ring-green-500" />
                  <Button type="button" variant="ghost" size="sm" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1">
                    {showPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                  </Button>
                </div>
              </div>
            </div>

            {/* 登录按钮 */}
            <Button onClick={handleLogin} disabled={isLoading} className="w-full h-12 bg-green-500 hover:bg-green-600 text-white text-base font-medium shadow-md hover:shadow-lg transition-all">
              {isLoading ? <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  登录中...
                </div> : '登录'}
            </Button>

            {/* 其他选项 */}
            <div className="flex items-center justify-between text-sm">
              <button className="text-green-500 hover:text-green-600">忘记密码？</button>
              <button onClick={() => $w.utils.navigateTo({
            pageId: 'register',
            params: {}
          })} className="text-green-500 hover:text-green-600">
                注册新账号
              </button>
            </div>
          </div>}

        {/* 底部说明 */}
        <div className="text-center mt-8 space-y-2">
          <p className="text-xs text-gray-500">
            登录即表示同意
            <a href="#" className="text-green-500 hover:text-green-600 mx-1">用户协议</a>
            和
            <a href="#" className="text-green-500 hover:text-green-600 mx-1">隐私政策</a>
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