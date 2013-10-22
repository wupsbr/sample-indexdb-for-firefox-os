// vamos deixar a variavel publica para garnatir que ela seja acessivel em todas as funções
var objDiv, objInputRegistro, objInputTitulo;

function buscarRegistros() 
{
    if (!db) {
        // HACK:
        // O db pode não existir quando o indexDB ainda está executando a
        // criação do banco de dados. Nesta situação aguardamos mais alguns
        // segundos e chamamos novamente até funcionar.
        console.warn("Database não está pronto!");
        setTimeout(buscarRegistros, 1000);
        return;
    }

    // vamos apagar o conteudo da div primeiro ...
    objDiv.innerHTML = "";

    // Vamos chamar a função que lista todos os registros do model.js ...
    listarRegistros(function (err, value) 
    {
        var objTitulo = document.createTextNode(value.id + ". " + value.nm_titulo);
        var objP = document.createElement("p");

        // cria um elemento de tex
        objP.appendChild(objTitulo);
        objDiv.appendChild(objP);

    });
}


function adicionarNovoRegistro() 
{
    if (objInputTitulo.value.length > 0)
    {

        var objNovoRegistro = new Registro();
        objNovoRegistro.nm_titulo = objInputTitulo.value;
        objNovoRegistro.ds_conteudo = "Outro exemplo de conteudo!";

        // apaga o conteudo do titulo ...
        objInputTitulo.value = "";

        salvarRegistro(objNovoRegistro, function (err, value)
        {
            console.log("Salvo com sucesso!");

            // Vamos atualizar a lista novamente..
            buscarRegistros();

        });
    }
    else
    {
        alert("Digite algo para adicionar!");
    }
}

function apagarRegistro()
{
    if (objInputRegistro.value.length > 0)
    {
        deletarRegistro(parseInt(objInputRegistro.value), function (err, value)
        {
            // Vamos limpar o campo para facilitar a inserção novamente ...
            objInputRegistro.value = ""; 
            // ... e atualizar a lista novamente..
            buscarRegistros();

        });
    }
    else
    {
        alert("Digite o ID para apagar!");
    }
}

window.onload = function () 
{
    objDiv = document.getElementById("minha-div");
    objInputRegistro = document.getElementById("registro");
    objInputTitulo = document.getElementById("titulo");

    // Vamos buscar os registros no banco de dados ...
    buscarRegistros();

    // Vamos adicionar os eventos nos botões..
    document.getElementById("adicionar-registro").addEventListener("click", adicionarNovoRegistro);
    document.getElementById("apagar-registro").addEventListener("click", apagarRegistro);

};