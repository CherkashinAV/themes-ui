import {Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Button, Card, CardBody, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Flex, Heading, IconButton, Input, Select, Stack, useColorModeValue, useDisclosure, Text, Switch, Skeleton, SliderMark, Slider, SliderFilledTrack, SliderTrack, SliderThumb} from '@chakra-ui/react'
import React, {useEffect, useRef, useState} from 'react'
import SearchBar from '../../components/SearchBar'
import {useAppDispatch, useAppSelector} from '../../store/hooks'
import ThemeAccordionItem from '../../components/ThemeAccordionItem'
import {getThemes, getThemesIds, setFilters, clearState, Filters, setSearch} from '../../store/slices/ThemesSlice'
import LayoutWrapper from '../../components/LayoutWrapper'
import {SettingsIcon} from '@chakra-ui/icons'
import {Controller, useForm} from 'react-hook-form'
import {ThemeType} from '../../types'
import {projectTypeMapping} from '../../utils/themeUtils'
import {unwrapResult} from '@reduxjs/toolkit'

const scrollBarSettings = {
	'&::-webkit-scrollbar': {
		width: '5px',
		borderRadius: '8px',
		backgroundColor: `rgba(0, 0, 0, 0.1)`,
	},
	'&::-webkit-scrollbar-thumb': {
		backgroundColor: `rgba(66, 153,225, 1)`,
		height:'10px'
	}
}

const labelStyles = {
  mt: '2',
  ml: '-2.5',
  fontSize: 'sm',
};

