import Image from "next/image"
import lost from "../public/undraw_lost_re_xqjt.svg"
import { useRouter } from 'next/navigation'
import { Button } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';

export default function InvalidURL() {
    const router = useRouter();

    const theme = createTheme({
        palette: {
            primary: {
                main: '#55286f',
                light: '#7f368b',
                contrastText: '#fff',
            }
        }
    })

    return (
        <div className="container-404">
            <p className="header-404">404</p>
            <Image 
                src={lost} 
                alt="404 image - person looking at a map"
                loading="lazy"
                width={0}
                height={0}
                style={{ width: '275px', height: 'auto' }}
            />
            <p className="subtext-404">Oops! Took a wrong turn?<br /> <br /> No worries, just click below to head back.</p>
            <ThemeProvider theme={theme}>
            <Button
                variant="contained"
                color="primary"
                fontWeight="bold"
                onClick={() => router.back()}
                >
                go back
            </Button>
            </ThemeProvider>
        </div>
    )
}