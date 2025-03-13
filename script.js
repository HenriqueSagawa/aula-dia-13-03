function buscarCNPJ() {
    let cnpj = document.getElementById('cnpj').value;
    const resultadoDiv = document.getElementById('resultado');

    console.log(resultadoDiv);

    cnpj = cnpj.replace(/\D/g, ""); 

    console.log(cnpj)

    if (cnpj.length !== 14) {
        resultadoDiv.innerHTML = `<p style="color: red;">Digite um CNPJ válido, você digitou ${cnpj.length} números</p>`;
        return;
    }

    const url = `https://cors-anywhere.herokuapp.com/https://receitaws.com.br/v1/cnpj/${cnpj}`;
    console.log("carregando...");

    fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log("terminou o fetch");

        console.log(data);
        
        if (data.status === "ERROR") {
            resultadoDiv.innerHTML = '<p style="color: red;">CNPJ não encontrado.</p>';
        } else {
            const temp = `
                <h3>Dados da Empresa</h3>
                <p><strong>Nome:</strong> ${data.nome}</p>
                <p><strong>Fantasia:</strong> ${data.fantasia}</p>
                <p><strong>Atividade Principal:</strong> ${data.atividade_principal[0].text}</p>
                <p><strong>Telefone:</strong> ${data.telefone}</p>
                <p><strong>Endereço:</strong> ${data.logradouro}, ${data.numero} - ${data.bairro}, ${data.municipio}/${data.uf}</p>
            `;
            console.log(temp);

            if (!resultadoDiv) {
                console.error("Erro: resultadoDiv não encontrado!");
                return;
            }

            console.log("Atualizando innerHTML...");
            resultadoDiv.innerHTML = temp;
            console.log("Atualizou");
        }
    }

)
    .catch(error => {
        resultadoDiv.innerHTML = `<p style="color: red;">Erro ao buscar CNPJ: ${error.message}</p>`;
    });
}
