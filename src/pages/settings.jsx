// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Button, Card, CardContent, CardHeader, CardTitle, Switch, useToast } from '@/components/ui';
// @ts-ignore;
import { Settings as SettingsIcon, Bell, Shield, Moon, Globe, HelpCircle, Info, LogOut, ArrowLeft, Smartphone, Database } from 'lucide-react';

// @ts-ignore;
import { TabBar } from '@/components/TabBar';
// @ts-ignore;

export default function SettingsPage(props) {
  const {
    $w,
    style
  } = props;
  const {
    toast
  } = useToast();
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    autoUpdate: true,
    location: true,
    cache: true
  });
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    loadSettings();
  }, []);
  const loadSettings = async () => {
    setIsLoading(true);
    try {
      // 模拟加载设置
      await new Promise(resolve => setTimeout(resolve, 500));
      const savedSettings = localStorage.getItem('app_settings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('加载设置失败:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleSettingChange = (key, value) => {
    const newSettings = {
      ...settings,
      [key]: value
    };
    setSettings(newSettings);
    localStorage.setItem('app_settings', JSON.stringify(newSettings));
  };
  const handleClearCache = async () => {
    setIsLoading(true);
    try {
      // 模拟清除缓存
      await new Promise(resolve => setTimeout(resolve, 1000));
      localStorage.clear();
      toast({
        title: "清除成功",
        description: "缓存已清除"
      });
    } catch (error) {
      console.error('清除缓存失败:', error);
      toast({
        title: "清除失败",
        description: "无法清除缓存",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleLogout = () => {
    toast({
      title: "已退出登录",
      description: "期待您的再次使用"
    });
    setTimeout(() => {
      $w.utils.navigateTo({
        pageId: 'login',
        params: {}
      });
    }, 1500);
  };
  const handlePageChange = pageId => {
    $w.utils.navigateTo({
      pageId,
      params: {}
    });
  };
  const SettingItem = ({
    icon: Icon,
    title,
    description,
    action
  }) => <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-gray-100 rounded-lg">
          <Icon className="w-5 h-5 text-gray-600" />
        </div>
        <div>
          <h3 className="font-medium text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
      {action}
    </div>;
  return <div style={style} className="min-h-screen bg-gray-50 pb-20">
      {/* 顶部导航 */}
      <div className="bg-white shadow-sm">
        <div className="max-w-md mx-auto px-6 py-4 flex items-center">
          <Button variant="ghost" size="sm" onClick={() => $w.utils.navigateBack()} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold text-gray-900 ml-2">设置</h1>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="max-w-md mx-auto px-6 py-6 space-y-6">
        {/* 通知设置 */}
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">通知设置</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <SettingItem icon={Bell} title="推送通知" description="接收应用推送通知" action={<Switch checked={settings.notifications} onCheckedChange={checked => handleSettingChange('notifications', checked)} />} />
            <SettingItem icon={Smartphone} title="声音提醒" description="新消息声音提醒" action={<Switch checked={settings.autoUpdate} onCheckedChange={checked => handleSettingChange('autoUpdate', checked)} />} />
          </CardContent>
        </Card>

        {/* 隐私设置 */}
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">隐私设置</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <SettingItem icon={Shield} title="位置信息" description="允许应用获取位置信息" action={<Switch checked={settings.location} onCheckedChange={checked => handleSettingChange('location', checked)} />} />
            <SettingItem icon={Database} title="数据缓存" description="允许应用缓存数据" action={<Switch checked={settings.cache} onCheckedChange={checked => handleSettingChange('cache', checked)} />} />
          </CardContent>
        </Card>

        {/* 显示设置 */}
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">显示设置</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <SettingItem icon={Moon} title="深色模式" description="启用深色主题" action={<Switch checked={settings.darkMode} onCheckedChange={checked => handleSettingChange('darkMode', checked)} />} />
            <SettingItem icon={Globe} title="语言设置" description="选择应用语言" action={<Button variant="ghost" size="sm" className="text-gray-500">
                简体中文
              </Button>} />
          </CardContent>
        </Card>

        {/* 其他设置 */}
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">其他</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <SettingItem icon={Database} title="清除缓存" description="清除应用缓存数据" action={<Button variant="ghost" size="sm" onClick={handleClearCache} disabled={isLoading} className="text-red-600">
                {isLoading ? '清除中...' : '清除'}
              </Button>} />
            <SettingItem icon={HelpCircle} title="帮助中心" description="查看使用帮助" action={<Button variant="ghost" size="sm" className="text-gray-500">
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </Button>} />
            <SettingItem icon={Info} title="关于我们" description="应用版本信息" action={<Button variant="ghost" size="sm" className="text-gray-500">
                v1.0.0
              </Button>} />
          </CardContent>
        </Card>

        {/* 退出登录 */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-4">
            <Button onClick={handleLogout} variant="outline" className="w-full h-12 text-red-600 border-red-300 hover:bg-red-50 flex items-center justify-center">
              <LogOut className="w-5 h-5 mr-2" />
              退出登录
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* 底部导航 */}
      <TabBar currentPage="settings" onPageChange={handlePageChange} />
    </div>;
}