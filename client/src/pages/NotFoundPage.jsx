import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Button,
  Icon,
  useColorModeValue
} from '@chakra-ui/react';
import {
  FiHome,
  FiArrowLeft,
  FiSearch,
  FiBook
} from 'react-icons/fi';

const NotFoundPage = () => {
  const navigate = useNavigate();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  return (
    <Box bg={bgColor} minH="100vh" display="flex" alignItems="center" justifyContent="center">
      <Container maxW="container.md" textAlign="center">
        <VStack spacing={8}>
          {/* 404 Visual */}
          <VStack spacing={4}>
            <Text
              fontSize={{ base: '8xl', md: '12xl' }}
              fontWeight="bold"
              color="blue.500"
              lineHeight="1"
            >
              404
            </Text>
            <Text fontSize="2xl" fontWeight="semibold" color={textColor}>
              Oops! Page not found
            </Text>
            <Text fontSize="lg" color={textColor} maxW="md" lineHeight="1.6">
              The page you're looking for doesn't exist or has been moved. 
              Don't worry, let's get you back on track with your learning journey!
            </Text>
          </VStack>

          {/* Action Buttons */}
          <VStack spacing={4} w="100%">
            <HStack spacing={4} flexWrap="wrap" justify="center">
              <Button
                colorScheme="blue"
                size="lg"
                leftIcon={<FiHome />}
                onClick={() => navigate('/')}
              >
                Go Home
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                leftIcon={<FiArrowLeft />}
                onClick={() => navigate(-1)}
              >
                Go Back
              </Button>
            </HStack>

            {/* Quick Links */}
            <VStack spacing={2} pt={4}>
              <Text fontSize="md" fontWeight="medium" color={textColor}>
                Or try these popular options:
              </Text>
              
              <HStack spacing={4} flexWrap="wrap" justify="center">
                <Button
                  variant="link"
                  leftIcon={<FiBook />}
                  onClick={() => navigate('/')}
                  color="blue.500"
                >
                  Create a Course
                </Button>
                
                <Button
                  variant="link"
                  leftIcon={<FiSearch />}
                  onClick={() => navigate('/')}
                  color="blue.500"
                >
                  Browse Courses
                </Button>
              </HStack>
            </VStack>
          </VStack>

          {/* Fun Learning Tip */}
          <Box
            p={6}
            bg={useColorModeValue('white', 'gray.800')}
            borderRadius="lg"
            border="1px"
            borderColor={useColorModeValue('gray.200', 'gray.600')}
            maxW="md"
          >
            <VStack spacing={3}>
              <Icon as={FiBook} boxSize={8} color="blue.500" />
              <Text fontSize="sm" fontWeight="medium" color="blue.600">
                💡 Learning Tip
              </Text>
              <Text fontSize="sm" color={textColor} textAlign="center" lineHeight="1.5">
                While you're here, did you know that our AI can generate 
                comprehensive courses on any topic in multiple languages? 
                Try creating a course about something you've always wanted to learn!
              </Text>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default NotFoundPage;
