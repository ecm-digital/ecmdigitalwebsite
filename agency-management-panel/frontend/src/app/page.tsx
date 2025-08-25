"use client";

import { useState, useEffect } from "react";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { RecentProjects } from "@/components/dashboard/recent-projects";
import { TeamActivity } from "@/components/dashboard/team-activity";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { LoginForm } from "@/components/auth/login-form";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
  permissions: string[];
}

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [user, setUser] = useState<User | null>({ id: 'u-local', email: 'admin@ecm-digital.com', name: 'Admin', role: 'admin', permissions: ['all'] });
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    // Disable auth check: render dashboard immediately
    setIsLoading(false);
  }, []);

  const checkAuthStatus = async (token: string) => {
    try {
      const response = await fetch('http://localhost:3001/auth/validate', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('authToken');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('authToken');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    setLoginError(null);
    try {
      const response = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('authToken', data.token);
        setUser(data.user);
        setIsAuthenticated(true);
      } else {
        const error = await response.json();
        setLoginError(error.error || 'Logowanie nie powiodło się');
        console.error('Login failed:', error.error || 'Login failed');
      }
    } catch (error) {
      setLoginError('Błąd połączenia z serwerem');
      console.error('Login failed:', error);
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        await fetch('http://localhost:3001/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      localStorage.removeItem('authToken');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Ładowanie...</p>
        </div>
      </div>
    );
  }

  // Auth disabled: always show dashboard

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-6 py-8">
        {/* User Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Panel Zarządzania Agencją
            </h1>
            <p className="text-muted-foreground">
              Witaj, {user?.name}! Przegląd aktywności i kluczowych metryk Twojej agencji
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-primary-foreground" />
                </div>
              )}
              <span className="text-sm font-medium">{user?.name}</span>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                {user?.role}
              </span>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Wyloguj
            </Button>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Stats Overview */}
          <DashboardStats />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Projects - Takes 2 columns on large screens */}
            <div className="lg:col-span-2">
              <RecentProjects />
            </div>

            {/* Quick Actions - Takes 1 column */}
            <div>
              <QuickActions />
            </div>
          </div>

          {/* Team Activity */}
          <TeamActivity />
        </div>
      </main>
    </div>
  );
}