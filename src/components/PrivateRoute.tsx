import {Navigate, Outlet} from "react-router-dom";
import {useAuth} from '../hooks/UseAuth';
import {Flex, Spinner} from '@chakra-ui/react';

const PrivateRoute = () => {
  const isLoading = useAuth();
  
  return isLoading ? (
      <Flex
        minW={"100vw"}
        minH={"100vh"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Spinner />
      </Flex>
    ) : 
    <Outlet />;
};

export default PrivateRoute;