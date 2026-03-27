import { Box } from '@chakra-ui/react';
import { Outlet, Navigate } from "react-router-dom";
import { getToken, isTokenValid } from './service/http';

export default function ProtectedLayout(){
  const token = getToken();
  const isAuthenticated = !!token && isTokenValid();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return(
    <Box display="flex" w="100%" h="100vh">
      <Box flex="1" overflow="auto">
        <Outlet/>
      </Box>
    </Box>
  );
}
