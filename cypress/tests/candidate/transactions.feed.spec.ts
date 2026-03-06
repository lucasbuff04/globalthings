/// <reference types="cypress" />

describe('Transactions @regression', () => {

  beforeEach(() => {
    cy.task("db:seed");
    cy.intercept('POST', '/transactions').as('createTransaction');
  });

  it('envia pagamento e valida no feed', () => {
    cy.fixture('users.json').then((data: any) => {
      const recipient = data.invalid.username;
      const min = 40, max = 200;
      const amount = (Math.floor(Math.random() * (max - min + 1)) + min).toFixed(2);
      const note = `QA Payment ${Date.now()}`;

      cy.database("find", "users").then((user: User) => {
        cy.login(user.username, "s3cret", { rememberUser: true });
      });
  
      cy.visit('/');

      cy.sendPayment(recipient, amount, note);

      cy.wait('@createTransaction').then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
      });

      cy.getBySel('new-transaction-return-to-transactions').click();
      cy.getBySel('nav-personal-tab').click();

      // Valida amount ALEATÓRIO + note
      cy.getBySelLike('transaction-amount').contains(`$${amount}`).should('be.visible');
      cy.contains(note).should('be.visible');
    });
  });

});
