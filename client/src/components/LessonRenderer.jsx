import React from 'react';
import { VStack } from '@chakra-ui/react';
import HeadingBlock from './blocks/HeadingBlock';
import ParagraphBlock from './blocks/ParagraphBlock';
import CodeBlock from './blocks/CodeBlock';
import VideoBlock from './blocks/VideoBlock';
import MCQBlock from './blocks/MCQBlock';
import ListBlock from './blocks/ListBlock';
import ImageBlock from './blocks/ImageBlock';

const LessonRenderer = ({ content = [], isEditable = false, onBlockUpdate, onBlockDelete, onAnswer }) => {
  const renderBlock = (block, index) => {
    const commonProps = {
      key: index,
      content: block,
      isEditable,
      onUpdate: onBlockUpdate,
      onDelete: onBlockDelete,
    };

    switch (block.type) {
      case 'heading':
        return <HeadingBlock {...commonProps} />;
      case 'paragraph':
        return <ParagraphBlock {...commonProps} />;
      case 'code':
        return <CodeBlock {...commonProps} />;
      case 'video':
        return <VideoBlock {...commonProps} />;
      case 'mcq':
        return <MCQBlock {...commonProps} onAnswer={onAnswer} />;
      case 'list':
        return <ListBlock {...commonProps} />;
      case 'image':
        return <ImageBlock {...commonProps} />;
      default:
        return null;
    }
  };
  return (
    <VStack spacing={6} align="stretch" w="100%">
      {content.map((block, index) => renderBlock(block, index))}
    </VStack>
  );
};

export default LessonRenderer;
