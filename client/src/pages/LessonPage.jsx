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
  Card,
  CardBody,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Alert,
  AlertIcon,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Divider,
  Icon,
  Tooltip,
  useColorModeValue,
  useToast,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure
} from '@chakra-ui/react';
import {
  FiChevronLeft,
  FiChevronRight,
  FiBookOpen,
  FiClock,
  FiCheckCircle,
  FiCircle,
  FiMoreHorizontal,
  FiEdit2,
  FiDownload,
  FiShare2,
  FiVolume2,
  FiVolumeX,
  FiMenu,
  FiHome,
  FiArrowLeft,
  FiArrowRight
} from 'react-icons/fi';
import { api } from '../utils/api';
import LoadingScreen from '../components/LoadingScreen';
import LessonRenderer from '../components/LessonRenderer';
import LessonPDFExporter from '../components/LessonPDFExporter';

const LessonPage = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth0();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [lesson, setLesson] = useState(null);
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [currentModule, setCurrentModule] = useState(null);
  const [navigation, setNavigation] = useState({ prev: null, next: null });
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [hinglishAudio, setHinglishAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    const fetchLessonData = async () => {
      if (!courseId || !lessonId) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch lesson details
        const lessonResponse = await api.get(`/lessons/${lessonId}`);
        const lessonData = lessonResponse.data;
        setLesson(lessonData);

        // Fetch course details
        const courseResponse = await api.get(`/courses/${courseId}`);
        const courseData = courseResponse.data;
        setCourse(courseData);

        // Check if user is the owner
        if (isAuthenticated && user && courseData.createdBy === user.sub) {
          setIsOwner(true);
        }

        // Fetch course modules for navigation
        const modulesResponse = await api.get(`/courses/${courseId}/modules`);
        const modulesData = modulesResponse.data;
        setModules(modulesData);

        // Find current module and lesson navigation
        let prevLesson = null;
        let nextLesson = null;
        let currentMod = null;

        for (let i = 0; i < modulesData.length; i++) {
          const module = modulesData[i];
          const lessonIndex = module.lessons?.findIndex(l => l._id === lessonId);
          
          if (lessonIndex !== -1) {
            currentMod = module;
            
            // Previous lesson
            if (lessonIndex > 0) {
              prevLesson = module.lessons[lessonIndex - 1];
            } else if (i > 0) {
              const prevModule = modulesData[i - 1];
              if (prevModule.lessons?.length > 0) {
                prevLesson = prevModule.lessons[prevModule.lessons.length - 1];
              }
            }

            // Next lesson
            if (lessonIndex < module.lessons.length - 1) {
              nextLesson = module.lessons[lessonIndex + 1];
            } else if (i < modulesData.length - 1) {
              const nextModule = modulesData[i + 1];
              if (nextModule.lessons?.length > 0) {
                nextLesson = nextModule.lessons[0];
              }
            }
            break;
          }
        }

        setCurrentModule(currentMod);
        setNavigation({ prev: prevLesson, next: nextLesson });

        // Fetch user progress if authenticated
        if (isAuthenticated) {
          try {
            const progressResponse = await api.get(`/courses/${courseId}/progress`);
            setProgress(progressResponse.data);
          } catch (progressError) {
            console.log('Progress data not available:', progressError);
          }
        }

      } catch (err) {
        console.error('Error fetching lesson data:', err);
        setError(err.response?.data?.message || 'Failed to load lesson');
        
        if (err.response?.status === 404) {
          toast({
            title: 'Lesson Not Found',
            description: 'The requested lesson could not be found.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLessonData();
  }, [courseId, lessonId, isAuthenticated, user, toast]);

  const handleMarkComplete = async () => {
    if (!isAuthenticated) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to track your progress.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await api.post(`/lessons/${lessonId}/complete`);
      
      // Update local progress
      setProgress(prev => ({
        ...prev,
        completedLessons: [...(prev?.completedLessons || []), lessonId]
      }));

      toast({
        title: 'Lesson Completed!',
        description: 'Great job! Your progress has been saved.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.error('Error marking lesson complete:', err);
      toast({
        title: 'Progress Error',
        description: 'Failed to save your progress. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleMCQAnswer = async (answerData) => {
    if (!isAuthenticated) return;

    try {
      await api.post(`/lessons/${lessonId}/answer`, answerData);
      
      // Update progress if question was answered correctly
      if (answerData.isCorrect) {
        toast({
          title: 'Correct Answer!',
          description: `You earned ${answerData.points} point${answerData.points !== 1 ? 's' : ''}.`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (err) {
      console.error('Error saving answer:', err);
    }
  };

  const handleNavigate = (direction) => {
    const targetLesson = navigation[direction];
    if (targetLesson) {
      navigate(`/courses/${courseId}/lessons/${targetLesson._id}`);
    }
  };

  const handleGenerateHinglishAudio = async () => {
    try {
      const response = await api.post(`/lessons/${lessonId}/hinglish-audio`);
      setHinglishAudio(response.data.audioUrl);
      
      toast({
        title: 'Audio Generated',
        description: 'Hinglish audio explanation is ready!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.error('Error generating audio:', err);
      toast({
        title: 'Audio Generation Failed',
        description: 'Unable to generate audio. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleLessonNavigation = (lessonIdToNavigate) => {
    navigate(`/courses/${courseId}/lessons/${lessonIdToNavigate}`);
    onClose();
  };

  const formatDuration = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const isLessonCompleted = progress?.completedLessons?.includes(lessonId);

  if (loading) return <LoadingScreen />;

  if (error) {
    return (
      <Container maxW="container.lg" py={8}>
        <Alert status="error" borderRadius="lg">
          <AlertIcon />
          <VStack align="start" spacing={2}>
            <Text fontWeight="medium">Error Loading Lesson</Text>
            <Text fontSize="sm">{error}</Text>
            <Button size="sm" colorScheme="blue" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </VStack>
        </Alert>
      </Container>
    );
  }

  if (!lesson || !course) {
    return (
      <Container maxW="container.lg" py={8}>
        <Alert status="info" borderRadius="lg">
          <AlertIcon />
          <Text>Lesson not found.</Text>
        </Alert>
      </Container>
    );
  }
  return (
    <Box>
      <Box bg={bgColor} borderBottom="1px" borderColor={borderColor} py={4} position="sticky" top={0} zIndex={10}>
        <Container maxW="container.xl">
          <HStack justify="space-between">
            <HStack spacing={4}>
              <Button
                variant="ghost"
                leftIcon={<FiArrowLeft />}
                onClick={() => navigate(`/courses/${courseId}`)}
              >
                Back to Course
              </Button>
              
              <Button
                variant="ghost"
                leftIcon={<FiMenu />}
                onClick={onOpen}
                display={{ base: 'flex', lg: 'none' }}
              >
                Lessons
              </Button>

              <VStack spacing={0} align="start">
                <Text fontSize="lg" fontWeight="semibold" noOfLines={1}>
                  {lesson.title}
                </Text>
                <Text fontSize="sm" color="gray.600" noOfLines={1}>
                  {course.title}
                </Text>
              </VStack>
            </HStack>            <HStack spacing={2}>
              {hinglishAudio && (
                <Button
                  size="sm"
                  leftIcon={<FiVolume2 />}
                  colorScheme="purple"
                  variant="outline"
                  onClick={() => {
                    const audio = new Audio(hinglishAudio);
                    if (isPlaying) {
                      audio.pause();
                      setIsPlaying(false);
                    } else {
                      audio.play();
                      setIsPlaying(true);
                      audio.onended = () => setIsPlaying(false);
                    }
                  }}
                >
                  {isPlaying ? 'Pause' : 'Play'} Hinglish
                </Button>
              )}

              <Button
                size="sm"
                leftIcon={<FiVolume2 />}
                variant="outline"
                onClick={handleGenerateHinglishAudio}
                isDisabled={!!hinglishAudio}
              >
                Generate Audio
              </Button>

              {isOwner && (
                <Menu>
                  <MenuButton as={Button} size="sm" leftIcon={<FiMoreHorizontal />} variant="outline">
                    Actions
                  </MenuButton>
                  <MenuList>
                    <MenuItem icon={<FiEdit2 />}>Edit Lesson</MenuItem>
                    <MenuItem>
                      <LessonPDFExporter lesson={lesson} course={course} />
                    </MenuItem>
                    <MenuItem icon={<FiShare2 />}>Share Lesson</MenuItem>
                  </MenuList>
                </Menu>
              )}

              <LessonPDFExporter lesson={lesson} course={course} />
            </HStack>
          </HStack>
        </Container>
      </Box>

      <Container maxW="container.xl" py={6}>
        <HStack align="start" spacing={8}>
          {/* Main Content */}
          <VStack spacing={6} align="stretch" flex={1}>
            {/* Lesson Header */}
            <Card bg={bgColor}>
              <CardBody p={6}>
                <VStack spacing={4} align="stretch">
                  {/* Breadcrumb */}
                  <Breadcrumb spacing="8px" separator={<FiChevronRight />} fontSize="sm">
                    <BreadcrumbItem>
                      <BreadcrumbLink onClick={() => navigate('/')}>Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbItem>
                      <BreadcrumbLink onClick={() => navigate(`/courses/${courseId}`)}>
                        {course.title}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    {currentModule && (
                      <BreadcrumbItem>
                        <BreadcrumbLink>{currentModule.title}</BreadcrumbLink>
                      </BreadcrumbItem>
                    )}
                    <BreadcrumbItem isCurrentPage>
                      <BreadcrumbLink fontWeight="medium">{lesson.title}</BreadcrumbLink>
                    </BreadcrumbItem>
                  </Breadcrumb>

                  {/* Lesson Info */}
                  <HStack justify="space-between" align="start">
                    <VStack spacing={3} align="start">
                      <HStack spacing={3} flexWrap="wrap">
                        <Badge colorScheme={isLessonCompleted ? 'green' : 'gray'} variant="solid">
                          {isLessonCompleted ? 'Completed' : 'In Progress'}
                        </Badge>
                        <HStack spacing={1}>
                          <Icon as={FiClock} boxSize={4} />
                          <Text fontSize="sm" color="gray.600">
                            {formatDuration(lesson.estimatedDuration)}
                          </Text>
                        </HStack>
                      </HStack>

                      <Text fontSize="2xl" fontWeight="bold">
                        {lesson.title}
                      </Text>

                      {lesson.description && (
                        <Text color="gray.600" lineHeight="1.6">
                          {lesson.description}
                        </Text>
                      )}
                    </VStack>

                    {!isLessonCompleted && (
                      <Button
                        colorScheme="green"
                        leftIcon={<FiCheckCircle />}
                        onClick={handleMarkComplete}
                      >
                        Mark Complete
                      </Button>
                    )}
                  </HStack>
                </VStack>
              </CardBody>
            </Card>

            {/* Lesson Content */}
            <Card bg={bgColor}>
              <CardBody p={6}>
                <LessonRenderer
                  content={lesson.content || []}
                  onAnswer={handleMCQAnswer}
                />
              </CardBody>
            </Card>

            {/* Navigation */}
            <Card bg={bgColor}>
              <CardBody p={6}>
                <HStack justify="space-between">
                  {navigation.prev ? (
                    <Button
                      leftIcon={<FiChevronLeft />}
                      variant="outline"
                      onClick={() => handleNavigate('prev')}
                    >
                      Previous: {navigation.prev.title}
                    </Button>
                  ) : (
                    <Box />
                  )}

                  {navigation.next ? (
                    <Button
                      rightIcon={<FiChevronRight />}
                      colorScheme="blue"
                      onClick={() => handleNavigate('next')}
                    >
                      Next: {navigation.next.title}
                    </Button>
                  ) : (
                    <Button
                      rightIcon={<FiHome />}
                      colorScheme="green"
                      onClick={() => navigate(`/courses/${courseId}`)}
                    >
                      Course Complete!
                    </Button>
                  )}
                </HStack>
              </CardBody>
            </Card>
          </VStack>

          {/* Sidebar - Course Navigation (Desktop) */}
          <Box
            w="300px"
            display={{ base: 'none', lg: 'block' }}
            position="sticky"
            top="100px"
            maxH="calc(100vh - 120px)"
            overflowY="auto"
          >
            <Card bg={bgColor}>
              <CardBody p={4}>
                <VStack spacing={4} align="stretch">
                  <Text fontSize="lg" fontWeight="semibold">
                    Course Content
                  </Text>

                  {modules.map((module, moduleIndex) => (
                    <VStack key={module._id} spacing={2} align="stretch">
                      <Text fontSize="sm" fontWeight="medium" color="gray.600">
                        Module {moduleIndex + 1}: {module.title}
                      </Text>
                      
                      {module.lessons?.map((moduleLesson, lessonIndex) => {
                        const isCurrentLesson = moduleLesson._id === lessonId;
                        const isCompleted = progress?.completedLessons?.includes(moduleLesson._id);
                        
                        return (
                          <HStack
                            key={moduleLesson._id}
                            p={2}
                            borderRadius="md"
                            cursor="pointer"
                            bg={isCurrentLesson ? 'blue.50' : 'transparent'}
                            borderLeft="3px solid"
                            borderColor={isCurrentLesson ? 'blue.400' : 'transparent'}
                            _hover={{ bg: isCurrentLesson ? 'blue.50' : 'gray.50' }}
                            onClick={() => handleLessonNavigation(moduleLesson._id)}
                          >
                            <Icon
                              as={isCompleted ? FiCheckCircle : FiCircle}
                              color={isCompleted ? 'green.500' : 'gray.400'}
                              boxSize={4}
                            />
                            <VStack spacing={0} align="start" flex={1}>
                              <Text
                                fontSize="sm"
                                fontWeight={isCurrentLesson ? 'semibold' : 'normal'}
                                color={isCurrentLesson ? 'blue.600' : 'inherit'}
                                noOfLines={2}
                              >
                                {lessonIndex + 1}. {moduleLesson.title}
                              </Text>
                            </VStack>
                          </HStack>
                        );
                      })}
                    </VStack>
                  ))}
                </VStack>
              </CardBody>
            </Card>
          </Box>
        </HStack>
      </Container>

      {/* Mobile Lessons Drawer */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Course Content</DrawerHeader>
          <DrawerBody p={0}>
            <VStack spacing={4} align="stretch" p={4}>
              {modules.map((module, moduleIndex) => (
                <VStack key={module._id} spacing={2} align="stretch">
                  <Text fontSize="sm" fontWeight="medium" color="gray.600">
                    Module {moduleIndex + 1}: {module.title}
                  </Text>
                  
                  {module.lessons?.map((moduleLesson, lessonIndex) => {
                    const isCurrentLesson = moduleLesson._id === lessonId;
                    const isCompleted = progress?.completedLessons?.includes(moduleLesson._id);
                    
                    return (
                      <HStack
                        key={moduleLesson._id}
                        p={3}
                        borderRadius="md"
                        cursor="pointer"
                        bg={isCurrentLesson ? 'blue.50' : 'transparent'}
                        borderLeft="3px solid"
                        borderColor={isCurrentLesson ? 'blue.400' : 'transparent'}
                        _hover={{ bg: isCurrentLesson ? 'blue.50' : 'gray.50' }}
                        onClick={() => handleLessonNavigation(moduleLesson._id)}
                      >
                        <Icon
                          as={isCompleted ? FiCheckCircle : FiCircle}
                          color={isCompleted ? 'green.500' : 'gray.400'}
                          boxSize={4}
                        />
                        <VStack spacing={0} align="start" flex={1}>
                          <Text
                            fontSize="sm"
                            fontWeight={isCurrentLesson ? 'semibold' : 'normal'}
                            color={isCurrentLesson ? 'blue.600' : 'inherit'}
                            noOfLines={2}
                          >
                            {lessonIndex + 1}. {moduleLesson.title}
                          </Text>
                        </VStack>
                      </HStack>
                    );
                  })}
                </VStack>
              ))}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default LessonPage;
