import { Button } from '@material-ui/core'
import React, { useState } from 'react'
import { storage, db } from "./firebase"
// import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import 'firebase/compat/firestore';
import './ImageUpload.css';

function ImageUpload({username}) {
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);
    const [caption, setCaption] = useState('');

    const handleChange = (e) => {
        if(e.target.files[0]) { //get the first file user selected
            setImage(e.target.files[0]);
        }
    }

    const handleUpload = () => {
        // const storageRef = ref(storage);
        // // Points to 'images'
        // const imagesRef = ref(storageRef, 'images');
        // const fileName = image.name;
        // const spaceRef = ref(imagesRef, fileName);
        // // File path is 'images/space.jpg'
        // const path = spaceRef.fullPath;
        // const uploadTask = ref(storage, path).put(image);

        const uploadTask = storage.ref(`/images/${image.name}`).put(image);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // progress function 
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100); //progress indicator from 0 to 100
                setProgress(progress);
            },
            (error) => {
                // Error function
                console.log(error);
                alert(error.message);
            },
            () => {
                // complete function
                storage
                .ref('images')
                .child(image.name)
                .getDownloadURL()
                .then(url => {
                    // post image in db
                    db.collection("posts").add({
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(), //we want the timestamp so that we can put recent posts at top regardless of where we are in the world
                        caption: caption,
                        imageUrl: url,
                        username: username
                    })
                    setProgress(0);
                    setCaption("");
                    setImage(null);
                });
            }
        );
    };

    return (
        <div className="imageUpload">
            {/* Caption input + File Picker + Post button */}
            <progress className="progressIndicator" value={progress} max="100" />
            <input type="text" placeholder = 'Enter a caption...' onChange={event=> setCaption(event.target.value)}/>
            <input type="file" onChange={handleChange} />
            <Button className="imageupload__button" onClick={handleUpload}> 
                Upload
            </Button>
        </div>
    )
}

export default ImageUpload
