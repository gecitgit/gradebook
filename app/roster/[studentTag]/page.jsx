"use client";
import { useRef, useEffect, useState } from "react";
import NavBar from "@/components/navbar";
import StudentAssignmentCard from "@/components/studentAssignmentCard";
import StudentCard from "@/components/studentCard";
import { useAuth } from '../../../firebase/auth';
import { getStudentInfo } from '../../../firebase/firestore';
import { CircularProgress } from "@mui/material";
import Image from "next/image";
import { useRouter, usePathname } from 'next/navigation';
import { getAssignments } from "../../../firebase/firestore";

export default function StudentPage() {
    const { authUser, isLoading } = useAuth();
    const router = useRouter();

    const pathnameNEXT = usePathname();
    const shortenedPath = pathnameNEXT.split("/")[2];

    const [studentInfo, setStudentInfo] = useState({});
    const [isFetching, setIsFetching] = useState(true);
    const [error, setError] = useState(false);
    const [assignments, setAssignments] = useState([]);

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
                setAssignments(await getAssignments(authUser.uid, studentInfo.studentSlug));
            }
        };
        fetchAssignments();
    }, [authUser, studentInfo]);
    
    console.log("this is your student now: ", studentInfo);
    
    if (isFetching) {
        return <CircularProgress />;
    }

    if (error) {
        return <p>Invalid url lmao</p>
    }

    return (
        <>
            <NavBar />
            <div style={{ border: "2px solid purple"}}>
                <h2>{studentInfo.studentFirstName} {studentInfo.studentLastName}</h2>
                <p>Here is the shortened pathname: <b>{shortenedPath}</b></p>
                    <StudentCard studentInfo={studentInfo}/>
                    <StudentAssignmentCard studentInfo={studentInfo} assignments={assignments}/>
            </div>
        </>
    )
}