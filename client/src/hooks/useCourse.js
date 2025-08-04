import { useState, useEffect } from 'react';
import { api } from '../utils/api';

export const useCourse = (courseId) => {
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch course details
        const courseResponse = await api.get(`/courses/${courseId}`);
        setCourse(courseResponse.data);

        // Fetch course modules
        const modulesResponse = await api.get(`/courses/${courseId}/modules`);
        setModules(modulesResponse.data);

      } catch (err) {
        console.error('Error fetching course:', err);
        setError(err.response?.data?.message || 'Failed to load course');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  const updateCourse = (updatedCourse) => {
    setCourse(updatedCourse);
  };

  const updateModules = (updatedModules) => {
    setModules(updatedModules);
  };

  return {
    course,
    modules,
    loading,
    error,
    updateCourse,
    updateModules,
    refetch: () => {
      setLoading(true);
      // Re-trigger useEffect
      setCourse(prev => ({ ...prev }));
    }
  };
};

export default useCourse;
