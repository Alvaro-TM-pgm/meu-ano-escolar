import {firebaseConfig} from '../firebase-config.js';
const configured=()=>firebaseConfig?.apiKey&&!firebaseConfig.apiKey.startsWith('SUA_')&&firebaseConfig.projectId&&!firebaseConfig.projectId.startsWith('SEU_');
let api=null,app=null,auth=null,provider=null,db=null;
async function loadSdk(){if(!configured())throw new Error('Firebase ainda não foi configurado.');if(api)return api;const base='https://www.gstatic.com/firebasejs/10.14.1/';const [appSdk,authSdk,storeSdk]=await Promise.all([import(base+'firebase-app.js'),import(base+'firebase-auth.js'),import(base+'firebase-firestore.js')]);api={...appSdk,...authSdk,...storeSdk};app=api.initializeApp(firebaseConfig);auth=api.getAuth(app);provider=new api.GoogleAuthProvider();db=api.getFirestore(app);try{await api.enableIndexedDbPersistence(db)}catch(e){console.info('Persistência local Firestore indisponível neste contexto:',e.code)}return api}
export const isFirebaseConfigured=configured;
export async function onAuthStateChangedSafe(callback){if(!configured()){callback(null);return()=>{}}let a=await loadSdk();return a.onAuthStateChanged(auth,callback)}
export async function signInGoogle(){let a=await loadSdk();return a.signInWithPopup(auth,provider)}
export async function signOutUser(){if(!auth)return;return api.signOut(auth)}
export async function syncProfile(user){if(!user)return;let a=await loadSdk(),ref=a.doc(db,'users',user.uid),snap=await a.getDoc(ref),now=a.serverTimestamp();await a.setDoc(ref,{name:user.displayName||'',email:user.email||'',photoURL:user.photoURL||'',createdAt:snap.exists()?snap.data().createdAt:now,updatedAt:now,settings:{}},{merge:true})}
async function replaceCollection(a,path,rows,key){let col=a.collection(db,...path),existing=await a.getDocs(col),wanted=new Set(rows.map(key));for(const d of existing.docs)if(!wanted.has(d.id))await a.deleteDoc(d.ref);for(const row of rows)await a.setDoc(a.doc(db,...path,key(row)),row)}
export async function saveSubject(uid,subject){let a=await loadSdk(),path=['users',uid,'subjects',subject.id],{terms=[],assessments=[],...fields}=subject;await a.setDoc(a.doc(db,...path),{...fields,updatedAt:a.serverTimestamp()});await replaceCollection(a,[...path,'terms'],terms,t=>`term-${t.number}`);await replaceCollection(a,[...path,'assessments'],assessments,t=>t.id)}
export async function removeSubject(uid,id){let a=await loadSdk(),path=['users',uid,'subjects',id];for(const child of ['terms','assessments']){const rows=await a.getDocs(a.collection(db,...path,child));for(const row of rows.docs)await a.deleteDoc(row.ref)}return a.deleteDoc(a.doc(db,...path))}
export async function fetchSubjects(uid){let a=await loadSdk(),snap=await a.getDocs(a.collection(db,'users',uid,'subjects'));return Promise.all(snap.docs.map(async d=>{let path=['users',uid,'subjects',d.id],terms=await a.getDocs(a.collection(db,...path,'terms')),assessments=await a.getDocs(a.collection(db,...path,'assessments'));return {...d.data(),id:d.id,terms:terms.docs.map(t=>t.data()).sort((x,y)=>x.number-y.number),assessments:assessments.docs.map(x=>({...x.data(),id:x.id}))}}))}
export async function saveSettings(uid,settings){let a=await loadSdk();return a.setDoc(a.doc(db,'users',uid),{settings,updatedAt:a.serverTimestamp()},{merge:true})}
export async function getUserProfile(uid){let a=await loadSdk(),s=await a.getDoc(a.doc(db,'users',uid));return s.exists()?s.data():null}
export async function saveUserProfile(user){return syncProfile(user)}
export async function createSubject(uid,s){return saveSubject(uid,s)}
export async function updateSubject(uid,s){return saveSubject(uid,s)}
export async function deleteSubject(uid,id){return removeSubject(uid,id)}
export async function getSubjects(uid){return fetchSubjects(uid)}
export async function createAssessment(uid,subjectId,a){let x=await loadSdk();return x.setDoc(x.doc(db,'users',uid,'subjects',subjectId,'assessments',a.id),a)}
export async function updateAssessment(uid,subjectId,a){return createAssessment(uid,subjectId,a)}
export async function deleteAssessment(uid,subjectId,id){let x=await loadSdk();return x.deleteDoc(x.doc(db,'users',uid,'subjects',subjectId,'assessments',id))}
export async function loadSettings(uid){return getUserProfile(uid)}
export async function clearSchoolData(uid){let a=await loadSdk(),subs=await a.getDocs(a.collection(db,'users',uid,'subjects'));for(const s of subs.docs)await removeSubject(uid,s.id)}
export async function deleteMyProfileData(uid){let a=await loadSdk();await clearSchoolData(uid);await a.deleteDoc(a.doc(db,'users',uid))}
