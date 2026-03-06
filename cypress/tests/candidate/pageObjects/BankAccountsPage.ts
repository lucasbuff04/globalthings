/// <reference types="cypress" />

export class BankAccountsPage {
  visit() {
    cy.visit('/bankaccounts');
  }

  createAccount(name: string) {
    cy.createBankAccount(name);
  }

  deleteAccount(name: string) {
    cy.deleteBankAccount(name);
  }

  assertAccountVisible(name: string) {
    cy.getBySelLike('bankaccount-list-item').should('contain', name);
  }

  assertAccountNotVisible(name: string) {
    cy.getBySelLike('bankaccount-list-item').contains(name).should('not.exist');
  }
}