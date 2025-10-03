// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Button } from '@/components/ui';
// @ts-ignore;
import { Home, User, Settings, BarChart3, Plus } from 'lucide-react';

export function TabBar({
  currentPage,
  onPageChange
}) {
  const tabs = [{
    id: 'home',
    label: '首页',
    icon: Home
  }, {
    id: 'data',
    label: '数据',
    icon: BarChart3
  }, {
    id: 'add',
    label: '发布',
    icon: Plus
  }, {
    id: 'profile',
    label: '我的',
    icon: User
  }, {
    id: 'settings',
    label: '设置',
    icon: Settings
  }];
  return <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="max-w-md mx-auto">
        <div className="flex justify-around items-center py-2">
          {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = currentPage === tab.id;
          return <Button key={tab.id} variant="ghost" onClick={() => onPageChange(tab.id)} className={`flex flex-col items-center p-2 h-auto min-w-[60px] ${isActive ? 'text-green-500' : 'text-gray-500'}`}>
                <Icon className={`w-5 h-5 mb-1 ${isActive ? 'text-green-500' : 'text-gray-400'}`} />
                <span className={`text-xs ${isActive ? 'text-green-500 font-medium' : 'text-gray-500'}`}>
                  {tab.label}
                </span>
              </Button>;
        })}
        </div>
      </div>
    </div>;
}