import React, { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import { Box, Spinner, Center, Text, VStack } from '@chakra-ui/react'
import { Helmet } from 'react-helmet-async'

// Components
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import ProtectedRoute from './components/ProtectedRoute'
import LoadingScreen from './components/LoadingScreen'

// Pages
import HomePage from './pages/HomePage'
import CoursePage from './pages/CoursePage'
import LessonPage from './pages/LessonPage'
import ProfilePage from './pages/ProfilePage'
import NotFoundPage from './pages/NotFoundPage'

// Utils
import { tokenUtils } from './utils/api'

function App() {
  const { 
    isLoading, 
    isAuthenticated, 
    getAccessTokenSilently, 
    error: authError 
  } = useAuth0()

  // Store Auth0 token when user is authenticated
  useEffect(() => {
    const storeToken = async () => {
      if (isAuthenticated) {
        try {
          const token = await getAccessTokenSilently()
          tokenUtils.setToken(token)
        } catch (error) {
          console.error('Error getting access token:', error)
        }
      } else {
        tokenUtils.removeToken()
      }
    }

    if (!isLoading) {
      storeToken()
    }
  }, [isAuthenticated, isLoading, getAccessTokenSilently])

  // Show loading screen while Auth0 is initializing
  if (isLoading) {
    return <LoadingScreen />
  }

  // Show error if Auth0 failed to initialize
  if (authError) {
    return (
      <Center h="100vh" bg="gray.50">
        <VStack spacing={4}>
          <Text fontSize="xl" color="red.500" fontWeight="semibold">
            Authentication Error
          </Text>
          <Text color="gray.600" textAlign="center" maxW="md">
            {authError.message || 'Failed to initialize authentication'}
          </Text>
        </VStack>
      </Center>
    )
  }

  return (
    <>
      <Helmet>
        <title>Text-to-Learn: AI-Powered Course Generator</title>
        <meta 
          name="description" 
          content="Transform any topic into a structured, multi-module online course with AI-powered content generation, video integration, and multilingual support." 
        />
      </Helmet>

      <Box minH="100vh" bg="gray.50">
        <Navbar />
        
        <Box display="flex" minH="calc(100vh - 64px)">
          {/* Sidebar - only show when authenticated */}
          {isAuthenticated && (
            <Box
              w="280px"
              bg="white"
              borderRight="1px"
              borderColor="gray.200"
              position="sticky"
              top="64px"
              h="calc(100vh - 64px)"
              overflowY="auto"
              display={{ base: 'none', lg: 'block' }}
            >
              <Sidebar />
            </Box>
          )}

          {/* Main Content */}
          <Box 
            flex="1" 
            p={{ base: 4, md: 6 }}
            maxW={isAuthenticated ? 'calc(100vw - 280px)' : '100vw'}
            mx="auto"
          >            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              
              {/* Protected Routes */}
              <Route
                path="/courses/:courseId"
                element={
                  <ProtectedRoute>
                    <CoursePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/courses/:courseId/lessons/:lessonId"
                element={
                  <ProtectedRoute>
                    <LessonPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              
              {/* Fallback Route */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default App
