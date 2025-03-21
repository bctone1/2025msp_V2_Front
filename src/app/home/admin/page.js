"use client"

// AdminInterface.jsx
import React, { useState } from 'react';
import AdminNavigation from '@/components/AdminNavigation';
import AdminDashboard from '@/components/AdminDashboard';
import ProviderManagement from '@/components/ProviderManagement';
import ModelManagement from '@/components/ModelManagement';
import UserManagement from '@/components/UserManagement';
import SystemSettings from '@/components/SystemSettings';
import UsageAnalytics from '@/components/UsageAnalytics';

const AdminInterface = () => {
  // 메인 상태
  const [currentView, setCurrentView] = useState('dashboard');

  // 샘플 데이터
  const providerData = {
    providers: [
      {
        id: 'openai',
        name: 'OpenAI',
        status: 'active',
        apiKey: 'sk-abc...xyz',
        models: ['GPT-4', 'GPT-3.5 Turbo'],
        usageStats: { current: 45320, limit: 100000, cost: 12.54 },
        lastUsed: '2시간 전',
        defaultParams: { temperature: 0.7, max_tokens: 4000 }
      },
      {
        id: 'anthropic',
        name: 'Anthropic',
        status: 'active',
        apiKey: 'sk-ant...def',
        models: ['Claude 3 Opus', 'Claude 3 Sonnet'],
        usageStats: { current: 12850, limit: 50000, cost: 8.92 },
        lastUsed: '5시간 전',
        defaultParams: { temperature: 0.5, max_tokens: 8000 }
      },
      {
        id: 'deepseek',
        name: 'DeepSeek',
        status: 'inactive',
        apiKey: 'sk-deep...ghi',
        models: ['DeepSeek Coder', 'DeepSeek Chat'],
        usageStats: { current: 0, limit: 0, cost: 0 },
        lastUsed: '7일 전',
        defaultParams: { temperature: 0.3, max_tokens: 4000 }
      }
    ]
  };

  const userData = {
    users: [
      { id: 'user1', name: '김영희', email: 'kim@example.com', role: 'admin', status: 'active', lastActive: '1시간 전', projectCount: 5 },
      { id: 'user2', name: '이철수', email: 'lee@example.com', role: 'user', status: 'active', lastActive: '3시간 전', projectCount: 3 },
      { id: 'user3', name: '박지민', email: 'park@example.com', role: 'user', status: 'inactive', lastActive: '7일 전', projectCount: 0 }
    ]
  };

  const usageData = {
    summary: {
      totalCalls: 12450,
      totalTokens: 1845200,
      totalCost: 28.76,
      activeProjects: 8
    },
    providerUsage: [
      { provider: 'OpenAI', calls: 8230, tokens: 1245000, cost: 18.54 },
      { provider: 'Anthropic', calls: 3610, tokens: 582000, cost: 9.82 },
      { provider: 'DeepSeek', calls: 610, tokens: 18200, cost: 0.40 }
    ],
    recentActivity: [
      { time: '14:25', user: '김영희', action: 'API 호출', details: 'OpenAI GPT-4, 토큰: 3250' },
      { time: '13:15', user: '이철수', action: '새 프로젝트 생성', details: '모바일 앱 개발' },
      { time: '12:30', user: '김영희', action: 'API 키 갱신', details: 'Anthropic API' }
    ]
  };

  const systemData = {
    settings: {
      maxProjectsPerUser: 10,
      defaultTokenLimit: 100000,
      sessionTimeout: 60,
      defaultModel: 'gpt-4'
    },
    maintenance: {
      status: 'operational',
      scheduledMaintenance: null,
      version: '1.2.5',
      lastUpdated: '2024-03-10'
    }
  };

  // 현재 화면 렌더링
  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <AdminDashboard usageData={usageData} providerData={providerData} userData={userData} />;
      case 'providers':
        return <ProviderManagement providers={providerData.providers} />;
      case 'models':
        return <ModelManagement providers={providerData.providers} />;
      case 'users':
        return <UserManagement users={userData.users} />;
      case 'settings':
        return <SystemSettings settings={systemData.settings} maintenance={systemData.maintenance} />;
      case 'analytics':
        return <UsageAnalytics usageData={usageData} />;
      default:
        return <AdminDashboard usageData={usageData} providerData={providerData} userData={userData} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* 사이드 네비게이션 */}
      <AdminNavigation
        currentView={currentView}
        setCurrentView={setCurrentView}
      />

      {/* 메인 콘텐츠 영역 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 헤더 */}
        <header className="bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">
              {currentView === 'dashboard' && '관리자 대시보드'}
              {currentView === 'providers' && 'AI 프로바이더 관리'}
              {currentView === 'models' && '모델 설정'}
              {currentView === 'users' && '사용자 관리'}
              {currentView === 'settings' && '시스템 설정'}
              {currentView === 'analytics' && '사용량 분석'}
            </h1>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">관리자: admin@example.com</span>
              <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                A
              </div>
            </div>
          </div>
        </header>

        {/* 콘텐츠 영역 */}
        <main className="flex-1 overflow-y-auto">
          {renderCurrentView()}
        </main>
      </div>
    </div>
  );
};

export default AdminInterface;