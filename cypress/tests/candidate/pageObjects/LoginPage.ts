/// <reference types="cypress" />

export class LoginPage {
    login(username: string, password: string) {
        cy.login(username, password);
    }

    assertLoginSucessAndDashboardVisible(username: string) {
        cy.getBySel('sidenav-username').should('contain', username);
        cy.getBySel('nav-top-notifications-link').should('be.visible');
    }

    assertLoginError() {
        cy.getBySel("signin-error")
            .should("be.visible")
            .and("have.text", "Username or password is invalid");
    }
}