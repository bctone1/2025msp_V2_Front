import React, { useState } from 'react';
import { PlusCircle, RefreshCw, CheckCircle, XCircle } from 'lucide-react';

const ApiKeys = ({ apiKeys: initialApiKeys, sessionData, providers }) => {
  const [apiKeys, setApiKeys] = useState(initialApiKeys);
  const filterApiKey = apiKeys.filter(apiKey => apiKey.user_id === sessionData.user.id);
  // console.log(sessionData);
  // console.log(filterApiKey);
  // console.log(providers);

  const [isAddingKey, setIsAddingKey] = useState(false);
  const [newKeyData, setNewKeyData] = useState({
    name: '',
    key: '',
    provider: 'OpenAI',
    limit: 100000
  });


  // 새 API 키 추가
  const addNewKey = () => {
    // alert("Add new api key handler");
    if (!newKeyData.key) return;
    console.log(newKeyData);

    // const newKey = {
    //   id: `key-${Date.now()}`,
    //   name: newKeyData.name,
    //   api_key: newKeyData.key,
    //   provider: newKeyData.provider,
    //   usage_limit : newKeyData.limit,
    //   status: 'active',
    //   lastUsed: '방금',
    //   usage: { current: 0, limit: parseInt(newKeyData.limit) || 100000 }
    // };

    setApiKeys([...apiKeys, newKeyData]);
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
              {/* <div>
                <label className="block text-sm font-medium mb-2">API 키 이름</label>
                <input
                  type="text"
                  value={newKeyData.name}
                  onChange={(e) => setNewKeyData({ ...newKeyData, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="예: OpenAI API"
                />
              </div> */}

              <div>
                <label className="block text-sm font-medium mb-2">프로바이더</label>
                <select
                  value={newKeyData.provider}
                  onChange={(e) => setNewKeyData({ ...newKeyData, provider: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  {providers.map(provider => (
                    <option key={provider.name} value={provider.name}>
                      {provider.name}
                    </option>
                  ))}
                </select>
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
                disabled={!newKeyData.key}
                className={`px-4 py-2 rounded-lg ${!newKeyData.key
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
          {filterApiKey.map(apiKey => (
            <div key={apiKey.api_key} className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-medium">{apiKey.name}</h2>
                  <p className="text-sm text-gray-500">{apiKey.provider_name}</p>
                </div>
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
                    <div className="text-2xl font-bold">{apiKey?.usage_count?.toLocaleString() ?? '0'}</div>
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
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <button className="px-3 py-1.5 text-sm border rounded hover:bg-gray-50">
                  사용량 보기
                </button>
                <button className="px-3 py-1.5 text-sm border rounded hover:bg-gray-50">
                  수정
                </button>
                <button className="px-3 py-1.5 text-sm border rounded hover:bg-gray-50">
                  삭제
                </button>

              </div>
            </div>
          ))}
        </div>

        {filterApiKey.length === 0 && (
          <div className="text-center text-gray-500 py-6 bg-white rounded-lg border">
            등록된 API 키가 없습니다. 새 API 키를 등록해보세요.
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiKeys;