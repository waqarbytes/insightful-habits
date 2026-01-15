import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHabits } from '@/context/HabitContext';

const Index = () => {
  const { isAuthenticated } = useHabits();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Redirects are handled by Dashboard component
  return null;
};

export default Index;
