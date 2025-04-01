"use client"

import React, { useState, useRef, useEffect } from 'react';
import { useSession } from "next-auth/react";

import Navigation from '@/components/Navigation';
import Dashboard from '@/components/Dashboard';
import ProjectsList from '@/components/ProjectsList';
import NewProject from '@/components/NewProject';
import ProjectChat from '@/components/ProjectChat';
import ApiKeys from '@/components/ApiKeys';
import Profile from '@/components/Profile';



const EnhancedMetaLLMInterface = () => {
  // 핵심 상태
  const [view, setView] = useState('dashboard');
  const [navView, setNavView] = useState('dashboard');
  const [activeProject, setActiveProject] = useState(null);
  const [selectedModel, setSelectedModel] = useState('gpt-4');

  // 샘플 데이터
  const { data: session, status } = useSession();
  const [projects, setProjects] = useState([]);
  const [apiKeys, setApiKeys] = useState([]);
  const [providers, setProviders] = useState([]);
  const [userinfo, setUserinfo] = useState([]);
  const [sessionLogs, setSessionLogs] = useState([]);
  const [conversations, setconversations] = useState([]);
  const [ModelsData, setModelsData] = useState([]);


  useEffect(() => {
    if (status !== "authenticated") return;
    if (session?.user?.email) {
      // console.log(session);
      fetchProjects(session.user.email);
      fetchUserInfo(session.user.email);
      fetchSessions(session.user.email);
      fetchConversations(session.user.email);
    }
  }, [session, status]); // session과 status가 변경될 때 실행

  const fetchConversations = async (email) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/getConversations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email }),
    });
    const data = await response.json();
    if (response.ok) {
      console.log(data);
      setconversations(data);
    } else {
      alert("대화기록 오류발생");
    }
  };

  const fetchSessions = async (email) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/getSessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email }),
    });
    const data = await response.json();
    if (response.ok) {
      setSessionLogs(data);
      // console.log(data);
    } else {
      alert("대화세션 오류발생");
    }
  };

  const fetchProjects = async (email) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projectsList`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email }),
    });
    const data = await response.json();
    if (response.ok) {
      setProjects(data);
      // console.log(data);
    } else {
      alert("프로젝트 오류발생");
    }
  };

  const fetchUserInfo = async (email) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/getUserInfo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email }),
    });
    const data = await response.json();
    if (response.ok) {
      setUserinfo(data);
    } else {
      alert("사용자정보 오류발생");
    }
  };

  useEffect(() => {

    const fetchModels = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/modelsList`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (response.ok) {
        console.log(data);
        setModelsData(data.models);
      } else {
        alert("공급자 오류발생");
      }
    };

    const fetchProvider = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/providerList`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (response.ok) {
        setProviders(data);
      } else {
        alert("공급자 오류발생");
      }
    };


    const fetchAPIKey = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/APIkeyList`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (response.ok) {
        console.log(data);
        setApiKeys(data.api_keys);
      } else {
        alert("APIkey 오류발생");
      }
    };

    fetchModels();
    fetchProvider();
    fetchAPIKey();
  }, []);





  // const projects = [
  //   { id: 'proj-1', name: '웹사이트 개발', category: 'web', desc: '회사 웹사이트', model: 'gpt-4', lastActive: '오늘', progress: 65, status: 'active' },
  //   { id: 'proj-2', name: '모바일 앱', category: 'mobile', desc: '주문 관리 앱', model: 'claude-3', lastActive: '어제', progress: 30, status: 'active' },
  //   { id: 'proj-3', name: 'DB 마이그레이션', category: 'database', desc: 'NoSQL 마이그레이션', model: 'deepseek-coder', lastActive: '3일 전', progress: 100, status: 'completed' }
  // ];

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
    { id: 'database', name: '데이터베이스' }
  ];

  // const conversations = [
  //   { id: 'conv-1', title: '로그인 기능 구현', project: 3, date: '2024-03-10', messages: 24 },
  //   { id: 'conv-2', title: 'DB 설계 논의', project: 3, date: '2024-03-12', messages: 15 }
  // ];

  // const apiKeys = [
  //   { id: 'key-1', name: 'OpenAI API', key: 'sk-abc...xyz', provider: 'OpenAI', status: 'active', lastUsed: '2시간 전', usage: { current: 45320, limit: 100000 } },
  //   { id: 'key-2', name: 'Claude API', key: 'sk-ant...def', provider: 'Anthropic', status: 'active', lastUsed: '5시간 전', usage: { current: 12850, limit: 50000 } },
  //   { id: 'key-3', name: 'DeepSeek API', key: 'sk-deep...ghi', provider: 'DeepSeek', status: 'expired', lastUsed: '7일 전', usage: { current: 0, limit: 0 } }
  // ];

  const recentActivities = [
    { id: 'act-1', type: 'message', project: 'proj-1', title: '인증 서비스 설계', time: '3시간 전', description: '사용자 인증 플로우 논의' },
    { id: 'act-2', type: 'file', project: 'proj-2', title: '앱 와이어프레임 업로드', time: '어제', description: '주문 프로세스 UI 설계' },
    { id: 'act-3', type: 'code', project: 'proj-1', title: 'JWT 처리 모듈 생성', time: '2일 전', description: '토큰 생성 및 검증 기능' }
  ];

  // 프로젝트 선택
  const selectProject = (projectId) => {
    // console.log(projectId);
    const project = projects.find(p => p.project_id === projectId);
    // console.log(project);
    setActiveProject(project);
    setSelectedModel(project.ai_model);
    setView('project-detail');
  };

  // 네비게이션 변경
  const changeNavigation = (nav) => {
    setNavView(nav);
    setView(nav);
  };

  return (
    <div className="h-screen flex">
      {/* 네비게이션 메뉴 */}
      <Navigation
        navView={navView}
        changeNavigation={changeNavigation}
      />

      {/* 메인 컨텐츠 영역 */}
      {view === 'dashboard' && (
        <Dashboard
          projects={projects}
          apiKeys={apiKeys}
          sessionLogs={sessionLogs}
          recentActivities={recentActivities}
          selectProject={selectProject}
          changeNavigation={changeNavigation}
        />
      )}

      {view === 'projects' && (
        <ProjectsList
          projects={projects}
          categories={categories}
          models={providers}
          selectProject={selectProject}
          setView={setView}
        />
      )}

      {view === 'new-project' && (
        <NewProject
          categories={categories}
          models={ModelsData}
          setView={setView}
          setActiveProject={setActiveProject}
          sessionemail={session.user.email}
        />
      )}

      {view === 'project-detail' && (
        <ProjectChat
          activeProject={activeProject}
          models={ModelsData}
          sessionLogs={sessionLogs}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          setView={setView}
          conversations={conversations}
        />
      )}

      {view === 'apikeys' && (
        <ApiKeys
          apiKeys={apiKeys}
          sessionData = {session}
        />
      )}

      {view === 'profile' && (
        <Profile
          models={models} userInfo={userinfo}
        />
      )}
    </div>
  );
};

export default EnhancedMetaLLMInterface;