"use client";

import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Menu, LogOut, Bell, Package, UserPlus, Check } from 'lucide-react';
import { Button } from '@/components/shared/ui/Button';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  link?: string | null;
  isRead: boolean;
  createdAt: string;
}

interface AdminHeaderProps {
  adminName?: string;
  adminEmail?: string;
  adminAvatar?: string | null;
}

export function AdminHeader({ adminName, adminEmail, adminAvatar }: AdminHeaderProps) {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch {
      // Silently fail
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      await fetch('/api/notifications', { method: 'PATCH' });
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch {
      // Silently fail
    }
  };

  // Fetch on mount and poll every 30s
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target as Node)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const getTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'الآن';
    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `منذ ${hours} ساعة`;
    const days = Math.floor(hours / 24);
    return `منذ ${days} يوم`;
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'NEW_ORDER':
        return <Package className="h-4 w-4 text-blue-500" />;
      case 'NEW_CUSTOMER':
        return <UserPlus className="h-4 w-4 text-green-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 border-gray-200 bg-white px-6 dark:border-gray-800 dark:bg-gray-950">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => {
              setShowDropdown(!showDropdown);
              if (!showDropdown && unreadCount > 0) {
                markAllAsRead();
              }
            }}
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-gray-950">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showDropdown && (
            <div className="absolute left-0 sm:right-0 sm:left-auto mt-2 w-80 rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900 z-50 overflow-hidden">
              <div className="flex items-center justify-between border-b border-gray-200 border-gray-100 px-4 py-3 dark:border-gray-800">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">الإشعارات</h3>
                {notifications.some(n => !n.isRead) && (
                  <button
                    onClick={markAllAsRead}
                    className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400"
                  >
                    <Check className="h-3 w-3" />
                    قراءة الكل
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                    لا توجد إشعارات
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => {
                        if (notification.link) {
                          router.push(notification.link);
                          setShowDropdown(false);
                        }
                      }}
                      className={`flex items-start gap-3 px-4 py-3 border-b border-gray-200 border-gray-50 dark:border-gray-800 transition-colors ${
                        notification.link ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50' : ''
                      } ${!notification.isRead ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''}`}
                    >
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {notification.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
                          {getTimeAgo(notification.createdAt)}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="h-8 w-px bg-gray-200 dark:bg-gray-700" />

        {/* User Info & Dropdown */}
        <div className="relative" ref={userDropdownRef}>
          <button 
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 p-1.5 rounded-xl transition-colors"
          >
           

            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">
                {adminName || 'مدير'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight">
                {adminEmail || ''}
              </p>
            </div>

             <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 font-bold overflow-hidden shadow-inner">
              {adminAvatar ? (
                <img src={adminAvatar} alt="Admin" className="w-full h-full object-cover" />
              ) : (
                (adminName || 'A').charAt(0).toUpperCase()
              )}
            </div>
                        
          </button>

          {/* User Dropdown */}
          {showUserDropdown && (
            <div className="absolute left-0 mt-2 w-48 rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900 z-50 overflow-hidden">
              <div className="p-2">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>تسجيل الخروج</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
