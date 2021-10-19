import * as firebase from "firebase";

const firebaseConfig = {
	apiKey: "AIzaSyBliVi5SDz78UrGkKscLWogPrXJZBvX154",
	authDomain: "authentication-prj-firebase.firebaseapp.com",
	projectId: "authentication-prj-firebase",
	storageBucket: "authentication-prj-firebase.appspot.com",
	messagingSenderId: "74622010958",
	appId: "1:74622010958:web:7087e8f0e994b0cee1651f",
	measurementId: "G-YE2B878842"
      };

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = app.auth();
const db = app.firestore();

const googleProvider = new firebase.auth.GoogleAuthProvider();

const signInWithGoogle = async ()=>{
	try{
		const res = await auth.signInWithPopup(googleProvider);
		const user = res.user;
		const query= await db
		.collection("users")
		.where("uid","==",user.uid)
		.get();
		if(query.docs.length === 0){
			await db.collection("users").add({
				uid:user.uid,
				name:user.displayName,
				authProvider:"google",
				email:user.email,
			});

		}
	} catch(err){
		console.log(err);
		alert(err.message);
	}
};

const signInWithEmailAndPassword = async (uname,password)=>{
	try{
		await auth.signInWithEmailAndPassword(uname,password);
	}catch(err){
		console.log(err);
		alert(err.message);
	}
};

const registerWithEmailAndPassword = async (uname,email,password)=>{
	try{
		const res=await db.registerWithEmailAndPassword(email,password);
		const user = res.user;
		await db.collection("users").add({
			uid:user.uid,
			name:uname,
			authProvider:"local",
			email,
		})
	}catch(err){
		console.log(err);
		alert(err.message);
	}
};

const sendPasswordResetEmail = async (email)=>{
	try{
		await auth.sendPasswordResetEmail(email);
	}catch(err){
		console.log(err);
		alert(err.message);
	}
}

const logout = ()=>{
	auth.logout();
}

export {
	auth,
	db,
	signInWithGoogle,
	signInWithEmailAndPassword,
	registerWithEmailAndPassword,
	sendPasswordResetEmail,
	logout,
};