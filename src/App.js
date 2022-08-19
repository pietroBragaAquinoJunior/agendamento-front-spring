import './App.css';
import axios from "axios";
import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DeleteIcon from '@mui/icons-material/Delete'
import Moment from 'moment';
import Button from '@mui/material/Button';

function App() {

  const [agendas, setAgendas] = useState([]);
  const [titulo, setTitulo] = useState([]);
  const [descricao, setDescricao] = useState([]);
  const [data1, setData1] = useState(new Date());
  const [alterarModo, setAlterarModo] = useState(0);
  const [idAlterarValor, setIdAlterarValor] = useState(0);

  useEffect(() => {
    atualizarValores()
  }, []);

  const atualizarValores = () => {
    axios
      .get("http://localhost:8080/agendas")
      .then(response => setAgendas(response.data));
  }

  const limparFormulario = () => {
    setTitulo("");
    setDescricao("");
    setData1(new Date());
  }

  const cadastrar = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8080/agendas', {
      titulo: titulo,
      descricao: descricao,
      dataFim: data1,
    }).then(atualizarValores());
    limparFormulario();
  }

  const deletar = (id) => {
    axios
    .delete(`http://localhost:8080/agendas/${id}`)
    .then(atualizarValores());
  }

  const alterarValores = (e) => {
    console.log(e);
    setTitulo(e.titulo);
    setDescricao(e.descricao);
    setData1(new Date(e.dataFim));
    setAlterarModo(1);
    setIdAlterarValor(e.id);
  }

  const alterar = (e) => {
    e.preventDefault();
    console.log(`Alterando valor de id = ${idAlterarValor}`)
    axios
    .put(`http://localhost:8080/agendas/${idAlterarValor}`,
    {
      titulo: titulo,
      descricao: descricao,
      dataFim: data1,
    })
    .then(atualizarValores());
    setAlterarModo(0);
  }

  return (
    <div className="principal">
      <div className="form">
        <form className="formulario">
          <h2 className="tituloFormulario">Formulário de Agendamento</h2>
          <p className="textoFormulario">Título: </p>
          <TextField id="outlined-basic" label="Título" variant="outlined" value={titulo} onChange={(e) => { setTitulo(e.target.value) }} />
          <p className="textoFormulario">Descrição: </p>
          <TextField id="outlined-basic" label="Descrição" variant="outlined" value={descricao} onChange={(e) => { setDescricao(e.target.value) }} />
          <p className="textoFormulario">Fim da tarefa: </p>
          <DatePicker selected={data1} onChange={(date: Date) => setData1(date)} className="formulario-data" />
          {alterarModo == 0 ?
            <Button variant="contained" onClick={cadastrar}>Cadastrar</Button>
            :
            <Button variant="contained" onClick={alterar}>Alterar</Button>
          }
     
        </form>
        {agendas.length !== 0 ?
          <>
            <table className="tabela">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Titulo</th>
                  <th>Descrição</th>
                  <th>Data Alteração</th>
                  <th>Data Criação</th>
                  <th>Data Fim</th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {agendas.map((agenda) => (
                  <tr key={agenda.id}>
                    <td>{agenda.id}</td>
                    <td>{agenda.titulo}</td>
                    <td>{agenda.descricao}</td>
                    <td>{Moment(agenda.dataAlteracao).format('DD-MM-YYYY')}</td>
                    <td>{Moment(agenda.dataCriacao).format('DD-MM-YYYY')}</td>
                    <td>{Moment(agenda.dataFim).format('DD-MM-YYYY')}</td>
                    <td><DeleteIcon onClick={() => deletar(agenda.id)} /></td>
                    <td><Button variant="contained" onClick={() => alterarValores(agenda)}>Alterar</Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
          :
          <> Carregando... </>
        }
      </div>
    </div>
  );
}

export default App;
