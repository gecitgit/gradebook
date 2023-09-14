import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, setDoc, where, getDocs, getDoc, updateDoc, writeBatch } from "firebase/firestore";
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

// export async function getSpecificAssignment(assignmentId, studentSlug) {
//     const assignmentQuery = query(collection(db, ASSIGNMENTS_COLLECTION), where("id", "==", assignmentId), where("studentslug", "==", studentSlug));
//     const querySnapshot = await getDocs(assignmentQuery);

//     console.log("this is the assignmentquery inside of getspecificassignment: ", assignmentQuery)
//     console.log("this is the query snapshot inside of getspecificassignment: ", querySnapshot)

//     if (!querySnapshot.empty) {
//         const assignmentData = querySnapshot.docs[0].data();
//         return {
//             ...assignmentData,
//             id: assignmentId
//         };
//     } else {
//         return null;
//     }
// }
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


// export async function updateAssignment(assignmentId, uid, assignmentClass, assignmentType, isSubmitted, assignmentGrade, assignmentComments, studentSlug) {
//     setDoc(doc(db, ASSIGNMENTS_COLLECTION, assignmentId), { uid, assignmentClass, assignmentType, isSubmitted, assignmentGrade, assignmentComments, studentSlug });
// }

export async function updateAssignment(assignmentId, updatedData) {
    const assignmentRef = doc(db, ASSIGNMENTS_COLLECTION, assignmentId);
    await updateDoc(assignmentRef, updatedData);
}

export async function deleteAssignment(assignmentId) {
    await deleteDoc(doc(db, ASSIGNMENTS_COLLECTION, assignmentId));
}

// export async function deleteStudent(studentSlug) {
//     await deleteDoc(doc(db, STUDENTS_COLLECTION, studentSlug));

//     const studentAssignments = query(collection(db, ASSIGNMENTS_COLLECTION), where("studentSlug", "==", studentSlug));
//     const querySnapshot = await getDocs(studentAssignments);

//     for (const documentSnapshot of querySnapshot.docs) {
//         const assignment = documentSnapshot.data();
//         await deleteDoc(doc(db, ASSIGNMENTS_COLLECTION, assignment.id));
//     }
// }

export async function deleteStudentAssignments(studentSlug) {
    console.log("Inside deleteStudentAssignments. Slug:", studentSlug);

    const studentAssignments = query(collection(db, ASSIGNMENTS_COLLECTION), where("studentSlug", "==", studentSlug));
    const querySnapshot = await getDocs(studentAssignments);

    // Store the assignments in an array
    const assignmentsToDelete = [];
    querySnapshot.forEach((doc) => {
        const assignment = doc.data();
        assignment.id = doc.id;  // Make sure to attach the document ID as well
        assignmentsToDelete.push(assignment);
    });

    console.log("Assignments to be deleted:", assignmentsToDelete);

    // Iterate over the assignments array and delete each one
    for (const assignment of assignmentsToDelete) {
        console.log("Deleting assignment:", assignment.uid, "Authenticated UID: ", firebase.auth().currentUser.uid);
        // await deleteDoc(doc(db, ASSIGNMENTS_COLLECTION, assignment.id));
        try {
            await deleteDoc(doc(db, ASSIGNMENTS_COLLECTION, assignment.id));
        } catch (error) {
            console.error("Error deleting assignment:", error);
        }
    }
}

// export async function deleteStudentAssignments(studentSlug) {
//     try {
//         console.log("Inside deleteStudentAssignments. Slug:", studentSlug);

//         const studentAssignments = query(collection(db, ASSIGNMENTS_COLLECTION), where("studentSlug", "==", studentSlug));
//         const querySnapshot = await getDocs(studentAssignments);

//         const assignmentIdsToDelete = [];
//         querySnapshot.forEach((doc) => {
//             assignmentIdsToDelete.push(doc.id);
//         });
//         console.log("assignment ids to be deleted: ", assignmentIdsToDelete);

//         for (const assignmentId of assignmentIdsToDelete) {
//             console.log("preparing to delete: ", assignmentId);
//             await deleteDoc(doc(db, ASSIGNMENTS_COLLECTION, assignmentId));
//         }
//     } catch (error) {
//         console.error("Error inside deleteStudentAssignments:", error);
//         throw error;  // Re-throw the error to propagate it to calling functions
//     }
// }


