import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Button,
  Badge,
  Progress,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  SimpleGrid,
  Card,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Alert,
  AlertIcon,
  Skeleton,
  SkeletonText,
  Divider,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Icon,
  Tooltip,
  useColorModeValue,
  useToast
} from '@chakra-ui/react';
import {
  FiPlay,
  FiBookOpen,
  FiClock,
  FiUsers,
  FiStar,
  FiDownload,
  FiShare2,
  FiMoreHorizontal,
  FiEdit2,
  FiTrash2,
  FiCheckCircle,
  FiCircle,
  FiChevronRight,
  FiCalendar,
  FiTrendingUp
} from 'react-icons/fi';
import { api } from '../utils/api';
import LoadingScreen from '../components/LoadingScreen';

const CoursePage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth0();
  const toast = useToast();

  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const cardBg = useColorModeValue('gray.50', 'gray.700');

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!courseId) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch course details
        const courseResponse = await api.get(`/courses/${courseId}`);
        const courseData = courseResponse.data;
        setCourse(courseData);

        // Check if user is the owner
        if (isAuthenticated && user && courseData.createdBy === user.sub) {
          setIsOwner(true);
        }

        // Fetch course modules with lessons
        const modulesResponse = await api.get(`/courses/${courseId}/modules`);
        setModules(modulesResponse.data);

        // Fetch user progress if authenticated
        if (isAuthenticated) {
          try {
            const progressResponse = await api.get(`/courses/${courseId}/progress`);
            setProgress(progressResponse.data);
          } catch (progressError) {
            // Progress endpoint might not exist yet, that's okay
            console.log('Progress data not available:', progressError);
          }
        }

      } catch (err) {
        console.error('Error fetching course data:', err);
        setError(err.response?.data?.message || 'Failed to load course');
        
        if (err.response?.status === 404) {
          toast({
            title: 'Course Not Found',
            description: 'The requested course could not be found.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId, isAuthenticated, user, toast]);

  const handleStartLearning = () => {
    if (modules.length > 0 && modules[0].lessons?.length > 0) {
      navigate(`/courses/${courseId}/lessons/${modules[0].lessons[0]._id}`);
    } else {
      toast({
        title: 'No Content Available',
        description: 'This course doesn\'t have any lessons yet.',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleLessonClick = (lessonId) => {
    navigate(`/courses/${courseId}/lessons/${lessonId}`);
  };

  const handleEditCourse = () => {
    navigate(`/courses/${courseId}/edit`);
  };

  const handleDeleteCourse = async () => {
    if (!window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`/courses/${courseId}`);
      toast({
        title: 'Course Deleted',
        description: 'Course has been successfully deleted.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/');
    } catch (err) {
      console.error('Error deleting course:', err);
      toast({
        title: 'Delete Failed',
        description: err.response?.data?.message || 'Failed to delete course.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const calculateModuleProgress = (module) => {
    if (!progress || !module.lessons) return 0;
    
    const completedLessons = module.lessons.filter(lesson => 
      progress.completedLessons?.includes(lesson._id)
    ).length;
    
    return module.lessons.length > 0 ? (completedLessons / module.lessons.length) * 100 : 0;
  };

  const calculateOverallProgress = () => {
    if (!progress || !modules.length) return 0;
    
    const totalLessons = modules.reduce((total, module) => 
      total + (module.lessons?.length || 0), 0
    );
    
    const completedLessons = progress.completedLessons?.length || 0;
    
    return totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
  };

  const formatDuration = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner': return 'green';
      case 'intermediate': return 'yellow';
      case 'advanced': return 'red';
      default: return 'gray';
    }
  };

  if (loading) return <LoadingScreen />;

  if (error) {
    return (
      <Container maxW="container.lg" py={8}>
        <Alert status="error" borderRadius="lg">
          <AlertIcon />
          <VStack align="start" spacing={2}>
            <Text fontWeight="medium">Error Loading Course</Text>
            <Text fontSize="sm">{error}</Text>
            <Button size="sm" colorScheme="blue" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </VStack>
        </Alert>
      </Container>
    );
  }

  if (!course) {
    return (
      <Container maxW="container.lg" py={8}>
        <Alert status="info" borderRadius="lg">
          <AlertIcon />
          <Text>Course not found.</Text>
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={6}>
      <VStack spacing={6} align="stretch">
        {/* Breadcrumb */}
        <Breadcrumb spacing="8px" separator={<FiChevronRight />}>
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => navigate('/')}>Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink fontWeight="medium">{course.title}</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        {/* Course Header */}
        <Card bg={bgColor} shadow="lg">
          <CardBody p={8}>
            <VStack spacing={6} align="stretch">
              {/* Title and Actions */}
              <HStack justify="space-between" align="start">
                <VStack spacing={3} align="start" flex={1}>
                  <HStack spacing={3} flexWrap="wrap">
                    <Badge colorScheme={getDifficultyColor(course.difficulty)} variant="solid">
                      {course.difficulty || 'Beginner'}
                    </Badge>
                    <Badge colorScheme="blue" variant="outline">
                      {course.language || 'English'}
                    </Badge>
                    <HStack spacing={1}>
                      <Icon as={FiStar} color="yellow.400" />
                      <Text fontSize="sm" color="gray.600">
                        {course.rating || 'Not rated'}
                      </Text>
                    </HStack>
                  </HStack>

                  <Text fontSize="3xl" fontWeight="bold" lineHeight="1.2">
                    {course.title}
                  </Text>

                  <Text fontSize="lg" color="gray.600" lineHeight="1.6">
                    {course.description}
                  </Text>

                  {/* Course Meta */}
                  <HStack spacing={6} flexWrap="wrap" color="gray.600">
                    <HStack spacing={2}>
                      <Icon as={FiBookOpen} />
                      <Text fontSize="sm">
                        {modules.length} module{modules.length !== 1 ? 's' : ''}
                      </Text>
                    </HStack>
                    <HStack spacing={2}>
                      <Icon as={FiClock} />
                      <Text fontSize="sm">
                        {formatDuration(course.estimatedDuration)}
                      </Text>
                    </HStack>
                    <HStack spacing={2}>
                      <Icon as={FiCalendar} />
                      <Text fontSize="sm">
                        Created {new Date(course.createdAt).toLocaleDateString()}
                      </Text>
                    </HStack>
                  </HStack>
                </VStack>

                {/* Action Buttons */}
                <VStack spacing={2} align="end">
                  <HStack spacing={2}>
                    <Button
                      colorScheme="blue"
                      size="lg"
                      leftIcon={<FiPlay />}
                      onClick={handleStartLearning}
                    >
                      {progress ? 'Continue Learning' : 'Start Learning'}
                    </Button>

                    {isOwner && (
                      <Menu>
                        <MenuButton as={Button} leftIcon={<FiMoreHorizontal />} variant="outline">
                          Actions
                        </MenuButton>
                        <MenuList>
                          <MenuItem icon={<FiEdit2 />} onClick={handleEditCourse}>
                            Edit Course
                          </MenuItem>
                          <MenuItem icon={<FiShare2 />}>
                            Share Course
                          </MenuItem>
                          <MenuItem icon={<FiDownload />}>
                            Export as PDF
                          </MenuItem>
                          <Divider />
                          <MenuItem icon={<FiTrash2 />} color="red.500" onClick={handleDeleteCourse}>
                            Delete Course
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    )}
                  </HStack>

                  {/* Progress */}
                  {progress && (
                    <Box w="300px">
                      <HStack justify="space-between" mb={1}>
                        <Text fontSize="sm" color="gray.600">Progress</Text>
                        <Text fontSize="sm" fontWeight="medium">
                          {Math.round(calculateOverallProgress())}%
                        </Text>
                      </HStack>
                      <Progress
                        value={calculateOverallProgress()}
                        colorScheme="blue"
                        borderRadius="full"
                        size="md"
                      />
                    </Box>
                  )}
                </VStack>
              </HStack>

              {/* Course Stats */}
              <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6}>
                <Stat>
                  <StatLabel>Modules</StatLabel>
                  <StatNumber>{modules.length}</StatNumber>
                </Stat>
                <Stat>
                  <StatLabel>Total Lessons</StatLabel>
                  <StatNumber>
                    {modules.reduce((total, module) => total + (module.lessons?.length || 0), 0)}
                  </StatNumber>
                </Stat>
                <Stat>
                  <StatLabel>Duration</StatLabel>
                  <StatNumber>{formatDuration(course.estimatedDuration)}</StatNumber>
                </Stat>
                <Stat>
                  <StatLabel>Language</StatLabel>
                  <StatNumber>{course.language || 'English'}</StatNumber>
                </Stat>
              </SimpleGrid>
            </VStack>
          </CardBody>
        </Card>

        {/* Course Content */}
        <Card bg={bgColor}>
          <CardBody p={6}>
            <VStack spacing={4} align="stretch">
              <Text fontSize="2xl" fontWeight="bold">Course Content</Text>

              {modules.length === 0 ? (
                <Alert status="info" borderRadius="lg">
                  <AlertIcon />
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="medium">No modules available</Text>
                    <Text fontSize="sm">This course doesn't have any modules yet.</Text>
                  </VStack>
                </Alert>
              ) : (
                <Accordion allowMultiple defaultIndex={[0]}>
                  {modules.map((module, moduleIndex) => (
                    <AccordionItem key={module._id} border="1px" borderColor={borderColor} borderRadius="lg" mb={4}>
                      <AccordionButton p={6} _hover={{ bg: cardBg }}>
                        <VStack spacing={3} align="start" flex={1}>
                          <HStack justify="space-between" w="100%">
                            <HStack spacing={3}>
                              <Text fontSize="lg" fontWeight="semibold">
                                Module {moduleIndex + 1}: {module.title}
                              </Text>
                              <Badge colorScheme="blue" variant="outline">
                                {module.lessons?.length || 0} lessons
                              </Badge>
                            </HStack>
                            <AccordionIcon />
                          </HStack>

                          {module.description && (
                            <Text color="gray.600" fontSize="sm">
                              {module.description}
                            </Text>
                          )}

                          {progress && (
                            <Box w="100%">
                              <HStack justify="space-between" mb={1}>
                                <Text fontSize="xs" color="gray.500">Module Progress</Text>
                                <Text fontSize="xs" color="gray.500">
                                  {Math.round(calculateModuleProgress(module))}%
                                </Text>
                              </HStack>
                              <Progress
                                value={calculateModuleProgress(module)}
                                colorScheme="green"
                                size="sm"
                                borderRadius="full"
                              />
                            </Box>
                          )}
                        </VStack>
                      </AccordionButton>

                      <AccordionPanel p={0}>
                        <VStack spacing={0} align="stretch">
                          {module.lessons?.map((lesson, lessonIndex) => {
                            const isCompleted = progress?.completedLessons?.includes(lesson._id);
                            
                            return (
                              <Box
                                key={lesson._id}
                                p={4}
                                borderBottom="1px"
                                borderColor={borderColor}
                                cursor="pointer"
                                transition="all 0.2s"
                                _hover={{ bg: cardBg }}
                                _last={{ borderBottom: 'none' }}
                                onClick={() => handleLessonClick(lesson._id)}
                              >
                                <HStack justify="space-between">
                                  <HStack spacing={3}>
                                    <Icon
                                      as={isCompleted ? FiCheckCircle : FiCircle}
                                      color={isCompleted ? 'green.500' : 'gray.400'}
                                    />
                                    <VStack spacing={1} align="start">
                                      <Text fontWeight="medium">
                                        Lesson {lessonIndex + 1}: {lesson.title}
                                      </Text>
                                      {lesson.description && (
                                        <Text fontSize="sm" color="gray.600">
                                          {lesson.description}
                                        </Text>
                                      )}
                                    </VStack>
                                  </HStack>

                                  <HStack spacing={2}>
                                    <Text fontSize="sm" color="gray.500">
                                      {formatDuration(lesson.estimatedDuration)}
                                    </Text>
                                    <Icon as={FiChevronRight} color="gray.400" />
                                  </HStack>
                                </HStack>
                              </Box>
                            );
                          })}
                        </VStack>
                      </AccordionPanel>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Container>
  );
};

export default CoursePage;
