import React from 'react'
import {
  Center,
  VStack,
  Spinner,
  Text,
  Box,
  keyframes,
} from '@chakra-ui/react'

const pulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
`

const LoadingScreen = ({ message = 'Loading...' }) => {
  return (
    <Center h="100vh" bg="gray.50">
      <VStack spacing={6}>        <Box
          w={16}
          h={16}
          bgGradient="linear(135deg, brand.500 0%, accent.500 100%)"
          borderRadius="xl"
          display="flex"
          alignItems="center"
          justifyContent="center"
          animation={`${pulse} 2s infinite`}
          boxShadow="lg"
        >
          <Text color="white" fontWeight="bold" fontSize="xl">
            TL
          </Text>
        </Box>

        {/* Loading Spinner */}
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="brand.500"
          size="xl"
        />

        {/* Loading Message */}
        <VStack spacing={2}>
          <Text fontSize="lg" fontWeight="semibold" color="gray.700">
            {message}
          </Text>
          <Text fontSize="sm" color="gray.500" textAlign="center">
            Setting up your learning environment...
          </Text>
        </VStack>
      </VStack>
    </Center>
  )
}

export default LoadingScreen
