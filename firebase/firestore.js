import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, setDoc, where, getDocs, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import { getDownloadURL } from "./storage";

const STUDENTS_COLLECTION = "students";
const ASSIGNMENTS_COLLECTION = "assignments";


export async function addStudent(uid, studentFirstName, studentLastName, gradeLevel, birthday, pronouns, academicStanding, hobbies, allergies, emergencyContactName, emergencyContactRelationship, emergencyContactPhone, imageBucket, studentSlug) {
    const studentsCollectionRef = collection(db, STUDENTS_COLLECTION);

    const studentDocRef = await addDoc(studentsCollectionRef, {
        uid,
        studentFirstName,
        studentLastName,
        gradeLevel,
        birthday,
        pronouns,
        academicStanding,
        hobbies,
        allergies,
        emergencyContactName,
        emergencyContactRelationship,
        emergencyContactPhone,
        imageBucket,
        studentSlug
    });

    const studentUID = studentDocRef.id;

    await updateDoc(studentDocRef, { studentUID });
}

export async function getStudents(uid) {
    const students = query(collection(db, STUDENTS_COLLECTION), where("uid", "==", uid), orderBy("studentFirstName", "desc"));
    const querySnapshot = await getDocs(students);

    let allStudents = [];
    for (const documentSnapshot of querySnapshot.docs) {
        const student = documentSnapshot.data();
        await allStudents.push({
            ...student,
            id: documentSnapshot.id,
            imageUrl: await getDownloadURL(student['imageBucket'])
        })
    }
    return allStudents;
}

export async function getStudentInfo(uid, studentSlug) {
    const studentQuery = query(collection(db, STUDENTS_COLLECTION), where("uid", "==", uid), where("studentSlug", "==", studentSlug));
    const querySnapshot = await getDocs(studentQuery);

    if (!querySnapshot.empty) {
        const studentData = querySnapshot.docs[0].data();
        const imageUrl = await getDownloadURL(studentData['imageBucket']);

        return {
            ...studentData,
            imageUrl: imageUrl
        };
    } else {
        return null;
    }
}

export async function addAssignment(uid, assignmentClass, assignmentType, isSubmitted, assignmentGrade, assignmentComments, studentSlug) {
    const newAssignmentRef = doc(collection(db, ASSIGNMENTS_COLLECTION));

    await setDoc(newAssignmentRef, {
        id: newAssignmentRef.id,
        uid,
        assignmentClass,
        assignmentType,
        isSubmitted,
        assignmentGrade,
        assignmentComments,
        studentSlug
    });
}

export async function getAssignments(uid, studentSlug) {
    const assignments = query(collection(db, ASSIGNMENTS_COLLECTION), where("uid", "==", uid), where("studentSlug", "==", studentSlug), orderBy("assignmentClass", "desc"));
    const querySnapshot = await getDocs(assignments);

    let allAssignments = [];
    for (const documentSnapshot of querySnapshot.docs) {
        const assignment = documentSnapshot.data();
        await allAssignments.push({
            ...assignment,
            id: documentSnapshot.id
        })
    }
    return allAssignments;
}

export async function getSpecificAssignment(assignmentId) {
    const assignmentDocRef = doc(db, ASSIGNMENTS_COLLECTION, assignmentId);

    try {
        const docSnap = await getDoc(assignmentDocRef);

        if (docSnap.exists()) {
            const assignmentData = docSnap.data();
            return {
                ...assignmentData,
                id: assignmentId
            };
        } else {
            throw new Error("no such document!");
        }
    } catch (error) {
        console.error("error getting docs: ", error.message);
        throw error;
    }
}

export async function updateAssignment(assignmentId, updatedData) {
    const assignmentRef = doc(db, ASSIGNMENTS_COLLECTION, assignmentId);
    await updateDoc(assignmentRef, updatedData);
}

export async function deleteAssignment(assignmentId) {
    await deleteDoc(doc(db, ASSIGNMENTS_COLLECTION, assignmentId));
}

export async function deleteStudentOnly(studentId) {
    try {
        await deleteDoc(doc(db, STUDENTS_COLLECTION, studentId));
    } catch (error) {
        console.error("Error inside deleteStudentOnly:", error);
        throw error;
    }
}

export async function updateStudentInfo(studentUID, updatedData) {
    const studentRef = doc(db, STUDENTS_COLLECTION, studentUID);

    await updateDoc(studentRef, updatedData);
    console.log("THIS IS WHERE I WOULD UPDATE THE STUDENT IF I COULD")
}