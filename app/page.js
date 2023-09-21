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
      <div className='login-page-pic'>
      </div>
      :
      <div className='login-page-pic'>
          <div className="login-page-text">
            <span className='login-header'>Hey Teach! 🍎</span>
            <p>
              Let <span style={{ color: "#55286F" }}>Gradebook</span> help you keep track of your students and their assignments. <br /> <br />
              Log in to get started!
            </p>
            <div>
              <Button variant="contained" color="secondary" style={{ margin: 0, fontSize: 20, fontWeight: 600, letterSpacing: 3 }}
                onClick={() => setLogin(true)}>
                Login
              </Button>
            </div>
            <Dialog open={login} onClose={() => setLogin(false)}>
              <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth}></StyledFirebaseAuth>
            </Dialog>
          </div>

      </div>
  )
}
