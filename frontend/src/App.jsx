import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import ProfileSetup from './pages/ProfileSetup';
import HomeChat from './pages/HomeChat';
import Task from './pages/Task';
import Profile from './pages/Profile';
import { ROUTES } from './utils/constants';
import { useFont } from './hooks/useFont';
import './styles/theme.css';

function App() {
  // Apply global font preference
  useFont();

  // Initialize dark mode from localStorage
  useEffect(() => {
    const isDark = localStorage.getItem('darkMode');
    if (isDark === 'true') {
      document.documentElement.classList.add('dark');
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public route - no layout */}
        <Route path="/" element={<Login />} />
        <Route path={ROUTES.LOGIN} element={<Login />} />
        
        {/* Protected routes - with MainLayout */}
        <Route path={ROUTES.SETUP} element={
          <MainLayout>
            <ProfileSetup />
          </MainLayout>
        } />
        
        <Route path={ROUTES.HOME} element={
          <MainLayout>
            <HomeChat />
          </MainLayout>
        } />
        
        <Route path={ROUTES.TASK} element={
          <MainLayout>
            <Task />
          </MainLayout>
        } />
        
        <Route path={ROUTES.PROFILE} element={
          <MainLayout>
            <Profile />
          </MainLayout>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

