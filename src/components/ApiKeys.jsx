import React, { useState } from 'react';
import { PlusCircle, RefreshCw, CheckCircle, XCircle } from 'lucide-react';

const ApiKeys = ({ apiKeys: initialApiKeys }) => {
  const [apiKeys, setApiKeys] = useState(initialApiKeys);
  const [isAddingKey, setIsAddingKey] = useState(false);
  const [newKeyData, setNewKeyData] = useState({
    name: '',
    key: '',
    provider: 'OpenAI',
    limit: 100000
  });

  // API 키 활성화/비활성화 토글
  const toggleKeyStatus = (keyId) => {
    setApiKeys(keys => keys.map(key =>
      key.id === keyId
        ? { ...key, status: key.status === 'active' ? 'expired' : 'active' }
        : key
    ));
  };

  // 새 API 키 추가
  const addNewKey = () => {
    if (!newKeyData.name || !newKeyData.key) return;

    const newKey = {
      id: `key-${Date.now()}`,
      name: newKeyData.name,
      key: newKeyData.key,
      provider: newKeyData.provider,
      status: 'active',
      lastUsed: '방금',
      usage: { current: 0, limit: parseInt(newKeyData.limit) || 100000 }
    };

    setApiKeys([...apiKeys, newKey]);
    setIsAddingKey(false);
    setNewKeyData({
      name: '',
      key: '',
      provider: 'OpenAI',
      limit: 100000
    });
  };

  return (
    <div className="flex-1 p-6 bg-gray-50 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">API 키 관리</h1>

          <button
            onClick={() => setIsAddingKey(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
          >
            <PlusCircle size={16} />
            <span>새 API 키 등록</span>
          </button>
        </div>

        {/* 새 API 키 추가 폼 */}
        {isAddingKey && (
          <div className="bg-white rounded-lg border p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">새 API 키 등록</h2>
              <button
                onClick={() => setIsAddingKey(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">API 키 이름</label>
                <input
                  type="text"
                  value={newKeyData.name}
                  onChange={(e) => setNewKeyData({ ...newKeyData, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="예: OpenAI API"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">프로바이더</label>
                <select
                  value={newKeyData.provider}
                  onChange={(e) => setNewKeyData({ ...newKeyData, provider: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="OpenAI">OpenAI</option>
                  <option value="Anthropic">Anthropic</option>
                  <option value="DeepSeek">DeepSeek</option>
                  <option value="Google">Google</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium mb-2">API 키</label>
                <input
                  type="text"
                  value={newKeyData.key}
                  onChange={(e) => setNewKeyData({ ...newKeyData, key: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg font-mono"
                  placeholder="sk-..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">일일 사용량 한도 (토큰)</label>
                <input
                  type="number"
                  value={newKeyData.limit}
                  onChange={(e) => setNewKeyData({ ...newKeyData, limit: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  min="0"
                  step="10000"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsAddingKey(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={addNewKey}
                disabled={!newKeyData.name || !newKeyData.key}
                className={`px-4 py-2 rounded-lg ${!newKeyData.name || !newKeyData.key
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
              >
                저장
              </button>
            </div>
          </div>
        )}

        {/* API 키 목록 */}
        <div className="space-y-6">
          {apiKeys.map(apiKey => (
            <div key={apiKey.id} className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-medium">{apiKey.name}</h2>
                  <p className="text-sm text-gray-500">{apiKey.provider_name}</p>
                </div>
                {/* <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${apiKey.status === 'ctive'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                  }`}>
                  {apiKey.status === 'Active' ?
                    <CheckCircle size={16} /> :
                    <XCircle size={16} />
                  }
                  <span>{apiKey.status === 'Active' ? '활성' : '비활성'}</span>
                </div> */}
              </div>

              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg mb-6">
                <code className="flex-1 font-mono text-sm truncate">{apiKey.api_key}</code>
                <button className="px-3 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100">
                  복사
                </button>
                <button className="px-3 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200">
                  <RefreshCw size={14} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium mb-2">현재 사용량</h3>
                  <div className="flex items-end gap-2">
                    <div className="text-2xl font-bold">{apiKey.usage_count.toLocaleString()}</div>
                    <div className="text-sm text-gray-500 mb-1">토큰</div>
                  </div>
                  {apiKey.usage_limit > 0 && (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>사용량</span>
                        <span>{Math.round(apiKey.usage_count / apiKey.usage_limit * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-blue-600 h-1.5 rounded-full"
                          style={{ width: `${Math.min(100, Math.round(apiKey.usage_count / apiKey.usage_limit * 100))}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">일일 한도</h3>
                  <div className="flex items-end gap-2">
                    <div className="text-2xl font-bold">{apiKey.usage_limit > 0 ? apiKey.usage_limit.toLocaleString() : '무제한'}</div>
                    {apiKey.usage_limit > 0 && <div className="text-sm text-gray-500 mb-1">토큰</div>}
                  </div>
                </div>

                {/* <div>
                  <h3 className="text-sm font-medium mb-2">최근 사용</h3>
                  <div className="text-2xl font-bold">{apiKey.lastUsed}</div>
                </div> */}
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <button className="px-3 py-1.5 text-sm border rounded hover:bg-gray-50">
                  사용량 보기
                </button>
                <button className="px-3 py-1.5 text-sm border rounded hover:bg-gray-50">
                  한도 설정
                </button>
                {/* <button
                  onClick={() => toggleKeyStatus(apiKey.id)}
                  className={`px-3 py-1.5 text-sm rounded ${apiKey.status === 'Active'
                      ? 'bg-red-50 text-red-600 hover:bg-red-100'
                      : 'bg-green-50 text-green-600 hover:bg-green-100'
                    }`}
                >
                  {apiKey.status === 'Active' ? '비활성화' : '활성화'}
                </button> */}
              </div>
            </div>
          ))}
        </div>

        {apiKeys.length === 0 && (
          <div className="text-center text-gray-500 py-6 bg-white rounded-lg border">
            등록된 API 키가 없습니다. 새 API 키를 등록해보세요.
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiKeys;