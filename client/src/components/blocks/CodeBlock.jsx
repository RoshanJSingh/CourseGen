import React, { useState } from 'react'
import {
  Box,
  Code,
  Button,
  useToast,
  HStack,
  Text,
  useColorModeValue,
  IconButton,
  Tooltip,
} from '@chakra-ui/react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { FiCopy, FiCode } from 'react-icons/fi'

const CodeBlock = ({ block }) => {
  const { language, text, title } = block
  const [copied, setCopied] = useState(false)
  const toast = useToast()
  
  const isDark = useColorModeValue(false, true)
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const headerBg = useColorModeValue('gray.50', 'gray.700')

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast({
        title: 'Code copied!',
        status: 'success',
        duration: 2000,
        isClosable: true,
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast({
        title: 'Failed to copy code',
        status: 'error',
        duration: 2000,
        isClosable: true,
      })
    }
  }

  return (
    <Box
      border="1px"
      borderColor={borderColor}
      borderRadius="lg"
      overflow="hidden"
      my={4}
      bg={isDark ? 'gray.800' : 'white'}
    >
      {/* Header */}
      <HStack
        justify="space-between"
        px={4}
        py={2}
        bg={headerBg}
        borderBottom="1px"
        borderColor={borderColor}
      >
        <HStack spacing={2}>
          <FiCode />
          <Text fontSize="sm" fontWeight="medium">
            {title || language || 'Code'}
          </Text>
          {language && (
            <Code fontSize="xs" colorScheme="gray">
              {language}
            </Code>
          )}
        </HStack>
        
        <Tooltip label={copied ? 'Copied!' : 'Copy code'}>
          <IconButton
            size="sm"
            variant="ghost"
            icon={<FiCopy />}
            onClick={handleCopy}
            aria-label="Copy code"
            colorScheme={copied ? 'green' : 'gray'}
          />
        </Tooltip>
      </HStack>

      {/* Code Content */}
      <Box position="relative">
        <SyntaxHighlighter
          language={language || 'text'}
          style={isDark ? oneDark : oneLight}
          customStyle={{
            margin: 0,
            padding: '1rem',
            background: 'transparent',
            fontSize: '14px',
            lineHeight: '1.5',
          }}
          showLineNumbers={text.split('\n').length > 5}
          wrapLines={true}
          wrapLongLines={true}
        >
          {text}
        </SyntaxHighlighter>
      </Box>
    </Box>
  )
}

export default CodeBlock
