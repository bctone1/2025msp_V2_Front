"use client"
import React, { useState, useRef } from 'react';
import {
    Bot, User, Send, FileText,
    Upload, PlusCircle, Search,
    ChevronDown, Settings, Cloud,
    Folder, Database, History, Trash2
} from 'lucide-react';


import { useSession, signOut } from "next-auth/react";

const SimplifiedInterface = () => {
    // 핵심 상태
    const { data: session } = useSession();
    const [view, setView] = useState('projects'); // 'projects', 'new-project', 'chat'
    const [activeProject, setActiveProject] = useState(null);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedModel, setSelectedModel] = useState('gpt-4');
    const [files, setFiles] = useState([]);
    const [projectName, setProjectName] = useState('');
    const [projectDesc, setProjectDesc] = useState('');
    const [projectCategory, setProjectCategory] = useState('web');
    const [showModelSelector, setShowModelSelector] = useState(false);
    const [fileSource, setFileSource] = useState('local'); // 'local', 'drive', 'github', 'dropbox'
    const fileInputRef = useRef(null);
    const messagesEndRef = useRef(null);

    // 샘플 데이터
    const projects = [
        { id: 'proj-1', name: '웹사이트 개발', category: 'web', desc: '회사 웹사이트', model: 'gpt-4' },
        { id: 'proj-2', name: '모바일 앱', category: 'mobile', desc: '주문 관리 앱', model: 'claude-3' }
    ];

    const models = [
        { id: 'gpt-4', name: 'GPT-4', provider: 'OpenAI' },
        { id: 'claude-3', name: 'Claude 3', provider: 'Anthropic' },
        { id: 'deepseek-coder', name: 'DeepSeek Coder', provider: 'Local' },
        { id: 'gemini-pro', name: 'Gemini Pro', provider: 'Google' }
    ];

    const categories = [
        { id: 'web', name: '웹 개발' },
        { id: 'mobile', name: '모바일 앱' },
        { id: 'ai', name: 'AI/ML' },
        { id: 'data', name: '데이터' }
    ];

    const conversations = [
        { id: 'conv-1', title: '로그인 기능 구현', project: 'proj-1' },
        { id: 'conv-2', title: 'DB 설계 논의', project: 'proj-1' }
    ];

    const handleRemove = (file) => {
        console.log("삭제할 파일:", file);  // 파일 구조 확인
        console.log("파일 이름:", file[0]?.name); // 첫 번째 파일의 이름 확인

        setFiles(prevFiles => prevFiles.filter(r => r.name !== file[0]?.name));
    };


    // 프로젝트 선택
    const selectProject = (projectId) => {
        const project = projects.find(p => p.id === projectId);
        setActiveProject(project);
        setSelectedModel(project.model);
        setView('chat');
        setMessages([{
            id: 1,
            role: 'system',
            content: `${project.name} 프로젝트를 시작합니다. ${project.desc ? `설명: ${project.desc}` : ''} 어떤 도움이 필요하신가요?`
        }]);
    };

    // 새 프로젝트 생성
    const createProject = () => {
        if (!projectName) return;

        const newProject = {
            id: `proj-${Date.now()}`,
            name: projectName,
            desc: projectDesc,
            category: projectCategory,
            model: selectedModel
        };

        // 실제로는 프로젝트 목록에 추가
        setActiveProject(newProject);
        setView('chat');
        setMessages([{
            id: 1,
            role: 'system',
            content: `${newProject.name} 프로젝트를 시작합니다. ${newProject.desc ? `설명: ${newProject.desc}` : ''} 어떤 도움이 필요하신가요?`
        }]);

        // 입력 필드 초기화
        setProjectName('');
        setProjectDesc('');
    };

    // 메시지 전송
    const sendMessage = () => {
        if (!input.trim()) return;

        const userMessage = {
            id: messages.length + 1,
            role: 'user',
            content: input
        };

        setMessages([...messages, userMessage]);
        setInput('');
        setIsLoading(true);

        // 응답 시뮬레이션
        setTimeout(() => {
            const aiResponse = {
                id: messages.length + 2,
                role: 'assistant',
                content: `${activeProject.name} 프로젝트에 대한 질문에 답변드립니다. 더 자세한 설명이 필요하시면 말씀해주세요.`,
                model: selectedModel
            };

            setMessages(prev => [...prev, aiResponse]);
            setIsLoading(false);
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 1000);
    };

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

    const handleFileSelect = (e) => {
        const selectedFiles = Array.from(e.target.files);
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
                messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 1000);
        }
    };

    // 파일 소스에 따른 아이콘 반환
    const getFileSourceIcon = (source) => {
        switch (source) {
            case 'drive': return <Cloud size={14} />;
            case 'github': return <FileText size={14} />;
            case 'dropbox': return <FileText size={14} />;
            default: return <FileText size={14} />;
        }
    };

    // 대화 저장
    const saveConversation = () => {
        if (messages.length <= 1) return; // 시스템 메시지만 있는 경우 저장하지 않음

        const title = messages.find(m => m.role === 'user')?.content.slice(0, 20) + '...';
        alert(`대화가 "${title}" 이름으로 저장되었습니다.`);
    };

    // 프로젝트 목록 화면
    const renderProjects = () => (
        <div className="flex-1 p-6 bg-gray-50">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">내 프로젝트</h2>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="프로젝트 검색..."
                                className="pl-10 pr-4 py-2 border rounded-lg"
                            />
                        </div>
                        <button
                            onClick={() => setView('new-project')}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
                        >
                            <PlusCircle size={16} />
                            <span>새 프로젝트</span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
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
                            </div>

                            <div className="flex items-center justify-between mt-4">
                                <div className="flex items-center text-sm text-gray-600">
                                    <Bot size={14} className="mr-1" />
                                    <span>{models.find(m => m.id === project.model)?.name || project.model}</span>
                                </div>
                                <div className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600">
                                    {categories.find(c => c.id === project.category)?.name || '기타'}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    // 새 프로젝트 화면
    const renderNewProject = () => (
        <div className="flex-1 flex items-center justify-center bg-gray-50 p-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-6">새 프로젝트</h2>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">프로젝트 이름</label>
                    <input
                        type="text"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        placeholder="프로젝트 이름을 입력하세요"
                        className="w-full px-4 py-2 border rounded-lg"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">프로젝트 설명 (선택사항)</label>
                    <textarea
                        value={projectDesc}
                        onChange={(e) => setProjectDesc(e.target.value)}
                        placeholder="프로젝트에 대한 간단한 설명을 입력하세요"
                        className="w-full px-4 py-2 border rounded-lg h-20 resize-none"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">카테고리</label>
                    <div className="grid grid-cols-4 gap-2">
                        {categories.map(category => (
                            <div
                                key={category.id}
                                onClick={() => setProjectCategory(category.id)}
                                className={`p-2 border rounded-lg cursor-pointer text-center ${projectCategory === category.id
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'hover:bg-gray-50'
                                    }`}
                            >
                                <div className="text-xs">{category.name}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">AI 모델 선택</label>
                    <div className="grid grid-cols-2 gap-3">
                        {models.map(model => (
                            <div
                                key={model.id}
                                onClick={() => setSelectedModel(model.id)}
                                className={`p-3 border rounded-lg cursor-pointer ${selectedModel === model.id
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

                <div className="flex justify-between">
                    <button
                        onClick={() => setView('projects')}
                        className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                    >
                        취소
                    </button>
                    <button
                        onClick={createProject}
                        disabled={!projectName.trim()}
                        className={`px-4 py-2 rounded-lg ${!projectName.trim()
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                            }`}
                    >
                        프로젝트 생성
                    </button>
                </div>
            </div>
        </div>
    );

    // 채팅 인터페이스
    const renderChat = () => (
        <div className="flex-1 flex">
            {/* 왼쪽: 지식 베이스 및 대화 이력 패널 */}
            <div className="w-64 bg-white border-r flex flex-col">
                {/* 프로젝트 정보 */}
                <div className="p-3 border-b">
                    <div className="flex items-center justify-between">
                        <div className="font-medium truncate">{activeProject.name}</div>
                        <button
                            onClick={() => setView('projects')}
                            className="p-1 hover:bg-gray-100 rounded"
                            title="프로젝트 목록"
                        >
                            <Folder size={16} className="text-gray-500" />
                        </button>
                    </div>
                    {activeProject.desc && (
                        <p className="text-xs text-gray-500 mt-1 truncate">{activeProject.desc}</p>
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
                                <Database size={14} />
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
                                    <button
                                        onClick={() => handleRemove(files)}
                                        className="p-1.5 hover:bg-red-100 rounded"
                                    >
                                        <Trash2 className="w-4 h-4 text-red-500" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-xs text-gray-400 text-center py-2">
                            파일이 없습니다
                        </div>
                    )}
                </div>

                {/* 새로운 대화 */}
                <div className="p-3 border-b flex justify-between items-center">
                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition w-full"
                        onClick={() => console.log("새로운 대화 시작")}
                    >
                        새로운 대화하기
                    </button>
                </div>

                {/* 대화 이력 */}
                <div className="p-3 flex-1 overflow-y-auto">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium">대화 이력</h3>
                        <button
                            onClick={saveConversation}
                            className="p-1 hover:bg-gray-100 rounded"
                            title="현재 대화 저장"
                        >
                            <History size={14} className="text-gray-500" />
                        </button>
                    </div>
                    {conversations
                        .filter(c => c.project === activeProject?.id)
                        .length > 0 ? (
                        <div className="space-y-1">
                            {conversations
                                .filter(c => c.project === activeProject?.id)
                                .map(conv => (
                                    <div
                                        key={conv.id}
                                        className="p-2 text-xs hover:bg-gray-100 rounded cursor-pointer"
                                    >
                                        <div className="font-medium truncate">{conv.title}</div>
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

                {/* 유저 정보 */}
                <div className="p-3 border-t">
                    {session ? (
                        <>
                            <p className="text-sm">{session.user.name || "이름 없음"}</p>
                            <p className="text-sm">{session.user.email || "이메일 없음"}</p>
                            <button
                                onClick={() => signOut({ callbackUrl: "/login" })}
                                className="mt-4 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
                            >
                                로그아웃
                            </button>
                        </>
                    ) : (
                        <>
                            <p className="text-sm">로그인된 사용자 없음</p>
                            <button
                                onClick={() => (window.location.href = "/login")}
                                className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                            >
                                로그인
                            </button>
                        </>
                    )}
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

                    {/* 모델 선택 */}
                    <div className="p-3 w-[200px]">
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
                                <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-10">

                                    <div className="p-2">
                                        {models.map(model => (
                                            <div
                                                key={model.id}
                                                onClick={() => {
                                                    setSelectedModel(model.id);
                                                    setShowModelSelector(false);
                                                }}
                                                className={`flex items-center gap-2 p-2 rounded cursor-pointer ${selectedModel === model.id ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                                                    }`}
                                            >
                                                <Bot size={14} className={selectedModel === model.id ? "text-blue-500" : "text-gray-500"} />
                                                <div>
                                                    <div className="text-sm font-medium">{model.name}</div>
                                                    <div className="text-xs text-gray-500">{model.provider}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <button className="p-1.5 hover:bg-gray-100 rounded">
                        <Settings size={16} className="text-gray-500" />
                    </button>
                </div>

                {/* 메시지 영역 */}
                <div className="flex-1 overflow-y-auto p-4">
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
                                        {message.model && (
                                            <div className="ml-auto text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                                                {models.find(m => m.id === message.model)?.name || message.model}
                                            </div>
                                        )}
                                    </div>

                                    <p className="text-sm">{message.content}</p>

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

                        <div ref={messagesEndRef} />
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

    return (
        <div className="h-screen flex flex-col">
            {/* 헤더 */}
            <div className="bg-white border-b px-4 py-2 flex items-center">
                <Bot size={20} className="text-blue-500 mr-2" />
                <span className="font-medium">META LLM MSP</span>
            </div>

            {/* 콘텐츠 영역 */}
            {view === 'projects' && renderProjects()}
            {view === 'new-project' && renderNewProject()}
            {view === 'chat' && renderChat()}
        </div>
    );
};

export default SimplifiedInterface;