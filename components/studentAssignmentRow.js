import Link from "next/link";
import { deleteAssignment } from "../firebase/firestore";

export default function StudentAssignmentRow(props) {
    const assignment = props.assignmentInfo;
    console.log("this is the assginment inside of the assignment row: ", assignment)

    // function handleDelete() {
    //     let result = confirm("are you sure you want to delete this assignment?")
    //     if (result) {
    //         deleteAssignment(assignment.id);
    //     } else {
    //         console.log("delete was cancelled")
    //     }
    // }

    const handleDelete = async () => {
        let result = confirm("are you sure you want to delete this assignment?")
        if (result) {
            try {
                await deleteAssignment(assignment.id);
                console.log("deleted successfully poggers");
                location.reload();
            } catch (error) {
                console.error("error deleting the assignment: ", error);
            }
        } else {
            console.log("delete was cancelled")
        }
    }

    function handleEdit() {
        console.log("edit button clicked")
    }

    return (
        <div style={{ padding: '10px', border: '2px solid black'}}>
            <p>lmfao here's one more assignment</p>
            <p>Class: {assignment.assignmentClass}</p>
            <p>Type: {assignment.assignmentType}</p>
            <p>Submitted: {assignment.isSubmitted ? 'true' : 'not submitted'}</p>
            <p>Grade: {assignment.assignmentGrade || 'Not submitted yet'}</p>
            <p>Comments: {assignment.assignmentComments || 'no comments yet'}</p>
            {/* <button onClick={handleEdit}>edit</button> */}
            <Link href={`/roster/${assignment.studentSlug}/assignmentForm/${assignment.id}`}>edit</Link>
            <button onClick={handleDelete}>delete</button>
        </div>
    )
}