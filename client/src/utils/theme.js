import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  fonts: {
    heading: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  colors: {
    brand: {
      50: '#e8f2ff',
      100: '#c3d9ff',
      200: '#9dc0ff',
      300: '#76a7ff',
      400: '#4f8eff',
      500: '#667eea',
      600: '#4c63d2',
      700: '#3949ab',
      800: '#283593',
      900: '#1a237e',
    },
    accent: {
      50: '#f3e8ff',
      100: '#e0c3ff',
      200: '#cd9eff',
      300: '#ba79ff',
      400: '#a754ff',
      500: '#764ba2',
      600: '#5d3c7a',
      700: '#442d52',
      800: '#2b1e2a',
      900: '#120f02',
    }
  },
  styles: {
    global: (props) => ({
      body: {
        bg: props.colorMode === 'dark' ? 'gray.900' : 'gray.50',
        color: props.colorMode === 'dark' ? 'white' : 'gray.800',
      },
    }),
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: '500',
        borderRadius: 'lg',
      },
      variants: {
        solid: (props) => ({
          bg: props.colorScheme === 'brand' ? 'brand.500' : undefined,
          _hover: {
            bg: props.colorScheme === 'brand' ? 'brand.600' : undefined,
          },
        }),
        gradient: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          _hover: {
            background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
            transform: 'translateY(-1px)',
            boxShadow: 'lg',
          },
          _active: {
            transform: 'translateY(0)',
          },
          transition: 'all 0.2s',
        },
      },
    },
    Card: {
      baseStyle: {
        container: {
          borderRadius: 'xl',
          boxShadow: 'sm',
          _hover: {
            boxShadow: 'md',
            transform: 'translateY(-2px)',
          },
          transition: 'all 0.2s',
        },
      },
    },
    Input: {
      variants: {
        filled: {
          field: {
            borderRadius: 'lg',
            _focus: {
              borderColor: 'brand.500',
              boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
            },
          },
        },
      },
    },
    Textarea: {
      variants: {
        filled: {
          borderRadius: 'lg',
          _focus: {
            borderColor: 'brand.500',
            boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
          },
        },
      },
    },
  },
  shadows: {
    brand: '0 0 0 3px rgba(102, 126, 234, 0.6)',
  },
})

export default theme
