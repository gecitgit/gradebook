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
        console.log("submitting assignment form: ", assignmentFormData);
        console.log("this is the user: ", authUser.uid)
        console.log("this is student slug: ", studentSlug)
        try {
            await addAssignment(authUser.uid, assignmentFormData.assignmentClass, assignmentFormData.assignmentType, assignmentFormData.isSubmitted, assignmentFormData.assignmentGrade, assignmentFormData.assignmentComments, studentSlug);
            router.push(`/roster/${studentSlug}`);
        } catch (error) {
            console.error('error adding assignment: ', error);
        }
    }

    return (
        (!authUser) ? <CircularProgress /> 
        :
        <>
            <NavBar />
            <h1>Assignment Form</h1>
            <form onSubmit={handleSubmit}>
                <fieldset>
                    <legend>add an assignment</legend>
                    <div>
                        <label htmlFor="assignmentClass">Class</label>
                        <input required type='text' name='assignmentClass' id='assignmentClass' value={assignmentFormData.assignmentClass} onChange={handleChange} />
                    </div>
                    <div>
                        <label htmlFor="assignmentType">Type</label>
                        <select required name='assignmentType' id='assignmentType' value={assignmentFormData.assignmentType} onChange={handleChange}>
                            <option hidden value=''>Select Assignment type</option>
                            <option value='homework'>Homework</option>
                            <option value='quiz'>Quiz</option>
                            <option value='test'>Test</option>
                            <option value='project'>Project</option>
                            <option value='other'>Other</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="isSubmitted">Submitted?</label>
                        <input type='checkbox' name='isSubmitted' id='isSubmitted' checked={assignmentFormData.isSubmitted} onChange={handleChange} />
                    </div>
                    <div>
                        <label htmlFor="assignmentGrade">Grade</label>
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
                    <div>
                        <label htmlFor="assignmentComments">Comments</label>
                        <input required type='text' name='assignmentComments' id='assignmentComments' value={assignmentFormData.assignmentComments} onChange={handleChange} disabled={!assignmentFormData.isSubmitted}/>
                    </div>
                    <button type='submit' value="submit form">Submit</button>
                </fieldset>
            </form>
        </>
    );
}
