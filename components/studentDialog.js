import { useState, useEffect } from 'react';
import { Avatar, Button, Dialog, DialogActions, DialogContent } from '@mui/material';
// import AdapterDateFns from '@mui/lab/AdapterDateFns';
// import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { useAuth } from '../firebase/auth';

const DEFAULT_FILE_NAME = "No file selected";

const DEFAULT_FORM_STATE = {
    fileName: DEFAULT_FILE_NAME,
    file: null,
    studentName: "",
    birthday: null,
    pronouns: "",
    academicStanding: "",
    hobbies: "",
    allergies: "",
    emergencyContactName: "",
    emergencyContactRelationship: "",
    emergencyContactPhone: "",
};

export default function StudentDialog(props) {
    const { authUser } = useAuth();
    const isEdit = Object.keys(props.edit).length > 0;
    const [formFields, setFormFields] = useState(isEdit ? props.edit : DEFAULT_FORM_STATE);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (props.showDialog) {
            setFormFields(isEdit ? props.edit : DEFAULT_FORM_STATE);
        }
    }, [props.edit, props.showDialog])

    const isDisabled = () => formFields.fileName === DEFAULT_FILE_NAME ||
        formFields.studentName.length === 0 ||
        !formFields.birthday ||
        formFields.pronouns.length === 0 ||
        formFields.academicStanding.length === 0 ||
        formFields.hobbies.length === 0 ||
        formFields.allergies.length === 0 ||
        formFields.emergencyContactName.length === 0 ||
        formFields.emergencyContactRelationship.length === 0 ||
        formFields.emergencyContactPhone.length === 0;

    const updateFormField = (event, field) => {
        setFormFields(prevState => ({...prevState, [field]: event.target.value}))
    }

    const setFileData = (target) => {
        const file = target.files[0];
        setFormFields(prevState => ({...prevState, fileName: file.name }));
        setFormFields(prevState => ({...prevState, file }));
    }

    const closeDialog = () => {
        setIsSubmitting(false);
        props.onCloseDialog();
    }

    const handleSubmit = () => {
        console.log("you submttted this form bucko");
    }


    return (
        <Dialog
            onClose={() => closeDialog()}
            open={props.showDialog}
            component="form"
        >
            <h4>{isEdit ? "EDIT" : "ADD"} STUDENT</h4>
            <DialogContent>
                <div>
                    {(isEdit && !formFields.fileName) && <Avatar alt="student image" src={formFields.imageUrl} sx={{ marginRight: '1em' }} /> }
                    <Button variant="outlined" component="label" color="secondary">
                        Upload Kid Pic
                        <input type="file" hidden onInput={(event) => {setFileData(event.target)}} />
                    </Button>
                    <span>{formFields.fileName}</span>
                </div>
                <div>
                    <label htmlFor="studentName">Student Name</label>
                    <input type="text" id="studentName" value={formFields.studentName} onChange={(event) => updateFormField(event, "studentName")} />
                </div>
                <div>
                    <label htmlFor="birthday">Birthday</label>
                    <input type="date" id="birthday" value={formFields.birthday} onChange={(event) => updateFormField(event, "birthday")} />
                </div>
                <div>
                    <label htmlFor="pronouns">Pronouns</label>
                    <input type="text" id="pronouns" value={formFields.pronouns} onChange={(event) => updateFormField(event, "pronouns")} />
                </div>
                <div>
                    <label htmlFor="academicStanding">Academic Standing</label>
                    <input type="text" id="academicStanding" value={formFields.academicStanding} onChange={(event) => updateFormField(event, "academicStanding")} />
                </div>
                <div>
                    <label htmlFor="hobbies">Hobbies</label>
                    <input type="text" id="hobbies" value={formFields.hobbies} onChange={(event) => updateFormField(event, "hobbies")} />
                </div>
                <div>
                    <label htmlFor="allergies">Allergies</label>
                    <input type="text" id="allergies" value={formFields.allergies} onChange={(event) => updateFormField(event, "allergies")} />
                </div>
                <div>
                    <label htmlFor="emergencyContactName">Emergency Contact Name</label>
                    <input type="text" id="emergencyContactName" value={formFields.emergencyContactName} onChange={(event) => updateFormField(event, "emergencyContactName")} />
                </div>
                <div>
                    <label htmlFor="emergencyContactRelationship">Emergency Contact Relationship</label>
                    <input type="text" id="emergencyContactRelationship" value={formFields.emergencyContactRelationship} onChange={(event) => updateFormField(event, "emergencyContactRelationship")} />
                </div>
                <div>
                    <label htmlFor="emergencyContactPhone">Emergency Contact Phone</label>
                    <input type="text" id="emergencyContactPhone" value={formFields.emergencyContactPhone} onChange={(event) => updateFormField(event, "emergencyContactPhone")} />
                </div>
            </DialogContent>
            <DialogActions>
                {isSubmitting ?
                    <Button color="secondary" variant="contained" disabled={true}>
                        Submitting...
                    </Button> :
                    <Button color="secondary" variant="contained" disabled={isDisabled()} onClick={handleSubmit}>
                        Submit
                    </Button>}
            </DialogActions>
        </Dialog>
    )
}