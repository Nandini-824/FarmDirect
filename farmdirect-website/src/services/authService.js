import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  sendEmailVerification,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

const googleProvider = new GoogleAuthProvider();

export async function registerUser({ email, password, name, phone, role, location }) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  const { user } = credential;

  await updateProfile(user, { displayName: name });
  await sendEmailVerification(user);

  await setDoc(doc(db, 'users', user.uid), {
    uid: user.uid,
    name,
    email,
    phone: phone || '',
    role,
    profileImage: user.photoURL || '',
    photoURL: user.photoURL || '',
    location: location || '',
    createdAt: serverTimestamp(),
  });

  const profileCollection = role === 'farmer' ? 'farmerProfiles' : 'consumerProfiles';
  await setDoc(doc(db, profileCollection, user.uid), {
    uid: user.uid,
    name,
    email,
    phone: phone || '',
    location: location || '',
    photoURL: user.photoURL || '',
    ...(role === 'farmer' ? { farmName: '', rating: 0 } : { savedFarmers: [], recentlyViewed: [] }),
    createdAt: serverTimestamp(),
  });

  return user;
}

export async function loginUser(email, password) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

export async function loginWithGoogle(role) {
  const credential = await signInWithPopup(auth, googleProvider);
  const { user } = credential;
  const userRef = doc(db, 'users', user.uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    const userRole = role || 'consumer';
    await setDoc(userRef, {
      uid: user.uid,
      name: user.displayName || 'User',
      email: user.email,
      phone: '',
      role: userRole,
      profileImage: user.photoURL || '',
      photoURL: user.photoURL || '',
      location: '',
      createdAt: serverTimestamp(),
    });
    const profileCollection = userRole === 'farmer' ? 'farmerProfiles' : 'consumerProfiles';
    await setDoc(doc(db, profileCollection, user.uid), {
      uid: user.uid,
      name: user.displayName || 'User',
      email: user.email,
      phone: '',
      location: '',
      photoURL: user.photoURL || '',
      ...(userRole === 'farmer' ? { farmName: '', rating: 0 } : { savedFarmers: [], recentlyViewed: [] }),
      createdAt: serverTimestamp(),
    });
  }

  return user;
}

export async function resetPassword(email) {
  await sendPasswordResetEmail(auth, email);
}

export async function logoutUser() {
  await signOut(auth);
}

export async function updateUserRole(uid, role) {
  await setDoc(doc(db, 'users', uid), { role }, { merge: true });
  const profileCollection = role === 'farmer' ? 'farmerProfiles' : 'consumerProfiles';
  const snap = await getDoc(doc(db, profileCollection, uid));
  if (!snap.exists()) {
    const userSnap = await getDoc(doc(db, 'users', uid));
    const u = userSnap.data() || {};
    await setDoc(doc(db, profileCollection, uid), {
      uid,
      name: u.name,
      email: u.email,
      phone: u.phone || '',
      location: u.location || '',
      photoURL: u.photoURL || '',
      ...(role === 'farmer' ? { farmName: '', rating: 0 } : { savedFarmers: [], recentlyViewed: [] }),
      createdAt: serverTimestamp(),
    });
  }
}

export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? snap.data() : null;
}
