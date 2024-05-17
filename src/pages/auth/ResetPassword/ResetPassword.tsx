import React, {useEffect, useState} from 'react'
import {useAppDispatch, useAppSelector} from '../../../store/hooks';
import {FieldValues, useForm} from 'react-hook-form';
import {clearState} from '../../../store/slices/ForgotPasswordSlice';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Text,
  useColorModeValue
} from '@chakra-ui/react';
import {ViewIcon, ViewOffIcon} from '@chakra-ui/icons';
import {useNavigate, useParams} from 'react-router-dom';
import {resetPassword} from '../../../store/slices/ResetPasswordSlice';

const ResetPassword = () => {
  const {userId, secretCode} = useParams();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate()
  const dispatch = useAppDispatch();
  const {register, handleSubmit} = useForm();
  const {isFetching, isSuccess, isError, errorMessage} = useAppSelector((state) => state.resetPassword);
  const onSubmit = ({password}: FieldValues) => {
    dispatch(resetPassword({
        password,
        userId: userId!,
        secretCode: secretCode!
    }));
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
        <Stack spacing={8} w={"30rem"} mx={"auto"} maxW={"lg"} py={12} px={6}>
            <Box
                rounded={"lg"}
                bg={useColorModeValue("white", "gray.700")}
                boxShadow={"lg"}
                p={8}
            >
                <Stack spacing={4}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Stack spacing={4}>
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
                            {isFetching ?
                            <Button
                                isLoading
                                loadingText='Меняем пароль...'
                                bg={"blue.400"}
                                type="submit"
                                w="100%"
                                color={"white"}
                                _hover={{
                                    bg: "blue.500"
                                }}
                            >
                                Сменить пароль
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
                                Сменить пароль
                            </Button>}
                        </Stack>
                    </form>
                </Stack>
            </Box>
      	</Stack>
    </Flex>
  );
}

export default ResetPassword