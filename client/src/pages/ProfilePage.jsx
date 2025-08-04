import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Button,
  Avatar,
  Card,
  CardBody,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Badge,
  Progress,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Alert,
  AlertIcon,
  Skeleton,
  SkeletonText,
  Icon,
  Tooltip,
  useColorModeValue,
  useToast,
  Divider
} from '@chakra-ui/react';
import {
  FiUser,
  FiBook,
  FiClock,
  FiTrendingUp,
  FiPlus,
  FiMoreHorizontal,
  FiEdit2,
  FiTrash2,
  FiShare2,
  FiDownload,
  FiEye,
  FiCalendar,
  FiAward,
  FiTarget,
  FiActivity
} from 'react-icons/fi';
import { api } from '../utils/api';
import LoadingScreen from '../components/LoadingScreen';

const ProfilePage = () => {
  const { user, isAuthenticated, logout } = useAuth0();
  const navigate = useNavigate();
  const toast = useToast();

  const [userCourses, setUserCourses] = useState([]);
  const [userProgress, setUserProgress] = useState([]);
  const [stats, setStats] = useState({
    totalCourses: 0,
    completedLessons: 0,
    totalStudyTime: 0,
    coursesCompleted: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const cardBg = useColorModeValue('gray.50', 'gray.700');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    const fetchUserData = async () => {
      try {
        setLoading(true);

        // Fetch user's created courses
        const coursesResponse = await api.get('/courses/user');
        setUserCourses(coursesResponse.data);

        // Fetch user's progress data
        const progressResponse = await api.get('/courses/progress');
        setUserProgress(progressResponse.data);

        // Calculate stats
        const totalCourses = coursesResponse.data.length;
        const completedLessons = progressResponse.data.reduce(
          (total, progress) => total + (progress.completedLessons?.length || 0), 0
        );
        
        const coursesCompleted = progressResponse.data.filter(
          progress => progress.completionPercentage === 100
        ).length;

        const totalStudyTime = progressResponse.data.reduce(
          (total, progress) => total + (progress.totalTimeSpent || 0), 0
        );

        setStats({
          totalCourses,
          completedLessons,
          totalStudyTime,
          coursesCompleted
        });

      } catch (err) {
        console.error('Error fetching user data:', err);
        toast({
          title: 'Error Loading Data',
          description: 'Failed to load your profile data. Please try again.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [isAuthenticated, navigate, toast]);

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`/courses/${courseId}`);
      setUserCourses(prev => prev.filter(course => course._id !== courseId));
      
      toast({
        title: 'Course Deleted',
        description: 'Course has been successfully deleted.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
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

  const formatDuration = (minutes) => {
    if (!minutes) return '0m';
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

  if (!isAuthenticated) {
    return (
      <Container maxW="container.lg" py={8}>
        <Alert status="warning" borderRadius="lg">
          <AlertIcon />
          <VStack align="start" spacing={2}>
            <Text fontWeight="medium">Authentication Required</Text>
            <Text fontSize="sm">Please log in to view your profile.</Text>
          </VStack>
        </Alert>
      </Container>
    );
  }

  if (loading) return <LoadingScreen />;

  return (
    <Container maxW="container.xl" py={6}>      <VStack spacing={6} align="stretch">
        <Card bg={bgColor} shadow="lg">
          <CardBody p={8}>
            <HStack spacing={6} align="start">
              <Avatar
                size="2xl"
                src={user.picture}
                name={user.name}
              />
              
              <VStack spacing={4} align="start" flex={1}>
                <VStack spacing={2} align="start">
                  <Text fontSize="3xl" fontWeight="bold">
                    {user.name}
                  </Text>
                  <Text color="gray.600" fontSize="lg">
                    {user.email}
                  </Text>
                  <HStack spacing={2}>
                    <Badge colorScheme="blue" variant="subtle">
                      Course Creator
                    </Badge>
                    <Badge colorScheme="green" variant="subtle">
                      Active Learner
                    </Badge>
                  </HStack>
                </VStack>

                {/* Quick Stats */}
                <SimpleGrid columns={4} spacing={6} w="100%">
                  <Stat>
                    <StatLabel>Courses Created</StatLabel>
                    <StatNumber>{stats.totalCourses}</StatNumber>
                  </Stat>
                  <Stat>
                    <StatLabel>Lessons Completed</StatLabel>
                    <StatNumber>{stats.completedLessons}</StatNumber>
                  </Stat>
                  <Stat>
                    <StatLabel>Study Time</StatLabel>
                    <StatNumber>{formatDuration(stats.totalStudyTime)}</StatNumber>
                  </Stat>
                  <Stat>
                    <StatLabel>Courses Completed</StatLabel>
                    <StatNumber>{stats.coursesCompleted}</StatNumber>
                  </Stat>
                </SimpleGrid>
              </VStack>

              <VStack spacing={2}>
                <Button
                  colorScheme="blue"
                  leftIcon={<FiPlus />}
                  onClick={() => navigate('/')}
                >
                  Create Course
                </Button>
                <Button
                  variant="outline"
                  leftIcon={<FiEdit2 />}
                  onClick={() => {
                    // Edit profile functionality would go here
                    toast({
                      title: 'Coming Soon',
                      description: 'Profile editing will be available soon.',
                      status: 'info',
                      duration: 3000,
                      isClosable: true,
                    });
                  }}
                >
                  Edit Profile
                </Button>
              </VStack>
            </HStack>
          </CardBody>
        </Card>

        {/* Tabs */}
        <Tabs index={activeTab} onChange={setActiveTab} variant="enclosed">
          <TabList>
            <Tab>
              <HStack spacing={2}>
                <Icon as={FiBook} />
                <Text>My Courses</Text>
              </HStack>
            </Tab>
            <Tab>
              <HStack spacing={2}>
                <Icon as={FiTrendingUp} />
                <Text>Learning Progress</Text>
              </HStack>
            </Tab>
            <Tab>
              <HStack spacing={2}>
                <Icon as={FiActivity} />
                <Text>Activity</Text>
              </HStack>
            </Tab>
          </TabList>

          <TabPanels>
            {/* My Courses Tab */}
            <TabPanel p={0} pt={6}>
              <VStack spacing={4} align="stretch">
                <HStack justify="space-between">
                  <Text fontSize="xl" fontWeight="semibold">
                    Your Created Courses ({userCourses.length})
                  </Text>
                  <Button
                    leftIcon={<FiPlus />}
                    colorScheme="blue"
                    onClick={() => navigate('/')}
                  >
                    Create New Course
                  </Button>
                </HStack>

                {userCourses.length === 0 ? (
                  <Card bg={cardBg}>
                    <CardBody p={8} textAlign="center">
                      <VStack spacing={4}>
                        <Icon as={FiBook} boxSize={12} color="gray.400" />
                        <VStack spacing={2}>
                          <Text fontSize="lg" fontWeight="medium" color="gray.600">
                            No courses created yet
                          </Text>
                          <Text color="gray.500">
                            Start creating your first AI-powered course today!
                          </Text>
                        </VStack>
                        <Button
                          colorScheme="blue"
                          leftIcon={<FiPlus />}
                          onClick={() => navigate('/')}
                        >
                          Create Your First Course
                        </Button>
                      </VStack>
                    </CardBody>
                  </Card>
                ) : (
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                    {userCourses.map((course) => (
                      <Card key={course._id} bg={bgColor} shadow="md" _hover={{ shadow: 'lg' }}>
                        <CardBody p={6}>
                          <VStack spacing={4} align="stretch">
                            <HStack justify="space-between" align="start">
                              <VStack spacing={2} align="start" flex={1}>
                                <HStack spacing={2}>
                                  <Badge
                                    colorScheme={getDifficultyColor(course.difficulty)}
                                    variant="solid"
                                  >
                                    {course.difficulty || 'Beginner'}
                                  </Badge>
                                  <Badge colorScheme="blue" variant="outline">
                                    {course.language || 'English'}
                                  </Badge>
                                </HStack>
                                
                                <Text
                                  fontSize="lg"
                                  fontWeight="semibold"
                                  noOfLines={2}
                                  cursor="pointer"
                                  _hover={{ color: 'blue.500' }}
                                  onClick={() => navigate(`/courses/${course._id}`)}
                                >
                                  {course.title}
                                </Text>
                              </VStack>

                              <Menu>
                                <MenuButton as={Button} size="xs" variant="ghost" leftIcon={<FiMoreHorizontal />}>
                                </MenuButton>
                                <MenuList>
                                  <MenuItem
                                    icon={<FiEye />}
                                    onClick={() => navigate(`/courses/${course._id}`)}
                                  >
                                    View Course
                                  </MenuItem>
                                  <MenuItem
                                    icon={<FiEdit2 />}
                                    onClick={() => {
                                      toast({
                                        title: 'Coming Soon',
                                        description: 'Course editing will be available soon.',
                                        status: 'info',
                                        duration: 3000,
                                        isClosable: true,
                                      });
                                    }}
                                  >
                                    Edit Course
                                  </MenuItem>
                                  <MenuItem icon={<FiShare2 />}>
                                    Share Course
                                  </MenuItem>
                                  <MenuItem icon={<FiDownload />}>
                                    Export PDF
                                  </MenuItem>
                                  <Divider />
                                  <MenuItem
                                    icon={<FiTrash2 />}
                                    color="red.500"
                                    onClick={() => handleDeleteCourse(course._id)}
                                  >
                                    Delete Course
                                  </MenuItem>
                                </MenuList>
                              </Menu>
                            </HStack>

                            <Text color="gray.600" fontSize="sm" noOfLines={3}>
                              {course.description}
                            </Text>

                            <HStack spacing={4} color="gray.500" fontSize="sm">
                              <HStack spacing={1}>
                                <Icon as={FiBook} />
                                <Text>{course.moduleCount || 0} modules</Text>
                              </HStack>
                              <HStack spacing={1}>
                                <Icon as={FiClock} />
                                <Text>{formatDuration(course.estimatedDuration)}</Text>
                              </HStack>
                              <HStack spacing={1}>
                                <Icon as={FiCalendar} />
                                <Text>{new Date(course.createdAt).toLocaleDateString()}</Text>
                              </HStack>
                            </HStack>

                            <Button
                              size="sm"
                              colorScheme="blue"
                              variant="outline"
                              onClick={() => navigate(`/courses/${course._id}`)}
                            >
                              View Details
                            </Button>
                          </VStack>
                        </CardBody>
                      </Card>
                    ))}
                  </SimpleGrid>
                )}
              </VStack>
            </TabPanel>

            {/* Learning Progress Tab */}
            <TabPanel p={0} pt={6}>
              <VStack spacing={4} align="stretch">
                <Text fontSize="xl" fontWeight="semibold">
                  Your Learning Progress
                </Text>

                {userProgress.length === 0 ? (
                  <Card bg={cardBg}>
                    <CardBody p={8} textAlign="center">
                      <VStack spacing={4}>
                        <Icon as={FiTrendingUp} boxSize={12} color="gray.400" />
                        <VStack spacing={2}>
                          <Text fontSize="lg" fontWeight="medium" color="gray.600">
                            No learning progress yet
                          </Text>
                          <Text color="gray.500">
                            Start learning from courses to see your progress here.
                          </Text>
                        </VStack>
                      </VStack>
                    </CardBody>
                  </Card>
                ) : (
                  <VStack spacing={4} align="stretch">
                    {userProgress.map((progress) => (
                      <Card key={progress.courseId} bg={bgColor}>
                        <CardBody p={6}>
                          <VStack spacing={4} align="stretch">
                            <HStack justify="space-between" align="start">
                              <VStack spacing={2} align="start" flex={1}>
                                <Text fontSize="lg" fontWeight="semibold">
                                  {progress.courseTitle}
                                </Text>
                                <HStack spacing={4} color="gray.600" fontSize="sm">
                                  <HStack spacing={1}>
                                    <Icon as={FiTarget} />
                                    <Text>
                                      {progress.completedLessons?.length || 0} of {progress.totalLessons || 0} lessons
                                    </Text>
                                  </HStack>
                                  <HStack spacing={1}>
                                    <Icon as={FiClock} />
                                    <Text>{formatDuration(progress.totalTimeSpent || 0)} studied</Text>
                                  </HStack>
                                  <HStack spacing={1}>
                                    <Icon as={FiCalendar} />
                                    <Text>
                                      Last activity: {new Date(progress.lastAccessedAt).toLocaleDateString()}
                                    </Text>
                                  </HStack>
                                </HStack>
                              </VStack>

                              <VStack spacing={2} align="end">
                                <Text fontSize="lg" fontWeight="bold" color="blue.500">
                                  {Math.round(progress.completionPercentage || 0)}%
                                </Text>
                                <Button
                                  size="sm"
                                  colorScheme="blue"
                                  onClick={() => navigate(`/courses/${progress.courseId}`)}
                                >
                                  Continue
                                </Button>
                              </VStack>
                            </HStack>

                            <Progress
                              value={progress.completionPercentage || 0}
                              colorScheme="blue"
                              borderRadius="full"
                              size="lg"
                            />

                            {progress.completionPercentage === 100 && (
                              <HStack spacing={2} color="green.500">
                                <Icon as={FiAward} />
                                <Text fontSize="sm" fontWeight="medium">
                                  Course Completed! 🎉
                                </Text>
                              </HStack>
                            )}
                          </VStack>
                        </CardBody>
                      </Card>
                    ))}
                  </VStack>
                )}
              </VStack>
            </TabPanel>

            {/* Activity Tab */}
            <TabPanel p={0} pt={6}>
              <VStack spacing={4} align="stretch">
                <Text fontSize="xl" fontWeight="semibold">
                  Recent Activity
                </Text>

                <Card bg={cardBg}>
                  <CardBody p={8} textAlign="center">
                    <VStack spacing={4}>
                      <Icon as={FiActivity} boxSize={12} color="gray.400" />
                      <VStack spacing={2}>
                        <Text fontSize="lg" fontWeight="medium" color="gray.600">
                          Activity tracking coming soon
                        </Text>
                        <Text color="gray.500">
                          We're working on detailed activity tracking and analytics.
                        </Text>
                      </VStack>
                    </VStack>
                  </CardBody>
                </Card>
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Container>
  );
};

export default ProfilePage;
