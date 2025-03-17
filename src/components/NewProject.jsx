import React, { useState } from 'react';

const NewProject = ({ 
  categories, 
  models, 
  setView, 
  setActiveProject 
}) => {
  const [projectName, setProjectName] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [projectCategory, setProjectCategory] = useState('web');
  const [selectedModel, setSelectedModel] = useState('gpt-4');

  // 새 프로젝트 생성
  const createProject = () => {
    if (!projectName) return;
    
    const newProject = {
      id: `proj-${Date.now()}`,
      name: projectName,
      desc: projectDesc,
      category: projectCategory,
      model: selectedModel,
      lastActive: '방금',
      progress: 0,
      status: 'active'
    };
    
    // 새 프로젝트 설정 및 화면 전환
    setActiveProject(newProject);
    setView('project-detail');
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-gray-50 p-6 overflow-y-auto">
      <div className="max-w-2xl w-full bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">새 프로젝트</h2>
          <button 
            onClick={() => setView('projects')}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">프로젝트 이름</label>
            <input 
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="프로젝트 이름을 입력하세요"
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">프로젝트 설명 (선택사항)</label>
            <textarea
              value={projectDesc}
              onChange={(e) => setProjectDesc(e.target.value)}
              placeholder="프로젝트에 대한 간단한 설명을 입력하세요"
              className="w-full px-4 py-2 border rounded-lg h-24 resize-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">카테고리</label>
            <div className="grid grid-cols-4 gap-3">
              {categories.map(category => (
                <div 
                  key={category.id}
                  onClick={() => setProjectCategory(category.id)}
                  className={`p-3 border rounded-lg cursor-pointer text-center ${
                    projectCategory === category.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="text-sm">{category.name}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">AI 모델 선택</label>
            <div className="grid grid-cols-2 gap-3">
              {models.map(model => (
                <div 
                  key={model.id}
                  onClick={() => setSelectedModel(model.id)}
                  className={`p-3 border rounded-lg cursor-pointer ${
                    selectedModel === model.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="font-medium">{model.name}</div>
                  <div className="text-xs text-gray-500">{model.provider}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <button 
              onClick={() => setView('projects')}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              취소
            </button>
            <button 
              onClick={createProject}
              disabled={!projectName.trim()}
              className={`px-4 py-2 rounded-lg ${
                !projectName.trim()
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              프로젝트 생성
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewProject;