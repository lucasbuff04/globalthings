/// <reference types="cypress" />
import { LoginPage } from './pageObjects/LoginPage';

describe('Bank Accounts @regression', () => {

  beforeEach(() => {
    cy.task("db:seed");

    cy.intercept('POST', '**graphql**', (req) => {
      if (req.body.operationName === 'CreateBankAccount') req.alias = 'gqlCreateBankAccountMutation';
      if (req.body.operationName === 'DeleteBankAccount') req.alias = 'gqlDeleteBankAccountMutation';
    });
  });

  it('cria e remove conta bancária', () => {
    const accountName = `QA Bank ${Date.now()}`;

    cy.database("find", "users").then((user: User) => {
      cy.login(user.username, "s3cret", { rememberUser: true });
    });

    cy.visit('/bankaccounts');

    cy.createBankAccount(accountName);
    cy.wait('@gqlCreateBankAccountMutation').then((interception) => {
      expect(interception.response.statusCode).to.eq(200);
      expect(interception.response.body.data).to.have.property('createBankAccount');
    });
    cy.getBySelLike('bankaccount-list-item').should('contain', accountName);

    cy.deleteBankAccount(accountName);
  });
});
