"use client";
import Image from 'next/image'
import { Button, Dialog, Typography, Container, CircularProgress } from '@mui/material'
import { GoogleAuthProvider, EmailAuthProvider } from 'firebase/auth';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { auth } from '../firebase/firebase'
import { useAuth } from '../firebase/auth';
import { useRouter } from 'next/navigation';
import image from 'public/bg-desk-small.jpg'

const REDIRECT_PAGE = "/roster";

const uiConfig = {
  signInFlow: 'popup',
  signInSuccessUrl: REDIRECT_PAGE,
  signInOptions: [
    EmailAuthProvider.PROVIDER_ID,
    GoogleAuthProvider.PROVIDER_ID,
  ]
}

export default function Home() {
  const { authUser, isLoading } = useAuth();
  const [login, setLogin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && authUser) {
      router.push('/roster')
    }
  }, [authUser, isLoading, router]);

  return (
    (isLoading || (!isLoading && !!authUser)) 
    ?
    <CircularProgress color="inherit" size="80px" thickness={4.5} sx={{ marginLeft:"40%", marginTop: "25%" }}/> 
    :
    <div style={{
      backgroundImage: `url(${image.src})`,
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      backgroundPosition: "center",
      height: "100vh",
      width: "100vw",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",

    }}>
      <Head>
        <title>Grading</title>
      </Head>

      <main>
        <Container id="login-page-text">
          <h1>Welcome to Gradebook</h1>
          <p>
            Gradebook is a tool for teachers to manage their students' grades, designed with simplicity and ease of use in mind. <br />
            Login below to get started!
          </p>
          <div>
            <Button variant="contained" color="secondary" style={{ margin: 20}}
              onClick={() => setLogin(true)}>
              Login
            </Button>
          </div>
          <Dialog open={login} onClose={() => setLogin(false)}>
            <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth}></StyledFirebaseAuth>
          </Dialog>
        </Container>
      </main>    

    </div>
  )
}
