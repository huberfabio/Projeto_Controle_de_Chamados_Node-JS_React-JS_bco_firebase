import { useContext } from "react";
import { Link } from "react-router-dom";
import avatarImg from "../../assets/avatar.png";

import { AuthContext } from "../../contexts/auth";
import { FiHome, FiUser, FiSettings } from "react-icons/fi";
import { GiExitDoor } from "react-icons/gi";

import './sidebar.css'

export default function SideBar(){
    const { user, logout } = useContext(AuthContext)

    return(
        <div className="sidebar"> 
            <div>
                <img src={user.avatarUrl === null ? avatarImg : user.avatarUrl} alt="Foto do usuário" />
            </div>

            <Link to="/dashboard">
                <FiHome color="#FFF" size={24} />
                Chamados
            </Link>

            <Link to="/customers">
                <FiUser color="#FFF" size={24} />
                Clientes
            </Link>

            <Link to="/profile">
                <FiSettings color="#FFF" size={24} />
                Perfil
            </Link>

            <Link onClick={() => logout()} >
                <GiExitDoor color="#FFF" size={24} />
                Sair
            </Link>
        </div>
    )
}