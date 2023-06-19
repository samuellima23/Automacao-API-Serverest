
describe('Criação de usuário', () => {
    let userId
    
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
  
    it('Verificar se o usuário foi criado usando GET de todos os usuários', () => {
      cy.api('GET', 'https://serverest.dev/usuarios')
        .then((response) => {
            if (response.status === 200) {
                const usuarios = response.body.usuarios
                const usuarioEncontrado = usuarios.find((usuario) => usuario.nome === 'Usuário de Teste')
                expect(usuarioEncontrado).to.have.property('nome', 'Usuário de Teste')
                expect(usuarioEncontrado).to.have.property('email', 'teste@example.com')
              } else {
                expect(response.body).to.have.property('message', 'Usuário não encontrado')
              }
        })
    })

    it('Verificar se o usuário foi criado passando o id', () => {
        cy.api({
          method: 'GET',
          url: `https://serverest.dev/usuarios/${userId}`
        }).then((response) => {
          if (response.status === 200) {
            const usuario = response.body
            expect(usuario).to.have.property('nome', 'Usuário de Teste')
            expect(usuario).to.have.property('email', 'teste@example.com')
          } else {
            expect(response.body).to.have.property('message', 'Usuário não encontrado')
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