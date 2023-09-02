"use client"
import { useState, useEffect } from 'react';
import { useAuth } from '../../../../firebase/auth';
import NavBar from '@/components/navbar';
import { CircularProgress } from '@mui/material';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { getStudentInfo } from '../../../../firebase/firestore';
import { updateStudentInfo } from '../../../../firebase/firestore';
import slugify from 'slugify';
import { getDownloadURL, deleteOldImage, uploadImage } from '../../../../firebase/storage';

const DEFAULT_FILE_NAME = "No file selected";

export default function EditStudent() {
    const { authUser, isLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const studentSlug = pathname.split("/")[2];
    console.log("this is the student slug inside of editstudent: ", studentSlug);
    // console.log("this is teh uid: ", authUser.uid);

    const [error, setError] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    const [studentData, setStudentData] = useState({});

    const [fileData, setFileData] = useState({
        fileName: DEFAULT_FILE_NAME,
        file: null
    });

    useEffect(() => {
        if (!isLoading && !authUser) {
            router.push('/');
        }
    }, [authUser, isLoading, router]);

    //this is going to be the useeffect to grab the student data from firestore
    useEffect(() => {
        if (!authUser) return;

        const userUID = authUser.uid;

        const fetchStudentInfo = async () => {
            try {
                const student = await getStudentInfo(userUID, studentSlug);
                console.log("this is the student info: ", student);
                setStudentData(student);
            } catch (error) {
                setError(error);
            } finally {
                setIsFetching(false);
            }
        }
        fetchStudentInfo();
    }, [authUser, studentSlug]);

    if (isFetching) {
        return <CircularProgress color="secondary" size="80px" thickness={4.5} sx={{ marginLeft:"40%", marginTop: "25%" }}/>
    }

    if (error) {
        return <p>error fetchign the student to edit</p>
    }

    const handleFileInput = (target) => {
        const file = target.files[0];
        setFileData({
            fileName: file.name,
            file: file
        });
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setStudentData({
            ...studentData,
            [name]: value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        let oldSlug = studentSlug;

        const firstNameSlug = slugify(studentData.studentFirstName, {
            lower: true,
            strict: true
        });
        const lastNameSlug = slugify(studentData.studentLastName, {
            lower: true,
            strict: true
        });
        const birthdaySlug = studentData.birthday.replace(/-/g, '');
        const updatedStudentSlug = `${firstNameSlug}-${lastNameSlug}-${birthdaySlug}`;
        console.log("this is the updated student slug: ", updatedStudentSlug);

        const updatedData = {
            ...studentData,
            studentSlug: updatedStudentSlug
        };

        const studentUID = studentData.studentUID;

        if (fileData.file) {
            const newImageBucket = await uploadImage(fileData.file, authUser.uid);
            const newImageUrl = await getDownloadURL(newImageBucket);

            await deleteOldImage(studentData.imageBucket);
            updatedData.imageBucket = newImageBucket;
            updatedData.imageUrl = newImageUrl;
        }

        try {
            await updateStudentInfo(studentUID, updatedData, oldSlug);
            console.log("student info updated successfully!");
            console.log("this is what the updated data looked like: ", updatedData);
            console.log("this is oldslug being submitted in the update form: ", oldSlug);
            router.push(`/roster/${updatedStudentSlug}`);
        } catch (error) {
            console.error("error updating student info: ", error);
        }
    }

    return (
        <>
            <NavBar />
            <div>

                <form onSubmit={handleSubmit} className='FORM-body'>
                    <fieldset className='FORM-fieldset'>
                        <legend>EDIT your student</legend>
                        <div className='FORM-div'>
                            <div className='FORM-div-label'>
                                <label htmlFor='studentPicBackup'>Student Photo</label>
                            </div>
                            <div className='FORM-div-input'>
                                <input type="file" name="studentPicBackup" id="studentPickBackup" onInput={(event) => handleFileInput(event.target)} />
                            </div>
                        </div>
                        <div className='FORM-div'>
                            <div className='FORM-div-label'>
                                <label htmlFor="studentFirstName">First Name</label>
                            </div>
                            <div className='FORM-div-input'>
                                <input required type='text' name='studentFirstName' id='studentFirstName' value={studentData.studentFirstName} onChange={handleChange} />
                            </div>
                        </div>
                        <div className='FORM-div'>
                            <div className='FORM-div-label'>
                                <label htmlFor='studentLastName'>Last Name</label>
                            </div>
                            <div className='FORM-div-input'>
                                <input required type='text' name='studentLastName' id='studentLastName' value={studentData.studentLastName} onChange={handleChange} />
                            </div>
                        </div>
                        <div className='FORM-div'>
                            <div className='FORM-div-label'>
                                <label htmlFor='gradeLevel'>Grade Level</label>
                            </div>
                            <div className='FORM-div-input'>
                                <select required name='gradeLevel' id='gradeLevel' value={studentData.gradeLevel} onChange={handleChange}>
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
                                <label htmlFor='birthday'>Birthday</label>
                            </div>
                            <div className='FORM-div-input'>
                                <input required type='date' name='birthday' id='birthday' value={studentData.birthday} onChange={handleChange} />
                            </div>
                        </div>
                        <div className='FORM-div'>
                            <div className='FORM-div-label'>
                                <label htmlFor='pronouns'>Pronouns</label>
                            </div>
                            <div className='FORM-div-input'>
                                <input required type='text' name='pronouns' id='pronouns' value={studentData.pronouns} onChange={handleChange} />
                            </div>
                        </div>
                        <div className='FORM-div'>
                            <div className='FORM-div-label'>
                                <label htmlFor='academicStanding'>Academic Standing</label>
                            </div>
                            <div className='FORM-div-input'>
                                <select required name='academicStanding' id='academicStanding' value={studentData.academicStanding} onChange={handleChange}>
                                    <option value=''>select an academic standing</option>
                                    <option value='Good'>Good</option>
                                    <option value='Warning'>Warning</option>
                                    <option value='Probation'>Probation</option>
                                </select>
                            </div>
                        </div>
                        <div className='FORM-div'>
                            <div className='FORM-div-label'>
                                <label htmlFor='hobbies'>Hobbies</label>
                            </div>
                            <div className='FORM-div-input'>
                                <input required type='text' name='hobbies' id='hobbies' value={studentData.hobbies} onChange={handleChange} />
                            </div>
                        </div>

                        <div className='FORM-div'>
                            <div className='FORM-div-label'>

                                <label htmlFor='allergies'>Allergies</label>
                            </div>
                            <div className='FORM-div-input'>
                                <input required type='text' name='allergies' id='allergies' value={studentData.allergies} onChange={handleChange} />
                            </div>
                        </div>
                        </fieldset>
                        <fieldset className='FORM-fieldset'>
                            <legend>Emergency Contact Information</legend>
                        <div className='FORM-div'>
                            <div className='FORM-div-label'>
                                <label htmlFor='emergencyContactName'>Name</label>
                            </div>
                            <div className='FORM-div-input'>
                                <input required type='text' name='emergencyContactName' id='emergencyContactName' value={studentData.emergencyContactName} onChange={handleChange} />
                            </div>
                        </div>
                        <div className='FORM-div'>
                            <div className='FORM-div-label'>
                                <label htmlFor='emergencyContactRelationship'>Relationship</label>
                            </div>
                            <div className='FORM-div-input'>
                                <input required type='text' name='emergencyContactRelationship' id='emergencyContactRelationship' value={studentData.emergencyContactRelationship} onChange={handleChange} />
                            </div>
                        </div>
                        <div className='FORM-div'>
                            <div className='FORM-div-label'>
                                <label htmlFor='emergencyContactPhone'>Phone</label>
                            </div>
                            <div className='FORM-div-input'>
                                <input required type='tel' name='emergencyContactPhone' id='emergencyContactPhone' value={studentData.emergencyContactPhone} onChange={handleChange} />
                            </div>
                        </div>
                    </fieldset>
                    <button type="submit" value="submit form" id="FORM-submit-btn">UPDATE</button>
                </form>
            </div>
        </>
    )
}