export async function deleteStudentRecord(studentSlug) {
    console.log("Attempting to delete student record with slug:", studentSlug);

    // 1. Query the collection to find the document with the matching `studentSlug`.
    const studentQuery = query(collection(db, STUDENTS_COLLECTION), where("studentSlug", "==", studentSlug));
    const querySnapshot = await getDocs(studentQuery);

    // Check if we got a result and handle it
    if (!querySnapshot.empty) {
        const studentDoc = querySnapshot.docs[0];

        // 2. Extract the document ID from the query result.
        const studentDocId = studentDoc.id;

        // 3. Use that document ID to delete the student record.
        await deleteDoc(doc(db, STUDENTS_COLLECTION, studentDocId));
        console.log("Deleted student record with slug:", studentSlug);
    } else {
        console.warn("No student found with slug:", studentSlug);
    }
}

export async function deleteStudentAndAssignments(studentSlug, studentId) {
    try {
        await deleteDoc(doc(db, STUDENTS_COLLECTION, studentId));

        const studentAssignments = query(collection(db, ASSIGNMENTS_COLLECTION), where("studentSlug", "==", studentSlug));
        const querySnapshot = await getDocs(studentAssignments);
        for (const doc of querySnapshot.docs) {
            await deleteDoc(doc(db, ASSIGNMENTS_COLLECTION, doc.id));
        }
    } catch (error) {
        console.error("Error inside deleteStudentAndAssignments:", error);
        throw error;
    }
}

export async function deleteStudentOnly(studentId) {
    try {
        await deleteDoc(doc(db, STUDENTS_COLLECTION, studentId));
    } catch (error) {
        console.error("Error inside deleteStudentOnly:", error);
        throw error;
    }
}

export async function deleteAssignmentsOnly(studentId) {
    try {
        // Step 1 & 2: Fetch the student document using the studentId
        const studentDocRef = doc(db, STUDENTS_COLLECTION, studentId);
        const studentDocSnap = await getDoc(studentDocRef);

        if (!studentDocSnap.exists) {
            console.error("Student not found:", studentId);
            return; // Early return if student doesn't exist
        }

        // Step 3: Extract studentSlug
        const studentData = studentDocSnap.data();
        const studentSlug = studentData.studentSlug;

        // Step 4: Query assignments using studentSlug and delete them
        const studentAssignments = query(collection(db, ASSIGNMENTS_COLLECTION), where("studentSlug", "==", studentSlug));
        const querySnapshot = await getDocs(studentAssignments);
        for (const doc of querySnapshot.docs) {
            await deleteDoc(doc(db, ASSIGNMENTS_COLLECTION, doc.id));
        }

    } catch (error) {
        console.error("Error inside deleteAssignmentsOnly:", error);
        throw error;
    }
}



export async function updateStudentInfo(studentUID, updatedData, oldSlug) {
    const studentRef = doc(db, STUDENTS_COLLECTION, studentUID);

    const newSlug = updatedData.studentSlug;

    // if (oldSlug !== newSlug) {
    //     // await updateAssignmentsSlug(oldSlug, newSlug, studentUID);
    //     console.log("the old slug is being swapped with the new!");
    // }

    await updateDoc(studentRef, updatedData);
    console.log("THIS IS WHERE I WOULD UPDATE THE STUDENT IF I COULD")
}

async function updateAssignmentsSlug(oldSlug, newSlug, studentUID) {
    try {
        
        const studentDocRef = doc(db, STUDENTS_COLLECTION, studentUID);
        const studentDocSnap = await getDoc(studentDocRef);

        if (!studentDocSnap.exists) {
            console.error("Student not found: ", studentUID);
            return;
        }

        const studentData = studentDocSnap.data();
        const studentSlug = studentData.studentSlug;

        console.log("this is the studentSlug thats being submitted in updateAssignmentsSlug: ", studentSlug);

        const studentAssignments = query(collection(db, ASSIGNMENTS_COLLECTION), where("studentSlug", "==", studentSlug));
        const querySnapshot = await getDocs(studentAssignments);


    } catch (error) {
        console.error("error inside of updateAssignmentsslug: ", error.message);
        throw error;
    }

}