import React from 'react';
import { FolderOpen, Activity, MessageSquare, ChevronDown, FileText, Code, Bot } from 'lucide-react';

const Dashboard = ({
  projects,
  apiKeys,
  sessionLogs,
  recentActivities,
  selectProject,
  changeNavigation
}) => {
  return (
    <div className="flex-1 p-6 bg-gray-50 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">대시보드</h1>

        {/* 요약 정보 */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-medium">활성 프로젝트</h2>
              <FolderOpen size={20} className="text-blue-500" />
            </div>
            <div className="text-3xl font-bold">
              {projects.filter(p => p.status === 'active').length}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              총 {projects.length}개 중
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-medium">API 사용량</h2>
              <Activity size={20} className="text-blue-500" />
            </div>
            <div className="text-3xl font-bold">
              {apiKeys.reduce((sum, api) => sum + api.usage_count, 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              토큰 / {apiKeys.reduce((sum, api) => sum + api.usage_limit, 0).toLocaleString()} 한도
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-medium">저장된 대화</h2>
              <MessageSquare size={20} className="text-blue-500" />
            </div>
            <div className="text-3xl font-bold">
              {sessionLogs.length}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              최근 30일
            </div>
          </div>


          
        </div>

        {/* 최근 활동 및 프로젝트 */}
        <div className="grid grid-cols-2 gap-6">
          {/* 최근 활동 */}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="font-medium mb-4">최근 활동</h2>

            <div className="space-y-4">
              {recentActivities.map(activity => (
                <div key={activity.id} className="flex items-start">
                  <div className={`rounded-full p-2 mr-3 ${activity.type === 'message' ? 'bg-blue-100' :
                    activity.type === 'file' ? 'bg-green-100' : 'bg-purple-100'
                    }`}>
                    {activity.type === 'message' && <MessageSquare size={16} className={`text-blue-600`} />}
                    {activity.type === 'file' && <FileText size={16} className={`text-green-600`} />}
                    {activity.type === 'code' && <Code size={16} className={`text-purple-600`} />}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{activity.title}</h3>
                      <span className="text-xs text-gray-500">{activity.time}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      프로젝트: {projects.find(p => p.id === activity.project)?.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {recentActivities.length === 0 && (
              <div className="text-center text-gray-500 py-6">
                최근 활동이 없습니다
              </div>
            )}
          </div>

          {/* 프로젝트 현황 */}
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-medium">프로젝트 현황</h2>
              <button
                onClick={() => changeNavigation('projects')}
                className="text-sm text-blue-500 flex items-center gap-1"
              >
                모두 보기 <ChevronDown size={16} className="transform rotate-270" />
              </button>
            </div>

            <div className="space-y-4">
              {projects.slice(0, 3).map(project => (
                <div key={project.project_id}
                  className="border rounded-lg p-4 hover:border-blue-300 cursor-pointer"
                  onClick={() => selectProject(project.project_id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{project.project_name}</h3>
                    {/* <span className={`px-2 py-0.5 rounded text-xs ${
                      project.status === 'active' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {project.status === 'active' ? '진행중' : '완료'}
                    </span> */}
                  </div>

                  <p className="text-sm text-gray-600 mb-3">{project.description}</p>

                  {/* <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-blue-600 h-1.5 rounded-full" 
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div> */}

                  <div className="flex items-center mt-3 text-xs text-gray-500 space-x-3 p-2 border rounded-lg shadow-sm bg-white">
                    <div className="flex items-center space-x-1">
                      <span className="font-semibold text-gray-600">모델 :</span>
                      <Bot size={14} className="mr-2 text-blue-500" />
                      <span className="font-medium">{project.ai_model}</span>
                    </div>

                    <div className="flex items-center space-x-1">
                      <span className="font-semibold text-gray-600">카테고리 :</span>
                      <span className="text-gray-700">{project.category}</span>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;