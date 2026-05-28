'use client';

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { useSession, signOut } from 'next-auth/react';

function getPasswordStrength(password: string) {
  if (!password) return { score: 0, label: '', color: 'bg-gray-200' };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 1) return { score: 1, label: 'Yếu', color: 'bg-red-500' };
  if (score === 2) return { score: 2, label: 'Trung bình', color: 'bg-[#eab308]' };
  if (score === 3) return { score: 3, label: 'Khá', color: 'bg-blue-500' };
  return { score: 4, label: 'Mạnh', color: 'bg-[#059669]' };
}

export function useSettingsData() {
  const { data: session } = useSession();

  // Account
  const [accountName, setAccountName] = useState('');
  const [accountEmail, setAccountEmail] = useState('');
  const [accountClass, setAccountClass] = useState('');
  const [accountGoal, setAccountGoal] = useState('');
  const [accountImage, setAccountImage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Security
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const strength = useMemo(() => getPasswordStrength(newPassword), [newPassword]);
  const passwordsMatch = newPassword.length > 0 && confirmPassword.length > 0 && newPassword === confirmPassword;
  const passwordsMismatch = newPassword.length > 0 && confirmPassword.length > 0 && newPassword !== confirmPassword;

  // Notifications
  const [notifyDaily, setNotifyDaily] = useState(true);
  const [notifyTime, setNotifyTime] = useState('19:00 tối');
  const [notifyExam, setNotifyExam] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState(false);
  const [notifyStreak, setNotifyStreak] = useState(true);

  // AI & Practice
  const [aiStyle, setAiStyle] = useState('Chi tiết từng bước');
  const [aiSuggest, setAiSuggest] = useState(true);
  const [aiSaveHistory, setAiSaveHistory] = useState(true);
  const [aiLanguage, setAiLanguage] = useState('Tiếng Việt');
  const [practiceQuestionCount, setPracticeQuestionCount] = useState('20 câu');
  const [practiceShowTimer, setPracticeShowTimer] = useState(true);
  const [practiceShuffle, setPracticeShuffle] = useState(true);
  const [practiceShowAnswers, setPracticeShowAnswers] = useState(true);
  const [practiceDifficulty, setPracticeDifficulty] = useState('Trung bình');

  // Init from session
  useEffect(() => {
    if (session?.user) {
      if (!accountName && session.user.name) setAccountName(session.user.name);
      if (!accountEmail && session.user.email) setAccountEmail(session.user.email);
      if (!accountImage && session.user.image) setAccountImage(session.user.image);
    }
  }, [session, accountName, accountEmail, accountImage]);

  // Fetch profile
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/v1/user/profile');
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setAccountName(data.name || session?.user?.name || '');
        setAccountEmail(data.email || session?.user?.email || '');
        setAccountClass(data.grade || 'Lớp 12');
        setAccountGoal(data.targetScore || '8.0 - 9.0 điểm');
        setAccountImage(data.image || session?.user?.image || '');
        const s = data.settings;
        if (s && typeof s === 'object') {
          if (s.notifications) {
            if (typeof s.notifications.daily === 'boolean') setNotifyDaily(s.notifications.daily);
            if (s.notifications.time) setNotifyTime(s.notifications.time);
            if (typeof s.notifications.exam === 'boolean') setNotifyExam(s.notifications.exam);
            if (typeof s.notifications.email === 'boolean') setNotifyEmail(s.notifications.email);
            if (typeof s.notifications.streak === 'boolean') setNotifyStreak(s.notifications.streak);
          }
          if (s.aiChat) {
            if (s.aiChat.style) setAiStyle(s.aiChat.style);
            if (typeof s.aiChat.suggest === 'boolean') setAiSuggest(s.aiChat.suggest);
            if (typeof s.aiChat.saveHistory === 'boolean') setAiSaveHistory(s.aiChat.saveHistory);
            if (s.aiChat.language) setAiLanguage(s.aiChat.language);
          }
          if (s.practice) {
            if (s.practice.questionCount) setPracticeQuestionCount(s.practice.questionCount);
            if (typeof s.practice.showTimer === 'boolean') setPracticeShowTimer(s.practice.showTimer);
            if (typeof s.practice.shuffle === 'boolean') setPracticeShuffle(s.practice.shuffle);
            if (typeof s.practice.showAnswers === 'boolean') setPracticeShowAnswers(s.practice.showAnswers);
            if (s.practice.difficulty) setPracticeDifficulty(s.practice.difficulty);
          }
        }
      } catch (err) { console.error('Failed to fetch profile:', err); }
      finally { setIsLoading(false); }
    })();
  }, [session]);

  // Handlers
  const handleAvatarUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Ảnh quá lớn (tối đa 5MB)'); return; }
    setIsUploadingAvatar(true);
    try {
      const fd = new FormData(); fd.append('file', file);
      const res = await fetch('/api/v1/user/avatar', { method: 'POST', body: fd });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || 'Upload failed'); }
      const data = await res.json(); setAccountImage(data.url);
      await fetch('/api/v1/user/profile', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ image: data.url }) });
      toast.success('Đã cập nhật ảnh đại diện!');
    } catch (err) { console.error('Avatar upload error:', err); toast.error('Có lỗi khi tải ảnh lên.'); }
    finally { setIsUploadingAvatar(false); if (avatarInputRef.current) avatarInputRef.current.value = ''; }
  }, []);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/v1/user/profile', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: accountName, email: accountEmail, grade: accountClass, targetScore: accountGoal, image: accountImage,
          settings: {
            notifications: { daily: notifyDaily, time: notifyTime, exam: notifyExam, email: notifyEmail, streak: notifyStreak },
            aiChat: { style: aiStyle, suggest: aiSuggest, saveHistory: aiSaveHistory, language: aiLanguage },
            practice: { questionCount: practiceQuestionCount, showTimer: practiceShowTimer, shuffle: practiceShuffle, showAnswers: practiceShowAnswers, difficulty: practiceDifficulty },
          },
        }),
      });
      if (!res.ok) throw new Error('Cập nhật thất bại');
      toast.success('Đã lưu thay đổi!');
    } catch (err) { console.error('Save error:', err); toast.error('Có lỗi xảy ra khi lưu thay đổi.'); }
    finally { setIsSaving(false); }
  }, [accountName, accountEmail, accountClass, accountGoal, accountImage, notifyDaily, notifyTime, notifyExam, notifyEmail, notifyStreak, aiStyle, aiSuggest, aiSaveHistory, aiLanguage, practiceQuestionCount, practiceShowTimer, practiceShuffle, practiceShowAnswers, practiceDifficulty]);

  const handleChangePassword = useCallback(async () => {
    if (!currentPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword || strength.score < 2) return;
    setIsChangingPassword(true);
    try {
      const res = await fetch('/api/v1/user/change-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ currentPassword, newPassword }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Đổi mật khẩu thất bại');
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
      toast.success('Mật khẩu đã được cập nhật!');
    } catch (err: unknown) { toast.error(err instanceof Error ? err.message : 'Có lỗi xảy ra khi đổi mật khẩu.'); }
    finally { setIsChangingPassword(false); }
  }, [currentPassword, newPassword, confirmPassword, strength.score]);

  const handleLogout = useCallback(() => { if (confirm('Bạn có chắc chắn muốn đăng xuất?')) signOut({ callbackUrl: '/login' }); }, []);

  const handleDeleteAccount = useCallback(async () => {
    if (!deletePassword) { toast.error('Vui lòng nhập mật khẩu để xác nhận.'); return; }
    setIsDeletingAccount(true);
    try {
      const res = await fetch('/api/v1/user/account', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: deletePassword }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Xóa tài khoản thất bại');
      toast.success('Tài khoản đã được xóa.'); signOut({ callbackUrl: '/login' });
    } catch (err: unknown) { toast.error(err instanceof Error ? err.message : 'Có lỗi xảy ra.'); }
    finally { setIsDeletingAccount(false); }
  }, [deletePassword]);

  return {
    // Account
    accountName, setAccountName, accountEmail, setAccountEmail, accountClass, setAccountClass,
    accountGoal, setAccountGoal, accountImage, avatarInputRef, isLoading, isSaving, isUploadingAvatar,
    handleAvatarUpload, handleSave,
    // Security
    currentPassword, setCurrentPassword, newPassword, setNewPassword, confirmPassword, setConfirmPassword,
    showCurrentPassword, setShowCurrentPassword, showNewPassword, setShowNewPassword,
    isChangingPassword, handleChangePassword, strength, passwordsMatch, passwordsMismatch,
    deletePassword, setDeletePassword, isDeletingAccount, showDeleteConfirm, setShowDeleteConfirm,
    handleLogout, handleDeleteAccount,
    // Notifications
    notifyDaily, setNotifyDaily, notifyTime, setNotifyTime, notifyExam, setNotifyExam,
    notifyEmail, setNotifyEmail, notifyStreak, setNotifyStreak,
    // AI
    aiStyle, setAiStyle, aiSuggest, setAiSuggest, aiSaveHistory, setAiSaveHistory, aiLanguage, setAiLanguage,
    // Practice
    practiceQuestionCount, setPracticeQuestionCount, practiceShowTimer, setPracticeShowTimer,
    practiceShuffle, setPracticeShuffle, practiceShowAnswers, setPracticeShowAnswers,
    practiceDifficulty, setPracticeDifficulty,
  };
}
