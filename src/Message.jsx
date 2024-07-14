import React from 'react'
import {HStack,VStack,Avatar,Text} from '@chakra-ui/react';
const Message = ({text,uri,user,name}) => {
    
  return (
    
    <HStack alignSelf={user==="me" ? "flex-end" : "flex-start"} maxW={"70%"}  minH={"auto"}  >

        {user!=="me" && (
          <div className='prodiv' >
          <img src={uri}  style={{width:"60px",borderRadius:"5px" }} />
           <Text fontSize={"13px"} fontWeight={"300"} textColor={"white"} letterSpacing={"2px"} paddingX={"3px"} >{name}</Text>
          </div>
        )}
        <Text borderRadius={'10px'} bg={'#CEF09D'} paddingX={4} paddingY={1}>{text}</Text>
        {user==="me" && (
          <div className='prodiv' >
          <img src={uri}  style={{width:"60px",borderRadius:"5px" }} />
           <Text fontSize={"13px"} fontWeight={"300"} textColor={"white"} letterSpacing={"2px"} paddingX={"3px"}>{name}</Text>
          </div>
        )}
    </HStack>
    
  )
}

export default Message