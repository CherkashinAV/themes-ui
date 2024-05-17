import React, {useEffect, useState} from 'react'
import {clearState} from '../../../store/slices/SignUpSlice';
import {useAppDispatch, useAppSelector} from '../../../store/hooks';
import {useNavigate, useParams} from 'react-router-dom';
import {
  Box,
  Flex,
  FormControl,
  Button,
  FormLabel,
  HStack,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  useColorModeValue,
  Checkbox,
  Link
} from '@chakra-ui/react';
import {Link as RouterLink} from 'react-router-dom';
import {ViewIcon, ViewOffIcon} from "@chakra-ui/icons";
import {FieldValues, useForm} from 'react-hook-form';
import {getRegisterPayload} from '../../../utils/authUtils';
import {signUp} from '../../../store/slices/SignUpSlice';


const Register = () => {
  const {secret} = useParams();
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setChecked] = useState(true);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {register, handleSubmit} = useForm();
  const {isFetching, isSuccess, isError, errorMessage} = useAppSelector((state) => state.signUp);
  const onSubmit = (data: FieldValues) => {
    const signUpPayload = getRegisterPayload(data)
    dispatch(signUp(signUpPayload));
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
      navigate('/auth/login');
    }
}, [isError, isSuccess]);

  return (
	  <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} mx={"auto"} w={"30rem"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Регистрация
          </Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={4}>
              <FormControl id="email" isRequired>
                <FormLabel>Email</FormLabel>
                <Input 
                  type="email"
                  {...register('email', { pattern: /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/i })}
                />
              </FormControl>
              <FormControl id="password" isRequired>
                <FormLabel>Пароль</FormLabel>
                <InputGroup>
                  <Input 
                    type={showPassword ? "text" : "password"}
                    {...register('password', {required: true, minLength: 6})}
                  />
                  <InputRightElement h={"full"}>
                    <Button
                      variant={"ghost"}
                      onClick={() =>
                        setShowPassword((showPassword) => !showPassword)
                      }
                    >
                      {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <Stack spacing={5} direction='row'>
                <Checkbox 
                  defaultChecked
                  checked={isChecked}
                  onChange={() => setChecked((cur) => !cur)}
                >
                  У меня есть код регистрации
                </Checkbox>
              </Stack>

              {
                isChecked ?
                <Box>
                  <FormControl id="invitationCode" isRequired>
                    <FormLabel>Код приглашения</FormLabel>
                    <Input type="text" {...register('invitationCode', {required: true})} defaultValue={secret ?? ''}/>
                  </FormControl>
                </Box> 
                  :
                <Stack>
                  <Flex gap={3}>
                    <Box>
                      <FormControl id="name" isRequired>
                        <FormLabel>Имя</FormLabel>
                        <Input type="text" {...register('name', {required: true})}/>
                      </FormControl>
                    </Box>
                    <Box>
                      <FormControl id="surname" isRequired>
                        <FormLabel>Фамилия</FormLabel>
                        <Input type="text" {...register('surname', {required: true})}/>
                      </FormControl>
                    </Box>
                  </Flex>
                  <Box>
                    <FormControl id="patronymic" isRequired>
                      <FormLabel>Отчество</FormLabel>
                      <Input type="text" placeholder='При наличии' {...register('patronymic', {required: false})}/>
                    </FormControl>
                  </Box>
                </Stack>
                }
              
              <Stack spacing={10} pt={2}>
              {isFetching ?
                <Button
                  isLoading
                  loadingText='Регистрируем...'
                  bg={"blue.400"}
                  type="submit"
                  w="100%"
                  color={"white"}
                  _hover={{
                      bg: "blue.500"
                  }}
                >
                  Зарегистрироваться
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
                  Зарегистрироваться
                </Button>
              }
              </Stack>
              <Stack alignItems={'center'} gap={0} fontSize={15}>
                <Box>Уже есть аккаунт? <Link as={RouterLink} to='/auth/login' color={'blue.400'}>Войти</Link></Box>
              </Stack>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Flex>
  );
}

export default Register