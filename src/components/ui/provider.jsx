'use client'

import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { ColorModeProvider } from './color-mode'

const system = {
  ...defaultSystem,
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
}

export function Provider(props) {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider {...props} />
    </ChakraProvider>
  )
}
