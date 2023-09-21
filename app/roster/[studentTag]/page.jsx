"use client";
import { useEffect, useState } from "react";
import NavBar from "@/components/navbar";
import StudentAssignmentCard from "@/components/studentAssignmentCard";
import StudentCard from "@/components/studentCard";
import { useAuth } from '../../../firebase/auth';
import { getStudentInfo } from '../../../firebase/firestore';
import { CircularProgress } from "@mui/material";
import { useRouter, usePathname } from 'next/navigation';
import { getAssignments } from "../../../firebase/firestore";
import InvalidURL from "@/components/invalidURL";

export default function StudentPage() {
    const { authUser, isLoading } = useAuth();
    const router = useRouter();

    const pathnameNEXT = usePathname();
    const shortenedPath = pathnameNEXT.split("/")[2];

    const [studentInfo, setStudentInfo] = useState({});
    const [isFetching, setIsFetching] = useState(true);
    const [error, setError] = useState(false);
    const [assignments, setAssignments] = useState([]);
    const [isFetchingAssignments, setIsFetchingAssignments] = useState(true);

    useEffect(() => {
        if (!isLoading && !authUser) {
            router.push('/');
        }
    }, [authUser, isLoading, router]);

    useEffect(() => {
        if (shortenedPath && authUser && authUser.uid) {
            const fetchStudentData = async () => {
                try {
                    let data = await getStudentInfo(authUser.uid, shortenedPath);
                    if (data !== null) {
                        setStudentInfo(data);
                    } else {
                        setError(true);
                    }
                    setIsFetching(false);
                } catch (error) {
                    alert('error fetching student data');
                    console.error('error fetching student data: ', error);
                    setError(true);
                    setIsFetching(false);
                }
            };
            fetchStudentData();
        }
    }, [shortenedPath, authUser]);

    useEffect(() => {
        const fetchAssignments = async () => {
            if (authUser && studentInfo && studentInfo.studentSlug) {
                setIsFetchingAssignments(true);
                setAssignments(await getAssignments(authUser.uid, studentInfo.studentSlug));
                setIsFetchingAssignments(false);
            }
        };
        fetchAssignments();
    }, [authUser, studentInfo]);

    if (isFetching) {
        return (
            <>
                <NavBar />
                <div className="overlay-blur"></div>
                <div className='progress-div'>
                    <CircularProgress color="secondary" size="80px" thickness={4.5} />
                </div>
            </>
        )
    }

    if (error) {
        return (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <NavBar />
                <InvalidURL />
            </div>
        )
    }

    return (
        <>
            <NavBar />
            <div className="studentpage-bigdiv">
                <StudentCard studentInfo={studentInfo} assignments={assignments} />
                <StudentAssignmentCard studentInfo={studentInfo} assignments={assignments} isLoading={isFetchingAssignments} />
            </div>
        </>
    )
}