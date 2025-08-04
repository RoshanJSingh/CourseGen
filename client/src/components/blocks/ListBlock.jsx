import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  UnorderedList,
  OrderedList,
  ListItem,
  Badge,
  Icon,
  useColorModeValue
} from '@chakra-ui/react';
import {
  FiCheckCircle,
  FiCircle,
  FiArrowRight,
  FiStar,
  FiAlertCircle,
  FiInfo,
  FiTrendingUp,
  FiBookmark
} from 'react-icons/fi';

const ListBlock = ({ content }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  
  const {
    type = 'unordered', // 'unordered', 'ordered', 'checklist', 'steps', 'features', 'pros-cons'
    items = [],
    title,
    style = 'default', // 'default', 'compact', 'spaced', 'card'
    variant = 'default', // 'default', 'success', 'warning', 'info', 'error'
    numbered = false,
    showIcons = true
  } = content;

  const getVariantColors = () => {
    switch (variant) {
      case 'success':
        return {
          bg: 'green.50',
          border: 'green.200',
          accent: 'green.500',
          text: 'green.700'
        };
      case 'warning':
        return {
          bg: 'yellow.50',
          border: 'yellow.200',
          accent: 'yellow.500',
          text: 'yellow.700'
        };
      case 'info':
        return {
          bg: 'blue.50',
          border: 'blue.200',
          accent: 'blue.500',
          text: 'blue.700'
        };
      case 'error':
        return {
          bg: 'red.50',
          border: 'red.200',
          accent: 'red.500',
          text: 'red.700'
        };
      default:
        return {
          bg: bgColor,
          border: borderColor,
          accent: 'gray.500',
          text: 'gray.700'
        };
    }
  };

  const getIconForType = (itemType = 'default', isChecked = false) => {
    if (!showIcons) return null;

    switch (type) {
      case 'checklist':
        return isChecked ? FiCheckCircle : FiCircle;
      case 'steps':
        return FiArrowRight;
      case 'features':
        return FiStar;
      case 'pros-cons':
        return itemType === 'pro' ? FiTrendingUp : FiAlertCircle;
      default:
        switch (variant) {
          case 'success': return FiCheckCircle;
          case 'warning': return FiAlertCircle;
          case 'info': return FiInfo;
          case 'error': return FiAlertCircle;
          default: return null;
        }
    }
  };

  const getIconColor = (itemType = 'default', isChecked = false) => {
    const colors = getVariantColors();
    
    if (type === 'checklist') {
      return isChecked ? 'green.500' : 'gray.400';
    }
    
    if (type === 'pros-cons') {
      return itemType === 'pro' ? 'green.500' : 'red.500';
    }
    
    return colors.accent;
  };

  const renderListItem = (item, index) => {
    const iconComponent = getIconForType(item.type, item.checked);
    const iconColor = getIconColor(item.type, item.checked);
    
    const content = typeof item === 'string' ? item : item.text || item.content;
    const subtitle = typeof item === 'object' ? item.subtitle : null;
    const badge = typeof item === 'object' ? item.badge : null;
    const priority = typeof item === 'object' ? item.priority : null;

    const itemContent = (
      <HStack spacing={3} align="start" width="100%">
        {iconComponent && (
          <Icon
            as={iconComponent}
            color={iconColor}
            boxSize={5}
            mt={0.5}
            flexShrink={0}
          />
        )}
        
        <VStack spacing={1} align="start" flex={1}>
          <HStack spacing={2} align="center" flexWrap="wrap">
            <Text
              fontSize={style === 'compact' ? 'sm' : 'md'}
              lineHeight="1.6"
              textDecoration={
                type === 'checklist' && item.checked ? 'line-through' : 'none'
              }
              opacity={type === 'checklist' && item.checked ? 0.7 : 1}
            >
              {content}
            </Text>
            
            {badge && (
              <Badge
                colorScheme={badge.color || 'blue'}
                variant="subtle"
                fontSize="xs"
              >
                {badge.text}
              </Badge>
            )}
            
            {priority && (
              <HStack spacing={0}>
                {[...Array(priority)].map((_, i) => (
                  <Icon key={i} as={FiStar} color="yellow.400" boxSize={3} />
                ))}
              </HStack>
            )}
          </HStack>
          
          {subtitle && (
            <Text fontSize="sm" color="gray.600" lineHeight="1.5">
              {subtitle}
            </Text>
          )}
        </VStack>
      </HStack>
    );

    if (style === 'card') {
      return (
        <Box
          key={index}
          p={3}
          bg={getVariantColors().bg}
          borderRadius="md"
          border="1px"
          borderColor={getVariantColors().border}
          transition="all 0.2s"
          _hover={{ shadow: 'sm' }}
        >
          {itemContent}
        </Box>
      );
    }

    return (
      <ListItem key={index} py={style === 'spaced' ? 2 : 1}>
        {itemContent}
      </ListItem>
    );
  };

  const getSpacing = () => {
    switch (style) {
      case 'compact': return 1;
      case 'spaced': return 4;
      case 'card': return 3;
      default: return 2;
    }
  };

  if (!items || items.length === 0) {
    return (
      <Box
        p={4}
        bg="gray.50"
        borderRadius="lg"
        border="2px"
        borderColor="gray.200"
        borderStyle="dashed"
        textAlign="center"
      >
        <VStack spacing={2}>
          <Icon as={FiBookmark} boxSize={6} color="gray.400" />
          <Text color="gray.500" fontSize="sm">
            No list items to display
          </Text>
        </VStack>
      </Box>
    );
  }

  const colors = getVariantColors();

  return (
    <Box
      bg={colors.bg}
      p={4}
      borderRadius="lg"
      border="1px"
      borderColor={colors.border}
    >
      <VStack spacing={getSpacing()} align="stretch">
        {/* List Title */}
        {title && (
          <VStack spacing={2} align="start" mb={2}>
            <Text fontSize="lg" fontWeight="semibold" color={colors.text}>
              {title}
            </Text>
            
            {/* Type Badge */}
            <HStack spacing={2}>
              <Badge
                colorScheme={variant !== 'default' ? variant : 'gray'}
                variant="subtle"
              >
                {type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Badge>
              
              {items.length > 0 && (
                <Badge colorScheme="blue" variant="outline">
                  {items.length} item{items.length !== 1 ? 's' : ''}
                </Badge>
              )}
            </HStack>
          </VStack>
        )}

        {/* List Content */}
        {style === 'card' ? (
          <VStack spacing={getSpacing()} align="stretch">
            {items.map((item, index) => renderListItem(item, index))}
          </VStack>
        ) : type === 'ordered' || numbered ? (
          <OrderedList spacing={getSpacing()} pl={showIcons ? 0 : 4}>
            {items.map((item, index) => renderListItem(item, index))}
          </OrderedList>
        ) : (
          <UnorderedList spacing={getSpacing()} pl={showIcons ? 0 : 4} styleType="none">
            {items.map((item, index) => renderListItem(item, index))}
          </UnorderedList>
        )}

        {/* Summary for special types */}
        {type === 'checklist' && (
          <Box pt={2} borderTop="1px" borderColor={colors.border}>
            <HStack spacing={4} justify="center" fontSize="sm" color="gray.600">
              <Text>
                Completed: {items.filter(item => item.checked).length}
              </Text>
              <Text>
                Remaining: {items.filter(item => !item.checked).length}
              </Text>
              <Text>
                Progress: {Math.round((items.filter(item => item.checked).length / items.length) * 100)}%
              </Text>
            </HStack>
          </Box>
        )}

        {type === 'pros-cons' && (
          <Box pt={2} borderTop="1px" borderColor={colors.border}>
            <HStack spacing={6} justify="center" fontSize="sm">
              <HStack spacing={1}>
                <Icon as={FiTrendingUp} color="green.500" boxSize={4} />
                <Text color="green.600">
                  {items.filter(item => item.type === 'pro').length} Pros
                </Text>
              </HStack>
              <HStack spacing={1}>
                <Icon as={FiAlertCircle} color="red.500" boxSize={4} />
                <Text color="red.600">
                  {items.filter(item => item.type === 'con').length} Cons
                </Text>
              </HStack>
            </HStack>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default ListBlock;
