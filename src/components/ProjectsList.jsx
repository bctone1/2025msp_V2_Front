import React from 'react';
import {
  PlusCircle, Search, Bot, Clock
} from 'lucide-react';

const ProjectsList = ({
  projects,
  categories,
  models,
  selectProject,
  setView
}) => {
  return (
    <div className="flex-1 p-6 bg-gray-50 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">프로젝트 관리</h1>

          <button
            onClick={() => setView('new-project')}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
          >
            <PlusCircle size={16} />
            <span>새 프로젝트</span>
          </button>
        </div>

        {/* 검색 및 필터 */}
        <div className="bg-white rounded-lg border p-4 mb-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="프로젝트 검색..."
                className="pl-10 pr-4 py-2 border rounded-lg w-full"
              />
            </div>

            <select className="px-4 py-2 border rounded-lg">
              <option value="all">모든 카테고리</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>

            <select className="px-4 py-2 border rounded-lg">
              <option value="all">모든 상태</option>
              <option value="active">진행중</option>
              <option value="completed">완료</option>
            </select>
          </div>
        </div>

        {/* 프로젝트 목록 */}
        <div className="grid grid-cols-2 gap-6">
          {projects.map(project => (
            <div
              key={project.id}
              onClick={() => selectProject(project.id)}
              className="bg-white rounded-lg border p-4 hover:border-blue-300 hover:shadow-sm cursor-pointer"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-lg">{project.name}</h3>
                  {project.desc && (
                    <p className="text-sm text-gray-600 mt-1">{project.desc}</p>
                  )}
                </div>
                <span className={`px-2 py-0.5 rounded text-xs ${project.status === 'active'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-green-100 text-green-700'
                  }`}>
                  {project.status === 'active' ? '진행중' : '완료'}
                </span>
              </div>

              <div className="mt-4">
                <div className="flex justify-between items-center mb-1.5 text-sm">
                  <span className="text-gray-600">진행률</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Bot size={14} className="mr-1" />
                  <span>{models.find(m => m.id === project.model)?.name || project.model}</span>
                </div>

              </div>
            </div>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center text-gray-500 py-6 bg-white rounded-lg border">
            생성된 프로젝트가 없습니다. 새 프로젝트를 시작해보세요.
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsList;