// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
// @ts-ignore;
import { BarChart3, TrendingUp, Users, MessageSquare, Star, Download, RefreshCw, ArrowLeft } from 'lucide-react';

// @ts-ignore;
import { TabBar } from '@/components/TabBar';
// @ts-ignore;

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
export default function Data(props) {
  const {
    $w,
    style
  } = props;
  const [timeRange, setTimeRange] = useState('week');
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalPosts: 0,
    totalMessages: 0
  });
  useEffect(() => {
    loadData();
  }, [timeRange]);
  const loadData = async () => {
    setIsLoading(true);
    try {
      // 模拟加载数据
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 生成图表数据
      const data = [];
      const now = new Date();
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        data.push({
          name: `${date.getMonth() + 1}/${date.getDate()}`,
          users: Math.floor(Math.random() * 100) + 50,
          posts: Math.floor(Math.random() * 50) + 20,
          messages: Math.floor(Math.random() * 200) + 100
        });
      }
      setChartData(data);

      // 生成统计数据
      setStats({
        totalUsers: 1234,
        activeUsers: 856,
        totalPosts: 567,
        totalMessages: 2341
      });
    } catch (error) {
      console.error('加载数据失败:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleRefresh = () => {
    loadData();
  };
  const handleExport = () => {
    // 模拟导出数据
    const dataStr = JSON.stringify(chartData, null, 2);
    const dataBlob = new Blob([dataStr], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `data-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
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
    change,
    color
  }) => <Card className="bg-white shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className={`p-2 rounded-lg ${color}`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div className={`flex items-center text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            <TrendingUp className={`w-4 h-4 mr-1 ${change < 0 ? 'rotate-180' : ''}`} />
            {Math.abs(change)}%
          </div>
        </div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </CardContent>
    </Card>;

  // 饼图数据
  const pieData = [{
    name: '活跃用户',
    value: stats.activeUsers
  }, {
    name: '非活跃用户',
    value: stats.totalUsers - stats.activeUsers
  }];
  const COLORS = ['#10B981', '#E5E7EB'];
  if (isLoading) {
    return <div style={style} className="min-h-screen bg-gray-50 pb-20">
        {/* 顶部导航 */}
        <div className="bg-white shadow-sm">
          <div className="max-w-md mx-auto px-6 py-4 flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => $w.utils.navigateBack()} className="p-2">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold text-gray-900">数据统计</h1>
            <div className="w-9"></div>
          </div>
        </div>

        {/* 加载状态 */}
        <div className="max-w-md mx-auto px-6 py-6 space-y-6">
          <div className="animate-pulse space-y-4">
            <div className="h-32 bg-gray-200 rounded-lg"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-24 bg-gray-200 rounded-lg"></div>
              <div className="h-24 bg-gray-200 rounded-lg"></div>
            </div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>;
  }
  return <div style={style} className="min-h-screen bg-gray-50 pb-20">
      {/* 顶部导航 */}
      <div className="bg-white shadow-sm">
        <div className="max-w-md mx-auto px-6 py-4 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => $w.utils.navigateBack()} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold text-gray-900">数据统计</h1>
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm" onClick={handleRefresh}>
              <RefreshCw className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleExport}>
              <Download className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="max-w-md mx-auto px-6 py-6 space-y-6">
        {/* 时间范围选择 */}
        <div className="flex space-x-2">
          {['day', 'week', 'month'].map(range => <Button key={range} variant={timeRange === range ? 'default' : 'outline'} onClick={() => setTimeRange(range)} className={`flex-1 ${timeRange === range ? 'bg-green-500 hover:bg-green-600' : ''}`}>
              {range === 'day' ? '今日' : range === 'week' ? '本周' : '本月'}
            </Button>)}
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-2 gap-4">
          <StatCard icon={Users} title="总用户数" value={stats.totalUsers} change={12} color="bg-blue-500" />
          <StatCard icon={BarChart3} title="活跃用户" value={stats.activeUsers} change={8} color="bg-green-500" />
          <StatCard icon={MessageSquare} title="内容数" value={stats.totalPosts} change={15} color="bg-purple-500" />
          <StatCard icon={Star} title="消息数" value={stats.totalMessages} change={-3} color="bg-yellow-500" />
        </div>

        {/* 用户活跃度饼图 */}
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">用户活跃度</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={80} paddingAngle={5} dataKey="value">
                    {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center space-x-6 mt-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">活跃用户</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                <span className="text-sm text-gray-600">非活跃用户</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 趋势图 */}
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">数据趋势</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="users" stroke="#3B82F6" strokeWidth={2} name="用户数" />
                  <Line type="monotone" dataKey="posts" stroke="#10B981" strokeWidth={2} name="内容数" />
                  <Line type="monotone" dataKey="messages" stroke="#8B5CF6" strokeWidth={2} name="消息数" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* 柱状图 */}
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">每日统计</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="users" fill="#3B82F6" name="用户数" />
                  <Bar dataKey="posts" fill="#10B981" name="内容数" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 底部导航 */}
      <TabBar currentPage="data" onPageChange={handlePageChange} />
    </div>;
}