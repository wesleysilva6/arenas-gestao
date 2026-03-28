import { Box, Flex } from '@chakra-ui/react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopBar from './Topbar'

export default function AppLayout() {
  return (
    <Flex minH="100vh" bg="gray.50">
      <Sidebar />

      {/* Conteúdo principal — margem para compensar a sidebar fixa */}
      <Box
        flex="1"
        ml={{ base: '70px', xl: '240px' }}
        display="flex"
        flexDirection="column"
        minH="100vh"
      >
        <TopBar />

        <Box flex="1" overflow="auto">
          <Outlet />
        </Box>
      </Box>
    </Flex>
  )
}
