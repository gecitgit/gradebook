"use client";
import { useAuth } from '../../firebase/auth';
import NavBar from '../../components/navbar';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CircularProgress } from '@mui/material';
import Link from 'next/link';
import { getStudents } from '../../firebase/firestore';
import StudentRow from '@/components/studentRow';

export default function Roster() {
    const { authUser, isLoading } = useAuth();
    const router = useRouter();
    const [students, setStudents] = useState([]);
    const [duplicatedSlugs, setDuplicatedSlugs] = useState(new Set());

    useEffect(() => {
        if (!isLoading && !authUser) {
            router.push('/');
        }
    }, [authUser, isLoading, router]);

    useEffect(() => {
        const fetchStudents = async () => {
            if (authUser) {
                const studentList = await getStudents(authUser.uid);
                setStudents(studentList);

                const slugCounts = studentList.reduce((acc, student) => {
                    acc[student.studentSlug] = (acc[student.studentSlug] || 0) + 1;
                    return acc;
                }, {});

                const duplicates = new Set();
                for (const [slug, count] of Object.entries(slugCounts)) {
                    if (count > 1) {
                        duplicates.add(slug);
                    }
                }

                setDuplicatedSlugs(duplicates);  
            }
        };
    
        fetchStudents();
    }, [authUser]);

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
                { duplicatedSlugs.size > 0 && <div style={{ padding: "10px", margin: "10px", backgroundColor: "orange", fontWeight: "bolder" }}>You ahve duplicate students</div>}
            </div>
            <div>
                { students.map((student) => {
                    return (
                        <div key={student.id}>
                            <StudentRow student={student} isDuplicated={duplicatedSlugs.has(student.studentSlug)} />
                        </div>
                    )
                })}
            </div>
        </>
    )
}