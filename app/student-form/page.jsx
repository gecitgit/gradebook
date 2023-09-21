"use client";
import { useState, useEffect } from 'react';
import { CircularProgress, Snackbar, Alert } from '@mui/material';
import { useAuth } from '../../firebase/auth';
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
        setFormData(prevState => ({ ...prevState, fileName: file.name }));
        setFormData(prevState => ({ ...prevState, file }));
    }

    return (
        (!authUser) ?
            (
                <>
                    <NavBar />
                    <div className="overlay-blur"></div>
                    <div className='progress-div'>
                        <CircularProgress color="secondary" size="80px" thickness={4.5} />
                    </div>
                </>
            )
            :
            <>
                <NavBar />

                <div>
                    {/* //this holds the whole form */}
                    {/* <h1>New Student Form</h1> */}
                    <form onSubmit={handleSubmit} className='FORM-body'>
                        <fieldset className="FORM-fieldset">
                            <legend>New Student Form</legend>
                            <div className='FORM-div'>
                                <div className='FORM-div-label'>
                                    <label htmlFor="studentPicBackup">Student Photo</label>
                                </div>
                                <div className='FORM-div-input'>
                                    <input required type="file" name="studentPicBackup" id="studentPicBackup" onInput={(event) => { setFileData(event.target) }} />
                                </div>
                            </div>
                            <div className='FORM-div'>
                                <div className='FORM-div-label'>
                                    <label htmlFor="studentFirstName">First Name</label>
                                </div>
                                <div className='FORM-div-input'>
                                    <input required type='text' name='studentFirstName' id='studentFirstName' onChange={handleChange} value={formData.studentFirstName} />
                                </div>
                            </div>
                            <div className='FORM-div'>
                                <div className='FORM-div-label'>
                                    <label htmlFor="studentLastName">Last Name</label>
                                </div>
                                <div className='FORM-div-input'>
                                    <input required type='text' name='studentLastName' id='studentLastName' onChange={handleChange} value={formData.studentLastName} />
                                </div>
                            </div>
                            <div className='FORM-div'>
                                <div className='FORM-div-label'>
                                    <label htmlFor='gradeLevel'>Grade Level</label>
                                </div>
                                <div className='FORM-div-input'>
                                    <select required name='gradeLevel' id='gradeLevel' onChange={handleChange} value={formData.gradeLevel}>
                                        <option hidden value=''>Select current grade level...</option>
                                        <option value="Pre-K">Pre-K</option>
                                        <option value="Kindergarten">Kindergarten</option>
                                        <option value="1st grade">1st grade</option>
                                        <option value="2nd grade">2nd grade</option>
                                        <option value="3rd grade">3rd grade</option>
                                        <option value="4th grade">4th grade</option>
                                        <option value="5th grade">5th grade</option>
                                        <option value="6th grade">6th grade</option>
                                        <option value="7th grade">7th grade</option>
                                        <option value="8th grade">8th grade</option>
                                        <option value="9th grade">9th grade</option>
                                        <option value="10th grade">10th grade</option>
                                        <option value="11th grade">11th grade</option>
                                        <option value='12th grade'>12th grade</option>
                                        <option value="College">College</option>
                                        <option value="Post-College">Post College</option>
                                    </select>
                                </div>
                            </div>
                            <div className='FORM-div'>
                                <div className='FORM-div-label'>
                                    <label htmlFor="birthday">Birthday</label>
                                </div>
                                <div className='FORM-div-input'>
                                    <input required type='date' name='birthday' id='birthday' onChange={handleChange} value={formData.birthday} />
                                </div>
                            </div>
                            <div className='FORM-div'>
                                <div className='FORM-div-label'>
                                    <label htmlFor="pronouns">Pronouns</label>
                                </div>
                                <div className='FORM-div-input'>

                                    <input required type='text' name='pronouns' id='pronouns' onChange={handleChange} value={formData.pronouns} />
                                </div>
                            </div>
                            <div className='FORM-div'>
                                <div className='FORM-div-label'>
                                    <label htmlFor="academicStanding">Academic Standing</label>
                                </div>
                                <div className='FORM-div-input'>
                                    <select required type='text' name='academicStanding' id='academicStanding' onChange={handleChange} value={formData.academicStanding}>
                                        <option hidden value=''>current standing......</option>
                                        <option value="Good">Good</option>
                                        <option value="Warning">Warning</option>
                                        <option value="Probation">Probation</option>
                                    </select>
                                </div>
                            </div>
                            <div className='FORM-div'>
                                <div className='FORM-div-label'>
                                    <label htmlFor="hobbies">Hobbies</label>
                                </div>
                                <div className='FORM-div-input'>
                                    <input required type='text' name='hobbies' id='hobbies' onChange={handleChange} value={formData.hobbies} />
                                </div>
                            </div>
                            <div className='FORM-div'>
                                <div className='FORM-div-label'>
                                    <label htmlFor="allergies">Allergies</label>
                                </div>
                                <div className='FORM-div-input'>
                                    <input required type='text' name='allergies' id='allergies' onChange={handleChange} value={formData.allergies} />
                                </div>
                            </div>
                        </fieldset>
                        <fieldset className="FORM-fieldset">
                            <legend>Emergency Contact Information</legend>
                            <div className='FORM-div'>
                                <div className='FORM-div-label'>
                                    <label htmlFor="emergencyContactName">Name</label>
                                </div>
                                <div className='FORM-div-input'>
                                    <input required type='text' name='emergencyContactName' id='emergencyContactName' onChange={handleChange} value={formData.emergencyContactName} />
                                </div>
                            </div>
                            <div className='FORM-div'>
                                <div className='FORM-div-label'>
                                    <label htmlFor="emergencyContactRelationship">Relationship</label>
                                </div>
                                <div className='FORM-div-input'>
                                    <input required type='text' name='emergencyContactRelationship' id='emergencyContactRelationship' onChange={handleChange} value={formData.emergencyContactRelationship} />
                                </div>
                            </div>
                            <div className='FORM-div'>
                                <div className='FORM-div-label'>
                                    <label htmlFor="emergencyContactPhone">Phone</label>
                                </div>
                                <div className='FORM-div-input'>
                                    <input required type='tel' name='emergencyContactPhone' id='emergencyContactPhone' onChange={handleChange} value={formData.emergencyContactPhone} />
                                </div>
                            </div>

                        </fieldset>
                        <button type="submit" value="submit form" id="FORM-submit-btn">Add to Roster</button>
                        <button className="FORM-cancel-btn" onClick={() => router.back()}>Cancel</button>
                    </form>


                </div>
            </>
    )
}