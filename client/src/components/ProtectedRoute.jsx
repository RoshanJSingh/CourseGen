import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { Navigate } from 'react-router-dom'
import { Box, Spinner, Center, Text } from '@chakra-ui/react'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0()

  // Show loading spinner while Auth0 is checking authentication
  if (isLoading) {
    return (
      <Center h="50vh">
        <Box textAlign="center">
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="brand.500"
            size="xl"
            mb={4}
          />
          <Text color="gray.600">Checking authentication...</Text>
        </Box>
      </Center>
    )
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    loginWithRedirect()
    return (
      <Center h="50vh">
        <Box textAlign="center">
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="brand.500"
            size="xl"
            mb={4}
          />
          <Text color="gray.600">Redirecting to login...</Text>
        </Box>
      </Center>
    )
  }

  // Render protected content
  return children
}

export default ProtectedRoute
