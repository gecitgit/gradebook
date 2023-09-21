"use client"
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Checkbox, FormControlLabel } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState } from "react";

export default function ReusableDialog(props) {
    const [isChecked, setIsChecked] = useState(false);

    const theme = createTheme({
        palette: {
            primary: {
                main: '#55286f',
                light: '#7f368b',
                contrastText: '#fff',
            },
            secondary: {
                main: '#Bc96e6',
                light: '#d7c0f0',
                dark: '#d7c0f0',
                contrastText: '#210B2c',
            },
        },
    });

    return (
        <ThemeProvider theme={theme}>
            <Dialog open={props.isOpen} onClose={props.onClose} className="dialog-box">
                <DialogTitle className="dialog-title">{props.title}</DialogTitle>
                <DialogContent className="dialog-content">
                    <DialogContentText className="dialog-text">
                        {props.contentText}
                    </DialogContentText>
                    {props.hasCheckbox && <FormControlLabel
                        className="dialog-checkbox-label"
                        control={
                            <Checkbox
                            checked={isChecked}
                            onChange={(e) => setIsChecked(e.target.checked)}
                            color="primary"
                            />
                        }
                        label={<span>{props.checkboxText}</span>}
                        />}
                </DialogContent>
                <DialogActions className="dialog-actions">
                    <Button
                        className="dialog-cancel"
                        variant="contained"
                        disabled={props.hasCheckbox && !isChecked}
                        color="secondary"
                        onClick={props.onClose}
                        >
                        {props.secondaryButtonText}
                    </Button>
                    <Button
                        className="dialog-confirm"
                        variant="contained"
                        disabled={props.hasCheckbox && !isChecked}
                        onClick={async () => {
                            props.onClose();
                            await props.onConfirm();
                        }}
                        >
                        {props.primaryButtonText}
                    </Button>
                </DialogActions>
            </Dialog>
        </ThemeProvider>
    )
}