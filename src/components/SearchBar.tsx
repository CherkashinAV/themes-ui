import {Search2Icon} from '@chakra-ui/icons'
import {Button, Card, CardBody, Input, InputGroup, InputLeftElement, InputRightAddon, useColorModeValue} from '@chakra-ui/react'
import React from 'react'

const SearchBar = () => {
  return (
	  <Card
      rounded={"lg"}
      bg={useColorModeValue("white", "gray.700")}
      boxShadow={"md"}
      w={"89%"}
    >
      <CardBody>
        <InputGroup borderRadius={5} size="sm">
          <InputLeftElement
            pointerEvents="none"
            children={<Search2Icon color="gray.600" />}
          />
          <Input
            type="text"
            placeholder="Поиск"
            border="1px solid #949494"
            borderRadius={10}
          />
          <InputRightAddon p={0} border="none">
            <Button
              size="sm"
              borderLeftRadius={0}
              borderRightRadius={3.3}
              border="1px solid #949494"
            >
              Искать
            </Button>
          </InputRightAddon>
        </InputGroup>
      </CardBody>
    </Card>
  )
}

export default SearchBar