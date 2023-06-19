
describe('Criação de produto', () => {
    let produtoId
    let userId
    let authToken;

    it('Cadastrando um novo usuário',() => {
        cy.api('POST', 'https://serverest.dev/usuarios', {
          nome: 'Usuário de Teste',
          email: 'teste@example.com',
          password: 'senha123',
          administrador: 'true'
        }).then((response)=>{
          expect(response.status).to.eq(201)
          expect(response.body).to.have.property('_id')
          userId = response.body._id
        });
      });

    it('Enviar email e senha no login',() => {
        cy.api({
            method: 'POST',
            url: 'https://serverest.dev/login', // URL da API
            failOnStatusCode: false,
            headers: {
              'Content-Type': 'application/json', // Tipo de conteúdo do corpo da requisição
            },
            body: {
              email: 'teste@example.com',
              password: 'senha123',
            } // Corpo da requisição
          }).then((responseLogin) => {
            // Verifique se a resposta de login é bem-sucedida
            authToken = responseLogin.body.authorization;
            expect(responseLogin.status).to.equal(200);
            expect(responseLogin.body).to.have.property('authorization',authToken)
          });
        });

    it('Cadastrando um novo produto',() => {
      cy.api({
        method: 'POST',
        url: 'https://serverest.dev/produtos',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': authToken
        },  
        body:{
            nome: 'Produto de Teste',
            preco: 1,
            descricao: 'teste',
            quantidade: 1,
        },
      }).then((response)=>{
        expect(response.status).to.eq(201)
        expect(response.body).to.have.property('_id')
        produtoId = response.body._id
      });
    });
  
    it('Verificar se o produto foi criado usando GET de todos os produtos', () => {
      cy.api('GET', 'https://serverest.dev/produtos')
        .then((response) => {
            if (response.status === 200) {
                const produtos = response.body.produtos
                const produtoEncontrado = produtos.find((produto) => produto.nome === 'Produto de Teste')
                expect(produtoEncontrado).to.have.property('nome', 'Produto de Teste')
                expect(produtoEncontrado).to.have.property('preco', 1)
              } else {
                expect(response.body).to.have.property('message', 'Produto não encontrado')
              }
        })
    })

    it('Verificar se o produto foi criado passando o id', () => {
        cy.api({
          method: 'GET',
          url: `https://serverest.dev/produtos/${produtoId}`
        }).then((response) => {
          if (response.status === 200) {
            const produto = response.body
            expect(produto).to.have.property('nome', 'Produto de Teste')
            expect(produto).to.have.property('preco', 1)
          } else {
            expect(response.body).to.have.property('message', 'Produto não encontrado')
          }
        })
      })

    it('Deletar o produto passando o id', () => {
        cy.api({
          method: 'DELETE',
          url: `https://serverest.dev/produtos/${produtoId}`,
          headers: {
            'Authorization': authToken
        }
        }).then((response) => {
          if (response.status === 200) {
            const produto = response.body
            expect(response.status).to.eq(200)
            expect(response.body).to.have.property('message', 'Registro excluído com sucesso')
          } else {
            expect(response.body).to.have.property('message', 'Nenhum registro excluído')
          }
        })
      })

      it('Deletar o usuário passando o id', () => {
        cy.api({
          method: 'DELETE',
          url: `https://serverest.dev/usuarios/${userId}`
        }).then((response) => {
          if (response.status === 200) {
            expect(response.status).to.eq(200)
            expect(response.body).to.have.property('message', 'Registro excluído com sucesso')
          } else {
            expect(response.body).to.have.property('message', 'Nenhum registro excluído')
          }
        })
      })
  })