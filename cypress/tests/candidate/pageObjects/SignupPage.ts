/// <reference types="cypress" />

export class SignupPage {
  visit() {
    cy.visit('/');
    cy.getBySel('signup').click();
  }

  signup(user: { firstName: string; lastName: string; username: string; password: string }) {
    cy.getBySel('signup-first-name').type(user.firstName);
    cy.getBySel('signup-last-name').type(user.lastName);
    cy.getBySel('signup-username').type(user.username);
    cy.getBySel('signup-password').type(user.password);
    cy.getBySel('signup-confirmPassword').type(user.password);
    cy.getBySel('signup-submit').click();
    cy.wait('@signup');
  }

  assertSignupTitle() {
    cy.getBySel('signup-title').should('be.visible').and('contain', 'Sign Up');
  }
}
