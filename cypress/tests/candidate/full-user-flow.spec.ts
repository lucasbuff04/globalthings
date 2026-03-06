/// <reference types="cypress" />
import { SignupPage } from './pageObjects/SignupPage';
import { OnboardingPage } from './pageObjects/OnboardingPage';
import { AuthPage } from './pageObjects/AuthPage';

describe('Fluxo completo do usuário @regression', () => {
  const signupPage = new SignupPage();
  const onboardingPage = new OnboardingPage();
  const authPage = new AuthPage();

  beforeEach(() => {
    cy.task("db:seed");

    cy.intercept('POST', '/users').as('signup');
    cy.intercept('POST', '**graphql**', (req) => {
      if (req.body.operationName === 'CreateBankAccount') req.alias = 'gqlCreateBankAccountMutation';
    });
  });

  it('deve permitir signup, login, onboarding e logout', () => {
    cy.fixture('newUsers.json').then((data: any) => {
      // GERAR USUÁRIO ALEATÓRIO
      const template = data.templates[Math.floor(Math.random() * data.templates.length)];
      const user = {
        firstName: template.firstName,
        lastName: template.lastName[Math.floor(Math.random() * template.lastName.length)],
        username: `${template.usernamePrefix}${Date.now()}`,
        password: template.password
      };

      const bankName = data.banks.name[Math.floor(Math.random() * data.banks.name.length)];

      // SIGNUP
      signupPage.visit();
      signupPage.assertSignupTitle();
      signupPage.signup(user);

      // LOGIN
      authPage.login(user.username, user.password);

      // ONBOARDING
      onboardingPage.assertDialogVisible();
      onboardingPage.nextStep();

      onboardingPage.assertBankAccountStep();
      onboardingPage.createBankAccount(bankName);

      onboardingPage.assertFinished();
      onboardingPage.complete();

      onboardingPage.assertTransactionList();

      // LOGOUT
      authPage.logout();
    });
  });
});
