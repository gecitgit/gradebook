import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from '../firebase/auth'
import { useRouter } from 'next/navigation';
import { deleteStudentOnly, deleteAssignment } from "../firebase/firestore";
import { deleteStudentImage } from "../firebase/storage";
import ReusableDialog from "./reusableDialog";

export default function StudentCard(props) {
    const { authUser } = useAuth();
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

    const assignmentsForStudent = props.assignments;
    const idsForAssignments = assignmentsForStudent.map((assignment) => {
        return assignment.id;
    })
    
    const router = useRouter();
    const student = props.studentInfo;
    const studentbday = new Date(student.birthday + "T00:00:00");
    const formattedBirthday = studentbday.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

    const studentSlug = student.studentSlug;
    const studentId = student.studentUID;

    const handleDelete = async () => {
        setOpenConfirmDialog(true);
    }

    const performDelete = async () => {
        try {
            await deleteStudentOnly(studentId);

            for (const assignmentId of idsForAssignments) {
                await deleteAssignment(assignmentId);
            }
            await deleteStudentImage(student.imageUrl);
            router.push('/roster');
        } catch (error) {
            alert("error deleting student")
            console.error("error deleting student inside of performDelete: ", error)
        }
    }


    return (
        <div className="studentcard-holder">
            <ReusableDialog
                isOpen={openConfirmDialog}
                onClose={() => setOpenConfirmDialog(false)}
                title="DELETE STUDENT"
                contentText="Are you sure you want to delete this student? This student and all of their assignments will be deleted.  This action cannot be undone."
                hasCheckbox={true}
                checkboxText="I understand this action is permanent."
                onConfirm={async () => {
                    setOpenConfirmDialog(false);
                    await performDelete();
                }}
                primaryButtonText="Delete"
                secondaryButtonText="Cancel"
            />


            <div className="studentcard-header">
                <p id="studentcard-name">{student.studentFirstName} {student.studentLastName}</p>
                <p id="studentcard-pronouns">{student.pronouns}</p>
            </div>
            <div className="studentcard-body">
                <Image
                    alt="student image"
                    src={student.imageUrl}
                    loading="lazy"
                    width={0}
                    height={0}
                    sizes="100vw"
                    style={{ width: '200px', height: 'auto' }}
                    id="studentcard-image"
                />
                <div className="studentcard-text-div">
                    <p id="studentcard-detail-header">Student Info</p>
                    <p className="studentcard-details"><strong>Grade level: </strong>{student.gradeLevel}</p>
                    <p className="studentcard-details"><strong>Birthday: </strong>{formattedBirthday}</p>
                    <p className="studentcard-details"><strong>Academic Standing: </strong>{student.academicStanding}</p>
                    <p className="studentcard-details"><strong>Hobbies: </strong>{student.hobbies}</p>
                    <p className="studentcard-details"><strong>Allergies: </strong>{student.allergies}</p>
                    <p id="studentcard-eheader">Emergency Contact Info</p>
                    <p className="studentcard-details"><strong>Name: </strong>{student.emergencyContactName}</p>
                    <p className="studentcard-details"><strong>Relationship: </strong>{student.emergencyContactRelationship}</p>
                    <p className="studentcard-details"><strong>Phone: </strong>{student.emergencyContactPhone}</p>
                </div>
            </div>
            <div className="studentcard-btn-div">
                <Link href={`/roster/${studentSlug}/editStudent`} id="studentcard-edit-btn">EDIT</Link>
                <button onClick={handleDelete} id="studentcard-delete-btn">DELETE</button>
            </div>

        </div>
    )
}