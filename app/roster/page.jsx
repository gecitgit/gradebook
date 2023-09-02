"use client";
import { useAuth } from '../../firebase/auth';
import NavBar from '../../components/navbar';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CircularProgress } from '@mui/material';
import Link from 'next/link';
import { getStudents } from '../../firebase/firestore';
import StudentRow from '@/components/studentRow';
import { toast } from 'react-toastify';

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
        (!authUser) ? <CircularProgress color="secondary" size="80px" thickness={4.5} sx={{ marginLeft:"50%", marginTop: "25%" }} />
        :

        <div className='roster-big-div'>
            <NavBar />
            <div id="roster-main-page">
                <h2>Current Roster</h2>
                <Link href="/student-form" id="add-student-btn">+ Add student</Link>
                { duplicatedSlugs.size > 0 && <div id="dupe-div"><p id="dupe-student-warning">
                    You have duplicate students!</p><p id="dupe-student-expl">Two or more students have the exact same name and birthday, which indicates a possible double entry. If this is an error, please delete the duplicated student. If these are indeed two separate students then consider adding an identifer to one of them to ensure their files are kept separate.</p></div>}
            </div>
            {students.length === 0 ?
                <div id="no-student-div">
                    <p>You don't have any students yet! Click the button above to add your first student to your roster.</p>
                </div>
            :
                <div id="student-row-holder">
                    { students.map((student) => {
                        return (
                            <div key={student.id}>
                                <StudentRow student={student} isDuplicated={duplicatedSlugs.has(student.studentSlug)} />
                            </div>
                        )
                    })}
                </div>
            }
        </div>
    )
}