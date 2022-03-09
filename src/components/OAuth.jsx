import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';
import googleIcon from '../assets/svg/googleIcon.svg';

function OAuth() {
  const navigate = useNavigate();
  const location = useLocation();

  const onGoogleClick = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      // The signed-in user info.
      const user = result.user;
      // This gives you a Google Access Token. You can use it to access the Google API.
      //const credential = GoogleAuthProvider.credentialFromResult(result); //not needed

      //check for user in database
      //doc checks db in Users for UserID
      const docRef = doc(db, 'users', user.uid);
      //documentSnapShot = getDoc while referenceing user id
      const docSnap = await getDoc(docRef);

      //if user doesnt exist create user
      if (!docSnap.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          name: user.displayName,
          email: user.email,
          timeStamp: serverTimestamp(),
        });
      }
      navigate('/');
    } catch (error) {
      toast.error('Could not authorize with Google');
    }
  };
  return (
    <div className='socialLogin'>
      <p className=''>
        Sign {location.pathname === '/sign-up' ? 'up' : 'in'} with{' '}
      </p>
      <button className='socialIconDiv' onClick={onGoogleClick}>
        <img src={googleIcon} className='socialIconImg' alt='google' />
      </button>
    </div>
  );
}

export default OAuth;
