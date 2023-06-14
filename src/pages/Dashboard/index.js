import { useState, useEffect } from "react";

import Header from "../../components/Header";
import Title from "../../components/Title";
import { FiPlus, FiMessageSquare, FiSearch, FiEdit2 } from "react-icons/fi";

import { collection, getDocs, orderBy, limit, startAfter, query } from "firebase/firestore";
import { db } from "../../services/firebaseConnection";

import { Link } from "react-router-dom";

import { format } from "date-fns";
import Modal from "../../components/Modal";

import './dashboard.css'

const listRef = collection(db, "calleds")

export default function Dashboard(){
    const [chamados, setChamados] = useState([])
    const [loading, setLoading] = useState(true)

    // paginação
    const [isEmpty, setIsEmpty] = useState(false)
    const [lastDocs, setLostDocs] = useState('')
    const [loadingMore, setLoadingMore] = useState(false)

    const [showPostModal, setShowPostModal] = useState(false)
    const [detail, setDetail] = useState('')

    useEffect(() => {
        async function loadChamados(){
            const q = query(listRef, orderBy('created', 'desc'), limit(5))
        
            const querySnapshot = await getDocs(q)
            setChamados([])

            await updateState(querySnapshot)

            setLoading(false)

        }
        loadChamados()

        return () => {}
    }, [])

    async function updateState(querySnapshot){
        const isCollectionEmpty = querySnapshot.size === 0

        if(!isCollectionEmpty){
            let lista = []

            querySnapshot.forEach((doc) => {
              lista.push({
                id: doc.id,
                assunto: doc.data().assunto,
                cliente: doc.data().cliente,
                clienteId: doc.data().clienteId,
                created: doc.data().created,
                createdFormat: format(doc.data().created.toDate(), 'dd/MM/yyyy'),
                status: doc.data().status,
                complemento: doc.data().complemento,
              })  
            })

            // paginação
            // pegando último ítem da lista
            const lastDoc = querySnapshot.docs[querySnapshot.docs.length -1]
            setLostDocs(lastDoc)

            setChamados(chamados => [...chamados, ...lista])
        }else{
            setIsEmpty(true)
        }
        setLoadingMore(false)
    }

    async function handleMore(){
        setLoadingMore(true)

        const q = query(listRef, orderBy('created', 'desc'), startAfter(lastDocs), limit(5))
        const querySnapshot = await getDocs(q)
        await updateState(querySnapshot)
    }

    function toggleMOdal(item){
        setShowPostModal(!showPostModal)
        setDetail(item)
    }

    if(loading){
        return(
            <div>
                <Header />

                <div className="content">
                    <Title name="Chamados">
                        <FiMessageSquare size={25} />
                    </Title>

                    <div className="container dashboard">
                        <span>Buscando chamados...</span>
                    </div>
                </div>
            </div>
        )
    }

    return(
        <div>
            <Header />
            
            <div className="content">
                <Title name="Chamados">
                    <FiMessageSquare size={25}/>
                </Title>

                <>
                    {chamados.length === 0 ? (
                        <div className="container dashboard">
                            <span>Nenhum Chamado encontrado...</span>
                            <Link to="/new" className="new">
                                <FiPlus color="#FFF" size={25} />
                                Novo Chamado
                            </Link>
                        </div>
                    ) : (
                       <>
                            <Link to="/new" className="new">
                                <FiPlus color="#FFF" size={25} />
                                Novo Chamado
                            </Link>

                            <table>
                                <thead>
                                    <tr>
                                        <th scope="col" style={{ textAlign: 'left' }}>Cliente</th>
                                        <th scope="col">Assunto</th>
                                        <th scope="col">Status</th>
                                        <th scope="col">Cadastrado em</th>
                                        <th scope="col">#</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {chamados.map((item, index) => {
                                        return(
                                            <tr key={index}>
                                                <td data-label="Cliente" style={{ textAlign: 'left' }}>{item.cliente}</td>
                                                <td data-label="Assunto">{item.assunto}</td>
                                                <td data-label="Status">
                                                    <span className="badge" style={{ backgroundColor: item.status === 'Aberto' ? '#5cb85c' :
                                                                                                      item.status === 'Progresso' ? '#FF0000' :
                                                                                                      item.status === 'Atendido' ? '#3583f6' : '#999'}}>
                                                                                                 
                                                        {item.status}
                                                    </span>
                                                </td>
                                                <td data-label="Cadastrado">{item.createdFormat}</td>
                                                <td data-label="#">
                                                    <button className="btn-action" style={{ backgroundColor: '#3583f6', color: '#FFF' }} onClick={ () => toggleMOdal(item)}>
                                                        <FiSearch color="#FFF" size={17} />
                                                    </button>
                                                    <Link to={`/new/${item.id}`} className="btn-action" style={{ backgroundColor: '#FF8C00', color: '#FFF' }}>
                                                        <FiEdit2 color="#FFF" size={17} />
                                                    </Link>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                            {loadingMore && <h3>Buscando chamados...</h3>}
                            {!loadingMore && !isEmpty && <button className="btn-more" onClick={handleMore}>Buscar mais</button>}
                       </> 
                    )}
               </>    
               
            </div>

            {showPostModal && (
                <Modal
                    conteudo={detail}
                    close={ () => setShowPostModal(!showPostModal)}
                />
            )}
            
        </div>
    )
}