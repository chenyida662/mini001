// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
// @ts-ignore;
import { Home as HomeIcon, User, Settings, BarChart3, Plus, TrendingUp, Users, MessageSquare, Star } from 'lucide-react';

// @ts-ignore;
import { TabBar } from '@/components/TabBar';
// @ts-ignore;

export default function HomePage(props) {
  const {
    $w,
    style
  } = props;
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPosts: 0,
    totalMessages: 0,
    totalReviews: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    loadDashboardData();
  }, []);
  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // 模拟加载仪表板数据
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStats({
        totalUsers: 1234,
        totalPosts: 567,
        totalMessages: 890,
        totalReviews: 234
      });
      setRecentActivities([{
        id: 1,
        type: 'user',
        title: '新用户注册',
        description: '张三刚刚注册了账号',
        time: '2分钟前'
      }, {
        id: 2,
        type: 'post',
        title: '新内容发布',
        description: '李四发布了一篇文章',
        time: '5分钟前'
      }, {
        id: 3,
        type: 'message',
        title: '新消息',
        description: '王五给您发送了一条消息',
        time: '10分钟前'
      }]);
    } catch (error) {
      console.error('加载数据失败:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const handlePageChange = pageId => {
    $w.utils.navigateTo({
      pageId,
      params: {}
    });
  };
  const StatCard = ({
    icon: Icon,
    title,
    value,
    color
  }) => <Card className="bg-white shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
          <div className={`p-3 rounded-full ${color}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>;
  const ActivityItem = ({
    icon: Icon,
    title,
    description,
    time,
    color
  }) => <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
      <div className={`p-2 rounded-full ${color} mt-1`}>
        <Icon className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1">
        <h4 className="font-medium text-gray-900">{title}</h4>
        <p className="text-sm text-gray-600">{description}</p>
        <p className="text-xs text-gray-400 mt-1">{time}</p>
      </div>
    </div>;
  return <div style={style} className="min-h-screen bg-gray-50 pb-20">
      {/* 顶部导航 */}
      <div className="bg-white shadow-sm">
        <div className="max-w-md mx-auto px-6 py-4">
          <h1 className="text-xl font-bold text-gray-900">首页</h1>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="max-w-md mx-auto px-6 py-6 space-y-6">
        {/* 欢迎信息 */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">欢迎回来</h2>
          <p className="text-green-100">今天是个美好的一天，开始您的精彩旅程吧！</p>
        </div>

        {/* 统计数据 */}
        <div className="grid grid-cols-2 gap-4">
          <StatCard icon={Users} title="用户总数" value={stats.totalUsers} color="bg-blue-500" />
          <StatCard icon={BarChart3} title="内容总数" value={stats.totalPosts} color="bg-green-500" />
          <StatCard icon={MessageSquare} title="消息总数" value={stats.totalMessages} color="bg-purple-500" />
          <StatCard icon={Star} title="评价总数" value={stats.totalReviews} color="bg-yellow-500" />
        </div>

        {/* 快捷操作 */}
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">快捷操作</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-4">
              <Button variant="outline" className="h-20 flex flex-col space-y-2">
                <Plus className="w-6 h-6" />
                <span className="text-xs">发布内容</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col space-y-2">
                <MessageSquare className="w-6 h-6" />
                <span className="text-xs">查看消息</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col space-y-2">
                <Users className="w-6 h-6" />
                <span className="text-xs">好友列表</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 最近活动 */}
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">最近活动</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? <div className="p-4 space-y-3">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div> : <div className="space-y-1">
                {recentActivities.map(activity => <ActivityItem key={activity.id} icon={activity.type === 'user' ? Users : activity.type === 'post' ? BarChart3 : MessageSquare} title={activity.title} description={activity.description} time={activity.time} color={activity.type === 'user' ? 'bg-blue-500' : activity.type === 'post' ? 'bg-green-500' : 'bg-purple-500'} />)}
              </div>}
          </CardContent>
        </Card>
      </div>

      {/* 底部导航 */}
      <TabBar currentPage="home" onPageChange={handlePageChange} />
    </div>;
}