import React, { useState } from 'react';
import {
  Box,
  Image,
  VStack,
  HStack,
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Badge,
  Skeleton,
  Icon,
  Tooltip,
  useDisclosure,
  useColorModeValue,
  useToast
} from '@chakra-ui/react';
import {
  FiMaximize2,
  FiDownload,
  FiExternalLink,
  FiImage,
  FiEye,
  FiInfo
} from 'react-icons/fi';

const ImageBlock = ({ content }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const placeholderBg = useColorModeValue('gray.100', 'gray.700');

  const {
    src,
    alt = 'Course image',
    caption,
    title,
    width,
    height,
    alignment = 'center', // 'left', 'center', 'right'
    size = 'medium', // 'small', 'medium', 'large', 'full'
    rounded = true,
    showCaption = true,
    allowFullscreen = true,
    allowDownload = false,
    source,
    tags = []
  } = content;

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { maxW: '300px', maxH: '200px' };
      case 'medium':
        return { maxW: '500px', maxH: '400px' };
      case 'large':
        return { maxW: '700px', maxH: '500px' };
      case 'full':
        return { w: '100%', maxH: '600px' };
      default:
        return { maxW: '500px', maxH: '400px' };
    }
  };

  const getAlignmentStyles = () => {
    switch (alignment) {
      case 'left':
        return { alignSelf: 'flex-start' };
      case 'right':
        return { alignSelf: 'flex-end' };
      case 'center':
      default:
        return { alignSelf: 'center' };
    }
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoaded(true);
    setImageError(true);
  };

  const handleDownload = async () => {
    if (!src) return;

    try {
      const response = await fetch(src);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = title || alt || 'image';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: 'Image Downloaded',
        description: 'Image saved successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Download failed:', error);
      toast({
        title: 'Download Failed',
        description: 'Unable to download image.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const openInNewTab = () => {
    if (src) {
      window.open(src, '_blank', 'noopener,noreferrer');
    }
  };

  if (!src) {
    return (
      <Box
        bg={placeholderBg}
        p={8}
        borderRadius="lg"
        border="2px"
        borderColor="gray.300"
        borderStyle="dashed"
        textAlign="center"
        {...getAlignmentStyles()}
      >
        <VStack spacing={3}>
          <Icon as={FiImage} boxSize={12} color="gray.400" />
          <VStack spacing={1}>
            <Text color="gray.500" fontWeight="medium">
              No image provided
            </Text>
            <Text color="gray.400" fontSize="sm">
              {caption || 'Image source is missing'}
            </Text>
          </VStack>
        </VStack>
      </Box>
    );
  }

  return (
    <Box
      bg={bgColor}
      p={4}
      borderRadius="lg"
      border="1px"
      borderColor={borderColor}
      {...getAlignmentStyles()}
    >
      <VStack spacing={3} align="stretch">
        {/* Image Title */}
        {title && (
          <VStack spacing={2} align="start">
            <Text fontSize="lg" fontWeight="semibold">
              {title}
            </Text>
            
            {tags.length > 0 && (
              <HStack spacing={1} flexWrap="wrap">
                {tags.map((tag, index) => (
                  <Badge key={index} colorScheme="blue" variant="subtle" fontSize="xs">
                    {tag}
                  </Badge>
                ))}
              </HStack>
            )}
          </VStack>
        )}

        {/* Image Container */}
        <Box position="relative" {...getSizeStyles()}>
          {/* Loading Skeleton */}
          {!imageLoaded && (
            <Skeleton
              borderRadius={rounded ? 'lg' : 'none'}
              {...getSizeStyles()}
              height="300px"
            />
          )}

          {/* Error State */}
          {imageError ? (
            <Box
              bg={placeholderBg}
              borderRadius={rounded ? 'lg' : 'none'}
              border="2px"
              borderColor="gray.300"
              borderStyle="dashed"
              display="flex"
              alignItems="center"
              justifyContent="center"
              minH="200px"
              {...getSizeStyles()}
            >
              <VStack spacing={2}>
                <Icon as={FiImage} boxSize={8} color="gray.400" />
                <Text color="gray.500" fontSize="sm" textAlign="center">
                  Failed to load image
                  <br />
                  {alt}
                </Text>
              </VStack>
            </Box>
          ) : (
            <Box position="relative" display="inline-block">
              <Image
                src={src}
                alt={alt}
                borderRadius={rounded ? 'lg' : 'none'}
                objectFit="contain"
                width={width}
                height={height}
                {...getSizeStyles()}
                onLoad={handleImageLoad}
                onError={handleImageError}
                cursor={allowFullscreen ? 'zoom-in' : 'default'}
                onClick={allowFullscreen ? onOpen : undefined}
                transition="all 0.2s"
                _hover={allowFullscreen ? {
                  transform: 'scale(1.02)',
                  shadow: 'lg'
                } : {}}
              />

              {/* Image Overlay Actions */}
              {imageLoaded && !imageError && (
                <Box
                  position="absolute"
                  top={2}
                  right={2}
                  opacity={0}
                  _groupHover={{ opacity: 1 }}
                  transition="opacity 0.2s"
                >
                  <HStack spacing={1}>
                    {allowFullscreen && (
                      <Tooltip label="View fullscreen">
                        <Button
                          size="sm"
                          colorScheme="whiteAlpha"
                          variant="solid"
                          onClick={onOpen}
                          leftIcon={<FiMaximize2 />}
                        >
                          Zoom
                        </Button>
                      </Tooltip>
                    )}
                  </HStack>
                </Box>
              )}
            </Box>
          )}
        </Box>

        {/* Image Details */}
        {imageLoaded && !imageError && (showCaption || source) && (
          <VStack spacing={2} align="start">
            {/* Caption */}
            {showCaption && caption && (
              <Text fontSize="sm" color="gray.600" fontStyle="italic" lineHeight="1.5">
                {caption}
              </Text>
            )}

            {/* Source Attribution */}
            {source && (
              <HStack spacing={2} fontSize="xs" color="gray.500">
                <Icon as={FiInfo} />
                <Text>
                  Source: {typeof source === 'string' ? source : source.name}
                </Text>
                {typeof source === 'object' && source.url && (
                  <Button
                    as="a"
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="xs"
                    variant="link"
                    colorScheme="blue"
                    rightIcon={<FiExternalLink />}
                  >
                    Visit
                  </Button>
                )}
              </HStack>
            )}
          </VStack>
        )}

        {/* Action Buttons */}
        {imageLoaded && !imageError && (allowDownload || allowFullscreen) && (
          <HStack spacing={2} justify="center" pt={2}>
            {allowFullscreen && (
              <Button
                size="sm"
                leftIcon={<FiEye />}
                variant="outline"
                onClick={onOpen}
              >
                View Full Size
              </Button>
            )}
            
            <Button
              size="sm"
              leftIcon={<FiExternalLink />}
              variant="outline"
              onClick={openInNewTab}
            >
              Open in New Tab
            </Button>
            
            {allowDownload && (
              <Button
                size="sm"
                leftIcon={<FiDownload />}
                variant="outline"
                onClick={handleDownload}
              >
                Download
              </Button>
            )}
          </HStack>
        )}

        {/* Image Stats */}
        {imageLoaded && !imageError && size === 'full' && (
          <HStack spacing={4} justify="center" fontSize="xs" color="gray.500">
            <Text>Alt: {alt}</Text>
            {width && height && (
              <Text>Dimensions: {width} × {height}</Text>
            )}
          </HStack>
        )}
      </VStack>

      {/* Fullscreen Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="full" isCentered>
        <ModalOverlay bg="blackAlpha.800" />
        <ModalContent bg="transparent" shadow="none">
          <ModalCloseButton
            color="white"
            size="lg"
            top={4}
            right={4}
            zIndex={2}
          />
          <ModalBody p={0} display="flex" alignItems="center" justifyContent="center">
            <Box maxW="90vw" maxH="90vh" textAlign="center">
              <Image
                src={src}
                alt={alt}
                maxW="100%"
                maxH="100%"
                objectFit="contain"
                userSelect="none"
              />
              
              {/* Fullscreen Caption */}
              {caption && (
                <Box
                  position="absolute"
                  bottom={4}
                  left="50%"
                  transform="translateX(-50%)"
                  bg="blackAlpha.700"
                  color="white"
                  px={4}
                  py={2}
                  borderRadius="md"
                  maxW="80%"
                >
                  <Text fontSize="sm" textAlign="center">
                    {caption}
                  </Text>
                </Box>
              )}

              {/* Fullscreen Actions */}
              <Box
                position="absolute"
                top={4}
                left={4}
                zIndex={2}
              >
                <HStack spacing={2}>
                  <Button
                    colorScheme="whiteAlpha"
                    variant="solid"
                    size="sm"
                    leftIcon={<FiDownload />}
                    onClick={handleDownload}
                  >
                    Download
                  </Button>
                  <Button
                    colorScheme="whiteAlpha"
                    variant="solid"
                    size="sm"
                    leftIcon={<FiExternalLink />}
                    onClick={openInNewTab}
                  >
                    Open
                  </Button>
                </HStack>
              </Box>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ImageBlock;
