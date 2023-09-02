import Link from "next/link";
import { deleteAssignment } from "../firebase/firestore";

export default function StudentAssignmentRow(props) {
    const assignment = props.assignmentInfo;
    console.log("this is the assginment inside of the assignment row: ", assignment)

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
        <div className="assignment-row">
            <div className="assignment-row-details">
                <p><strong><u>Class</u></strong><br />{assignment.assignmentClass}</p>
                <p><strong><u>Type</u></strong><br />{assignment.assignmentType}</p>
                <p><strong><u>Submitted</u></strong><br />{assignment.isSubmitted ? 'YES' : 'NO'}</p>
                <p><strong><u>Grade</u></strong><br />{assignment.assignmentGrade || 'N/A'}</p>
            </div>
            <div className="assignment-row-comments">
                <strong><u>Comments:</u> </strong>{assignment.assignmentComments || 'There are no comments for this assignment.'}
            </div>
            {/* <button onClick={handleEdit}>edit</button> */}
            <div className="assignment-row-btn-holder">
                <Link href={`/roster/${assignment.studentSlug}/assignmentForm/${assignment.id}`} className="assignment-row-edit-btn">EDIT</Link>
                <button onClick={handleDelete} className="assignment-row-delete-btn">DELETE</button>
            </div>
        </div>
    )
}