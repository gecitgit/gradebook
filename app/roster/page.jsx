"use client";
import { useAuth } from '../../firebase/auth';
import NavBar from '../../components/navbar';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CircularProgress } from '@mui/material';
import StudentDialog from '@/components/studentDialog';
import Link from 'next/link';
import { getStudents } from '../../firebase/firestore';
import StudentRow from '@/components/studentRow';
import slugify from 'slugify';

export default function Roster() {
    const { authUser, isLoading } = useAuth();
    const router = useRouter();

    const [isLoadingStudents, setIsLoadingStudents] = useState(true);
    const [deleteStudentId, setDeleteStudentId] = useState("");
    const [deleteStudentImageBucket, setDeleteStudentImageBucket] = useState("");
    const [students, setStudents] = useState([]);
    const [updateStudent, setUpdateStudent] = useState({});



    useEffect(() => {
        if (!isLoading && !authUser) {
            router.push('/');
        }
    }, [authUser, isLoading]);

    useEffect(() => {
        const fetchStudents = async () => {
            if (authUser) {
                setStudents(await getStudents(authUser.uid));
            }
        };
    
        fetchStudents();
    }, [authUser]);

    const createSlug = (student) => {
        const uniqueID = student.id.slice(-5);

        const firstNameSlug = slugify(student.studentFirstName, {
            lower: true,
            strict: true
        });
        const lastNameSlug = slugify(student.studentLastName, {
            lower: true,
            strict: true
        });
        return `${firstNameSlug}-${lastNameSlug}-${uniqueID}`;
    }

    const onUpdate = (student) => {
        console.log("edit button clicked for: ", student.studentFirstName);
    }

    const onClickDelete = (student) => {
        console.log("delete was clicked for: ", student.studentFirstName)
    }

    console.log("this is students: ", students)
    return (
        (!authUser) ? <CircularProgress color="inherit" sx={{ marginLeft: '50%', marginTop: '25%'}} />
        :
        <>
        <NavBar />
        <div>
            <h1>Dashboard</h1>
            <span>
                <p>add a new student</p>
                <Link href="/student-form">+ Add student</Link>
            </span>
        </div>
        <div>

        {/* { students.map((student) => (
            <div key={student.id}>
                <StudentRow student={student} 
                            onEdit={()  => onUpdate(student)}
                            onDelete={() => onClickDelete(student)}
                            />
            </div>)
        )} */}
        { students.map((student) => {
            const slug = createSlug(student);
            console.log("generated slug: ", slug);
            console.log("now this is the individual student inside of /roster: ", student);

            return (
                <div key={student.id}>
                    <StudentRow student={student}
                                onEdit={() => onUpdate(student)}
                                onDelete={() => onClickDelete(student)}
                                slug={slug}
                                />
                </div>
            )
        })}
        </div>
        </>
    )
}