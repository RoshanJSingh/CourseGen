import React from 'react'
import { Text, useColorModeValue } from '@chakra-ui/react'

const ParagraphBlock = ({ block }) => {
  const { text } = block
  const color = useColorModeValue('gray.700', 'gray.300')

  return (
    <Text
      fontSize="md"
      lineHeight="1.7"
      color={color}
      mb={4}
      whiteSpace="pre-wrap"
    >
      {text}
    </Text>
  )
}

export default ParagraphBlock
