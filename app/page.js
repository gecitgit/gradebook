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
  }, [authUser, isLoading]);

  return (
    (isLoading || (!isLoading && !!authUser)) 
    ?
    <CircularProgress color="inherit" sx={{ marginLeft: '50%', marginTop: '50%' }} /> 
    :
    <div>
      <Head>
        <title>Grading</title>
      </Head>

      <main>
        <Container>
          <Typography variant="h1">Welcome to gradebook</Typography>
          <Typography variant="h2">do some stuff with grades</Typography>
          <Typography variant="h3">or don't, i don't care.</Typography>
          <div>
            <Button variant="contained" color="secondary"
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
