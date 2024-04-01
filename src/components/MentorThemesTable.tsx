import React from 'react'
import {Theme} from '../types'
import {Card, CardBody, Divider, Grid, GridItem, Heading} from '@chakra-ui/react'
import MentorThemeRow from './MentorThemeRow'

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

const MentorThemesTable = ({themes}: {themes: Theme[]}) => {
  return (
	  <Card>
      <CardBody minHeight={'75vh'} maxHeight={'75vh'} overflowY={'scroll'} paddingTop={0} sx={scrollBarSettings}>
        <Grid
          templateColumns='1.5fr 1.5fr 1fr 1fr 1fr'
          position={'sticky'}
          top={0}
          left={0}
          bg={'white'}
          zIndex={100}
          alignItems={'center'}
        >
          <GridItem w='100%' justifyItems={'center'} padding={5}>
            <Heading fontSize={16} textAlign={'center'}>Тема</Heading>
          </GridItem>
          <GridItem w='100%'>
            <Heading fontSize={16} textAlign={'center'}>Кандидаты на роль исполнителя</Heading>
          </GridItem>
          <GridItem w='100%'>
            <Heading fontSize={16} textAlign={'center'}>Статус</Heading>
          </GridItem>
          <GridItem w='100%'>
            <Heading fontSize={16} textAlign={'center'}>Время подачи заявки</Heading>
          </GridItem>
          <GridItem w='100%'>
            <Heading fontSize={16} textAlign={'center'}>Действие</Heading>
          </GridItem>
        </Grid>
        <Divider />
        {themes.map((theme) => 
          <MentorThemeRow theme={theme}/>
        )}
      </CardBody>
    </Card>
  )
}

export default MentorThemesTable