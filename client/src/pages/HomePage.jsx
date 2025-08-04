import React, { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Input,
  FormControl,
  FormLabel,
  FormHelperText,
  useToast,
  Grid,
  GridItem,
  Card,
  CardBody,
  Badge,
  Spinner,
  Center,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react'
import { useAuth0 } from '@auth0/auth0-react'
import { useNavigate } from 'react-router-dom'
import { FiBook, FiClock, FiTrendingUp, FiPlus, FiSearch } from 'react-icons/fi'
import { Helmet } from 'react-helmet-async'
import { apiClient, handleApiError } from '../utils/api'

const HomePage = () => {
  const { isAuthenticated, loginWithRedirect, user } = useAuth0()
  const [topic, setTopic] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [courses, setCourses] = useState([])
  const [isLoadingCourses, setIsLoadingCourses] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const toast = useToast()
  const navigate = useNavigate()

  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  // Load user's courses if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadUserCourses()
    }
  }, [isAuthenticated])

  const loadUserCourses = async () => {
    setIsLoadingCourses(true)
    try {
      const response = await apiClient.courses.getAll({ limit: 6 })
      setCourses(response.data.data)
    } catch (error) {
      const errorInfo = handleApiError(error)
      toast({
        title: 'Error loading courses',
        description: errorInfo.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsLoadingCourses(false)
    }
  }

  const handleTopicChange = async (e) => {
    const value = e.target.value
    setTopic(value)

    // Get suggestions when user types
    if (value.length >= 3) {
      try {
        const response = await apiClient.courses.getSuggestions(value)
        setSuggestions(response.data.data.slice(0, 5))
      } catch (error) {
        // Silently handle suggestion errors
        setSuggestions([])
      }
    } else {
      setSuggestions([])
    }
  }

  const handleGenerateCourse = async () => {
    if (!topic.trim()) {
      toast({
        title: 'Topic required',
        description: 'Please enter a topic to generate a course',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    if (!isAuthenticated) {
      loginWithRedirect()
      return
    }

    setIsGenerating(true)
    try {
      const response = await apiClient.courses.create({ topic: topic.trim() })
      const newCourse = response.data.data

      toast({
        title: 'Course generated successfully!',
        description: `"${newCourse.title}" is ready for you to explore.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      })

      // Navigate to the new course
      navigate(`/courses/${newCourse._id}`)
    } catch (error) {
      const errorInfo = handleApiError(error)
      toast({
        title: 'Failed to generate course',
        description: errorInfo.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSuggestionClick = (suggestion) => {
    setTopic(suggestion)
    setSuggestions([])
  }

  const CourseCard = ({ course }) => (
    <Card
      bg={cardBg}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="xl"
      overflow="hidden"
      _hover={{
        transform: 'translateY(-2px)',
        boxShadow: 'lg',
      }}
      transition="all 0.2s"
      cursor="pointer"
      onClick={() => navigate(`/courses/${course._id}`)}
    >
      <CardBody>
        <VStack align="start" spacing={3}>
          <HStack justify="space-between" w="100%">
            <Badge colorScheme="brand" variant="subtle">
              {course.difficulty}
            </Badge>
            <Text fontSize="sm" color="gray.500">
              {course.moduleCount} modules
            </Text>
          </HStack>
          
          <Box>
            <Heading size="sm" mb={2} noOfLines={2}>
              {course.title}
            </Heading>
            <Text fontSize="sm" color="gray.600" noOfLines={3}>
              {course.description}
            </Text>
          </Box>

          <HStack spacing={4} fontSize="xs" color="gray.500">
            <HStack>
              <Icon as={FiClock} />
              <Text>{course.estimatedHours}h</Text>
            </HStack>
            <HStack>
              <Icon as={FiBook} />
              <Text>{course.modules?.length || 0} modules</Text>
            </HStack>
          </HStack>
        </VStack>
      </CardBody>
    </Card>
  )

  return (
    <>
      <Helmet>
        <title>Text-to-Learn: AI-Powered Course Generator</title>
        <meta 
          name="description" 
          content="Transform any topic into a structured, multi-module online course with AI-powered content generation." 
        />
      </Helmet>

      <Container maxW="6xl" py={8}>
        {/* Hero Section */}
        <VStack spacing={8} textAlign="center" mb={12}>
          <Box>
            <Heading
              size="2xl"
              bgGradient="linear(135deg, brand.500 0%, accent.500 100%)"
              bgClip="text"
              mb={4}
            >
              Transform Any Topic Into a Complete Course
            </Heading>
            <Text fontSize="xl" color="gray.600" maxW="2xl" mx="auto">
              Powered by AI, create structured learning experiences with rich content, 
              interactive quizzes, and video suggestions in minutes.
            </Text>
          </Box>

          {/* Course Generation Form */}
          <Box w="100%" maxW="2xl" position="relative">
            <FormControl>
              <FormLabel fontSize="lg" fontWeight="semibold">
                What would you like to learn?
              </FormLabel>
              <VStack spacing={4}>
                <Box position="relative" w="100%">
                  <Input
                    placeholder="e.g., Introduction to React Hooks, Basics of Copyright Law, Python for Beginners..."
                    value={topic}
                    onChange={handleTopicChange}
                    size="lg"
                    bg="white"
                    borderWidth="2px"
                    borderColor="gray.200"
                    _focus={{
                      borderColor: 'brand.500',
                      boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
                    }}
                    _hover={{
                      borderColor: 'gray.300',
                    }}
                  />
                  
                  {/* Suggestions Dropdown */}
                  {suggestions.length > 0 && (
                    <Box
                      position="absolute"
                      top="100%"
                      left={0}
                      right={0}
                      bg="white"
                      border="1px"
                      borderColor="gray.200"
                      borderRadius="md"
                      boxShadow="lg"
                      zIndex={10}
                      mt={1}
                    >
                      {suggestions.map((suggestion, index) => (
                        <Box
                          key={index}
                          px={4}
                          py={2}
                          cursor="pointer"
                          _hover={{ bg: 'gray.50' }}
                          onClick={() => handleSuggestionClick(suggestion)}
                          fontSize="sm"
                        >
                          {suggestion}
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>

                <Button
                  variant="gradient"
                  size="lg"
                  onClick={handleGenerateCourse}
                  isLoading={isGenerating}
                  loadingText="Generating Course..."
                  leftIcon={<FiPlus />}
                  w={{ base: '100%', md: 'auto' }}
                  px={8}
                >
                  Generate Course
                </Button>
              </VStack>
              <FormHelperText textAlign="center" mt={4}>
                Our AI will create a comprehensive course with modules, lessons, 
                quizzes, and suggested videos
              </FormHelperText>
            </FormControl>
          </Box>
        </VStack>

        {/* User's Recent Courses */}
        {isAuthenticated && (
          <Box>
            <HStack justify="space-between" mb={6}>
              <Box>
                <Heading size="lg" mb={2}>
                  Welcome back, {user?.name?.split(' ')[0] || 'there'}!
                </Heading>
                <Text color="gray.600">
                  Continue your learning journey
                </Text>
              </Box>
              <Button
                variant="outline"
                leftIcon={<FiSearch />}
                onClick={() => navigate('/courses')}
              >
                View All Courses
              </Button>
            </HStack>

            {isLoadingCourses ? (
              <Center py={12}>
                <VStack spacing={4}>
                  <Spinner size="lg" color="brand.500" />
                  <Text color="gray.500">Loading your courses...</Text>
                </VStack>
              </Center>
            ) : courses.length > 0 ? (
              <Grid
                templateColumns={{
                  base: '1fr',
                  md: 'repeat(2, 1fr)',
                  lg: 'repeat(3, 1fr)',
                }}
                gap={6}
              >
                {courses.map((course) => (
                  <GridItem key={course._id}>
                    <CourseCard course={course} />
                  </GridItem>
                ))}
              </Grid>
            ) : (
              <Center py={12}>
                <VStack spacing={4}>
                  <Icon as={FiBook} boxSize={12} color="gray.400" />
                  <Text color="gray.500" textAlign="center">
                    No courses yet. Generate your first course above!
                  </Text>
                </VStack>
              </Center>
            )}
          </Box>
        )}

        {/* Features Section for Non-Authenticated Users */}
        {!isAuthenticated && (
          <Box mt={16}>
            <Heading size="xl" textAlign="center" mb={8}>
              Why Choose Text-to-Learn?
            </Heading>
            <Grid
              templateColumns={{
                base: '1fr',
                md: 'repeat(3, 1fr)',
              }}
              gap={8}
            >
              <VStack spacing={4} textAlign="center">
                <Icon as={FiTrendingUp} boxSize={8} color="brand.500" />
                <Heading size="md">AI-Powered Generation</Heading>
                <Text color="gray.600">
                  Advanced AI creates comprehensive course structures with rich content
                </Text>
              </VStack>
              <VStack spacing={4} textAlign="center">
                <Icon as={FiBook} boxSize={8} color="brand.500" />
                <Heading size="md">Rich Learning Content</Heading>
                <Text color="gray.600">
                  Interactive lessons with quizzes, code examples, and video suggestions
                </Text>
              </VStack>
              <VStack spacing={4} textAlign="center">
                <Icon as={FiClock} boxSize={8} color="brand.500" />
                <Heading size="md">Learn at Your Pace</Heading>
                <Text color="gray.600">
                  Download lessons as PDFs and access multilingual explanations
                </Text>
              </VStack>
            </Grid>
          </Box>
        )}
      </Container>
    </>
  )
}

export default HomePage
