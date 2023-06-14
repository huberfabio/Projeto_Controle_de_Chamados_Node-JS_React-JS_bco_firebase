import { useState, useEffect, createContext } from "react";
import { toast } from "react-toastify";

import { auth, db } from "../services/firebaseConnection";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

import { useNavigate } from "react-router-dom";

export const AuthContext = createContext({});

function AuthProvider({ children }){
    const [user, setUser] = useState(null)
    const [loadingAuth, setLoadingAuth] = useState(false)
    const [loading, setLoading] = useState(true)

    const navigate = useNavigate()

    useEffect(() => {
        async function loadUser(){
            const storageUser = localStorage.getItem('@calledPRO')

            if(storageUser){
                setUser(JSON.parse(storageUser))
                setLoading(false)
            }
            setLoading(false)
        }
        loadUser()
    },[])

    async function signIn(email, password){
        setLoadingAuth(true)

        await signInWithEmailAndPassword(auth, email, password)
        .then( async (value) => {
            let uid = value.user.uid

            const dataRef = doc(db, "users", uid)
            const docSnap = await getDoc(dataRef)

            let data = {
                uid: uid,
                nome: docSnap.data().nome,
                email: value.user.email,
                avatarUrl: docSnap.data().avatarUrl
            }

            setUser(data)
            storageUser(data)
            setLoadingAuth(false)
            toast.success('Bem-vindo(a) de volta ' + docSnap.data().nome)

            navigate("/dashboard")
        })
        .catch((error) => {
            console.log(error)
            setLoadingAuth(false)
            toast.error('Ops algo deu errado')
        })
    }

    // cadastrar novo usuário
    async function signUp(email, password, name){
        setLoadingAuth(true);

        await createUserWithEmailAndPassword(auth, email, password)
        .then( async (value) => {
            let uid = value.user.uid

            await setDoc(doc(db, "users", uid),{
               nome: name,
               avatarUrl: null 
            })
            .then(() => {
                let data = {
                    uid: uid,
                    nome: name,
                    email: value.user.email,
                    avatarUrl: null
                }
                
                setUser(data)
                storageUser(data)
                setLoadingAuth(false)
                toast.success('Seja bem-vindo ao sistema ' + data.nome)

                navigate("/dashboard")
            })
        })
        .catch((error) => {
            console.log(error)
            setLoadingAuth(false)
            toast.error('Ops algo deu errado')
        })
    }

    function storageUser(data){
        localStorage.setItem('@calledPRO', JSON.stringify(data))
    }

    async function logout(){
        await signOut(auth)
        localStorage.removeItem('@calledPRO')
        setUser(null)
    }

    return(
        <AuthContext.Provider
            value={{
                signed: !!user,
                user,
                signIn,
                signUp,
                logout,
                loadingAuth,
                loading,
                storageUser,
                setUser
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;