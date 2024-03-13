import {AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Badge, Box, Button, Flex, Heading, Link, Stack, Tag, Text, Tooltip} from '@chakra-ui/react'
import React from 'react'
import {User} from '../types'
import {Link as RouterLink} from 'react-router-dom';
import {themesProvider} from '../providers/themes';

const MentorAccordionItem = ({user, themeId}: {user: User, themeId: number}) => {
	const inviteMentorHandler = (mentorUid: string, themeId: number) => {
		themesProvider.inviteMentor({
			mentorUid,
			themeId
		});
	}

	return (
		<AccordionItem>
			<h2>
			<AccordionButton>
				<Box as="span" flex='1' textAlign='left'>
					<Flex alignItems={'center'} gap={3}>
						<Heading fontSize={16}>{`${user.name} ${user.surname}`}</Heading>
						<Link as={RouterLink} to="/profile">
								<Tooltip 
									label={user.organization.fullName}
									hasArrow
									bg={"gray.400"}
									color={"white"}
									placement='top'
								>
									<Tag
										_hover={{transform: 'scale(1.1)'}}
									>
										{user.organization.shortName}
									</Tag>
								</Tooltip>
							</Link>
					</Flex>
				</Box>
				<AccordionIcon />
			</AccordionButton>
			</h2>
			<AccordionPanel pb={4}>
				<Stack>
					<Heading fontSize={15}>Описание ментора</Heading>
					<Text fontSize={15}>
						{user.description}
					</Text>
					<Button onClick={() => inviteMentorHandler(user.uid, themeId)}>Пригласить в проект</Button>
				</Stack>
			</AccordionPanel>
		</AccordionItem>
	)
}

export default MentorAccordionItem