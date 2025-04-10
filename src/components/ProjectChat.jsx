import React, { useState, useRef, useEffect } from 'react';
import {
  Bot, User, Send, FileText,
  Upload, Settings, Cloud,
  Folder, Github, History,
  ChevronDown, Database
} from 'lucide-react';

const ProjectChat = ({
  activeProject,
  models,
  sessionLogs,
  selectedModel,
  setSelectedModel,
  setView,
  conversations
}) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [fileSource, setFileSource] = useState('local'); // 'local', 'drive', 'github', 'dropbox'
  const [files, setFiles] = useState([]);

  const [currentSessionLogs, setcurrentSessionLogs] = useState(sessionLogs);
  const now = new Date();
  const currentTime = "msp_id" +
    now.getFullYear().toString() +
    (now.getMonth() + 1).toString().padStart(2, "0") +
    now.getDate().toString().padStart(2, "0") +
    now.getHours().toString().padStart(2, "0") +
    now.getMinutes().toString().padStart(2, "0") +
    now.getSeconds().toString().padStart(2, "0");

  const currentSession = useRef(currentTime);

  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight + 50; // 50px 더 아래로 이동
    }
  }, [messages]); // messages가 변경될 때마다 실행


  // 컴포넌트 마운트 시 초기 메시지 설정
  useEffect(() => {
    console.log(activeProject);
    setMessages([{
      id: 1,
      role: 'system',
      content: `${activeProject.project_name} 프로젝트를 시작합니다. ${activeProject.description ? `설명: ${activeProject.description}` : ''} 어떤 도움이 필요하신가요?`
    }]);
  }, [activeProject]);

  

  // 메시지 전송
  const sendMessage = async () => {
    console.log(activeProject);
    if (!input.trim()) return;
    const userMessage = {
      id: messages.length + 1,
      role: 'user',
      content: input
    };
    setMessages([...messages, userMessage]);
    setInput('');
    setIsLoading(true);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/RequestMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messageInput: input, project_id: activeProject.project_id, user_email: activeProject.user_email, session: currentSession.current, selected_model: selectedModel}),
    });
    const data = await response.json();
    if (response.ok) {
      console.log(data);
      setTimeout(() => {
        const aiResponse = {
          id: messages.length + 2,
          role: 'assistant',
          content: data,
          model: selectedModel
        };

        setMessages(prev => [...prev, aiResponse]);
        setIsLoading(false);
        // messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 1000);
    } else {
      alert("오류발생");
    }
  };

  const showConversations = (param) => {
    console.log(param.id);
    if (currentSession.current === param.id) {
      alert("이미 같은 세션입니다.");
      return;
    }
    setMessages([]);

    const filteredConversations = conversations.filter(convo => convo.session_id === param.id);
    filteredConversations.forEach((object, index) => {
      setMessages(prevMessages => {
        const newId = prevMessages.length + 1;  // 이전 상태의 길이를 사용
        const updatedMessage = {
          id: newId,
          role: object.message_role,
          content: object.conversation,
          model: selectedModel
        };
        return [...prevMessages, updatedMessage];
      });
    });
    currentSession.current = param.id;
  }

  const newChat = async () => {
    currentSession.current = currentTime;
    setMessages([{
      id: 1,
      role: 'system',
      content: `${activeProject.project_name} 프로젝트를 시작합니다. ${activeProject.description ? `설명: ${activeProject.description}` : ''} 어떤 도움이 필요하신가요?`
    }]);

    const formattedDate = now.toLocaleString();

    const newSessionLogs = {
      id: currentSession.current,
      project_id: activeProject.project_id,
      session_title: 'New Chat!',
      register_at: formattedDate,
      messages: 0,
      user_email: activeProject.user_email,
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/newSession`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newSessionLogs),
    });
    const data = await response.json();
    if (response.ok) {
      console.log(data);
      setcurrentSessionLogs([newSessionLogs, ...currentSessionLogs]);
    } else {
      alert("오류발생");
    }
  }
  const initialized = useRef(false);
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      newChat();
    }
  }, []);
  
  // 파일 업로드
  const handleFileUpload = () => {
    if (fileSource === 'local') {
      fileInputRef.current?.click();

    } else {
      // 외부 스토리지 연동 시뮬레이션
      alert(`${fileSource} 연동을 시작합니다.`);

      // 외부에서 가져온 파일 시뮬레이션
      setTimeout(() => {
        const externalFiles = [
          { name: `${fileSource}_문서1.pdf`, source: fileSource },
          { name: `${fileSource}_문서2.docx`, source: fileSource }
        ];

        setFiles([...files, ...externalFiles]);
        alert(`${fileSource}에서 2개의 파일을 가져왔습니다.`);
      }, 1000);
    }
  };

  const handleFileSelect = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    const formData = new FormData();

    // formData.append("files[]", selectedFiles);
    formData.append("project_id", activeProject.project_id);
    formData.append("user_email", activeProject.user_email);
    selectedFiles.forEach(file => {
      formData.append("files[]", file);
    });

    const formDataObject = {};
    formData.forEach((value, key) => {
      formDataObject[key] = value;
    });
    console.log(formDataObject);


    // console.log(selectedFiles);
    // console.log(activeProject.project_id, activeProject.user_email);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/UploadFile`, {
      method: "POST",
      body: formData
    });
    const data = await response.json();
    if (response.ok) {
      console.log(data);
    } else {
      alert("파일 업로드 오류발생");
    }



    if (selectedFiles.length > 0) {
      const newFiles = selectedFiles.map(f => ({
        name: f.name,
        source: 'local'
      }));

      setFiles([...files, ...newFiles]);

      const fileMessage = {
        id: messages.length + 1,
        role: 'user',
        content: `파일 업로드: ${selectedFiles.map(f => f.name).join(', ')}`,
        files: newFiles
      };

      setMessages([...messages, fileMessage]);

      // AI 응답 시뮬레이션
      setIsLoading(true);
      setTimeout(() => {
        const response = {
          id: messages.length + 2,
          role: 'assistant',
          content: '파일이 지식 베이스에 추가되었습니다. 어떤 도움이 필요하신가요?',
          model: selectedModel
        };

        setMessages(prev => [...prev, response]);
        setIsLoading(false);
        // messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 1000);
    }
  };

  // 파일 소스에 따른 아이콘 반환
  const getFileSourceIcon = (source) => {
    switch (source) {
      case 'drive': return <Cloud size={14} />;
      case 'github': return <Github size={14} />;
      case 'dropbox': return <Database size={14} />;
      default: return <FileText size={14} />;
    }
  };


  return (
    <div className="flex-1 flex">
      {/* 왼쪽: 지식 베이스 및 대화 이력 패널 */}
      <div className="w-64 bg-white border-r flex flex-col">
        {/* 프로젝트 정보 */}
        <div className="p-3 border-b">
          <div className="flex items-center justify-between">
            <div className="font-medium truncate">{activeProject.project_name}</div>
            <button
              onClick={() => setView('projects')}
              className="p-1 hover:bg-gray-100 rounded"
              title="프로젝트 목록"
            >
              <Folder size={16} className="text-gray-500" />
            </button>
          </div>
          {activeProject.description && (
            <p className="text-xs text-gray-500 mt-1 truncate">{activeProject.description}</p>
          )}
        </div>

        {/* 지식 베이스 */}
        <div className="p-3 border-b">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">지식 베이스</h3>
            <div className="flex">
              <button
                onClick={() => setFileSource('local')}
                className={`p-1 rounded ${fileSource === 'local' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
                title="로컬 파일"
              >
                <FileText size={14} />
              </button>
              <button
                onClick={() => setFileSource('drive')}
                className={`p-1 rounded ${fileSource === 'drive' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
                title="Google Drive"
              >
                <Cloud size={14} />
              </button>
              <button
                onClick={() => setFileSource('github')}
                className={`p-1 rounded ${fileSource === 'github' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
                title="GitHub"
              >
                <Github size={14} />
              </button>
            </div>
          </div>
          <button
            onClick={handleFileUpload}
            className="w-full flex items-center justify-center gap-1 py-1.5 px-3 text-sm border border-dashed rounded-lg hover:bg-gray-50 mb-2"
          >
            <Upload size={14} />
            <span>{fileSource === 'local' ? '파일 업로드' : `${fileSource} 연동`}</span>
          </button>
          {files.length > 0 ? (
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {files.map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center p-1.5 text-xs hover:bg-gray-100 rounded"
                >
                  {getFileSourceIcon(file.source)}
                  <span className="ml-1.5 truncate">{file.name}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-gray-400 text-center py-2">
              파일이 없습니다
            </div>
          )}
        </div>

        <div className="p-3 border-b">
          <button
            onClick={() => newChat()}
          >
            새 채팅
          </button>
        </div>

        {/* 대화 이력 */}
        <div className="p-3 flex-1 overflow-y-auto">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">대화 기록</h3>
          </div>
          {currentSessionLogs
            .filter(c => c.project_id === activeProject?.project_id)
            .length > 0 ? (
            <div className="space-y-1">
              {currentSessionLogs
                .filter(c => c.project_id === activeProject?.project_id)
                .map(conv => (
                  <div
                    key={conv.id}
                    className="p-2 text-xs hover:bg-gray-100 rounded cursor-pointer"
                    onClick={() => showConversations(conv)}
                  >
                    <div className="font-medium truncate">{conv.session_title}</div>
                    <div className="flex justify-between text-gray-500 mt-1">
                      <span>{conv.register_at}</span>
                      <span>{conv.messages}개 메시지</span>
                    </div>
                  </div>
                ))
              }
            </div>
          ) : (
            <div className="text-xs text-gray-400 text-center py-2">
              저장된 대화가 없습니다
            </div>
          )}
        </div>

        {/* 모델 선택 */}
        <div className="p-3 border-t">
          <div className="relative">
            <button
              className="w-full flex items-center justify-between p-2 border rounded hover:bg-gray-50"
              onClick={() => setShowModelSelector(!showModelSelector)}
            >
              <div className="flex items-center gap-2">
                <Bot size={14} className="text-blue-500" />
                <span className="text-sm">{models.find(m => m.id === selectedModel)?.name || selectedModel}</span>
              </div>
              <ChevronDown size={16} />
            </button>

            {showModelSelector && (
              <div className="absolute bottom-full left-0 right-0 mb-1 bg-white border rounded-lg shadow-lg z-10">
                <div className="p-2">
                  {models.map(model => (
                    <div
                      key={model.id}
                      onClick={() => {
                        setSelectedModel(model.model_name);
                        setShowModelSelector(false);
                      }}
                      className={`flex items-center gap-2 p-2 rounded cursor-pointer ${selectedModel === model.id ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                        }`}
                    >
                      <Bot size={14} className={selectedModel === model.id ? "text-blue-500" : "text-gray-500"} />
                      <div>
                        <div className="text-sm font-medium">{model.model_name}</div>
                        <div className="text-xs text-gray-500">{model.provider_name}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 오른쪽: 채팅 인터페이스 */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {/* 채팅 헤더 */}
        <div className="p-3 bg-white border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot size={18} className="text-blue-500" />
            <span>AI 어시스턴트</span>
          </div>
          <button className="p-1.5 hover:bg-gray-100 rounded">
            <Settings size={16} className="text-gray-500" />
          </button>
        </div>

        {/* 메시지 영역 */}
        <div className="flex-1 overflow-y-auto p-4" ref={messagesEndRef}>
          <div className="max-w-3xl mx-auto space-y-4">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[75%] rounded-lg p-3 ${message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : message.role === 'system'
                    ? 'bg-amber-50 border border-amber-200'
                    : 'bg-white border'
                  }`}>
                  <div className="flex items-center gap-2 mb-1.5">
                    {message.role === 'user' ? (
                      <User size={14} />
                    ) : (
                      <Bot size={14} />
                    )}
                    <div className="text-sm">
                      {message.role === 'user' ? '사용자' : message.role === 'system' ? '시스템' : 'AI 어시스턴트'}
                    </div>
                    {message.model && message.role !== 'user' && (
                      <div className="ml-auto text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                        {models.find(m => m.id === message.model)?.name || message.model}
                      </div>
                    )}
                  </div>

                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>

                  {message.files && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {message.files.map((file, idx) => (
                        <div key={idx} className="text-xs bg-blue-600 bg-opacity-20 text-white rounded px-1.5 py-0.5 flex items-center gap-1">
                          {getFileSourceIcon(file.source)}
                          <span>{file.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border rounded-lg p-3">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-blue-300 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-blue-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}

            {/* <div ref={messagesEndRef} /> */}
          </div>
        </div>

        {/* 입력 영역 */}
        <div className="p-3 bg-white border-t">
          <div className="max-w-3xl mx-auto flex items-center gap-2">
            <button
              onClick={handleFileUpload}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
            >
              <Upload size={18} />
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                multiple
                onChange={handleFileSelect}
              />
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="메시지를 입력하세요..."
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />

            <button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              className={`p-2 rounded-lg ${isLoading || !input.trim()
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectChat;