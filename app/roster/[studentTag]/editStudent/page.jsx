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
    }, [authUser, isLoading]);
    
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
        return <CircularProgress />
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
            await updateStudentInfo(studentUID, updatedData);
            console.log("student info updated successfully!");
            router.push(`/roster/${updatedStudentSlug}`);
        } catch (error) {
            console.error("error updating student info: ", error);
        }
    }

    return (
        <>
            <NavBar />
            <h1>edit the student meng</h1>
            <div>
                <p>this is the student info form here:</p>
                <p>student first name: <strong>{studentData.studentFirstName}</strong></p>
            </div>
            <form onSubmit={handleSubmit}>
                <fieldset>
                    <legend>edit your stinky ass student</legend>
                    <div>
                        <p>this is going to be the picture stuff I don't want to do it right now</p>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <div>
                            <label htmlFor='studentPicBackup'>change the pic if you want to</label>
                            <input type="file" name="studentPicBackup" id="studentPickBackup" onInput={(event) => handleFileInput(event.target)} />
                        </div>
                        <div>
                            <label htmlFor="studentFirstName">student first name</label>
                            <input required type='text' name='studentFirstName' id='studentFirstName' value={studentData.studentFirstName} onChange={handleChange} />
                        </div>
                        <div>
                            <label htmlFor='studentLastName'>Stduent last name</label>
                            <input required type='text' name='studentLastName' id='studentLastName' value={studentData.studentLastName} onChange={handleChange} />
                        </div>
                        <div>
                            <label htmlFor='gradeLevel'>grade level</label>
                            <select required name='gradeLevel' id='gradeLevel' value={studentData.gradeLevel} onChange={handleChange}>
                                <option value='pre-k'>Pre-K</option>
                                <option value='k'>Kindergarten</option>
                                <option value='1'>1st Grade</option>
                                <option value='2'>2nd Grade</option>
                                <option value='3'>3rd Grade</option>
                                <option value='4'>4th Grade</option>
                                <option value='5'>5th Grade</option>
                                <option value='6'>6th Grade</option>
                                <option value='7'>7th Grade</option>
                                <option value='8'>8th Grade</option>
                                <option value='9'>9th Grade</option>
                                <option value='10'>10th Grade</option>
                                <option value='11'>11th Grade</option>
                                <option value='12'>12th Grade</option>
                                <option value='college'>College</option>
                                <option value='postcollege'>Post College</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor='birthday'>student birthday</label>
                            <input required type='date' name='birthday' id='birthday' value={studentData.birthday} onChange={handleChange} />
                        </div>
                        <div>
                            <label htmlFor='pronouns'>pronouns</label>
                            <input required type='text' name='pronouns' id='pronouns' value={studentData.pronouns} onChange={handleChange} />
                        </div>
                        <div>
                            <label htmlFor='academicStanding'>academic standing</label>
                            <select required name='academicStanding' id='academicStanding' value={studentData.academicStanding} onChange={handleChange}>
                                <option value=''>select an academic standing</option>
                                <option value='good'>Good</option>
                                <option value='mid'>Academic Notice</option>
                                <option value='bad'>Academic Probation</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor='hobbies'>hobbies</label>
                            <input required type='text' name='hobbies' id='hobbies' value={studentData.hobbies} onChange={handleChange} />
                        </div>
                        <div>
                            <label htmlFor='allergies'>allergies</label>
                            <input required type='text' name='allergies' id='allergies' value={studentData.allergies} onChange={handleChange} />
                        </div>
                        <div>
                            <label htmlFor='emergencyContactName'>emergency contact name</label>
                            <input required type='text' name='emergencyContactName' id='emergencyContactName' value={studentData.emergencyContactName} onChange={handleChange} />
                        </div>
                        <div>
                            <label htmlFor='emergencyContactRelationship'>emergency contact relationship</label>
                            <input required type='text' name='emergencyContactRelationship' id='emergencyContactRelationship' value={studentData.emergencyContactRelationship} onChange={handleChange} />
                        </div>
                        <div>
                            <label htmlFor='emergencyContactPhone'>emergency contact phone</label>
                            <input required type='tel' name='emergencyContactPhone' id='emergencyContactPhone' value={studentData.emergencyContactPhone} onChange={handleChange} />
                        </div>
                    </div>
                    <button type="submit" value="submit form">update this student already</button>
                </fieldset>
            </form>
        </>
    )
}