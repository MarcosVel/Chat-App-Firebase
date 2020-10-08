import React, { useState, useRef } from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyDb-f7ZdWxj9Mkf0VOW-JaJN3rE0l5oGnk",
  authDomain: "superchat-mrlv.firebaseapp.com",
  databaseURL: "https://superchat-mrlv.firebaseio.com",
  projectId: "superchat-mrlv",
  storageBucket: "superchat-mrlv.appspot.com",
  messagingSenderId: "808421288643",
  appId: "1:808421288643:web:fe2b11e093a646b8485076",
})
// measurementId: "G-5B1V4Y4FKZ"

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {

  const [ user ] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <h1>Chat do Marquin 💬</h1>
        <SignOut />
      </header>

      <section>
        { user ? <ChatRoom /> : <SignIn /> }
      </section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <>
      <button className='btnGoogle btnSignIn' onClick={ signInWithGoogle }>Sign in with Google</button>
      <div className='infoChat'>
        <h2>Sobre o chat</h2>
        <p>Este é um chat <strong>"coletivo"</strong>. <br />
            Sua <strong>foto do gmail e sua mensagem</strong> estarão disponíveis para todos os usuários que decidirem acessar. <br />
            Sinta-se a vontade para marcar sua presença de uma boa forma.
        </p>
      </div>
    </>
  )
}

function SignOut() {
  return auth.currentUser && (

    <button className='btnGoogle btnSignOut' onClick={ () => auth.signOut() }>Sign Out</button>
  )
}

function ChatRoom() {

  const dummy = useRef()

  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt');

  const [ messages ] = useCollectionData(query, { idField: 'id' });

  const [ formValue, setFormValue ] = useState('');


  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('');

    dummy.current.scrollIntoView({ behavior: 'smooth' });

  }

  return (
    <>
      <main>
        { messages && messages.map(msg => <ChatMessage key={ msg.id } message={ msg } />) }

        <div ref={ dummy } ></div>

      </main>

      <form onSubmit={ sendMessage }>

        <input placeholder='Digite aqui...' value={ formValue } onChange={ (e) => setFormValue(e.target.value) } />

        <button type='submit'>🚀</button>

      </form>
    </>
  )
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (
    <div className={ `message ${ messageClass }` }>
      <img src={ photoURL } />
      <p>{ text }</p>
    </div>
  )
}

export default App;
