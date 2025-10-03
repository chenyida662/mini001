// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Avatar, AvatarFallback, AvatarImage, useToast } from '@/components/ui';
// @ts-ignore;
import { User, Camera, Edit, LogOut, Settings, Mail, Phone, Calendar, MapPin, Heart, Share2 } from 'lucide-react';

// @ts-ignore;
import { TabBar } from '@/components/TabBar';
// @ts-ignore;

export default function Profile(props) {
  const {
    $w,
    style
  } = props;
  const {
    toast
  } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({
    nickname: '',
    email: '',
    phone: '',
    bio: '',
    location: '',
    birthday: '',
    avatar: ''
  });
  const [editForm, setEditForm] = useState({});
  useEffect(() => {
    loadUserInfo();
  }, []);
  const loadUserInfo = async () => {
    setIsLoading(true);
    try {
      // 获取当前用户信息
      const currentUser = $w.auth.currentUser;
      if (currentUser && currentUser.userId) {
        // 模拟加载用户详细信息
        await new Promise(resolve => setTimeout(resolve, 800));
        setUserInfo({
          nickname: currentUser.nickName || currentUser.name || '微信用户',
          email: 'user@example.com',
          phone: currentUser.userId ? `1${currentUser.userId.substring(0, 10)}` : '13800138000',
          bio: '热爱生活，享受每一天的美好时光。',
          location: '北京市朝阳区',
          birthday: '1990-01-01',
          avatar: currentUser.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=face'
        });
      }
    } catch (error) {
      console.error('加载用户信息失败:', error);
      toast({
        title: "加载失败",
        description: "无法加载用户信息",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleEdit = () => {
    setEditForm({
      ...userInfo
    });
    setIsEditing(true);
  };
  const handleSave = async () => {
    setIsLoading(true);
    try {
      // 模拟保存用户信息
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUserInfo({
        ...editForm
      });
      setIsEditing(false);
      toast({
        title: "保存成功",
        description: "个人信息已更新"
      });
    } catch (error) {
      console.error('保存失败:', error);
      toast({
        title: "保存失败",
        description: "无法保存用户信息",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({});
  };
  const handleAvatarUpload = () => {
    // 模拟头像上传
    const mockAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=face';
    if (isEditing) {
      setEditForm(prev => ({
        ...prev,
        avatar: mockAvatar
      }));
    } else {
      setUserInfo(prev => ({
        ...prev,
        avatar: mockAvatar
      }));
    }
    toast({
      title: "头像上传成功",
      description: "头像已更新"
    });
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
  const InfoItem = ({
    icon: Icon,
    label,
    value,
    editable = true
  }) => <div className="flex items-center space-x-3 py-3 border-b border-gray-100 last:border-b-0">
      <Icon className="w-5 h-5 text-gray-400" />
      <div className="flex-1">
        <p className="text-sm text-gray-600">{label}</p>
        {isEditing && editable ? <Input type="text" value={editForm[label.toLowerCase()] || ''} onChange={e => setEditForm(prev => ({
        ...prev,
        [label.toLowerCase()]: e.target.value
      }))} className="mt-1 h-8" /> : <p className="text-gray-900 font-medium">{value}</p>}
      </div>
    </div>;
  return <div style={style} className="min-h-screen bg-gray-50 pb-20">
      {/* 顶部导航 */}
      <div className="bg-white shadow-sm">
        <div className="max-w-md mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">个人中心</h1>
          <Button variant="ghost" size="sm" onClick={() => $w.utils.navigateTo({
          pageId: 'settings',
          params: {}
        })}>
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="max-w-md mx-auto px-6 py-6 space-y-6">
        {/* 用户基本信息 */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="w-24 h-24 border-4 border-green-100">
                  <AvatarImage src={isEditing ? editForm.avatar : userInfo.avatar} alt="用户头像" />
                  <AvatarFallback className="w-24 h-24 text-2xl bg-green-100 text-green-600">
                    <User className="w-12 h-12" />
                  </AvatarFallback>
                </Avatar>
                <Button onClick={handleAvatarUpload} className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-green-500 hover:bg-green-600 text-white p-0">
                  <Camera className="w-4 h-4" />
                </Button>
              </div>
              <div className="text-center">
                {isEditing ? <Input type="text" value={editForm.nickname || ''} onChange={e => setEditForm(prev => ({
                ...prev,
                nickname: e.target.value
              }))} className="text-xl font-bold text-center mb-2" /> : <h2 className="text-2xl font-bold text-gray-900">{userInfo.nickname}</h2>}
                <p className="text-gray-600">ID: {$w.auth.currentUser?.userId || 'user_123'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 详细信息 */}
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center justify-between">
              个人信息
              {!isEditing && <Button variant="ghost" size="sm" onClick={handleEdit}>
                  <Edit className="w-4 h-4 mr-1" />
                  编辑
                </Button>}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? <div className="p-4 space-y-4">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div> : <div>
                <InfoItem icon={Mail} label="邮箱" value={userInfo.email} />
                <InfoItem icon={Phone} label="电话" value={userInfo.phone} />
                <InfoItem icon={MapPin} label="地区" value={userInfo.location} />
                <InfoItem icon={Calendar} label="生日" value={userInfo.birthday} />
                <div className="flex items-start space-x-3 py-3">
                  <User className="w-5 h-5 text-gray-400 mt-1" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">个人简介</p>
                    {isEditing ? <textarea value={editForm.bio || ''} onChange={e => setEditForm(prev => ({
                  ...prev,
                  bio: e.target.value
                }))} className="mt-1 w-full p-2 border border-gray-300 rounded-md resize-none" rows={3} /> : <p className="text-gray-900">{userInfo.bio}</p>}
                  </div>
                </div>
              </div>}
          </CardContent>
        </Card>

        {/* 操作按钮 */}
        {isEditing ? <div className="flex space-x-3">
            <Button onClick={handleCancel} variant="outline" className="flex-1 h-12">
              取消
            </Button>
            <Button onClick={handleSave} disabled={isLoading} className="flex-1 h-12 bg-green-500 hover:bg-green-600">
              {isLoading ? '保存中...' : '保存'}
            </Button>
          </div> : <div className="space-y-3">
            <Button variant="outline" className="w-full h-12 flex items-center justify-center">
              <Heart className="w-5 h-5 mr-2" />
              我的收藏
            </Button>
            <Button variant="outline" className="w-full h-12 flex items-center justify-center">
              <Share2 className="w-5 h-5 mr-2" />
              分享名片
            </Button>
            <Button onClick={handleLogout} variant="outline" className="w-full h-12 text-red-600 border-red-300 hover:bg-red-50 flex items-center justify-center">
              <LogOut className="w-5 h-5 mr-2" />
              退出登录
            </Button>
          </div>}
      </div>

      {/* 底部导航 */}
      <TabBar currentPage="profile" onPageChange={handlePageChange} />
    </div>;
}