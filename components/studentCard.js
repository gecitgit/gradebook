import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useAuth } from '../firebase/auth'
import { deleteStudent } from "../firebase/firestore";
import { useRouter } from 'next/navigation';

import { deleteObject } from "firebase/storage";
import { storage } from "../firebase/firebase";

import { deleteStudentAssignments, deleteStudentRecord } from "../firebase/firestore";
import { deleteStudentImage } from "../firebase/storage";

export default function StudentCard(props) {
    const { authUser } = useAuth();

    
    const router = useRouter();
    const student = props.studentInfo;
    console.log("student info inside of studenCard: ", student)
    const studentbday = new Date(student.birthday)
    const formattedBirthday = studentbday.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric'})
    console.log("this is formattedBirthday: ", formattedBirthday)
    
    const studentSlug = student.studentSlug;

    const handleDelete = async () => {
        let result = confirm("are you absolutely sure you want to delete this student? you can't go back! all of this student's assignments will be deleted as well!");
        
        if (!result) {
            console.log("delete was cancelled")
            return;
        }

        try {
            await deleteStudentAssignments(studentSlug);
            console.log("student assignments deleted successfully");

            await deleteStudentRecord(studentSlug);
            console.log("student record deleted successfully");

            await deleteStudentImage(student.imageUrl);
            console.log("student image deleted successfully");

            router.push('/roster');
        } catch (error) {
            console.error("error deleting student: ", error)
        }
    }

    const handleEdit = () => {
        console.log("edit button clicked")
        router.push(`/roster/${studentSlug}/editStudent`)
    }

    return (
        <div style={{ padding: '10px', border: '1px solid black', margin: '10px'}}>
            <h2>{student.studentFirstName} {student.studentLastName}</h2>
            <h4>{student.pronouns}</h4>
             {/* this is the div that holds the image */}
                <div style={{ width: "200px", height: "350px", position: "relative"}}> 
                    <Image 
                        alt="student image"
                        src={student.imageUrl}
                        fill={true}
                    />
                </div>
                <div>
                    <p>Grade level: {student.gradeLevel}</p>
                    <p>Birthday: {formattedBirthday}</p>
                    <p>Academic Standing: {student.academicStanding}</p>
                    <p>Hobbies: {student.hobbies}</p>
                    <p>Allergies: {student.allergies}</p>
                    <span><strong>Emergency contact info</strong></span>
                    <p>Name: {student.emergencyContactName}</p>
                    <p>Relationship: {student.emergencyContactRelationship}</p>
                    <p>Phone: {student.emergencyContactPhone}</p>
                </div>
                {/* <button onClick={handleEdit}>edit student</button> */}
                <Link href={`/roster/${studentSlug}/editStudent`}>edit student</Link>
                <button onClick={handleDelete}>delete student</button>

        </div>
    )
}