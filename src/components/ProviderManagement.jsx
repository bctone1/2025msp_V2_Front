// ProviderManagement.jsx
import React, { useState } from 'react';
import { 
  PlusCircle, 
  Bot, 
  Zap, 
  BarChart, 
  Key, 
  RefreshCw, 
  CheckCircle, 
  XCircle 
} from 'lucide-react';

const ProviderManagement = ({ providers: initialProviders }) => {
  const [providers, setProviders] = useState(initialProviders);
  const [isAddingProvider, setIsAddingProvider] = useState(false);
  const [newProviderData, setNewProviderData] = useState({
    name: '',
    apiKey: '',
    models: [],
    defaultParams: { temperature: 0.7, max_tokens: 4000 }
  });

  // 프로바이더 활성화/비활성화 토글
  const toggleProviderStatus = (providerId) => {
    setProviders(items => items.map(item => 
      item.id === providerId 
        ? { ...item, status: item.status === 'active' ? 'inactive' : 'active' } 
        : item
    ));
  };

  // 새 프로바이더 추가
  const addNewProvider = () => {
    if (!newProviderData.name || !newProviderData.apiKey) return;
    
    const newProvider = {
      id: newProviderData.name.toLowerCase().replace(/\s+/g, '-'),
      name: newProviderData.name,
      status: 'active',
      apiKey: newProviderData.apiKey,
      models: newProviderData.models,
      usageStats: { current: 0, limit: 0, cost: 0 },
      lastUsed: '방금',
      defaultParams: newProviderData.defaultParams
    };
    
    setProviders([...providers, newProvider]);
    setIsAddingProvider(false);
    setNewProviderData({
      name: '',
      apiKey: '',
      models: [],
      defaultParams: { temperature: 0.7, max_tokens: 4000 }
    });
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-medium">AI 프로바이더 관리</h2>
            <p className="text-sm text-gray-500">LLM 프로바이더를 연결하고 관리합니다</p>
          </div>
          
          <button 
            onClick={() => setIsAddingProvider(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
          >
            <PlusCircle size={16} />
            <span>새 프로바이더 연결</span>
          </button>
        </div>
        
        {/* 새 프로바이더 추가 폼 */}
        {isAddingProvider && (
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">새 AI 프로바이더 연결</h2>
              <button 
                onClick={() => setIsAddingProvider(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">프로바이더 이름</label>
                <select 
                  value={newProviderData.name}
                  onChange={(e) => setNewProviderData({...newProviderData, name: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="">프로바이더 선택</option>
                  <option value="OpenAI">OpenAI</option>
                  <option value="Anthropic">Anthropic</option>
                  <option value="DeepSeek">DeepSeek</option>
                  <option value="Google">Google (Gemini)</option>
                  <option value="Cohere">Cohere</option>
                  <option value="Custom">기타 (직접 입력)</option>
                </select>
              </div>
              
              {newProviderData.name === 'Custom' && (
                <div>
                  <label className="block text-sm font-medium mb-2">커스텀 프로바이더 이름</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="프로바이더 이름 입력"
                    onChange={(e) => setNewProviderData({...newProviderData, name: e.target.value})}
                  />
                </div>
              )}
              
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-2">API 키</label>
                <input 
                  type="text" 
                  value={newProviderData.apiKey}
                  onChange={(e) => setNewProviderData({...newProviderData, apiKey: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg font-mono"
                  placeholder="sk-..."
                />
              </div>
              
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-2">사용 가능한 모델</label>
                <div className="space-y-2">
                  {newProviderData.name === 'OpenAI' && (
                    <>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="gpt4" onChange={(e) => {
                          const models = [...newProviderData.models];
                          if (e.target.checked) models.push('GPT-4');
                          else models.splice(models.indexOf('GPT-4'), 1);
                          setNewProviderData({...newProviderData, models});
                        }} />
                        <label htmlFor="gpt4">GPT-4</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="gpt35" onChange={(e) => {
                          const models = [...newProviderData.models];
                          if (e.target.checked) models.push('GPT-3.5 Turbo');
                          else models.splice(models.indexOf('GPT-3.5 Turbo'), 1);
                          setNewProviderData({...newProviderData, models});
                        }} />
                        <label htmlFor="gpt35">GPT-3.5 Turbo</label>
                      </div>
                    </>
                  )}
                  {/* 다른 프로바이더의 모델들도 비슷하게 추가 */}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setIsAddingProvider(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                취소
              </button>
              <button 
                onClick={addNewProvider}
                disabled={!newProviderData.name || !newProviderData.apiKey}
                className={`px-4 py-2 rounded-lg ${
                  !newProviderData.name || !newProviderData.apiKey
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                연결
              </button>
            </div>
          </div>
        )}
        
        {/* 프로바이더 카드 목록 */}
        <div className="space-y-6">
          {providers.map(provider => (
            <div key={provider.id} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    provider.id === 'openai' ? 'bg-black text-white' :
                    provider.id === 'anthropic' ? 'bg-blue-100 text-blue-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    <Bot size={24} />
                  </div>
                  <div>
                    <h2 className="text-lg font-medium">{provider.name}</h2>
                    <p className="text-sm text-gray-500">{provider.models.join(', ')}</p>
                  </div>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                  provider.status === 'active' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {provider.status === 'active' ? 
                    <CheckCircle size={16} /> : 
                    <XCircle size={16} />
                  }
                  <span>{provider.status === 'active' ? '활성' : '비활성'}</span>
                </div>
              </div>
              
              {/* API 키 표시 */}
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg mb-6">
                <Key className="text-gray-400" size={16} />
                <code className="flex-1 font-mono text-sm truncate">{provider.apiKey}</code>
                <button className="px-3 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100">
                  복사
                </button>
                <button className="px-3 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200">
                  <RefreshCw size={14} />
                </button>
              </div>
              
              {/* 사용량 및 정보 */}
              <div className="grid grid-cols-3 gap-6 mb-6">
                <div>
                  <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Zap size={14} className="text-yellow-500" />
                    사용량
                  </h3>
                  <div className="flex items-end gap-2">
                    <div className="text-2xl font-bold">{provider.usageStats.current.toLocaleString()}</div>
                    <div className="text-sm text-gray-500 mb-1">토큰</div>
                  </div>
                  {provider.usageStats.limit > 0 && (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>사용량</span>
                        <span>{Math.round(provider.usageStats.current / provider.usageStats.limit * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-blue-600 h-1.5 rounded-full" 
                          style={{ width: `${Math.min(100, Math.round(provider.usageStats.current / provider.usageStats.limit * 100))}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <BarChart size={14} className="text-blue-500" />
                    비용
                  </h3>
                  <div className="flex items-end gap-2">
                    <div className="text-2xl font-bold">${provider.usageStats.cost.toFixed(2)}</div>
                    <div className="text-sm text-gray-500 mb-1">이번 달</div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">최근 사용</h3>
                  <div className="text-2xl font-bold">{provider.lastUsed}</div>
                </div>
              </div>
              
              {/* 설정 및 액션 */}
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <button className="px-3 py-1.5 text-sm border rounded hover:bg-gray-50">
                  사용량 보기
                </button>
                <button className="px-3 py-1.5 text-sm border rounded hover:bg-gray-50">
                  모델 설정
                </button>
                <button 
                  onClick={() => toggleProviderStatus(provider.id)}
                  className={`px-3 py-1.5 text-sm rounded ${
                    provider.status === 'active'
                      ? 'bg-red-50 text-red-600 hover:bg-red-100'
                      : 'bg-green-50 text-green-600 hover:bg-green-100'
                  }`}
                >
                  {provider.status === 'active' ? '비활성화' : '활성화'}
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {providers.length === 0 && (
          <div className="text-center text-gray-500 py-6 bg-white rounded-lg shadow-sm border">
            연결된 AI 프로바이더가 없습니다. 새 프로바이더를 연결해보세요.
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderManagement;