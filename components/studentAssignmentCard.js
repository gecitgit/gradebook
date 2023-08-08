import Link from "next/link"
import StudentAssignmentRow from "./studentAssignmentRow";

export default function StudentAssignmentCard(props) {
    const student = props.studentInfo;
    const assignments = props.assignments
    // console.log("props inside of student assignment card: ", props)
    console.log("this is student inside of assignent card: ", student);
    console.log("this is assignments inside of assignment card: ", assignments);
    return (
        <div style={{ padding: '10px', border: '1px solid black', margin: '10px'}}>
            <h2>assignments are gonna go here</h2>
            <Link href={`/roster/${student.studentSlug}/assignmentForm`}>Add an assignment</Link>
            { assignments.map((assignment) => {
                return (
                    <StudentAssignmentRow key={assignment.id} assignmentInfo={assignment} />
                )
            })}
        </div>
    )
}