import { useState } from "react";
import Link from "next/link";
import { deleteAssignment } from "../firebase/firestore";
import ReusableDialog from "./reusableDialog";

export default function StudentAssignmentRow(props) {
    const assignment = props.assignmentInfo;
    console.log("this is the assginment inside of the assignment row: ", assignment)
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const handleDeleteConfirm = async () => {
        try {
            await deleteAssignment(assignment.id);
            console.log("deleted successfully");
            location.reload();
        } catch (error) {
            console.error("error deleting the assignment: ", error);
        }
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
            <div className="assignment-row-btn-holder">
                <Link href={`/roster/${assignment.studentSlug}/assignmentForm/${assignment.id}`} className="assignment-row-edit-btn">EDIT</Link>
                <button onClick={() => setOpenDeleteDialog(true)} className="assignment-row-delete-btn">DELETE</button>
            </div>

            <ReusableDialog
                isOpen={openDeleteDialog}
                onClose={() => setOpenDeleteDialog(false)}
                title="DELETE ASSIGNMENT"
                contentText={<span>Are you sure you want to delete this assignment? You <strong><em>will not</em></strong> be able to recover this assignment.</span>}
                hasCheckbox={true}
                checkboxText={<span>I understand this action is <strong>permanent.</strong></span>}
                onConfirm={async () => {
                    setOpenDeleteDialog(false);
                    await handleDeleteConfirm();
                }}
                primaryButtonText="Delete"
                secondaryButtonText="Cancel"
            />

        </div>
    )
}