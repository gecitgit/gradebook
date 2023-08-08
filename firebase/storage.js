import { format } from "date-fns";
import { deleteObject, getDownloadURL as getStorageDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "./firebase";

const BUCKET_URL = "gs://grading-df487.appspot.com";

export async function uploadImage(image, uid) {
    const formattedDate = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'Z'");
    const bucket = `${BUCKET_URL}/${uid}/${formattedDate}.jpg`;
    const storageRef = ref(storage, bucket);
    await uploadBytes(storageRef, image);
    return bucket;
}

export async function getDownloadURL(bucket) {
    return await getStorageDownloadURL(ref(storage, bucket));
}

export async function deleteStudentImage(imageURL) {
    const imageRef = ref(storage, imageURL); 
    await deleteObject(imageRef);
}

export async function deleteOldImage(bucket) {
    const storageRef = ref(storage, bucket);
    await deleteObject(storageRef);
}