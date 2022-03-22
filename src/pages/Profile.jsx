import React from 'react';
import { useState, useEffect } from 'react';
import { getAuth, updateProfile, updateEmail } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import {
  updateDoc,
  doc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg';
import homeIcon from '../assets/svg/homeIcon.svg';
import ListingItem from '../components/ListingItem';
import { getStorage, ref, deleteObject } from 'firebase/storage';

function Profile() {
  const auth = getAuth();
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState(null);
  const [changeDetails, setChangeDetails] = useState(false);
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

  const { name, email } = formData;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserListings = async () => {
      const listingsRef = collection(db, 'listings');
      const q = query(
        listingsRef,
        where('userRef', '==', auth.currentUser.uid),
        orderBy('timestamp', 'desc')
      );

      const querySnap = await getDocs(q);
      const listings = [];
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings(listings);
      setLoading(false);
    };

    fetchUserListings();
  }, [auth.currentUser.uid]);

  const onLogout = () => {
    auth.signOut();
    navigate('/');
  };

  const onSubmit = async (e) => {
    //e.preventDefault();
    try {
      //updates display name in firebase
      if (auth.currentUser.displayName !== name)
        await updateProfile(auth.currentUser, {
          displayName: name,
        });

      //update data in fireStore
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, {
        name: name,
        email: email,
      });

      //if user email does not equal the email on the acct, update email in firebase
      auth.currentUser.email !== email &&
        (await updateEmail(auth.currentUser, email));

      toast.success('change complete');
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong. Try logging out then logging back in');
    }
  };

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onDelete = async (listingId, listingUrls) => {
    //console.log(listingId);

    // const storage = getStorage();
    // //console.log(storage);
    // const deleteFileRef = ref(storage, `${listingUrls}`);
    // console.log(deleteFileRef._location.path_);
    // Create a reference to the file to delete

    if (window.confirm(`Are you sure you want to delete this listing?`)) {
      await deleteDoc(doc(db, 'listings', listingId));
      // deleteObject(deleteFileRef)
      //   .then(() => {
      //     // File deleted successfully
      //   })
      //   .catch((error) => {
      //     // Uh-oh, an error occurred!
      //   });

      const updatedListings = listings.filter(
        (listing) => listing.id !== listingId
      );
      setListings(updatedListings);
      toast.success(`Listing Deleted!`);
    }
  };

  return (
    <div className='profile'>
      <header className='profileHeader'>
        <p className='pageHeader'>My Profile</p>
        <button type='button' className='logOut' onClick={onLogout}>
          Log Out
        </button>
      </header>

      <main>
        <div className='profileDetailsHeader'>
          <p className='profileDetailsText'>Personal Details</p>
          <p
            className='changePersonalDetails'
            onClick={() => {
              changeDetails && onSubmit();
              setChangeDetails((prevState) => !prevState);
            }}
          >
            {changeDetails ? 'done' : 'change'}
          </p>
        </div>
        <div className='profileCard'>
          <form action=''>
            <input
              type='text'
              id='name'
              className={!changeDetails ? 'profileName' : 'profileNameActive'}
              disabled={!changeDetails}
              value={name}
              onChange={onChange}
            />
            <input
              type='text'
              id='email'
              className={!changeDetails ? 'profileEmail' : 'profileEmailActive'}
              disabled={!changeDetails}
              value={email}
              onChange={onChange}
            />
          </form>
        </div>
        <Link to='/create-listing' className='createListing'>
          <img src={homeIcon} alt='home' />
          <p>Sell or rent your home</p>
          <img src={arrowRight} alt='arrow right' />
        </Link>
        {!loading && listings?.length > 0 && (
          <>
            <div className='listingText'>Your Listings</div>
            <ul className='listingsList'>
              {listings.map(
                (listing) => (
                  console.log(listing),
                  (
                    <ListingItem
                      key={listing.id}
                      listing={listing.data}
                      id={listing.id}
                      onDelete={() =>
                        onDelete(listing.id, listing.data.imgUrls)
                      }
                    />
                  )
                )
              )}
            </ul>
          </>
        )}
      </main>
    </div>
  );
}

export default Profile;
