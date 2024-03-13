import {Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Button, Card, CardBody, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Flex, Heading, IconButton, Input, Stack, useColorModeValue, useDisclosure} from '@chakra-ui/react'
import React, {useEffect, useRef, useState} from 'react'
import SearchBar from '../../components/SearchBar'
import {useAppDispatch, useAppSelector} from '../../store/hooks'
import ThemeAccordionItem from '../../components/ThemeAccordionItem'
import {getThemes, getThemesIds} from '../../store/slices/ThemesSlice'
import LayoutWrapper from '../../components/LayoutWrapper'
import {SettingsIcon} from '@chakra-ui/icons'

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

const Themes = () => {
    const [isLoadingThemes, setIsLoadingThemes] = useState(false);
    const {isOpen, onOpen, onClose} = useDisclosure()
    const dispatch = useAppDispatch();
    const state = useAppSelector((state) => state);
    const themeListRef = useRef<HTMLDivElement>(null);
    const filterButtonRef = useRef(null);

    useEffect(() => {
      if (themeListRef && themeListRef.current) {
        themeListRef.current.addEventListener('scroll', scrollHandler);
      }
      dispatch(getThemesIds({userUid: undefined}))
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
          .then(() => setIsLoadingThemes(false))
      }
    }, [isLoadingThemes]);

    const scrollHandler = (e: any) => {
      if (e.currentTarget.scrollHeight - (e.currentTarget.scrollTop + e.currentTarget.clientHeight) < 5) {
        setIsLoadingThemes(true);
        console.log('true')
      }
      // console.log('scrollHeight: ', e.currentTarget.scrollHeight)
      // console.log('scrollTop: ', e.currentTarget.scrollTop)
      // console.log(themeListRef.current?.offsetHeight)
    }

    return (
        <LayoutWrapper>
          <Flex alignItems={'center'} justifyContent={'center'} h={'100%'} bg={"gray.50"}>
            <Card
              width={'80%'}
              rounded={"lg"}
              bg={useColorModeValue("white", "gray.700")}
              boxShadow={'lg'}
              marginTop={5}
              marginBottom={5}
            >
              <CardBody height={'100%'}>
                <Stack
                  w={"100%"}
                  alignItems={'center'}
                  gap={8}
                >
                  <Box width={'60%'}>
                      <SearchBar/>
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
                <Input placeholder='Type here...' />
              </DrawerBody>

              <DrawerFooter>
                <Button variant='outline' mr={3} onClick={onClose}>
                  Cancel
                </Button>
                <Button colorScheme='blue'>Save</Button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </LayoutWrapper>
    )
}

export default Themes