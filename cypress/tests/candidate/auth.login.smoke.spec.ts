/// <reference types="cypress" />
import { LoginPage } from './pageObjects/LoginPage';

describe('Auth @smoke', () => {
    const loginPage = new LoginPage();


    beforeEach(function () {
        cy.task("db:seed");
        cy.intercept('POST', '/login').as('loginUser');
    });


    it('login inválido', () => {
        cy.fixture('users.json').then((users: any) => {
            loginPage.login(users.invalid.username, users.invalid.password);
            loginPage.assertLoginError();
        });
    });

    it('login válido', () => {
        cy.fixture('users.json').then((users: any) => {
            cy.database("find", "users").then((user: User) => {
                cy.login(user.username, "s3cret", { rememberUser: true });
                loginPage.assertLoginSucessAndDashboardVisible(user.username);
            });
        });
    });
});
