import React, { useEffect, useRef, useState } from 'react'
import './App.css'
import Message from './Message';
import {Box,Container,VStack,HStack,Button,Input,Heading,Tooltip} from '@chakra-ui/react';
import dotenv from "dotenv";
dotenv.config({
	path: "./.env",
});
import {
  onAuthStateChanged, 
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut
} from 'firebase/auth';
import {getFirestore,addDoc,collection, serverTimestamp, onSnapshot, query, orderBy} from 'firebase/firestore'
import {app} from './firebase'



const auth = getAuth(app);
const db = getFirestore(app);

const loginHandler = () =>{
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth,provider);
}




const App = () => {

  const q = query(collection(db,"Message"),orderBy("createdAt",'asc'))

  const [user,setUser] = useState(false);
  

  const [message,setMessage] = useState("")
  const [messages,setMessages] = useState([])
  const [isOpen,setIsOpen] = useState(false);

  const forScroll = useRef(null);

  

  const submitHandler = async (e) =>{
    e.preventDefault();
    if(message==='') return;
    const msgObject = {
      text:message,
      uid:user.uid,
      uri:user.photoURL,
      createdAt:serverTimestamp(),
      userName:user.displayName,
    }
    try{
      await addDoc(collection(db,"Message"),msgObject);
      setMessages([...messages,msgObject])
      setMessage("");
      forScroll.current.scrollIntoView({behavior: "smooth"});
    }catch(err){
      alert(err)
    }
  }
  
  const logoutHandler = () => {
    setIsOpen(false);
    signOut(auth);
  }

  useEffect(()=>{
    const unsubscribe = onAuthStateChanged(auth,(data)=>{
      setUser(data);
    });
 
    const unsubscribeFormsg = onSnapshot(q,(snap)=>{
      setMessages(
        snap.docs.map((item)=>{
          const id = item.id;
          return {id,...item.data()};
        }
        
      )
      )
    });

    return () => {
      unsubscribe();
      unsubscribeFormsg();
    }
  },[])

  return (
    <Box bg={"red.100"} style={{transition:"transform 0.5"}}>
      {user?(<Container h={"100vh"} bg={"white"} padding={"0"}>
        <VStack bg={"#38184C"} width="100%" h="full" >

       
      <div className='header'>
        <h3 className='atma-light'>SS-Chat-Room</h3>
        
        <Tooltip label="Sure want to log out ?" aria-label='A tooltip' alignSelf={"flex-end"}>
          <Button w={24}  colorScheme='red' onClick={()=>setIsOpen(!isOpen)}>Log out</Button>
        </Tooltip>
      </div>

      {isOpen && (
      <VStack className='modal' bg={"white"} padding={6} borderRadius={"base"} margin={5}>
        <h3 style={{color:"black",fontWeight:"500",margin:"10px 0 "}}>Do you really want to leave the chat ?</h3>
        <HStack>
          <Button className='modal-button' colorScheme='red' width={20} onClick={logoutHandler}>log-out</Button>
          <Button className='modal-button' onClick={()=>setIsOpen(!isOpen)} colorScheme='green' width={20}>cancel</Button>
        </HStack>
      </VStack>

      )}
    
           
        <VStack  h="full" w="full" maxW={"100vw"} paddingX={4} paddingY={2} overflow={"auto"} style={{ filter: isOpen ? 'blur(2px)' : 'none' }}>
            
            {messages.map((msg,index)=><Message text={msg.text} uri={msg.uri} user={msg.uid===user.uid?"me":"other"} name={msg.userName.split(" ")[0]} key={index} />)}

            {/*  */}
          <div ref={forScroll} ></div>
          </VStack>

            <form style={{width:"100%"}} onSubmit={submitHandler} >
              <HStack>
                <Input placeholder='Enter message ...' value={message} onChange={(e)=>setMessage(e.target.value)} marginLeft={"20px"} textColor={'black'}  style={{backgroundColor:"#B4BEC9"}} />
                <Button type='submit' colorScheme='green' margin={"20px"}>send</Button>
              </HStack>
            </form>
          


        </VStack>
      </Container>):(
      <Container h={"100vh"} bg={"white"} padding={"0"}>
        <VStack h={"90vh"}  bg="#38184C" justifyContent={"center"} className='vstack'>
        <Heading as='h3' size='xl' noOfLines={1} color='white' padding={20} marginBottom={10}  className={`tagline atma-light` }fontFamily={""} >এসো গল্প করি...</Heading>
        <Button colorScheme='purple' onClick={loginHandler} className='signin'>Sign in with Google</Button>
        
        </VStack>
        <HStack h={"10vh"}  bg="#38184C" padding={"10px"}><span className='copyright' >@Sudip Sarkar</span></HStack>    
      </Container>)}
    </Box>
  )
}

export default App


