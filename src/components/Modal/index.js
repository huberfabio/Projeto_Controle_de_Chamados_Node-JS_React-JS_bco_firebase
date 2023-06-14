import { FiX } from "react-icons/fi";
import './modal.css'

export default function Modal({ conteudo, close }){
    return(
        <div className="modal">
            <div className="container">
                <button className="close" onClick={close}>
                    <FiX size={25} color="#FFF" />
                    Fechar
                </button>

                <main>
                    <h2 style={{ color: 'blue', textDecoration: 'underline', textDecorationColor: '#DDD', textDecorationThickness: '10px' }}>Detalhes do Chamado</h2>

                    <div className="row">
                        <span>
                            Cliente: <i>{conteudo.cliente}</i>
                        </span>
                    </div>

                    <div className="row">
                        <span>
                            Assunto: <i>{conteudo.assunto}</i>
                        </span>
                        <span>
                            Cadastrado em: <i>{conteudo.createdFormat}</i>
                        </span>
                    </div>

                    <div className="row">
                        <span>
                            Status: <i className="status-badge" style={{ color: '#FFF', fontWeight: 'bold',
                             backgroundColor: conteudo.status === 'Aberto' ? '#5cb85c' :
                                              conteudo.status === 'Progresso' ? '#FF0000' :
                                              conteudo.status === 'Atendido' ? '#3583f6' : '#999'}}>
                                
                            {conteudo.status}</i>
                        </span>
                    </div>

                    {conteudo.complemento !== '' && (
                        <>
                            <h3># Complemento</h3>
                            <p>
                                {conteudo.complemento}
                            </p>
                        </>
                    )}
                </main>
            </div>
        </div>
    )
}