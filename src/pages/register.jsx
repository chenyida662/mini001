// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { Button, Input, Avatar, AvatarFallback, AvatarImage, useToast } from '@/components/ui';
// @ts-ignore;
import { User, Camera, ArrowLeft, Eye, EyeOff, Smartphone, Lock, Mail, UserCircle } from 'lucide-react';

export default function Register(props) {
  const {
    $w,
    style
  } = props;
  const {
    toast
  } = useToast();

  // 表单状态
  const [formData, setFormData] = useState({
    phone: '',
    code: '',
    password: '',
    confirmPassword: '',
    nickname: '',
    avatar: ''
  });

  // UI状态
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [currentStep, setCurrentStep] = useState(1); // 1: 基本信息, 2: 用户信息

  // 处理输入变化
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 获取验证码 - 集成真实短信接口
  const handleGetCode = async () => {
    if (!formData.phone) {
      toast({
        title: "请输入手机号",
        description: "手机号不能为空",
        variant: "destructive"
      });
      return;
    }
    if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
      toast({
        title: "手机号格式错误",
        description: "请输入正确的手机号码",
        variant: "destructive"
      });
      return;
    }
    setIsLoading(true);
    try {
      // 生成随机验证码
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

      // 调用云开发发送短信
      const tcb = await $w.cloud.getCloudInstance();
      const result = await tcb.callFunction({
        name: 'sendSms',
        data: {
          phone: formData.phone,
          code: verificationCode,
          templateId: 'SMS_123456789' // 替换为实际的短信模板ID
        }
      });
      if (result.result && result.result.success) {
        // 开始倒计时
        setCountdown(60);
        const timer = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        toast({
          title: "验证码已发送",
          description: `验证码已发送至 ${formData.phone.substring(0, 3)}****${formData.phone.substring(7)}，请查收短信`
        });

        // 将验证码存储到本地，用于后续验证（实际项目中应该存储到服务器）
        localStorage.setItem(`verify_code_${formData.phone}`, verificationCode);
        localStorage.setItem(`verify_code_time_${formData.phone}`, Date.now().toString());
      } else {
        throw new Error(result.result?.message || '短信发送失败');
      }
    } catch (error) {
      console.error('短信发送失败:', error);

      // 如果云函数不存在，模拟发送过程用于演示
      if (error.message && error.message.includes('Function not found')) {
        console.log('使用模拟短信发送功能');
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        // 模拟发送延迟
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 开始倒计时
        setCountdown(60);
        const timer = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        toast({
          title: "验证码已发送（演示模式）",
          description: `模拟验证码: ${verificationCode}，请输入此验证码`
        });

        // 存储验证码到本地
        localStorage.setItem(`verify_code_${formData.phone}`, verificationCode);
        localStorage.setItem(`verify_code_time_${formData.phone}`, Date.now().toString());
      } else {
        toast({
          title: "发送失败",
          description: error.message || "短信发送失败，请重试",
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 验证验证码
  const verifyCode = inputCode => {
    const storedCode = localStorage.getItem(`verify_code_${formData.phone}`);
    const storedTime = localStorage.getItem(`verify_code_time_${formData.phone}`);
    if (!storedCode || !storedTime) {
      return false;
    }

    // 验证码有效期5分钟
    const isExpired = Date.now() - parseInt(storedTime) > 5 * 60 * 1000;
    if (isExpired) {
      localStorage.removeItem(`verify_code_${formData.phone}`);
      localStorage.removeItem(`verify_code_time_${formData.phone}`);
      return false;
    }
    return storedCode === inputCode;
  };

  // 验证第一步表单
  const validateStep1 = () => {
    if (!formData.phone) {
      toast({
        title: "请输入手机号",
        description: "手机号不能为空",
        variant: "destructive"
      });
      return false;
    }
    if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
      toast({
        title: "手机号格式错误",
        description: "请输入正确的手机号码",
        variant: "destructive"
      });
      return false;
    }
    if (!formData.code) {
      toast({
        title: "请输入验证码",
        description: "验证码不能为空",
        variant: "destructive"
      });
      return false;
    }
    if (!verifyCode(formData.code)) {
      toast({
        title: "验证码错误",
        description: "请输入正确的验证码",
        variant: "destructive"
      });
      return false;
    }
    if (!formData.password) {
      toast({
        title: "请设置密码",
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
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "密码不一致",
        description: "两次输入的密码不相同",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  // 验证第二步表单
  const validateStep2 = () => {
    if (!formData.nickname) {
      toast({
        title: "请输入昵称",
        description: "昵称不能为空",
        variant: "destructive"
      });
      return false;
    }
    if (formData.nickname.length < 2 || formData.nickname.length > 20) {
      toast({
        title: "昵称长度错误",
        description: "昵称长度应在2-20个字符之间",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  // 下一步
  const handleNextStep = () => {
    if (validateStep1()) {
      setCurrentStep(2);
    }
  };

  // 上一步
  const handlePrevStep = () => {
    setCurrentStep(1);
  };

  // 处理头像上传
  const handleAvatarUpload = () => {
    // 模拟头像上传
    const mockAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=face';
    setFormData(prev => ({
      ...prev,
      avatar: mockAvatar
    }));
    toast({
      title: "头像上传成功",
      description: "头像已更新"
    });
  };

  // 提交注册
  const handleSubmit = async () => {
    if (!validateStep2()) return;
    setIsLoading(true);
    try {
      // 调用云开发注册接口
      const tcb = await $w.cloud.getCloudInstance();
      const result = await tcb.callFunction({
        name: 'userRegister',
        data: {
          phone: formData.phone,
          password: formData.password,
          nickname: formData.nickname,
          avatar: formData.avatar
        }
      });
      if (result.result && result.result.success) {
        toast({
          title: "注册成功",
          description: "欢迎加入我们！"
        });

        // 清除验证码缓存
        localStorage.removeItem(`verify_code_${formData.phone}`);
        localStorage.removeItem(`verify_code_time_${formData.phone}`);

        // 注册成功后跳转到登录页
        setTimeout(() => {
          $w.utils.navigateTo({
            pageId: 'login',
            params: {}
          });
        }, 1500);
      } else {
        throw new Error(result.result?.message || '注册失败');
      }
    } catch (error) {
      console.error('注册失败:', error);

      // 如果云函数不存在，模拟注册过程用于演示
      if (error.message && error.message.includes('Function not found')) {
        console.log('使用模拟注册功能');
        await new Promise(resolve => setTimeout(resolve, 2000));
        toast({
          title: "注册成功（演示模式）",
          description: "欢迎加入我们！"
        });

        // 清除验证码缓存
        localStorage.removeItem(`verify_code_${formData.phone}`);
        localStorage.removeItem(`verify_code_time_${formData.phone}`);

        // 注册成功后跳转到登录页
        setTimeout(() => {
          $w.utils.navigateTo({
            pageId: 'login',
            params: {}
          });
        }, 1500);
      } else {
        toast({
          title: "注册失败",
          description: error.message || "注册失败，请重试",
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };
  return <div style={style} className="min-h-screen bg-gradient-to-br from-green-50 to-white flex flex-col">
      {/* 顶部导航 */}
      <div className="bg-white shadow-sm">
        <div className="max-w-md mx-auto px-6 py-4 flex items-center">
          <Button variant="ghost" size="sm" onClick={() => $w.utils.navigateBack()} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold text-gray-900 ml-2">用户注册</h1>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="flex-1 max-w-md mx-auto w-full px-6 py-8">
        {/* 步骤指示器 */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep >= 1 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
              1
            </div>
            <div className={`w-16 h-1 ${currentStep >= 2 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep >= 2 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
              2
            </div>
          </div>
        </div>

        {/* 第一步：基本信息 */}
        {currentStep === 1 && <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">创建账号</h2>
              <p className="text-gray-600">请填写基本信息完成注册</p>
            </div>

            <div className="space-y-4">
              {/* 手机号输入 */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">手机号</label>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input type="tel" placeholder="请输入手机号" value={formData.phone} onChange={e => handleInputChange('phone', e.target.value)} className="pl-10 h-12 border-gray-300 focus:border-green-500 focus:ring-green-500" />
                </div>
              </div>

              {/* 验证码输入 */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">验证码</label>
                <div className="flex space-x-3">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input type="text" placeholder="请输入验证码" value={formData.code} onChange={e => handleInputChange('code', e.target.value)} className="pl-10 h-12 border-gray-300 focus:border-green-500 focus:ring-green-500" />
                  </div>
                  <Button onClick={handleGetCode} disabled={isLoading || countdown > 0} className="h-12 px-6 bg-green-500 hover:bg-green-600 text-white whitespace-nowrap">
                    {countdown > 0 ? `${countdown}s` : '获取验证码'}
                  </Button>
                </div>
              </div>

              {/* 密码输入 */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">设置密码</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input type={showPassword ? 'text' : 'password'} placeholder="请设置密码（至少6位）" value={formData.password} onChange={e => handleInputChange('password', e.target.value)} className="pl-10 pr-10 h-12 border-gray-300 focus:border-green-500 focus:ring-green-500" />
                  <Button type="button" variant="ghost" size="sm" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1">
                    {showPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                  </Button>
                </div>
              </div>

              {/* 确认密码输入 */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">确认密码</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input type={showConfirmPassword ? 'text' : 'password'} placeholder="请再次输入密码" value={formData.confirmPassword} onChange={e => handleInputChange('confirmPassword', e.target.value)} className="pl-10 pr-10 h-12 border-gray-300 focus:border-green-500 focus:ring-green-500" />
                  <Button type="button" variant="ghost" size="sm" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1">
                    {showConfirmPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                  </Button>
                </div>
              </div>
            </div>

            <Button onClick={handleNextStep} className="w-full h-12 bg-green-500 hover:bg-green-600 text-white text-base font-medium">
              下一步
            </Button>
          </div>}

        {/* 第二步：用户信息 */}
        {currentStep === 2 && <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">完善信息</h2>
              <p className="text-gray-600">请完善您的个人信息</p>
            </div>

            <div className="space-y-6">
              {/* 头像上传 */}
              <div className="text-center space-y-4">
                <label className="text-sm font-medium text-gray-700">头像</label>
                <div className="relative inline-block">
                  <Avatar className="w-24 h-24 border-4 border-green-100">
                    <AvatarImage src={formData.avatar} alt="用户头像" />
                    <AvatarFallback className="w-24 h-24 text-2xl bg-green-100 text-green-600">
                      <UserCircle className="w-12 h-12" />
                    </AvatarFallback>
                  </Avatar>
                  <Button onClick={handleAvatarUpload} className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-green-500 hover:bg-green-600 text-white p-0">
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500">点击相机图标上传头像</p>
              </div>

              {/* 昵称输入 */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">昵称</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input type="text" placeholder="请输入昵称（2-20个字符）" value={formData.nickname} onChange={e => handleInputChange('nickname', e.target.value)} className="pl-10 h-12 border-gray-300 focus:border-green-500 focus:ring-green-500" />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button onClick={handlePrevStep} variant="outline" className="w-full h-12 border-gray-300 hover:bg-gray-50">
                上一步
              </Button>
              <Button onClick={handleSubmit} disabled={isLoading} className="w-full h-12 bg-green-500 hover:bg-green-600 text-white text-base font-medium">
                {isLoading ? <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    注册中...
                  </div> : '完成注册'}
              </Button>
            </div>
          </div>}

        {/* 底部链接 */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-600">
            已有账号？
            <button onClick={() => $w.utils.navigateTo({
            pageId: 'login',
            params: {}
          })} className="text-green-500 hover:text-green-600 ml-1 font-medium">
              立即登录
            </button>
          </p>
        </div>
      </div>
    </div>;
}