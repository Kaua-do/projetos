import { criarModeloErro, identificarErroDeRede } from "./erro.js"

function traduzirErro(erro, tipo) {
    if (erro.padronizado) {
        return erro
    }

    const erroDeRede = identificarErroDeRede(erro)

    if (erroDeRede) {
        return criarModeloErro('Erro de conexão', 'rede', 'falha_conexao')
    }

    switch (tipo) {

        case 'api':

            switch (erro.code) {

                case '42501': 
                    return criarModeloErro('Permissão', 'api', 'permissao')

                case '23505': 
                    return criarModeloErro('Duplicata', 'api', 'duplicada')

                case '23503': 
                    return criarModeloErro('Relação', 'api', 'relacao')

                case '23502':
                    return criarModeloErro('Campo obrigatório', 'api', 'campo_obrigatorio') 

                case '23514': 
                    return criarModeloErro('Violação de regra CHECK', 'api', 'violacao_de_regra_check')

                case '404':
                    return criarModeloErro('Tabela inexistente', 'api', 'tabela_inexistente') 

                case '42703':
                    return criarModeloErro('Coluna inexistente', 'api', 'coluna_inexistente') 

                case 'PGRST205':
                    return criarModeloErro('Tabela inexistente', 'api', 'tabela_inexistente') 

                case 'PGRST116':
                    return criarModeloErro('Resultado inválido', 'api', 'resultado_invalido') 

                default:
                    return criarModeloErro('Erro desconhecido', 'api', 'desconhecido')  
            }

        case 'auth': 
                
            switch (erro.code) {

                case 'invalid_credentials':
                    return criarModeloErro('Credenciais incorretas', 'auth', 'email_ou_senha_incorretos')
                
                case 'email_exists':
                    return criarModeloErro('Email já cadastrado', 'auth', 'email_já_cadastrado') 

                case 'email_not_confirmed':
                    return criarModeloErro('Email não confirmado', 'auth', 'email_ainda_não_confirmado') 

                case 'weak_password':
                    return criarModeloErro('Senha inválida', 'auth', 'senha_não_atende_aos_requisitos') 

                case 'validation_failed':
                    return criarModeloErro('Dados enviados inválidos', 'auth', 'dados_enviados_inválidos') 

                case 'too_many_requests':
                    return criarModeloErro('Muitas tentativas', 'auth', 'muitas_tentativas') 

                case 'unexpected_failure':
                    return criarModeloErro('Falha inesperada no auth', 'auth', 'falha_inesperada_no_auth') 

                default:
                    return criarModeloErro('Desconhecido', 'auth', 'desconhecido') 
            }

        default:
            return criarModeloErro('Desconhecido', 'desconhecido', 'desconhecido') 
    }
}

function tratarErro(erro) {

    console.error(erro)

    switch (erro.tipo) {

        case 'rede':

            switch (erro.codigo) {

                case 'falha_conexao':
                    return 'Não foi possível conectar ao servidor.'
                    

                default:
                    return 'Não foi possível se comunicar com o servidor.'
                
            }

        case 'api':

            switch (erro.codigo) {

                case 'permissao': 
                    return 'Você não tem permissão para realizar esta operação.'
                

                case 'duplicada':
                    return 'Esse registro já existe.'
                

                case 'relacao': 
                    return 'Não foi possível concluir a operação porque os dados relacionados são inválidos.'
                

                case 'campo_obrigatorio': 
                    return 'Este campo não pode estar vazio.'
                

                case 'tabela_inexistente': 
                    return 'O servidor não encontrou a estrutura de dados necessária.'
                

                case 'coluna_inexistente': 
                    return 'O servidor não encontrou a estrutura de dados necessária.'
                

                case 'resultado_invalido': 
                    return 'Resposta da API não corresponde ao resultado esperado.'
                     

                default: 
                    return 'Ocorreu um erro no servidor.'
                
            }

        case 'validacao':

            switch (erro.codigo) {

                case 'titulo_vazio': 
                    return 'O título não pode estar vazio.'
                

                case 'limite_caracteres':
                    return 'Esse campo só pode ter até 20 caracteres.'
                

                case 'minimo_caracteres':
                    return 'Esse campo deve ter no mínimo 3 caracteres.'
                

                case 'limite_caracteres_texto':
                    return 'O texto só pode ter até 200 caracteres.'
                

                default: 
                    return 'Dados inválidos.'
                    
            }

        case 'auth': 
            
            switch (erro.codigo) {
                
                case 'email_ou_senha_incorretos': 
                    return 'Email ou senha incorretos.'
                

                case 'email_já_cadastrado': 
                    return 'Email já cadastrado.'
                

                case 'email_ainda_não_confirmado': 
                    return 'Email ainda não confirmado.'
                

                case 'senha_não_atende_aos_requisitos': 
                    return 'Senha não atende aos requisitos.'
                

                case 'dados_enviados_inválidos': 
                    return 'Email ou senha inválidos.'
                

                case 'muitas_tentativas': 
                    return 'Muitas tentativas.'
                

                case 'falha_inesperada_no_auth': 
                    return 'Ocorreu um erro de autenticação.'
                

                default:
                    return 'Ocorreu um erro de autenticação.'
                
            }

        default:
            return 'Erro desconhecido.'
        
    }
}

export {traduzirErro, tratarErro}