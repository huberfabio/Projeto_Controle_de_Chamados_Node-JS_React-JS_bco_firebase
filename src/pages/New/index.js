import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import Header from "../../components/Header";
import Title from "../../components/Title";

import { FiPlusCircle } from "react-icons/fi";

import { AuthContext } from "../../contexts/auth";

import { db } from "../../services/firebaseConnection";
import { collection, getDocs, doc, addDoc, getDoc, updateDoc } from "firebase/firestore";

import { toast } from "react-toastify";

import './new.css'

const listRef = collection(db, "customers")

export default function New(){
    const { user } = useContext(AuthContext)
    const { id } = useParams()
    const navigate = useNavigate()

    const [customers, setCustomers] = useState([])
    const [loadingCustomer, setLoadingCustomer] = useState(true)
    const [customerSelected, setCustomerSelected] = useState(0)

    const [complemento, setComplemento] = useState('')
    const [assunto, setAssunto] = useState('Suporte')
    const [status, setStatus] = useState('Aberto')
    const [idCustomer, setIdCustomer] = useState(false)

    useEffect(() => {
        async function loadingCustomers(){
            const querySnapshot = await getDocs(listRef)
            .then((snapshot) => {
                let lista = []

                snapshot.forEach((doc) => {
                    lista.push({
                        id: doc.id,
                        nomeEmpresa: doc.data().nomeEmpresa
                    })
                })
                if(snapshot.docs.size === 0){
                    toast.warn('Nenhuma empresa encontrada')
                    setCustomers([ { id: '1', nomeEmpresa: 'PRATIC' } ])
                    setLoadingCustomer(false)
                    return;
                }
                setCustomers(lista)
                setLoadingCustomer(false)

                if(id){
                    loadId(lista)
                }
            })
            .catch((error) => {
                console.log(error)
                toast.error('Ops, algo deu errado')
                setLoadingCustomer(false)
                setCustomers([ { id: '1', nomeEmpresa: 'PRATIC' } ])
            })
        }
        loadingCustomers()
    }, [id])

    async function loadId(lista){
        const docRef = doc(db, "calleds", id)
        await getDoc(docRef)
        .then((snapshot) => {
            setAssunto(snapshot.data().assunto)
            setStatus(snapshot.data().status)
            setComplemento(snapshot.data().complemento)

            let index = lista.findIndex(item => item.id === snapshot.data().clienteId)
            setCustomerSelected(index)
            setIdCustomer(true)
        })
        .catch((error) => {
            console.log(error);
            toast.error('Ops, algo deu errado')
            setIdCustomer(false)
        })
    }

    function handleOptionChange(e){
        setStatus(e.target.value)
    }

    function handleChangeSelect(e){
        setAssunto(e.target.value)
    }

    function handleChangeCustomer(e){
        setCustomerSelected(e.target.value)        
    }

    async function handleRegister(e){
        e.preventDefault()

        if(idCustomer){
            // atualizando chamados
            const docRef = doc(db, "calleds", id)
            await updateDoc(docRef, {
                cliente: customers[customerSelected].nomeEmpresa,
                clienteId: customers[customerSelected].id,
                assunto: assunto,
                complemento: complemento,
                status: status,
                userId: user.uid,
            })
            .then(() => {
                toast.success('Chamado atualizado com sucesso')
                setCustomerSelected(0)
                setComplemento('')
                navigate('/dashboard')
            }) 
            .catch((error) => {
                console.log(error);
                toast.error('Ops, algo deu errado')
            })

            return;
        }

        // registrar um chamdo
        await addDoc(collection(db, "calleds"), {
            created: new Date(),
            cliente: customers[customerSelected].nomeEmpresa,
            clienteId: customers[customerSelected].id,
            assunto: assunto,
            complemento: complemento,
            status: status,
            userId: user.uid,
        })
        .then(() => {
            toast.success('Chamado registrado com sucesso')
            setComplemento('')
            setCustomerSelected(0)
        })
        .catch((error) => {
            console.log(error)
            toast.error('Ops, algo deu errado')
        })
    }

    return(
        <div>
            <Header />

            <div className="content">
                <Title name={id ? "Editando Chamado" : "Novo Chamado"}>
                    <FiPlusCircle size={25} />
                </Title>

                <div className="container">
                    <form className="form-profile" onSubmit={handleRegister}>
                        
                        <label>Cliente</label>
                        {
                            loadingCustomer ? (
                                <input type="text" disabled={true} value="Carregando..." />
                            ) : (
                                <select value={customerSelected} onChange={handleChangeCustomer}>
                                    {customers.map((item, index) => {
                                        return(
                                            <option key={index} value={index}>
                                                {item.nomeEmpresa}
                                            </option>
                                        )                                            
                                    })}
                                </select>
                            )
                        }

                        <label>Assunto</label>
                        <select value={assunto} onChange={handleChangeSelect}>
                            <option value="Suporte">Suporte</option>
                            <option value="Visita Técnica">Visita Técnica</option>
                            <option value="Financeiro">Financeiro</option>
                        </select>

                        <label>Status</label>
                        <div className="status">
                            <input
                                type="radio"
                                name="radio"
                                value="Aberto"
                                onChange={handleOptionChange}
                                checked={ status === 'Aberto' }
                            />
                            <span>Em Aberto</span>

                            <input
                                type="radio"
                                name="radio"
                                value="Progresso"
                                onChange={handleOptionChange}
                                checked={ status === 'Progresso' }
                            />
                            <span>Progresso</span>
 
                            <input
                                type="radio"
                                name="radio"
                                value="Atendido"
                                onChange={handleOptionChange}
                                checked={ status === 'Atendido' }
                            />
                            <span>Atendido</span>
                       </div>

                       <label>Complemento</label>
                       <textarea
                            type="text"
                            placeholder="Descreva seu problema (opcional)"        
                            value={complemento}
                            onChange={(e) => setComplemento(e.target.value)}                    
                       />

                       <button type="submit">Registrar</button>
                       <Link className="btn-dashboard" to="/dashboard">
                            Voltar para Chamados
                       </Link>
                    </form>
                </div>
            </div>
        </div>
    )
}