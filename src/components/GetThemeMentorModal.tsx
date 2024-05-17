import {Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Button, Card, CardBody, Center, Flex, Heading, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, useColorModeValue, useDisclosure} from '@chakra-ui/react'
import React, {useEffect, useRef, useState} from 'react'
import SearchBar from './SearchBar'
import {useAppDispatch, useAppSelector} from '../store/hooks'
import ThemeAccordionItem from './ThemeAccordionItem'
import {getThemes, getThemesIds} from '../store/slices/ThemesSlice'
import {useNavigate, useParams} from 'react-router-dom'
import {Theme} from '../types'
import MentorAccordionItem from './MentorAccordionItem'
import {clearState, getMentorIds, getMentors, setSearch} from '../store/slices/MentorSlice'

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

type GetThemeMentorModalProps = {
  theme: Theme,
  isOpen: boolean,
  onClose: () => void
}

const GetThemeMentorModal = ({theme, isOpen, onClose}: GetThemeMentorModalProps) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
	  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
    const state = useAppSelector((state) => state);
    const mentorListRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (mentorListRef && mentorListRef.current) {
        mentorListRef.current.addEventListener('scroll', scrollHandler);
      }
      dispatch(getMentorIds())
        .then(() => {
          setIsLoadingUsers(() => true)
        });

      return function() {
        mentorListRef.current?.removeEventListener('scroll', scrollHandler);
      }
    }, []);

    const searchBarHandler = (search: string) => {
      dispatch(clearState());
      dispatch(setSearch(search));
      dispatch(getMentorIds())
        .unwrap()
        .then(() => {
          setIsLoadingUsers(() => true)
        });
    }

    useEffect(() => {
      if (isLoadingUsers) {
        dispatch(getMentors({count: undefined}))
          .unwrap()
          .then(() => setIsLoadingUsers(() => false))
      }
    }, [isLoadingUsers]);

    const scrollHandler = (e: any) => {
      if (e.currentTarget.scrollHeight - (e.currentTarget.scrollTop + e.currentTarget.clientHeight) < 5) {
        setIsLoadingUsers(() => true);
        console.log('true')
      }
    }

    useEffect(() => {
      if (state.user.userInfo!.uid !== theme.creator.uid || theme.approver) {
        navigate(-1);
      }
    }, [])

    return (
      <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent minW={'80vw'} minH={'80vh'} maxHeight={'80vh'} h={'80vh'}>
        <ModalHeader>Список возможных руководителей</ModalHeader>
        <ModalCloseButton />
        <ModalBody h={'100%'}>
            <Stack
              w={"100%"}
              alignItems={'center'}
              gap={8}
            >
              <Box width={'60%'}>
                  <SearchBar handler={searchBarHandler}/>
              </Box>
          </Stack>
          <Box marginTop={8} ref={mentorListRef} overflowY={'scroll'} sx={scrollBarSettings} height={'80%'} w={'100%'}>
                <Accordion allowMultiple>
                  {state.mentors.mentors.map((mentor) =>
                    <MentorAccordionItem user={mentor} themeId={theme.id} key={mentor.uid}/>
                  )}
                </Accordion>
              </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
    )
}

export default GetThemeMentorModal