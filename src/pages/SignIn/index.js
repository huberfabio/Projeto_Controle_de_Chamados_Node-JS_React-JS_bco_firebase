import "./signin.css";
import logo from "../../assets/logo-pratic.png"
import { useContext, useState } from "react";
import { Link } from "react-router-dom";

import { AuthContext } from "../../contexts/auth";

export default function SignIn(){
    const [email, setEmail] = useState('');
    const [password, setPassord] = useState('');

    const { signIn, loadingAuth } = useContext(AuthContext)

    async function handleSignIn(e){
        e.preventDefault();

        if(email !== '' && password !== ''){
           await signIn(email, password); 
        }
    }

    return(
        <div className="container-center">
            <div className="login">
                <div className="login-area">
                    <img src={logo} alt="Logo do sistema" />
                </div>

                <form onSubmit={handleSignIn}>
                    <h1>Entrar</h1>
                    <input
                        type="text"
                        placeholder="Digite seu email..."
                        value={email}
                        onChange={ (e) => setEmail(e.target.value) }
                    />
                    <input
                        type="password"
                        placeholder="Digite sua senha..."
                        value={password}
                        onChange={ (e) => setPassord(e.target.value) }
                        autoComplete="off"
                    />

                    <button type="submit">
                        { loadingAuth ? 'Carregando...' : 'Acessar'}
                    </button>
                </form>
                <Link to="/register">Clique aqui para criar uma conta</Link>
            </div>
        </div>    
    )
}