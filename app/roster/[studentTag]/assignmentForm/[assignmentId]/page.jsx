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

    console.log("this is the assignemntdata inside of AssignmentPageUpdate Route: ", assignmentData);

    if (isFetching) {
        return (
            <>
                <NavBar />
                <div className="overlay-blur"></div>
                <div className='progress-div'>
                    <CircularProgress color="secondary" size="80px" thickness={4.5} />
                </div>
            </>
        )

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
                assignmentComments: checked ? prevState.assignmentComments : ''
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
        console.log("form submitted wit these values from the AssignmentPageUpdate Route: ", assignmentFormData);

        try {
            await updateAssignment(assignmentId, assignmentFormData);
            console.log("assignment updated successfully from the AssignmentPageUpdate Route!");
            router.push(`/roster/${studentSlug}`);
        } catch (error) {
            alert("error updating assignment")
            console.error("error updating assignment: ", error);
        }
    }


    return (
        <>
            <NavBar />
            <div>

                <form onSubmit={handleSubmit} className='FORM-body'>
                    <fieldset className='FORM-fieldset'>
                        <legend>Update the assignment</legend>
                        <div className='FORM-div'>
                            <div className='FORM-div-label'>
                                <label htmlFor='assignmentClass'>Class</label>
                            </div>
                            <div className='FORM-div-input'>
                                <input required type='text' name='assignmentClass' id='assignmentClass' value={assignmentFormData.assignmentClass || ''} onChange={handleChange} />
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
                                <input required type='text' name='assignmentComments' id='assignmentComments' value={assignmentFormData.assignmentComments} onChange={handleChange} disabled={!assignmentFormData.isSubmitted} />
                            </div>
                        </div>

                    </fieldset>
                    <button type='submit' value='submit form' id='FORM-submit-btn'>Update</button>
                    <button className="FORM-cancel-btn" onClick={() => router.back()}>Cancel</button>
                </form>
            </div>
        </>
    )
}