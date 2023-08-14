"use client";
import { useState, useEffect } from 'react';
import { Avatar, Button, Dialog, DialogActions, DialogContent } from '@mui/material';
import { useAuth } from '../../firebase/auth';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import DatePicker from '@mui/lab/DatePicker';
import { LocalizationProvider } from '@mui/lab';
import NavBar from '@/components/navbar';
import { uploadImage } from '../../firebase/storage';
import { useRouter } from 'next/navigation';
import { addStudent } from '../../firebase/firestore';
import slugify from 'slugify';

const DEFAULT_FILE_NAME = "No file selected";

export default function StudentForm() {
    const { authUser, isLoading } = useAuth();
    const router = useRouter();
    const [formData, setFormData] = useState({
        fileName: DEFAULT_FILE_NAME,
        file: null,
        studentFirstName: "",
        studentLastName: "",
        gradeLevel: "",
        birthday: "",
        pronouns: "",
        academicStanding: "",
        hobbies: "",
        allergies: "",
        emergencyContactName: "",
        emergencyContactRelationship: "",
        emergencyContactPhone: "",
    });

    useEffect(() => {
        if (!isLoading && !authUser) {
            router.push('/');
        }
    }, [authUser, isLoading, router]);

    function handleChange(event) {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log("this is formdata: ", formData);

        const firstNameSlug = slugify(formData.studentFirstName, {
            lower: true,
            strict: true
        });
        const lastNameSlug = slugify(formData.studentLastName, {
            lower: true,
            strict: true
        });
        const birthdaySlug = formData.birthday.replace(/-/g, '');
        const studentSlug = `${firstNameSlug}-${lastNameSlug}-${birthdaySlug}`;

        console.log("THIS IS THE STUDENT SLUG INSIDE OF THE HANDLE SUBMIT: ", studentSlug)

        try {
            const bucket = await uploadImage(formData.file, authUser.uid);
            await addStudent(authUser.uid, formData.studentFirstName, formData.studentLastName, formData.gradeLevel, formData.birthday, formData.pronouns, formData.academicStanding, formData.hobbies, formData.allergies, formData.emergencyContactName, formData.emergencyContactRelationship, formData.emergencyContactPhone, bucket, studentSlug);
            // alert('student added with picture and slug');
            router.push('/roster')
        } catch (error) {
            console.error(error);
        }
    }


    const setFileData = (target) => {
        const file = target.files[0];
        setFormData(prevState => ({...prevState, fileName: file.name}));
        setFormData(prevState => ({...prevState, file}));
    }

    return (
        <>
        <NavBar />

        <div> 
            {/* //this holds the whole form */}
            <h1>new student bucko</h1>
            <form onSubmit={handleSubmit}>
                    <fieldset>
                        <legend>welcoem to the cerew</legend>
                        <div>
                            <label htmlFor="studentPicBackup">lemme see them</label>
                            <input required type="file" name="studentPicBackup" id="studentPicBackup" onInput={(event) => { setFileData(event.target) }} />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <div>
                                <label htmlFor="studentFirstName">student first name</label>
                                <input required type='text' name='studentFirstName' id='studentFirstName' onChange={handleChange} value={formData.studentFirstName} />
                            </div>
                            <div>
                                <label htmlFor="studentLastName">student last name:</label>
                                <input required type='text' name='studentLastName' id='studentLastName' onChange={handleChange} value={formData.studentLastName} />
                            </div>
                            <div>
                                <label htmlFor='gradeLevel'>grade level</label>
                                <select required name='gradeLevel' id='gradeLevel' onChange={handleChange} value={formData.gradeLevel}>
                                    <option hidden value=''>select a grade level</option>
                                    <option value="pre-k">Pre-K</option>
                                    <option value="k">Kindergarten</option>
                                    <option value="1">1st grade</option>
                                    <option value="2">2nd grade</option>
                                    <option value="3">3rd grade</option>
                                    <option value="4">4th grade</option>
                                    <option value="5">5th grade</option>
                                    <option value="6">6th grade</option>
                                    <option value="7">7th grade</option>
                                    <option value="8">8th grade</option>
                                    <option value="9">9th grade</option>
                                    <option value="10">10th grade</option>
                                    <option value="11">11th grade</option>
                                    <option value='12'>12th grade</option>
                                    <option value="college">College</option>
                                    <option value="postcollege">Post College</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="birthday">birthday</label>
                                <input required type='date' name='birthday' id='birthday' onChange={handleChange} value={formData.birthday} />
                            </div>
                            <div>

                                <label htmlFor="pronouns">pronouns</label>
                                <input required type='text' name='pronouns' id='pronouns' onChange={handleChange} value={formData.pronouns} />
                            </div>
                            <div>
                                <label htmlFor="academicStanding">academic standing</label>
                                <select required type='text' name='academicStanding' id='academicStanding' onChange={handleChange} value={formData.academicStanding}>
                                    <option hidden value=''>select an academic standing</option>
                                    <option value="good">Good Standing</option>
                                    <option value="mid">Academic Notice</option>
                                    <option value="bad">Academic Probation</option>
                                </select>
                            </div>
                            <div>

                                <label htmlFor="hobbies">hobbies</label>
                                <input required type='text' name='hobbies' id='hobbies' onChange={handleChange} value={formData.hobbies} />
                            </div>
                            <div>

                                <label htmlFor="allergies">allergies</label>
                                <input required type='text' name='allergies' id='allergies' onChange={handleChange} value={formData.allergies} />
                            </div>
                            <div>

                                <label htmlFor="emergencyContactName">emergency contact name</label>
                                <input required type='text' name='emergencyContactName' id='emergencyContactName' onChange={handleChange} value={formData.emergencyContactName} />
                            </div>
                            <div>

                                <label htmlFor="emergencyContactRelationship">emergency contact relationship</label>
                                <input required type='text' name='emergencyContactRelationship' id='emergencyContactRelationship' onChange={handleChange} value={formData.emergencyContactRelationship} />
                            </div>
                            <div>
                                <label htmlFor="emergencyContactPhone">emergency contact phone</label>
                                <input required type='tel' name='emergencyContactPhone' id='emergencyContactPhone' onChange={handleChange} value={formData.emergencyContactPhone} />
                            </div>
                        </div>
                        <button type="submit" value="submit form">Submit this bad bitch</button>
                    </fieldset>
            </form>

        </div>
        </>
    )
}