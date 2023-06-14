import logo from "../../assets/logo-pratic.png"
import { useState, useContext } from "react";
import { Link } from "react-router-dom";

import { AuthContext } from "../../contexts/auth";

export default function SignUp(){
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassord] = useState('');

    const { signUp, loadingAuth }  = useContext(AuthContext);

    async function handleSubmit(e){
        e.preventDefault();

        if(name !== '' && email !== '' && password !== ''){
            await signUp(email, password, name)
        }
    }

    return(
        <div className="container-center">
            <div className="login">
                <div className="login-area">
                    <img src={logo} alt="Logo do sistema" />
                </div>

                <form onSubmit={handleSubmit}>
                    <h1>Nova Conta</h1>
                    <input
                        type="text"
                        placeholder="Digite seu nome..."
                        value={name}
                        onChange={ (e) => setName(e.target.value) }
                    />

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
                        { loadingAuth ? 'Carregando...' : 'Cadastrar' }
                    </button>
                </form>
                <Link to="/">Já possui uma conta? Faça login</Link>
            </div>
        </div>    
    )
}