import React from 'react'
import { Heading, useColorModeValue } from '@chakra-ui/react'

const HeadingBlock = ({ block }) => {
  const { text, level = 2 } = block
  const color = useColorModeValue('gray.800', 'white')

  const sizeMap = {
    1: 'xl',
    2: 'lg',
    3: 'md',
    4: 'sm',
    5: 'sm',
    6: 'xs',
  }

  return (
    <Heading
      as={`h${level}`}
      size={sizeMap[level] || 'md'}
      color={color}
      mt={level <= 2 ? 6 : 4}
      mb={2}
      fontWeight="semibold"
    >
      {text}
    </Heading>
  )
}

export default HeadingBlock
