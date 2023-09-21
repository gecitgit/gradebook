import Image from "next/image";
import Link from "next/link";

export default function StudentRow(props) {
    console.log("props inside of studentRow: ", props);
    const student = props.student;
    const isDuplicated = props.isDuplicated;
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
                    loading="lazy"
                    width={0}
                    height={0}
                    sizes="100vw"
                    style={{ width: '150px', height: 'auto', padding: '5px' }}
                    className="student-row-image"
                />
            </div>
            <div className="student-row-text-box">
                { isDuplicated && <p className="dupe-student-box-alert">this student is duplicated</p>}
                <p id="student-row-name">{student.studentFirstName} {student.studentLastName}</p>
                <p id="student-row-pronouns">{student.pronouns}</p>
                <p className="student-row-other">Grade: {student.gradeLevel} </p>
                <p className="student-row-other">Standing: {student.academicStanding} </p>
            <Link className="student-row-view-btn" href={`/roster/${props.student.studentSlug}`}>
                view student
            </Link>
            </div>
        </div>
    )
}