const Themes = () => {
    const [isLoadingThemes, setIsLoadingThemes] = useState(false);
    const {isOpen, onOpen, onClose} = useDisclosure()
    const dispatch = useAppDispatch();
    const state = useAppSelector((state) => state);
    const themeListRef = useRef<HTMLDivElement>(null);
    const filterButtonRef = useRef(null);

    const {control, watch, handleSubmit, resetField} = useForm<Filters>({
      defaultValues: {
        type: state.themes.filters?.type as ThemeType ?? 'no',
        private: state.themes.filters?.private ?? 'false',
        slotsCount: state.themes.filters?.slotsCount ?? 1
      }
    });

    const filterSubmit = handleSubmit((data) => {
      if (data.private === 'false' || !data.private) {
        data.private = undefined;
      }

      data.type = data.type === 'no' ? undefined : data.type;

      dispatch(clearState());
      dispatch(setFilters(data));
      dispatch(getThemesIds({orgId: state.user.userInfo!.organization.id, userUid: undefined}))
        .unwrap()
        .then(() => {
          setIsLoadingThemes(() => true)
        });
      onClose();
    });

    const searchBarHandler = (search: string) => {
      dispatch(clearState());
      dispatch(setSearch(search));
      dispatch(getThemesIds({orgId: state.user.userInfo!.organization.id, userUid: undefined}))
        .unwrap()
        .then(() => {
          setIsLoadingThemes(() => true)
        });
    }

    const resetFilters = () => {
      dispatch(clearState());
      dispatch(getThemesIds({orgId: state.user.userInfo!.organization.id, userUid: undefined}))
        .unwrap()
        .then(() => {
          setIsLoadingThemes(() => true)
        });
      resetField('slotsCount');
      onClose()
    }

    useEffect(() => {
      if (themeListRef && themeListRef.current) {
        themeListRef.current.addEventListener('scroll', scrollHandler);
      }
      dispatch(getThemesIds({orgId: state.user.userInfo!.organization.id, userUid: undefined}))
        .then(() => {
          setIsLoadingThemes(() => true)
        });

      return function() {
        themeListRef.current?.removeEventListener('scroll', scrollHandler);
      }
    }, []);

    useEffect(() => {
      if (isLoadingThemes) {
        dispatch(getThemes({count: undefined}))
          .unwrap()
          .then(() => setIsLoadingThemes(() => false))
      }
    }, [isLoadingThemes, state.themes.themeIds]);

    const scrollHandler = (e: any) => {
      if (e.currentTarget.scrollHeight - (e.currentTarget.scrollTop + e.currentTarget.clientHeight) < 5) {
        setIsLoadingThemes(() => true);
        console.log('true')
      }
      // console.log('scrollHeight: ', e.currentTarget.scrollHeight)
      // console.log('scrollTop: ', e.currentTarget.scrollTop)
      // console.log(themeListRef.current?.offsetHeight)
    }

    return (
        <LayoutWrapper>
          <Flex alignItems={'center'} justifyContent={'center'} h={'92vh'} bg={"gray.50"}>
            <Card
              width={'80%'}
              rounded={"lg"}
              bg={useColorModeValue("white", "gray.700")}
              boxShadow={'lg'}
            >
              <CardBody height={'100%'}>
                <Stack
                  w={"100%"}
                  alignItems={'center'}
                  gap={8}
                >
                  <Box width={'60%'}>
                      <SearchBar handler={searchBarHandler}/>
                  </Box>
                  <Card
                    rounded={"lg"}
                    bg={useColorModeValue("white", "gray.700")}
                    width={'100%'}
                    boxShadow={'md'}
                    p={8}
                  >
                    <CardBody>
                      <Flex justifyContent={'center'}>
                          <Heading fontSize={20}>Список подобранных тем</Heading>
                      </Flex>
                      <IconButton
                        ref={filterButtonRef}
                        aria-label='open-filters'
                        icon={<SettingsIcon/>}
                        position={'absolute'}
                        right={5}
                        top={5}
                        onClick={onOpen}
                      ></IconButton>
                      <Box marginTop={8} minH={'50vh'} maxH={'55vh'} ref={themeListRef} overflowY={'scroll'} sx={scrollBarSettings}>
                        <Accordion>
                          {state.themes.themes.map((theme) =>
                            <ThemeAccordionItem theme={theme} key={theme.id}/>
                          )}
                        </Accordion>
                      </Box>
                    </CardBody>
                  </Card>
                </Stack>
              </CardBody>
            </Card>
          </Flex>
          <Drawer
            isOpen={isOpen}
            placement='right'
            onClose={onClose}
            finalFocusRef={filterButtonRef}
          >
            <DrawerOverlay />
            <DrawerContent>
              <DrawerCloseButton />
              <DrawerHeader>Фильтры</DrawerHeader>

              <DrawerBody>
                <Stack gap={5}>
                  <Box>
                    <Text>Тип работы</Text>
                    <Controller
                      name="type"
                      control={control}
                      render={({field}) => (
                        <Select {...field}>
                          <option value={'no'}>{'Не важно'}</option>
                          {Object.entries(projectTypeMapping).map(
                            ([key, value]) => {
                              return <option key={key} value={key}>{value}</option>
                            })
                          }
                        </Select>
                      )}
                    />
                    
                  </Box>

                  <Box>
                      <Controller
                        name='private'
                        control={control}
                        render={({field}) => (
                          <Flex gap={3} alignItems={'center'}>
                            <Switch {...field} name='private' defaultChecked={(state.themes.filters?.private ?? false).toString() === 'true'}/>
                            <Text>Показывать темы только вашей организации</Text>
                          </Flex>
                        )}
                      />
                  </Box>

                  <Box padding={5}>
                    <Flex
                      alignItems={'center'}
                      gap={4}
                    >
                      Минимальное количество свободных слотов
                      <Box 
                        padding={2}
                        bg={'gray.200'}
                        fontSize={12}
                        borderRadius={3}
                      >
                        {watch().slotsCount}
                      </Box>
                    </Flex>
                    <Controller
                      name='slotsCount'
                      control={control}
                      render={({field}) => (
                        <Slider
                          {...field}
                          aria-label='slider-ex-6'
                          max={9}
                          min={1}
                          step={1}
                          marginTop={10}
                        >
                          <SliderMark value={1} {...labelStyles}>
                            1
                          </SliderMark>
                          <SliderMark value={5} {...labelStyles}>
                            5
                          </SliderMark>
                          <SliderMark value={9} {...labelStyles}>
                            9
                          </SliderMark>
                          <SliderTrack>
                            <SliderFilledTrack />
                          </SliderTrack>
                          <SliderThumb boxSize={5}/>
                        </Slider>
                      )}
                    />
                    
                  </Box>

                </Stack>
              </DrawerBody>

              <DrawerFooter>
                <Flex justifyContent={'center'} width={'100%'} gap={3}>
                  <Button variant='outline' onClick={resetFilters}>
                    Сбросить
                  </Button>
                  <Button colorScheme='blue' onClick={filterSubmit}>Применить</Button>
                </Flex>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </LayoutWrapper>
    )
}

export default Themes