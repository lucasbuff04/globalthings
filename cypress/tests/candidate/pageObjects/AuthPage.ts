/// <reference types="cypress" />

export class AuthPage {
  login(username: string, password: string) {
    cy.login(username, password);
  }

  logout() {
    if (Cypress.$('body').hasClass('MuiCssBaseline-root')) 
      cy.getBySel('sidenav-toggle').click();
    }
    cy.getBySel('sidenav-signout').click();
    cy.location('pathname').should('eq', '/signin');
  }
}
