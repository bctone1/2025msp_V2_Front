import React, { useState } from 'react';

const Profile = ({ models, userInfo }) => {

  const [newProfileData, setNewProfileData] = useState({
    name: userInfo.name,
    group: userInfo.group,
  });

  const [newPasswordData, setNewPasswordData] = useState({
    password: '',
    newpassword: '',
    confirmPassword: '',
  });

  const handleSaveProfile = async () => {
    console.log(newProfileData);
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ChangeProfile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ newProfileData: newProfileData, ProfileData: userInfo }),
    });
    if (response.ok) {
      alert("변경되었습니다.");
    } else {
      console.error("Failed to fetch data");
    }
  }

  const handleSavePassword = async () => {
    if (newPasswordData.newpassword != newPasswordData.confirmPassword) {
      alert("새로운 비밀번호를 확인해주세요.");
      return;
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ChangePassword`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ newPasswordData: newPasswordData, ProfileData: userInfo }),
    });
    if (response.ok) {
      const data = await response.json(); // 응답 파싱
      alert(data.message);
      // window.location.href = "/"
    } else {
      console.error("Failed to fetch data");
    }

  }


  return (
    <div className="flex-1 p-6 bg-gray-50 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">내 정보</h1>

        {/* 프로필 정보 */}
        <div className="bg-white rounded-lg border p-6 mb-6">
          <h2 className="text-lg font-medium mb-4">프로필 정보</h2>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">이름</label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg"
                defaultValue={userInfo.name}
                onChange={(e) => setNewProfileData({ ...newProfileData, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">이메일</label>
              <input
                type="email"
                className="w-full px-4 py-2 border rounded-lg"
                defaultValue={userInfo.email}
                disabled
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">소속 조직</label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg"
                defaultValue={userInfo.group}
                onChange={(e) => setNewProfileData({ ...newProfileData, group: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              onClick={() => handleSaveProfile()}>
              저장
            </button>
          </div>
        </div>

        {/* 기본 설정 */}


        {/* 비밀번호 변경 */}
        <div className="bg-white rounded-lg border p-6 mb-6">
          <h2 className="text-lg font-medium mb-4">비밀번호 변경</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">현재 비밀번호</label>
              <input
                type="password"
                className="w-full px-4 py-2 border rounded-lg"
                onChange={(e) => setNewPasswordData({ ...newPasswordData, password: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">새 비밀번호</label>
              <input
                type="password"
                className="w-full px-4 py-2 border rounded-lg"
                onChange={(e) => setNewPasswordData({ ...newPasswordData, newpassword: e.target.value })}
              />
              <p className="text-xs text-gray-500 mt-1">
                8자 이상, 영문, 숫자, 특수문자를 포함해야 합니다.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">새 비밀번호 확인</label>
              <input
                type="password"
                className="w-full px-4 py-2 border rounded-lg"
                onChange={(e) => setNewPasswordData({ ...newPasswordData, confirmPassword: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              onClick={() => handleSavePassword()}>
              비밀번호 변경
            </button>
          </div>
        </div>

        {/* 알림 설정 */}
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-medium mb-4">알림 설정</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <h3 className="font-medium">이메일 알림</h3>
                <p className="text-sm text-gray-500">주요 알림을 이메일로 받습니다</p>
              </div>
              <div className="relative inline-block w-12 h-6">
                <input type="checkbox" className="hidden peer" id="email" defaultChecked />
                <label htmlFor="email" className="absolute cursor-pointer bg-gray-200 peer-checked:bg-blue-500 rounded-full left-0 right-0 top-0 bottom-0 transition-all duration-300 before:absolute before:content-[''] before:h-4 before:w-4 before:left-1 before:bottom-1 before:bg-white before:rounded-full before:transition-all before:duration-300 peer-checked:before:translate-x-6"></label>
              </div>
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <h3 className="font-medium">작업 완료 알림</h3>
                <p className="text-sm text-gray-500">장시간 작업이 완료되면 알림을 받습니다</p>
              </div>
              <div className="relative inline-block w-12 h-6">
                <input type="checkbox" className="hidden peer" id="task" defaultChecked />
                <label htmlFor="task" className="absolute cursor-pointer bg-gray-200 peer-checked:bg-blue-500 rounded-full left-0 right-0 top-0 bottom-0 transition-all duration-300 before:absolute before:content-[''] before:h-4 before:w-4 before:left-1 before:bottom-1 before:bg-white before:rounded-full before:transition-all before:duration-300 peer-checked:before:translate-x-6"></label>
              </div>
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <h3 className="font-medium">프로젝트 업데이트 알림</h3>
                <p className="text-sm text-gray-500">프로젝트 변경사항을 알려드립니다</p>
              </div>
              <div className="relative inline-block w-12 h-6">
                <input type="checkbox" className="hidden peer" id="project" />
                <label htmlFor="project" className="absolute cursor-pointer bg-gray-200 peer-checked:bg-blue-500 rounded-full left-0 right-0 top-0 bottom-0 transition-all duration-300 before:absolute before:content-[''] before:h-4 before:w-4 before:left-1 before:bottom-1 before:bg-white before:rounded-full before:transition-all before:duration-300 peer-checked:before:translate-x-6"></label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;