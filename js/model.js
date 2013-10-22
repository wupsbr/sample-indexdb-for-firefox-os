
var dbName = "MeuDatabase";
var dbVersion = 1;

var db;
var request = indexedDB.open(dbName, dbVersion);

request.onerror = function (event) {
    console.error("Can't open indexedDB!!!", event);
};
request.onsuccess = function (event) {
    console.log("Database opened ok");
    db = event.target.result;
};

request.onupgradeneeded = function (event) {

    console.log("Running onUpgradeNeeded");

    db = event.target.result;

    if (!db.objectStoreNames.contains("MinhaTabela")) {

        console.log("Creating objectStore for MinhaTabela");

        var objectStore = db.createObjectStore("MinhaTabela", {
            keyPath: "id",
            autoIncrement: true
        });
        objectStore.createIndex("nm_titulo", "nm_titulo", {
            unique: false
        });

        console.log("Adding sample memo");
        var objNovoRegistro = new Registro();
        objNovoRegistro.nm_titulo = "Bem Vindo!";
        objNovoRegistro.ds_conteudo = "Exemplo de conteudo!";

        objectStore.add(objNovoRegistro);
    }
};

/**
 * Função Registro para criar novos registros no banco de dados
 * @constructor
 */

function Registro() {
    this.nm_titulo = "Titulo de Exemplo";
    this.ds_conteudo = "Conteudo de Exemplo";
    this.dt_created = Date.now();
    this.dt_modified = Date.now();
}

/**
 * Esta função irá carregar todos os registros e chamar o Callback 
 * para cada um dos registros carregados.
 * @param inCallback
 */
function listarRegistros(inCallback) {
    var objectStore = db.transaction("MinhaTabela").objectStore("MinhaTabela");
    console.log("Carregando registros...");

    objectStore.openCursor().onsuccess = function (event) {
        var cursor = event.target.result;
        if (cursor) {
            console.log("Registro encontrado #" + cursor.value.id + " - " + cursor.value.nm_titulo);
            inCallback(null, cursor.value);
            cursor.continue();
        }
    };
}

/**
 * Esta função é utilizada para saber um registro dentro do database indexedDB.
 * @param objRegistro
 * @param inCallback
 */
function salvarRegistro(objRegistro, inCallback) {
    var transaction = db.transaction(["MinhaTabela"], "readwrite");
    console.log("Salvando registro...");

    transaction.oncomplete = function (event) {
        console.log("Tudo certo!");
    };

    transaction.onerror = function (event) {
        console.error("Erro ao salvar o registro:", event);
        inCallback({
            error: event
        }, null);

    };

    var objectStore = transaction.objectStore("MinhaTabela");

    objRegistro.modified = Date.now();

    var request = objectStore.put(objRegistro);
    request.onsuccess = function (event) {
        console.log("Registro salvo com o id: " + request.result);
        inCallback(null, request.result);

    };
}

/**
 * Função para deletar um registro do database.
 * @param inId
 * @param inCallback
 */
function deletarRegistro(inId, inCallback) {
    console.log("Deletando registro com o ID " + inId + "...");
    var request = db.transaction(["MinhaTabela"], "readwrite").objectStore("MinhaTabela").delete(inId);

    request.onsuccess = function (event) {
        console.log("Registro deletado!");
        inCallback();
    };
}
