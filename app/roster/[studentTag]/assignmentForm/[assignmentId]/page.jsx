"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '../../../../../firebase/auth';
import NavBar from '@/components/navbar';
import { CircularProgress } from '@mui/material';
import { usePathname } from 'next/navigation';
import { updateAssignment } from '../../../../../firebase/firestore';
import { useRouter } from 'next/navigation';
import { getSpecificAssignment } from '../../../../../firebase/firestore';

export default function AssignmentPageUpdate() {
    const { authUser, isLoading } = useAuth();
    const router = useRouter();
    const [assignmentFormData, setAssignmentFormData] = useState({
        assignmentClass: "",
        assignmentType: "",
        isSubmitted: false,
        assignmentGrade: "",
        assignmentComments: "",
    });

    const [assignmentData, setAssignmentData] = useState({});

    const [error, setError] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    const pathnameID = usePathname();
    const studentSlug = pathnameID.split("/")[2];
    const assignmentId = pathnameID.split("/")[4];
    console.log("this is the assignmentID: ", assignmentId);
    console.log("this is the assignment's slug: ", studentSlug);
    

    useEffect(() => {
        if (!isLoading && !authUser) {
            router.push('/');
        }
    }, [authUser, isLoading, router]);

    useEffect(() => {
        if (!authUser) return;

        const fetchAssignment = async () => {
            try {
                const assignment = await getSpecificAssignment(assignmentId);
                setAssignmentData(assignment);
                setAssignmentFormData(assignment);
            } catch (error) {
                setError(error);
            } finally { 
                setIsFetching(false);
            }
        }
        fetchAssignment();
    }, [authUser, assignmentId]);

    console.log("this is the assignemntdata: ", assignmentData);

    if (isFetching) {
        return <CircularProgress />
    }
    
    if (error) {
        return <p>error fetching student data</p>
    }

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === "checkbox") {
            setAssignmentFormData(prevState => ({
                ...prevState,
                [name]: checked,
                assignmentGrade: checked ? prevState.assignmentGrade : '',
                assignmentComments: checked ? prevState.assignmentComments: ''
            }));
        } else {
            setAssignmentFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("form submitted wit these values: ", assignmentFormData);

        try {
            await updateAssignment(assignmentId, assignmentFormData);
            console.log("assignment updated successfully!");
            router.push(`/roster/${studentSlug}`)
        } catch (error) {
            console.error("error updating assignment: ", error);
        }
    }


    return (
        <>
            <NavBar />
            <h1>Assignment Page Update</h1>
            <div>
                <p>this will eventuall hold results</p>
                <p>this is the <strong>{assignmentData.id}</strong> assignment!</p>
            </div>
            <form onSubmit={handleSubmit}>
                <fieldset>
                    <legend>edit this shit</legend>
                    <div>
                        <label htmlFor='assignmentClass'>Class</label>
                        <input required type='text' name='assignmentClass' id='assignmentClass' value={assignmentFormData.assignmentClass || ''} onChange={handleChange}/>
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
                        <input required type='text' name='assignmentComments' id='assignmentComments' value={assignmentFormData.assignmentComments} onChange={handleChange} disabled={!assignmentFormData.isSubmitted} />
                    </div>

                    <button type='submit' value='submit form'>Submit this ish</button>
                </fieldset>
            </form>
        </>
    )
}