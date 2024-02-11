import React, {useEffect, useState} from 'react'
import {useAppDispatch, useAppSelector} from '../../../store/hooks';
import {FieldValues, useForm} from 'react-hook-form';
import {clearState, sendEmail} from '../../../store/slices/forgotPasswordSlice';
import {
  Box,
  Button,
  Flex,
  FormControl,
  Highlight,
  Input,
  Link,
  Stack,
  Text,
  useColorModeValue
} from '@chakra-ui/react';
import {Link as ReactRouterLink} from 'react-router-dom'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const dispatch = useAppDispatch();
  const {register, handleSubmit} = useForm();
  const {isFetching, isSuccess, isError, errorMessage} = useAppSelector((state) => state.forgotPassword);
  const onSubmit = ({email}: FieldValues) => {
    dispatch(sendEmail(email));
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
}, [isError, isSuccess]);

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} w={"30rem"} mx={"auto"} maxW={"lg"} py={12} px={6}>
          <Box
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"lg"}
            p={8}
          >
          {isSuccess ? (
              <Stack>
                <Text textAlign={'center'}>
                  Письмо было отправлено на email <br/>
                  <Highlight query={email} styles={{fontWeight: 'bold', color: 'blue.500'}}>
                    {email}
                  </Highlight>
                </Text>
                <Text textAlign={'center'}>
                  Перейдите по ссылке, чтобы восстановить пароль
                </Text>
              </Stack>
            )
            : (
              <Stack spacing={4}>
              <Box>
                <Text textAlign={'center'}>Введите email ниже и мы отправим ссылку на восстановление пароля.</Text>
              </Box>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={4}>
                  <FormControl id="email">
                    <Input
                      placeholder='Email'
                      type="email"
                      {...register('email', { pattern: /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/i, required: true})}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </FormControl>
                  {isFetching ?
                    <Button
                      isLoading
                      loadingText='Отправляем...'
                      bg={"blue.400"}
                      type="submit"
                      w="100%"
                      color={"white"}
                      _hover={{
                          bg: "blue.500"
                      }}
                    >
                      Отправить ссылку
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
                      Отправить ссылку
                    </Button>
                  }
                </Stack>
              </form>
              <Stack
                justify={'center'}
                alignItems={'center'}
              >
                <Text>Вспомнили пароль?</Text>
                <Link color={'blue.500'} _hover={{color: 'blue.600'}} as={ReactRouterLink} to='/auth/login'>
                  Войти
                </Link>
              </Stack>
              </Stack>
            )}
        </Box>
      </Stack>
    </Flex>
  );
}

export default ForgotPassword