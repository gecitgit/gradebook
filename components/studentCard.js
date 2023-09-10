import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useAuth } from '../firebase/auth'
import { deleteStudent } from "../firebase/firestore";
import { useRouter } from 'next/navigation';

import { deleteObject } from "firebase/storage";
import { storage } from "../firebase/firebase";

import { deleteStudentAssignments, deleteStudentRecord, deleteStudentAndAssignments, deleteStudentOnly, deleteAssignmentsOnly, deleteAssignment } from "../firebase/firestore";
import { deleteStudentImage } from "../firebase/storage";
import { toast } from "react-toastify";

export default function StudentCard(props) {
    const { authUser } = useAuth();

    console.log("THESE ARE THE PROPS INSIDE OF studentCard Component: ", props);

    const assignmentsForStudent = props.assignments;
    console.log("assignmentsForStudent inside of studentCard Component: ", assignmentsForStudent);

    const idsForAssignments = assignmentsForStudent.map((assignment) => {
        return assignment.id;
    })
    console.log("idsForAssignments inside of studentCard Component: ", idsForAssignments);
    console.log("THIS IS THE LENGTH OF idsForAssignments: ", idsForAssignments.length)

    
    const router = useRouter();
    const student = props.studentInfo;
    console.log("student info inside of studentCard Component: ", student)
    const studentbday = new Date(student.birthday + "T00:00:00");
    const formattedBirthday = studentbday.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric'})
    console.log("this is formattedBirthday inside of studentCard Component: ", formattedBirthday)
    
    const studentSlug = student.studentSlug;
    const studentId = student.studentUID;
    console.log("this is the authUser inside of studentCard Component:  ", authUser)
    console.log("This is the studentSlug that was pulled for current student inside of studentCard Component:  ", studentSlug);

    const handleDelete = async () => {
        let result = confirm("are you absolutely sure you want to delete this student? you can't go back! all of this student's assignments will be deleted as well!");
        
        if (!result) {
            console.log("delete was cancelled")
            return;
        }
        try {
            console.log("WE ARE DELETING THIS STUDENT: ", studentId);
            await deleteStudentOnly(studentId);
            console.log("student deleted successfully");

            for (const assignmentId of idsForAssignments) {
                console.log("WE ARE DELETING THIS ASSIGNMENT: ", assignmentId)
                await deleteAssignment(assignmentId);
            }
            console.log("assignments deleted successfully");

            
            console.log("WE ARE DELETING THIS PICTURE: ", student.imageUrl);
            await deleteStudentImage(student.imageUrl);
            console.log("student image deleted successfully");

            router.push('/roster');
        } catch (error) {
            console.error("error deleting student inside of handleDelete: ", error)
        }
    }

    const handleEdit = () => {
        console.log("edit button clicked inside of studentCard Component: ")
        router.push(`/roster/${studentSlug}/editStudent`)
    }

    return (
        <div className="studentcard-holder">
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
                {/* <button onClick={handleEdit}>edit student</button> */}
                <div className="studentcard-btn-div">
                    <Link href={`/roster/${studentSlug}/editStudent`} id="studentcard-edit-btn">EDIT</Link>
                    <button onClick={handleDelete} id="studentcard-delete-btn">DELETE</button>
                </div>

        </div>
    )
}