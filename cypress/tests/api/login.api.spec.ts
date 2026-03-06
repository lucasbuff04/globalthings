describe('API Tests - Challenge', function () {
    const username = 'Heath93';
    const password = 's3cret';

    beforeEach(function () {
        cy.task("db:seed");

        cy.intercept('POST', 'http://localhost:3001/login').as('loginUser');
        cy.intercept('GET', 'http://localhost:3001/checkAuth').as('userProfile');
    });

    context('POST /login', function () {
        it('loga usuário criado', function () {
            cy.request({
                method: 'POST',
                url: 'http://localhost:3001/login',
                body: { username, password }
            }).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.user.username).to.eq(username);
            });
        });
    });

    context('GET /checkAuth', function () {
        it('valida perfil após login', function () {
            cy.request({
                method: 'POST',
                url: 'http://localhost:3001/login',
                body: { username, password }
            });
            cy.request('http://localhost:3001/checkAuth').then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.user.username).to.eq(username);
            });
        });
    });
});
