import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Radio,
  RadioGroup,
  Checkbox,
  CheckboxGroup,
  Progress,
  Alert,
  AlertIcon,
  Badge,
  useColorModeValue,
  useToast,
  Collapse,
  Icon
} from '@chakra-ui/react';
import { FiCheck, FiX, FiHelpCircle, FiRefreshCw } from 'react-icons/fi';

const MCQBlock = ({ content, onAnswer, readonly = false }) => {
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const toast = useToast();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const correctBg = useColorModeValue('green.50', 'green.900');
  const incorrectBg = useColorModeValue('red.50', 'red.900');
  const correctBorder = useColorModeValue('green.200', 'green.600');
  const incorrectBorder = useColorModeValue('red.200', 'red.600');

  const {
    question,
    options = [],
    correctAnswers = [],
    type = 'single', // 'single' or 'multiple'
    explanation,
    points = 1,
    difficulty = 'medium',
    tags = []
  } = content;

  const handleSubmit = () => {
    if (selectedAnswers.length === 0) {
      toast({
        title: 'No Answer Selected',
        description: 'Please select at least one answer before submitting.',
        status: 'warning',
        duration: 3000,        isClosable: true,
      });
      return;
    }

    let correct = false;
    if (type === 'single') {
      correct = selectedAnswers.length === 1 && correctAnswers.includes(selectedAnswers[0]);
    } else {
      correct = selectedAnswers.length === correctAnswers.length &&
                selectedAnswers.every(answer => correctAnswers.includes(answer)) &&
                correctAnswers.every(answer => selectedAnswers.includes(answer));
    }

    setIsCorrect(correct);
    setShowResult(true);
    setShowExplanation(true);

    if (onAnswer) {
      onAnswer({
        question,
        selectedAnswers,
        correctAnswers,
        isCorrect: correct,
        points: correct ? points : 0,
        maxPoints: points
      });
    }

    toast({
      title: correct ? 'Correct!' : 'Incorrect',
      description: correct 
        ? `Well done! You earned ${points} point${points !== 1 ? 's' : ''}.`
        : 'Don\'t worry, keep learning!',
      status: correct ? 'success' : 'error',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleReset = () => {
    setSelectedAnswers([]);
    setShowResult(false);
    setIsCorrect(false);
    setShowExplanation(false);
  };

  const handleSingleChoice = (value) => {
    if (readonly || showResult) return;
    setSelectedAnswers([parseInt(value)]);
  };

  const handleMultipleChoice = (values) => {
    if (readonly || showResult) return;
    setSelectedAnswers(values.map(v => parseInt(v)));
  };

  const getOptionStyle = (index) => {
    if (!showResult) return {};

    const isSelected = selectedAnswers.includes(index);
    const isCorrectOption = correctAnswers.includes(index);

    if (isCorrectOption) {
      return {
        bg: correctBg,
        borderColor: correctBorder,
        borderWidth: '2px'
      };
    } else if (isSelected) {
      return {
        bg: incorrectBg,
        borderColor: incorrectBorder,
        borderWidth: '2px'
      };
    }

    return {};
  };

  const getOptionIcon = (index) => {
    if (!showResult) return null;

    const isSelected = selectedAnswers.includes(index);
    const isCorrectOption = correctAnswers.includes(index);

    if (isCorrectOption) {
      return <Icon as={FiCheck} color="green.500" />;
    } else if (isSelected) {
      return <Icon as={FiX} color="red.500" />;
    }

    return null;
  };

  const getDifficultyColor = () => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'green';
      case 'medium': return 'yellow';
      case 'hard': return 'red';
      default: return 'gray';
    }
  };

  if (!question || options.length === 0) {
    return (
      <Alert status="warning" borderRadius="lg">
        <AlertIcon />
        <Text>Invalid MCQ configuration. Question and options are required.</Text>
      </Alert>
    );
  }

  return (
    <Box
      bg={bgColor}
      p={6}
      borderRadius="lg"
      border="1px"
      borderColor={borderColor}
      shadow="sm"
    >
      <VStack spacing={4} align="stretch">
        {/* Question Header */}
        <VStack spacing={2} align="start">
          <HStack justify="space-between" width="100%" flexWrap="wrap">
            <HStack spacing={2} flexWrap="wrap">
              <Badge colorScheme={getDifficultyColor()} variant="subtle">
                {difficulty}
              </Badge>
              <Badge colorScheme="blue" variant="outline">
                {points} point{points !== 1 ? 's' : ''}
              </Badge>
              <Badge colorScheme="purple" variant="outline">
                {type === 'single' ? 'Single Choice' : 'Multiple Choice'}
              </Badge>
            </HStack>
            
            {tags.length > 0 && (
              <HStack spacing={1} flexWrap="wrap">
                {tags.map((tag, index) => (
                  <Badge key={index} colorScheme="gray" variant="subtle" fontSize="xs">
                    {tag}
                  </Badge>
                ))}
              </HStack>
            )}
          </HStack>

          <Text fontSize="lg" fontWeight="medium" lineHeight="1.6">
            {question}
          </Text>
        </VStack>

        {/* Options */}
        <VStack spacing={3} align="stretch">
          {type === 'single' ? (
            <RadioGroup
              value={selectedAnswers.length > 0 ? selectedAnswers[0].toString() : ''}
              onChange={handleSingleChoice}
              isDisabled={readonly || showResult}
            >
              <VStack spacing={2} align="stretch">
                {options.map((option, index) => (
                  <Box
                    key={index}
                    p={3}
                    borderRadius="md"
                    border="1px"
                    borderColor="gray.200"
                    transition="all 0.2s"
                    cursor={readonly || showResult ? 'default' : 'pointer'}
                    _hover={readonly || showResult ? {} : { borderColor: 'blue.300' }}
                    {...getOptionStyle(index)}
                  >
                    <HStack justify="space-between">
                      <Radio value={index.toString()} colorScheme="blue">
                        <Text>{option}</Text>
                      </Radio>
                      {getOptionIcon(index)}
                    </HStack>
                  </Box>
                ))}
              </VStack>
            </RadioGroup>
          ) : (
            <CheckboxGroup
              value={selectedAnswers.map(a => a.toString())}
              onChange={handleMultipleChoice}
              isDisabled={readonly || showResult}
            >
              <VStack spacing={2} align="stretch">
                {options.map((option, index) => (
                  <Box
                    key={index}
                    p={3}
                    borderRadius="md"
                    border="1px"
                    borderColor="gray.200"
                    transition="all 0.2s"
                    cursor={readonly || showResult ? 'default' : 'pointer'}
                    _hover={readonly || showResult ? {} : { borderColor: 'blue.300' }}
                    {...getOptionStyle(index)}
                  >
                    <HStack justify="space-between">
                      <Checkbox value={index.toString()} colorScheme="blue">
                        <Text>{option}</Text>
                      </Checkbox>
                      {getOptionIcon(index)}
                    </HStack>
                  </Box>
                ))}
              </VStack>
            </CheckboxGroup>
          )}
        </VStack>

        {/* Result Section */}
        {showResult && (
          <Box
            p={4}
            borderRadius="lg"
            bg={isCorrect ? correctBg : incorrectBg}
            border="1px"
            borderColor={isCorrect ? correctBorder : incorrectBorder}
          >
            <HStack spacing={3} align="start">
              <Icon
                as={isCorrect ? FiCheck : FiX}
                color={isCorrect ? 'green.500' : 'red.500'}
                boxSize={5}
                mt={0.5}
              />
              <VStack spacing={2} align="start" flex={1}>
                <Text fontWeight="medium" color={isCorrect ? 'green.700' : 'red.700'}>
                  {isCorrect ? 'Correct!' : 'Incorrect'}
                </Text>
                
                {isCorrect ? (
                  <Text fontSize="sm" color={isCorrect ? 'green.600' : 'red.600'}>
                    Great job! You earned {points} point{points !== 1 ? 's' : ''}.
                  </Text>
                ) : (
                  <Text fontSize="sm" color="red.600">
                    The correct answer{correctAnswers.length > 1 ? 's are' : ' is'}:{' '}
                    {correctAnswers.map(index => options[index]).join(', ')}
                  </Text>
                )}
              </VStack>
            </HStack>
          </Box>
        )}

        {/* Answer Explanation */}
        <Collapse in={showExplanation && explanation}>
          <Box
            p={4}
            bg="blue.50"
            borderRadius="lg"
            border="1px"
            borderColor="blue.200"
          >
            <HStack spacing={2} align="start">
              <Icon as={FiHelpCircle} color="blue.500" mt={0.5} />
              <VStack spacing={2} align="start">
                <Text fontWeight="medium" color="blue.700">
                  Explanation
                </Text>
                <Text fontSize="sm" color="blue.600" lineHeight="1.6">
                  {explanation}
                </Text>
              </VStack>
            </HStack>
          </Box>
        </Collapse>

        {/* Action Buttons */}
        {!readonly && (
          <HStack spacing={3} justify="center">
            {!showResult ? (
              <Button
                colorScheme="blue"
                onClick={handleSubmit}
                isDisabled={selectedAnswers.length === 0}
                minW="120px"
              >
                Submit Answer
              </Button>
            ) : (
              <Button
                leftIcon={<FiRefreshCw />}
                onClick={handleReset}
                variant="outline"
                minW="120px"
              >
                Try Again
              </Button>
            )}
          </HStack>
        )}

        {/* Progress Indicator for Multiple Choice */}
        {type === 'multiple' && !showResult && !readonly && (
          <Box>
            <HStack justify="space-between" mb={1}>
              <Text fontSize="sm" color="gray.600">
                Selected: {selectedAnswers.length} / {correctAnswers.length}
              </Text>
              <Text fontSize="xs" color="gray.500">
                Select {correctAnswers.length} correct answer{correctAnswers.length !== 1 ? 's' : ''}
              </Text>
            </HStack>
            <Progress
              value={(selectedAnswers.length / correctAnswers.length) * 100}
              colorScheme="blue"
              size="sm"
              borderRadius="full"
            />
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default MCQBlock;
