import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './Post.js';
import { db, auth } from './firebase';
import {makeStyles} from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import { signOut, signInWithEmailAndPassword } from "firebase/auth";
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed';

// require('firebase/auth');

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`
  };
}

const useStyles = makeStyles(theme => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const [modalStyle] = useState(getModalStyle);
  const classes = useStyles();

  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [openSignIn, setOpenSignIn] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if(authUser) {
        //user has logged in
        console.log(authUser);
        setUser(authUser);
      }
      else {
        //user logged out
        setUser(null);
      }
    })

    return () => {
      //perform some cleanup actions
      unsubscribe();
    }
  }, [user, username]);

  // Sign Up backend
  const signUp = (event) => {
    event.preventDefault(); //so that it does not refresh everytime we enter a field
    auth.createUserWithEmailAndPassword(email, password)
    .then((authUser) => {
      return authUser.user.updateProfile({
        displayName: username
      }).then(() => {
        // Profile updated!
        // console.log("profile updated");
      }).catch((error) => alert(error.message));
    })
    .catch((error) => alert(error.message))

    setOpen(false);
  };

  // Sign In backend
  const signIn = (event) => {
    event.preventDefault();

    auth.signInWithEmailAndPassword(email, password)
    .catch((error) => alert(error.message));

    setOpenSignIn(false);
  }

// useEffect runs a piece of code based on a specific condition
  useEffect( () => {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      // every time a new post is ad ded, this code runs
      setPosts(snapshot.docs.map(doc => ({
         id: doc.id,
         post: doc.data()
        })));
    })
  }, []);


  return (
    <div className="app">

      {/* Sign Up Modal */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        >
        <div style={modalStyle} className = {classes.paper}>
          <form className = "app__signup"> 
            <center>
              <img 
                className= "app__headerImage"
                src = "https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt =""
              />
            </center>
            <Input 
              placeholder="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input 
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input 
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signUp}>Sign Up</Button>

          </form>
        </div>
      </Modal>

      {/* Sign In Modal */}
      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
        >
        <div style={modalStyle} className = {classes.paper}>
          <form className = "app__signup"> 
            <center>
              <img 
                className= "app__headerImage"
                src = "https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt =""
              />
            </center>
            <Input 
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input 
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signIn}>Sign In</Button>

          </form>
        </div>
      </Modal>

      {/* Header */}
      <div className="app__header">
        <img 
          className= "app__headerImage"
          src = "https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt =""
        />
        {user ? (
        <Button onClick={() => signOut(auth).then(() => {
          // Sign-out successful.
        })}>Log Out</Button>
        ) : (
          <div className = "app__loginContainer">
            <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
            <Button onClick={() => setOpen(true)}>Sign Up</Button>
          </div>
        )}
      </div>
      
      {/* Posts */}
      <div className="app__posts">
        <div className="app__posts_left">
          {
            posts.map(({id, post}) => (
              <Post key = {id} postId = {id} 
              user={user} username={post.username} caption={post.caption} imageURL={post.imageUrl} />
            ))
          }
        </div>
        <div className="app__posts_right">
          <InstagramEmbed
            url='https://www.instagram.com/p/B_uf9dmAGPw/'
            clientAccessToken='{appId}|{clientToken}'
            maxWidth={320}
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {alert("error");}}
          />
        </div>
      </div>

      {/* Image Upload */}
      {user?.displayName ? (
      <ImageUpload username={user.displayName} />
      ) : (
        <h3>Sorry you need to login to upload</h3>
      )}

    </div>
  );
}

export default App;
