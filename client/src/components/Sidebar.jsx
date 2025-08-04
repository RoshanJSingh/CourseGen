import React from 'react'
import {
  Box,
  VStack,
  Text,
  List,
  ListItem,
  Icon,
  Divider,
  Badge,
  HStack,
  useColorModeValue,
} from '@chakra-ui/react'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import { 
  FiHome, 
  FiBook, 
  FiUser, 
  FiTrendingUp, 
  FiPlus,
  FiBookOpen
} from 'react-icons/fi'
import { useAuth0 } from '@auth0/auth0-react'

const Sidebar = () => {
  const location = useLocation()
  const { user } = useAuth0()
  
  const bg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const activeColor = useColorModeValue('brand.500', 'brand.300')
  const hoverBg = useColorModeValue('gray.50', 'gray.700')

  const navigationItems = [
    {
      label: 'Dashboard',
      icon: FiHome,
      path: '/',
      badge: null,
    },
    {
      label: 'My Courses',
      icon: FiBook,
      path: '/courses',
      badge: null,
    },
    {
      label: 'Create Course',
      icon: FiPlus,
      path: '/create',
      badge: 'New',
    },
    {
      label: 'Browse',
      icon: FiBookOpen,
      path: '/browse',
      badge: null,
    },
    {
      label: 'Analytics',
      icon: FiTrendingUp,
      path: '/analytics',
      badge: null,
    },
  ]

  const accountItems = [
    {
      label: 'Profile',
      icon: FiUser,
      path: '/profile',
      badge: null,
    },
  ]

  const SidebarItem = ({ item, isActive }) => (
    <ListItem>
      <Box
        as={RouterLink}
        to={item.path}
        display="flex"
        alignItems="center"
        px={4}
        py={3}
        borderRadius="lg"
        color={isActive ? activeColor : 'gray.600'}
        bg={isActive ? hoverBg : 'transparent'}
        _hover={{
          bg: hoverBg,
          color: activeColor,
          textDecoration: 'none',
        }}
        transition="all 0.2s"
      >
        <Icon as={item.icon} mr={3} />
        <Text fontSize="sm" fontWeight={isActive ? 'semibold' : 'medium'}>
          {item.label}
        </Text>
        {item.badge && (
          <Badge
            ml="auto"
            size="sm"
            colorScheme="brand"
            variant="subtle"
          >
            {item.badge}
          </Badge>
        )}
      </Box>
    </ListItem>
  )

  return (
    <Box h="100%" py={6}>
      <VStack spacing={6} align="stretch" h="100%">
        {/* User Info */}
        <Box px={4}>
          <HStack spacing={3}>
            <Box
              w={8}
              h={8}
              bgGradient="linear(135deg, brand.500 0%, accent.500 100%)"
              borderRadius="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Text color="white" fontWeight="bold" fontSize="xs">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </Text>
            </Box>
            <Box flex="1" minW={0}>
              <Text fontSize="sm" fontWeight="semibold" isTruncated>
                {user?.name || 'User'}
              </Text>
              <Text fontSize="xs" color="gray.500" isTruncated>
                Welcome back!
              </Text>
            </Box>
          </HStack>
        </Box>

        <Divider />

        {/* Main Navigation */}
        <Box flex="1">
          <List spacing={1} px={2}>
            {navigationItems.map((item) => (
              <SidebarItem
                key={item.path}
                item={item}
                isActive={location.pathname === item.path}
              />
            ))}
          </List>
        </Box>

        <Divider />

        {/* Account Section */}
        <Box>
          <Text
            fontSize="xs"
            fontWeight="semibold"
            color="gray.500"
            textTransform="uppercase"
            letterSpacing="wide"
            px={4}
            mb={2}
          >
            Account
          </Text>
          <List spacing={1} px={2}>
            {accountItems.map((item) => (
              <SidebarItem
                key={item.path}
                item={item}
                isActive={location.pathname === item.path}
              />
            ))}
          </List>
        </Box>

        {/* Quick Stats */}
        <Box px={4} py={3} bg={hoverBg} borderRadius="lg" mx={2}>
          <Text fontSize="xs" fontWeight="semibold" color="gray.500" mb={2}>
            Quick Stats
          </Text>
          <VStack spacing={1} align="stretch">
            <HStack justify="space-between">
              <Text fontSize="xs" color="gray.600">Courses</Text>
              <Badge size="sm" colorScheme="brand">0</Badge>
            </HStack>
            <HStack justify="space-between">
              <Text fontSize="xs" color="gray.600">Lessons</Text>
              <Badge size="sm" colorScheme="green">0</Badge>
            </HStack>
          </VStack>
        </Box>
      </VStack>
    </Box>
  )
}

export default Sidebar
