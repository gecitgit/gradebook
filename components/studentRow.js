import { Avatar, IconButton, Stack, Typography, Button } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

export default function StudentRow(props) {
    const student = props.student;
    console.log("this is the student inside of /studentRow: ", student);

    const handleProfileClick = () => {
        console.log("their slug is: ", props.slug);
    }

    return (
        <div className="student-row-box">
            <div className="student-row-picture-box">
                <Image 
                    alt="student image"
                    src={student.imageUrl}
                    width={100}
                    height={100}
                    className="student-row-image"
                />
            </div>
            <div className="student-row-text-box">
                <h2>{student.studentFirstName} {student.studentLastName} - <span>{student.pronouns}</span></h2>
                <p>Grade: {student.gradeLevel} <br />
                Academic Standing: {student.academicStanding} </p>
            <Link href={`/roster/${props.student.studentSlug}`}>click me for moe student info</Link>
            </div>
        </div>
    )
}