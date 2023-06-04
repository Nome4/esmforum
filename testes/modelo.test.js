const bd = require('../bd/bd_utils.js');
const modelo = require('../modelo.js');

beforeEach(() => {
  bd.reconfig('./bd/esmforum-teste.db');
  // limpa dados de todas as tabelas
  bd.exec('delete from perguntas', []);
  bd.exec('delete from respostas', []);
});

test('Testando banco de dados vazio', () => {
  expect(modelo.listar_perguntas().length).toBe(0);
});

test('Testando cadastro de três perguntas', () => {
  modelo.cadastrar_pergunta('1 + 1 = ?');
  modelo.cadastrar_pergunta('2 + 2 = ?');
  modelo.cadastrar_pergunta('3 + 3 = ?');
  const perguntas = modelo.listar_perguntas(); 
  expect(perguntas.length).toBe(3);
  expect(perguntas[0].texto).toBe('1 + 1 = ?');
  expect(perguntas[1].texto).toBe('2 + 2 = ?');
  expect(perguntas[2].num_respostas).toBe(0);
  expect(perguntas[1].id_pergunta).toBe(perguntas[2].id_pergunta-1);
});

test('Testando cadastro de três perguntas com respostas', () => {
  modelo.cadastrar_pergunta('1 + 1 = ?');
  modelo.cadastrar_pergunta('2 + 2 = ?');
  modelo.cadastrar_pergunta('3 + 3 = ?');
  const perguntas = modelo.listar_perguntas();

  modelo.cadastrar_resposta(perguntas[0].id_pergunta,"2");
  modelo.cadastrar_resposta(perguntas[1].id_pergunta,"4");
  modelo.cadastrar_resposta(perguntas[0].id_pergunta,"Não sei");

  let resps=[];
  for(let i=0; i<perguntas.length; i++){
    resps[i]=modelo.get_respostas(perguntas[i].id_pergunta);
  }

  expect(resps[0][0].texto).toBe("2");
  expect(resps[0][1].texto).toBe("Não sei");
  expect(resps[1][0].texto).toBe("4");

  expect(resps[0][0].id_pergunta).toBe(perguntas[0].id_pergunta);
  expect(resps[0][1].id_pergunta).toBe(perguntas[0].id_pergunta);
  expect(resps[1][0].id_pergunta).toBe(perguntas[1].id_pergunta);

  expect(resps[2].length).toBe(0);
});

test('Testando get_pergunta', () => {
  modelo.cadastrar_pergunta('1 + 1 = ?');
  modelo.cadastrar_pergunta('2 + 2 = ?');
  const perguntas = modelo.listar_perguntas(); 
  for(let i=0; i<perguntas.length; i++){
    const perg=modelo.get_pergunta(perguntas[i].id_pergunta);
    expect(perg.texto).toBe(perguntas[i].texto);
    expect(perg.id_pergunta).toBe(perguntas[i].id_pergunta);
  }
});