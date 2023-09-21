import Link from "next/link"
import StudentAssignmentRow from "./studentAssignmentRow";
import { CircularProgress } from "@mui/material";

export default function StudentAssignmentCard(props) {
    const student = props.studentInfo;
    const assignments = props.assignments
    const isLoading = props.isLoading
    // console.log("props inside of student assignment card: ", props)
    console.log("this is student inside of studentAssignmentCard Component: ", student);
    console.log("this is assignments inside of studentAssignmentCard Component: ", assignments);

    if (isLoading) {
        return (
            <div className='progress-div'>
                <CircularProgress color="secondary" size="80px" thickness={4.5} /> 
            </div>
        );
    }


    return (
        <div className="assignment-card-main">
            <Link href={`/roster/${student.studentSlug}/assignmentForm`} id="add-assignment-btn">+ Add new assignment</Link>
            { assignments.length === 0 ? 
                <div id="no-assignment-div">
                    <p>{student.studentFirstName} has no assignments yet.</p>
                </div>
                : assignments.map((assignment) => (
                    <StudentAssignmentRow key={assignment.id} assignmentInfo={assignment} />
                ))
            }
        </div>
    )
}