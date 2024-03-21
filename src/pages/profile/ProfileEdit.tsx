import React, {ChangeEvent, useEffect, useState} from 'react'
import {Box, Button, Text, Flex, FormControl, FormLabel, Heading, Input, Stack, useColorModeValue, Card, CardBody, Tag, Highlight, Tooltip, Textarea, Spinner} from '@chakra-ui/react'
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {Link, useNavigate} from 'react-router-dom';
import {matchRole} from '../../utils/authUtils';
import {updateUser} from '../../store/slices/User';
import LayoutWrapper from '../../components/LayoutWrapper';

const ProfileEdit = () => {
    const [showAddSkills, setShowAddSkills] = useState(false);
    const [skillInput, setSkillInput] = useState('');

    const state = useAppSelector((state) => state.user)
    const [input, setInput] = useState({description: state.userInfo!.description});
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const onSubmit = () => {
        dispatch(updateUser(input))
            .unwrap()
            .then(() => {
                navigate(`/profile/${state.userInfo!.uid}`);
            })
    };

    function inputHandler(e: React.ChangeEvent<HTMLTextAreaElement>) {
        setInput((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
        return;
    };
    
    const skills = ['JS', 'TS', 'Postgresql', 'React'];

    return (
        <LayoutWrapper>
            <Flex
                h={'100%'}
                align={"center"}
                justify={"center"}
                bg={useColorModeValue("gray.50", "gray.800")}
            >
                <Card
                    rounded={"lg"}
                    bg={useColorModeValue("white", "gray.700")}
                    boxShadow={"lg"}
                    w={"90%"}
                    h={'90%'}
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
                                            label={state.userInfo?.organization.fullName}
                                            hasArrow
                                            bg={"gray.400"}
                                            color={"white"}
                                            placement='top'
                                        >
                                            <Tag
                                                _hover={{transform: 'scale(1.1)'}}
                                            >
                                                {state.userInfo?.organization.shortName}
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
                                >
                                    {matchRole(state.userInfo?.role)}
                                </Tag>

                                <Stack mt={"1.5rem"}>
                                    <Heading fontSize={"1.5rem"}>Обо мне</Heading>

                                    <Textarea 
                                        resize={'vertical'}
                                        name='description'
                                        placeholder='Расскажите о себе'
                                        value={input.description}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => inputHandler(e)}
                                        minH={"8rem"}
                                        maxW={"40rem"}
                                    />
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
                                    
                                    <Flex
                                        justifyContent={'start'}
                                        paddingTop={5}
                                    >
                                        <Button
                                            maxW={200}
                                            onClick={() => onSubmit()}
                                        >
                                            {state.isLoading ? <Spinner></Spinner> : 'Сохранить'}
                                        </Button>
                                    </Flex>
                                </Stack>
                            </Stack>
                        </Stack>
                    </CardBody>
                </Card>
            </Flex>
        </LayoutWrapper>
    )
}

export default ProfileEdit