import React, {useEffect, useState} from 'react'
import {Box, Button, Text, Flex, FormControl, FormLabel, Heading, Input, Stack, useColorModeValue, Card, CardBody, Tag, Highlight, Tooltip, Textarea} from '@chakra-ui/react'
import {FieldValues, useForm} from 'react-hook-form';
import {useAppSelector} from '../../../store/hooks';
import {Link} from 'react-router-dom';
import {matchRole} from '../../../utils/authUtils';

const Profile = () => {
    const [isChanged, setIsChanged] = useState(false);
    const {register, handleSubmit} = useForm();
    const [showAddSkills, setShowAddSkills] = useState(false);
    const [skillInput, setSkillInput] = useState('');

    const state = useAppSelector((state) => state.user)

    const onSubmit = async (data: FieldValues) => {
    };

    useEffect(() => {

    }, [state])
    
    const skills = ['JS', 'TS', 'Postgresql', 'React'];

    return (
        <Flex
            minH={"100vh"}
            align={"center"}
            justify={"center"}
            bg={useColorModeValue("gray.50", "gray.800")}
        >
            <Card
                rounded={"lg"}
                bg={useColorModeValue("white", "gray.700")}
                boxShadow={"lg"}
                w={"89%"}
                p={8}
            >
                <CardBody>
                    <Stack>
                        <Heading>Профиль</Heading>
                        
                        <Stack spacing={2}>
                            <Flex
                                marginTop="2.5rem"
                                alignItems={'center'}
                                gap={'1rem'}
                            >
                                <Text
                                    fontSize="1.5rem"
                                >
                                    {state.userInfo!.surname + " " + state.userInfo!.name}
                                </Text>
                                <Link to="/profile">
                                    <Tooltip 
                                        label={"Московский авиационный институт"}
                                        hasArrow
                                        bg={"gray.400"}
                                        color={"white"}
                                        placement='top'
                                    >
                                        <Tag
                                            _hover={{transform: 'scale(1.1)'}}
                                        >
                                            МАИ
                                        </Tag>
                                    </Tooltip>
                                </Link>
                            </Flex>

                            <Text
                                color="gray.400"
                                fontSize={'1.2rem'}
                            >
                                {state.userInfo!.email}
                            </Text>

                            <Tag
                                width={'fit-content'}
                                // marginTop={'1.5rem'}
                            >
                                {matchRole(state.userInfo?.role)}
                            </Tag>

                            <form>
                                <Stack mt={"1.5rem"}>
                                    <Heading fontSize={"1.5rem"}>Обо мне</Heading>

                                    <FormControl id="description">
                                        <Textarea 
                                            resize={'vertical'}
                                            {...register('description', { required: true })}
                                            placeholder='Расскажите о себе'
                                            minH={"8rem"}
                                            maxW={"40rem"}
                                        />
                                    </FormControl>
                                </Stack>
                                
                                <Stack mt={"1.5rem"}>
                                    <Flex alignItems={"center"} gap={3}>
                                        <Heading fontSize={"1.5rem"}>Мои навыки</Heading>
                                        <Tag 
                                            as='button'
                                            type='button'
                                            _hover={{transform: 'scale(1.1)'}}
                                            cursor={"pointer"}
                                            onClick={() => setShowAddSkills((prev) => !prev)}
                                        >
                                            +
                                        </Tag>
                                        {showAddSkills && 
                                            <Box
                                                rounded={"lg"}
                                                bg={"gray.100"}
                                                boxShadow={"lg"}
                                                w={"37%"}
                                                p={3}
                                            >
                                                <Stack>
                                                    <Input 
                                                        placeholder='Typescript'
                                                        maxWidth={'15rem'}
                                                        value={skillInput}
                                                        onChange={(e) => setSkillInput(e.target.value.toLowerCase())}
                                                    >
                                                    </Input>

                                                    <Flex
                                                        flexWrap={'wrap'}
                                                        shrink={'1'}
                                                    >
                                                        {skills
                                                            .filter((skill) => skill.toLowerCase().includes(skillInput))
                                                            .map((skill) => <Tag key={skill}>{skill}</Tag>)
                                                        }
                                                    </Flex>
                                                </Stack>

                                            </Box>
                                        }
                                    </Flex>

                                    <FormControl id="skills" marginTop={3}>
                                        <Flex gap='2'>
                                            {skills.map((skill) => 
                                                <Tag key={skill}>
                                                    <Flex gap={2} alignItems={'center'}>
                                                        <Text>{skill}</Text>
                                                        <Flex 
                                                            as="button"
                                                            type='button'
                                                            w={5}
                                                            h={5}
                                                            alignItems={'center'}
                                                            justifyContent={'center'}
                                                            bg={'gray.200'}
                                                            rounded={'md'}
                                                            onClick={() => {}}
                                                        >
                                                            -
                                                        </Flex>
                                                    </Flex>
                                                </Tag>)
                                            }
                                        </Flex>
                                    </FormControl>
                                </Stack>
                            </form>
                        </Stack>
                    </Stack>
                </CardBody>
            </Card>
        </Flex>
    )
}

export default Profile