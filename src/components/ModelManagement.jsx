// ModelManagement.jsx
import React, { useState } from 'react';
import { 
  Bot, 
  Sliders, 
  Save, 
  CheckCircle, 
  XCircle,
  ArrowUpDown
} from 'lucide-react';

const ModelManagement = ({ providers }) => {
  // 프로바이더별 모델 정보를 추출
  const extractModels = (providers) => {
    let modelsList = [];
    providers.forEach(provider => {
      if (provider.status === 'active') {
        provider.models.forEach(modelName => {
          modelsList.push({
            id: `${provider.id}-${modelName.toLowerCase().replace(/\s+/g, '-')}`,
            name: modelName,
            provider: provider.name,
            providerId: provider.id,
            // 기본 설정 (실제로는 API에서 가져와야 함)
            settings: {
              temperature: 0.7,
              maxTokens: 4000,
              topP: 1,
              frequencyPenalty: 0,
              presencePenalty: 0,
              isDefault: modelName === 'GPT-4' && provider.id === 'openai'
            }
          });
        });
      }
    });
    return modelsList;
  };

  const [models, setModels] = useState(extractModels(providers));
  const [editingModel, setEditingModel] = useState(null);
  const [modelSettings, setModelSettings] = useState({});

  // 모델 수정 시작
  const startEditingModel = (model) => {
    setEditingModel(model.id);
    setModelSettings({...model.settings});
  };

  // 모델 설정 저장
  const saveModelSettings = (modelId) => {
    setModels(prevModels => 
      prevModels.map(model => 
        model.id === modelId 
          ? {...model, settings: modelSettings} 
          : model
      )
    );
    setEditingModel(null);
  };

  // 기본 모델 설정
  const setAsDefaultModel = (modelId) => {
    setModels(prevModels => 
      prevModels.map(model => ({
        ...model, 
        settings: {
          ...model.settings,
          isDefault: model.id === modelId
        }
      }))
    );
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h2 className="text-lg font-medium">모델 설정</h2>
          <p className="text-sm text-gray-500">AI 모델의 기본 설정 및 파라미터를 관리합니다</p>
        </div>
        
        {/* 모델 목록 테이블 */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden mb-6">
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  모델
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  프로바이더
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  기본값
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  파라미터
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  액션
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {models.map(model => (
                <tr key={model.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Bot className="w-5 h-5 text-gray-400 mr-3" />
                      <div className="text-sm font-medium text-gray-900">{model.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      model.providerId === 'openai' ? 'bg-black text-white' :
                      model.providerId === 'anthropic' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {model.provider}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {model.settings.isDefault ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        기본
                      </span>
                    ) : (
                      <button 
                        onClick={() => setAsDefaultModel(model.id)}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        기본으로 설정
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingModel === model.id ? (
                      <div className="flex items-center space-x-4">
                        <div>
                          <label className="block text-xs text-gray-500">Temperature</label>
                          <input 
                            type="number" 
                            min="0" 
                            max="2" 
                            step="0.1"
                            className="mt-1 p-1 border rounded w-16 text-sm"
                            value={modelSettings.temperature}
                            onChange={(e) => setModelSettings({...modelSettings, temperature: parseFloat(e.target.value)})}
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500">Max Tokens</label>
                          <input 
                            type="number" 
                            className="mt-1 p-1 border rounded w-20 text-sm"
                            value={modelSettings.maxTokens}
                            onChange={(e) => setModelSettings({...modelSettings, maxTokens: parseInt(e.target.value)})}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-900">
                        Temperature: {model.settings.temperature}, Max Tokens: {model.settings.maxTokens}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {editingModel === model.id ? (
                      <div className="flex justify-end space-x-2">
                        <button 
                          onClick={() => setEditingModel(null)}
                          className="text-red-600 hover:text-red-800"
                        >
                          취소
                        </button>
                        <button 
                          onClick={() => saveModelSettings(model.id)}
                          className="text-green-600 hover:text-green-800"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => startEditingModel(model)}
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        <Sliders className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* 모델 우선순위 설정 */}
        {/* <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="font-medium mb-4">모델 우선순위 설정</h3>
          <p className="text-sm text-gray-500 mb-4">
            모델 사용 우선순위를 설정합니다. 특정 모델이 사용 불가능한 경우 다음 순위 모델이 자동으로 선택됩니다.
          </p>
          
          <div className="space-y-2 mt-4">
            {models
              .filter(model => model.settings.isDefault || models.findIndex(m => m.settings.isDefault) === -1)
              .concat(models.filter(model => !model.settings.isDefault))
              .slice(0, 5)
              .map((model, index) => (
                <div key={model.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <span className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded-full text-xs font-medium mr-3">
                      {index + 1}
                    </span>
                    <div>
                      <div className="font-medium">{model.name}</div>
                      <div className="text-xs text-gray-500">{model.provider}</div>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </div>
              ))}
          </div>
          
          <div className="flex justify-end mt-6">
            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              우선순위 저장
            </button>
          </div>
        </div> */}



      </div>
    </div>
  );
};

export default ModelManagement;