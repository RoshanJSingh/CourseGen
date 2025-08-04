import React from 'react'
import {
  Box,
  Flex,
  Heading,
  Button,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  HStack,
  IconButton,
  useColorMode,
  useColorModeValue,
  Spacer,
  Text,
} from '@chakra-ui/react'
import { MoonIcon, SunIcon, HamburgerIcon } from '@chakra-ui/icons'
import { useAuth0 } from '@auth0/auth0-react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { FiUser, FiLogOut, FiHome } from 'react-icons/fi'

const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading } = useAuth0()
  const navigate = useNavigate()
  
  const bg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  const handleLogin = () => {
    loginWithRedirect()
  }

  const handleLogout = () => {
    logout({ 
      logoutParams: { 
        returnTo: window.location.origin 
      } 
    })
  }

  const handleProfileClick = () => {
    navigate('/profile')
  }

  const handleHomeClick = () => {
    navigate('/')
  }

  return (
    <Box
      bg={bg}
      borderBottom="1px"
      borderColor={borderColor}
      px={6}
      py={3}
      position="sticky"
      top={0}
      zIndex={1000}
      boxShadow="sm"
    >
      <Flex alignItems="center" maxW="7xl" mx="auto">
        {/* Logo/Brand */}
        <HStack spacing={4} onClick={handleHomeClick} cursor="pointer">
          <Box
            w={8}
            h={8}
            bgGradient="linear(135deg, brand.500 0%, accent.500 100%)"
            borderRadius="lg"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Text color="white" fontWeight="bold" fontSize="sm">
              TL
            </Text>
          </Box>
          <Heading 
            size="md" 
            bgGradient="linear(135deg, brand.500 0%, accent.500 100%)"
            bgClip="text"
            fontWeight="600"
          >
            Text-to-Learn
          </Heading>
        </HStack>

        <Spacer />

        {/* Right side - Auth and Controls */}
        <HStack spacing={3}>
          {/* Color mode toggle */}
          <IconButton
            aria-label="Toggle color mode"
            icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
            variant="ghost"
            size="sm"
          />

          {/* Authentication */}
          {!isLoading && (
            <>
              {isAuthenticated ? (
                <Menu>
                  <MenuButton as={Button} variant="ghost" p={0}>
                    <HStack spacing={2}>
                      <Avatar 
                        size="sm" 
                        src={user?.picture} 
                        name={user?.name || user?.email}
                      />
                      <Box display={{ base: 'none', md: 'block' }} textAlign="left">
                        <Text fontSize="sm" fontWeight="medium">
                          {user?.name || 'User'}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          {user?.email}
                        </Text>
                      </Box>
                    </HStack>
                  </MenuButton>
                  <MenuList>
                    <MenuItem icon={<FiHome />} onClick={handleHomeClick}>
                      Dashboard
                    </MenuItem>
                    <MenuItem icon={<FiUser />} onClick={handleProfileClick}>
                      Profile
                    </MenuItem>
                    <MenuDivider />
                    <MenuItem 
                      icon={<FiLogOut />} 
                      onClick={handleLogout}
                      color="red.500"
                    >
                      Sign out
                    </MenuItem>
                  </MenuList>
                </Menu>
              ) : (
                <HStack spacing={2}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogin}
                  >
                    Sign In
                  </Button>
                  <Button
                    variant="gradient"
                    size="sm"
                    onClick={handleLogin}
                    _hover={{
                      transform: 'translateY(-1px)',
                      boxShadow: 'lg',
                    }}
                  >
                    Get Started
                  </Button>
                </HStack>
              )}
            </>
          )}
        </HStack>
      </Flex>
    </Box>
  )
}

export default Navbar
