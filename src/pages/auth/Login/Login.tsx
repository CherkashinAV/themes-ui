import React, {useEffect} from 'react'
import {useNavigate} from 'react-router-dom';
import {useAppDispatch, useAppSelector} from '../../../store/hooks';
import {clearState, login} from '../../../store/slices/LoginSlice';
import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Button
} from '@chakra-ui/react';
import {FieldValues, useForm} from 'react-hook-form';
import {getLoginPayload} from '../../../utils/authUtils';

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {register, handleSubmit} = useForm();

  const {isFetching, isSuccess, isError, errorMessage} = useAppSelector((state) => state.login);
  const onSubmit = async (data: FieldValues) => {
    const loginPayload = await getLoginPayload(data);
    dispatch(login(loginPayload));
  };

  useEffect(() => {
    return () => {
      dispatch(clearState());
    };
  }, []);

  useEffect(() => {
    if (isError) {
      console.log(errorMessage);
      dispatch(clearState());
    }

    if (isSuccess) {
      dispatch(clearState());
      navigate('/home');
    }
  }, [isError, isSuccess]);

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} w={"30rem"} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"}>Вход</Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={4}>
              <FormControl id="email">
                <FormLabel>Email</FormLabel>
                <Input 
                  type="email"
                  {...register('email', { pattern: /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/i })}
                />
              </FormControl>
              <FormControl id="password">
                <FormLabel>Пароль</FormLabel>
                <Input 
                  type="password"
                  {...register('password', { required: true })}
                />
              </FormControl>
              {isFetching ?
                <Button
                  isLoading
                  loadingText='Сверяем данные...'
                  bg={"blue.400"}
                  type="submit"
                  w="100%"
                  color={"white"}
                  _hover={{
                      bg: "blue.500"
                  }}
                >
                  Войти
                </Button>
                :
                <Button
                  bg={"blue.400"}
                  type="submit"
                  w="100%"
                  color={"white"}
                  _hover={{
                      bg: "blue.500"
                  }}
                >
                  Войти
                </Button>
              }
            </Stack>
          </form>
        </Box>
      </Stack>
    </Flex>
  );
}

export default Login