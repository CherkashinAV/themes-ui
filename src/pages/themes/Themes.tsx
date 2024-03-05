import {Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Card, CardBody, Flex, Heading, Stack, useColorModeValue} from '@chakra-ui/react'
import React, {useEffect, useRef, useState} from 'react'
import SearchBar from '../../components/SearchBar'
import {useAppDispatch, useAppSelector} from '../../store/hooks'
import ThemeAccordionItem from '../../components/ThemeAccordionItem'
import {getThemes, getThemesIds} from '../../store/slices/ThemesSlice'

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
    const dispatch = useAppDispatch();
    const state = useAppSelector((state) => state);
    const themeListRef = useRef<HTMLDivElement>(null);

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
        <Flex alignItems={'center'} justifyContent={'center'} minHeight={'100vh'} maxHeight={'100vh'} bg={"gray.50"}>
          <Card
            width={'90%'}
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={'lg'}
            p={3}
            minH={'90vh'}
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
                <Flex width={'100%'} gap={5}>
                  <Stack alignItems={'center'} flex={'3 1 0'}>
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
                        <Box marginTop={8} minH={'60vh'} maxH={'60vh'} ref={themeListRef} overflowY={'scroll'} sx={scrollBarSettings}>
                          <Accordion>
                            {state.themes.themes.map((theme) =>
                              <ThemeAccordionItem theme={theme} key={theme.id}/>
                            )}
                          </Accordion>
                        </Box>
                      </CardBody>
                    </Card>
                  </Stack>
                  <Card
                    rounded={"lg"}
                    bg={useColorModeValue("white", "gray.700")}
                    p={8}
                    width={'100%'}
                    flex={'1 1 0'}
                    boxShadow={'md'}
                  >
                    <CardBody>
                      <Flex justifyContent={'center'}>
                        <Heading fontSize={20}>Фильтры</Heading>
                      </Flex>
                    </CardBody>
                  </Card>
                </Flex>
              </Stack>
            </CardBody>
          </Card>
        </Flex>
    )
}

export default Themes