import React, { useState, useEffect } from 'react';
import {
  Box,
  AspectRatio,
  Text,
  VStack,
  HStack,
  Button,
  Alert,
  AlertIcon,
  Badge,
  Skeleton,
  Icon,
  Tooltip,
  useColorModeValue,
  useToast
} from '@chakra-ui/react';
import { FiPlay, FiExternalLink, FiDownload, FiClock } from 'react-icons/fi';
import { api } from '../../utils/api';

const VideoBlock = ({ content }) => {
  const [videoData, setVideoData] = useState(null);
  const [embedHtml, setEmbedHtml] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();

  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    const fetchVideoData = async () => {
      if (!content.videoId && !content.videoUrl) {
        setError('No video ID or URL provided');
        setLoading(false);
        return;
      }

      try {        setLoading(true);
        setError(null);

        if (content.videoId) {
          const response = await api.get(`/youtube/video/${content.videoId}`);
          setVideoData(response.data);

          const embedResponse = await api.get(`/youtube/embed/${content.videoId}`);
          setEmbedHtml(embedResponse.data.embedHtml);
        } else if (content.videoUrl) {
          const videoId = extractVideoId(content.videoUrl);
          if (videoId) {
            const response = await api.get(`/youtube/video/${videoId}`);
            setVideoData(response.data);

            const embedResponse = await api.get(`/youtube/embed/${videoId}`);
            setEmbedHtml(embedResponse.data.embedHtml);
          } else {
            setVideoData({
              title: content.title || 'External Video',
              description: content.description || '',
              url: content.videoUrl
            });
          }
        }
      } catch (err) {
        console.error('Error fetching video data:', err);
        setError('Failed to load video data');
        toast({
          title: 'Video Error',
          description: 'Unable to load video. Please try again.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchVideoData();
  }, [content.videoId, content.videoUrl, content.title, content.description, toast]);

  const extractVideoId = (url) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const formatDuration = (duration) => {
    if (!duration) return '';    
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return '';

    const hours = parseInt(match[1] || 0);
    const minutes = parseInt(match[2] || 0);
    const seconds = parseInt(match[3] || 0);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleDownloadCaptions = async () => {
    if (!content.videoId) return;

    try {
      const response = await api.get(`/youtube/captions/${content.videoId}`);
      const captions = response.data.captions;
      
      if (captions && captions.length > 0) {
        const blob = new Blob([captions], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${videoData?.title || 'video'}-captions.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        toast({
          title: 'Captions Downloaded',
          description: 'Video captions saved successfully.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'No Captions Available',
          description: 'This video does not have captions.',
          status: 'info',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (err) {
      console.error('Error downloading captions:', err);
      toast({
        title: 'Download Failed',
        description: 'Unable to download captions.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return (
      <Box bg={bgColor} p={4} borderRadius="lg" border="1px" borderColor={borderColor}>
        <VStack spacing={4}>
          <Skeleton height="200px" width="100%" borderRadius="md" />
          <VStack spacing={2} align="start" width="100%">
            <Skeleton height="20px" width="80%" />
            <Skeleton height="16px" width="60%" />
          </VStack>
        </VStack>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert status="error" borderRadius="lg">
        <AlertIcon />
        <VStack align="start" spacing={1}>
          <Text fontWeight="medium">Video Error</Text>
          <Text fontSize="sm">{error}</Text>
        </VStack>
      </Alert>
    );
  }

  return (
    <Box bg={bgColor} p={4} borderRadius="lg" border="1px" borderColor={borderColor}>
      <VStack spacing={4} align="stretch">
        {/* Video Player */}
        <AspectRatio ratio={16 / 9}>
          {embedHtml ? (
            <Box
              dangerouslySetInnerHTML={{ __html: embedHtml }}
              borderRadius="md"
              overflow="hidden"
            />
          ) : videoData?.url ? (
            <Box
              bg="gray.100"
              display="flex"
              alignItems="center"
              justifyContent="center"
              borderRadius="md"
              border="2px"
              borderColor="gray.300"
              borderStyle="dashed"
            >
              <VStack spacing={3}>
                <Icon as={FiPlay} boxSize={8} color="gray.500" />
                <Text color="gray.600" textAlign="center">
                  External video player not supported.
                  <br />
                  Click below to open in new tab.
                </Text>
              </VStack>
            </Box>
          ) : (
            <Box
              bg="gray.100"
              display="flex"
              alignItems="center"
              justifyContent="center"
              borderRadius="md"
              border="2px"
              borderColor="gray.300"
              borderStyle="dashed"
            >
              <VStack spacing={2}>
                <Icon as={FiPlay} boxSize={8} color="gray.500" />
                <Text color="gray.600">Video not available</Text>
              </VStack>
            </Box>
          )}
        </AspectRatio>

        {/* Video Details */}
        {videoData && (
          <VStack spacing={3} align="stretch">
            <VStack spacing={2} align="start">
              <Text fontSize="lg" fontWeight="semibold">
                {videoData.title || content.title || 'Untitled Video'}
              </Text>
              
              {/* Video Stats */}
              <HStack spacing={4} flexWrap="wrap">
                {videoData.duration && (
                  <HStack spacing={1}>
                    <Icon as={FiClock} boxSize={4} color="gray.500" />
                    <Text fontSize="sm" color="gray.600">
                      {formatDuration(videoData.duration)}
                    </Text>
                  </HStack>
                )}
                
                {videoData.viewCount && (
                  <Badge colorScheme="blue" variant="subtle">
                    {parseInt(videoData.viewCount).toLocaleString()} views
                  </Badge>
                )}
                
                {videoData.channelTitle && (
                  <Badge colorScheme="green" variant="subtle">
                    {videoData.channelTitle}
                  </Badge>
                )}
              </HStack>
            </VStack>

            {/* Description */}
            {(videoData.description || content.description) && (
              <Text fontSize="sm" color="gray.600" noOfLines={3}>
                {videoData.description || content.description}
              </Text>
            )}

            {/* Action Buttons */}
            <HStack spacing={2} flexWrap="wrap">
              {videoData.url && (
                <Tooltip label="Open in new tab">
                  <Button
                    as="a"
                    href={videoData.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="sm"
                    leftIcon={<FiExternalLink />}
                    colorScheme="blue"
                    variant="outline"
                  >
                    Watch on YouTube
                  </Button>
                </Tooltip>
              )}
              
              {content.videoId && (
                <Tooltip label="Download video captions">
                  <Button
                    size="sm"
                    leftIcon={<FiDownload />}
                    variant="outline"
                    onClick={handleDownloadCaptions}
                  >
                    Captions
                  </Button>
                </Tooltip>
              )}
            </HStack>
          </VStack>
        )}

        {/* Custom Notes */}
        {content.notes && (
          <Box p={3} bg="blue.50" borderRadius="md" borderLeft="4px" borderColor="blue.400">
            <Text fontSize="sm" fontStyle="italic" color="blue.800">
              <strong>Notes:</strong> {content.notes}
            </Text>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default VideoBlock;
