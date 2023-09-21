"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '../../../../firebase/auth';
import NavBar from '@/components/navbar';
import { CircularProgress } from '@mui/material';
import { usePathname } from 'next/navigation';
import { addAssignment } from '../../../../firebase/firestore';
import { useRouter } from 'next/navigation';

export default function AssignmentPage() {
    const { authUser, isLoading } = useAuth();
    const router = useRouter();
    const [assignmentFormData, setAssignmentFormData] = useState({
        assignmentClass: "",
        assignmentType: "",
        isSubmitted: false,
        assignmentGrade: "",
        assignmentComments: "",        
    });

    const pathname = usePathname();
    const studentSlug = pathname.split("/")[2];

    useEffect(() => {
        if (!isLoading && !authUser) {
            router.push('/');
        }
    }, [authUser, isLoading, router]);

    function handleChange(event) {
        const { name, value, type, checked } = event.target;
        setAssignmentFormData({
            ...assignmentFormData,
            [name]: type === 'checkbox' ? checked : value
        });
    }

    useEffect(() => {
        if (!assignmentFormData.isSubmitted) {
            setAssignmentFormData((prevFormData) => ({
                ...prevFormData,
                assignmentGrade: "",
            }));
        }
    }, [assignmentFormData.isSubmitted]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log("submitting assignment form from AssignmentPage Route: ", assignmentFormData);
        console.log("this is the user from AssignmentPage Route: ", authUser.uid)
        console.log("this is student slug from AssignmentPage Route: ", studentSlug)
        try {
            await addAssignment(authUser.uid, assignmentFormData.assignmentClass, assignmentFormData.assignmentType, assignmentFormData.isSubmitted, assignmentFormData.assignmentGrade, assignmentFormData.assignmentComments, studentSlug);
            router.push(`/roster/${studentSlug}`);
        } catch (error) {
            console.error('error adding assignment: ', error);
        }
    }

    console.log("this is the student you're working on inside of the AssignmentPage Route: ", studentSlug)

    return (
        (!authUser) ? 
            // <div style={{ width: "100%", height: "50vh", display: "flex", justifyContent: "center", alignItems: "center", border: "2px solid orange" }}>
            <>
                <NavBar />
                <div className="overlay-blur"></div>
                <div className='progress-div'>
                    <CircularProgress color="secondary" size="80px" thickness={4.5} /> 
                </div>
            </>
            
        :
        <>
            <NavBar />
            <div>

            <form onSubmit={handleSubmit} className='FORM-body'>
                <fieldset className='FORM-fieldset'>
                    <legend>Add a new assignment</legend>
                    <div className='FORM-div'>
                        <div className='FORM-div-label'>
                            <label htmlFor="assignmentClass">Class</label>
                        </div>
                        <div className='FORM-div-input'>
                            <input required type='text' name='assignmentClass' id='assignmentClass' value={assignmentFormData.assignmentClass} onChange={handleChange} />
                        </div>
                    </div>
                    <div className='FORM-div'>
                        <div className='FORM-div-label'>
                            <label htmlFor="assignmentType">Type</label>
                        </div>
                        <div className='FORM-div-input'>
                            <select required name='assignmentType' id='assignmentType' value={assignmentFormData.assignmentType} onChange={handleChange}>
                                <option hidden value=''>Select Assignment type</option>
                                <option value='Homework'>Homework</option>
                                <option value='Quiz'>Quiz</option>
                                <option value='Test'>Test</option>
                                <option value='Project'>Project</option>
                                <option value='Other'>Other</option>
                            </select>
                        </div>
                    </div>
                    <div className='FORM-div'>
                        <div className='FORM-div-label'>
                            <label htmlFor="isSubmitted">Submitted?</label>
                        </div>
                        <div className='FORM-div-input'>
                            <input type='checkbox' name='isSubmitted' id='isSubmitted' checked={assignmentFormData.isSubmitted} onChange={handleChange} /> 
                        </div>
                    </div>
                    <div className='FORM-div'>
                        <div className='FORM-div-label'>
                            <label htmlFor="assignmentGrade">Grade</label>
                        </div>
                        <div className='FORM-div-input'>
                        <input
                            required={assignmentFormData.isSubmitted}
                            type='text'
                            name='assignmentGrade'
                            id='assignmentGrade'
                            value={assignmentFormData.assignmentGrade}
                            onChange={handleChange}
                            disabled={!assignmentFormData.isSubmitted}
                            />
                        </div>
                    </div>
                    <div className='FORM-div'>
                        <div className='FORM-div-label'>
                            <label htmlFor="assignmentComments">Comments</label>
                        </div>
                        <div className='FORM-div-input'>
                            <input required type='text' name='assignmentComments' id='assignmentComments' value={assignmentFormData.assignmentComments} onChange={handleChange} disabled={!assignmentFormData.isSubmitted}/>
                        </div>
                    </div>
                </fieldset>
                <button type='submit' value="submit form" id="FORM-submit-btn">Submit</button>
                <button className="FORM-cancel-btn" onClick={() => router.back()}>Cancel</button>
                
            </form>
        </div>
        </>
    );
}
