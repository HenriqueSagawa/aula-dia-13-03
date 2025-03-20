function buscarCNPJ() {
    let cnpj = document.getElementById('cnpj').value;
    const resultadoDiv = document.getElementById('resultado');

    cnpj = cnpj.replace(/\D/g, ""); 

    if (cnpj.length !== 14) {
        resultadoDiv.innerHTML = `<p style="color: red;">Digite um CNPJ válido, você digitou ${cnpj.length} números. Deve contem 14 números</p>`;
        return;
    }

    const url = `https://cors-anywhere.herokuapp.com/https://receitaws.com.br/v1/cnpj/${cnpj}`;
    setLoader(true);
    
    fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    })
    .then(response => {
        if (!response.ok) {
            if (response.status === 429) {
                throw new Error('Muitas requisições realizadas. Por favor, aguarde alguns minutos e tente novamente.');
            } else if (response.status === 403) {
                throw new Error('Acesso negado. Verifique suas permissões ou tente novamente mais tarde.');
            } else if (response.status === 404) {
                throw new Error('CNPJ não encontrado na base de dados.');
            } else if (response.status === 500) {
                throw new Error('Erro interno do servidor. Tente novamente mais tarde.');
            } else {
                throw new Error(`Erro na requisição: ${response.status}`);
            }
        }
        return response.json();
    })
    .then(data => {
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

            if (!resultadoDiv) {
                console.error("Erro: resultadoDiv não encontrado!");
                return;
            }

            resultadoDiv.innerHTML = temp;
            setLoader(false);
        }
    })
    .catch(error => {
        setLoader(false);
        resultadoDiv.innerHTML = `<p style="color: red;">${error.message}</p>`;
    })
}

function setLoader(e) {
    const loader = document.querySelector("#loader");

    if (e) {
        loader.classList.add('active');
    } else {
        loader.classList.remove("active");
    }
}