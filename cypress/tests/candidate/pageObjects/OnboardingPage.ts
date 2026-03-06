/// <reference types="cypress" />

export class OnboardingPage {
  assertDialogVisible() {
    cy.getBySel('user-onboarding-dialog').should('be.visible');
    cy.getBySel('list-skeleton').should('not.exist');
    cy.getBySel('nav-top-notifications-count').should('exist');
  }

  nextStep() {
    cy.getBySel('user-onboarding-next').click();
  }

  assertBankAccountStep() {
    cy.getBySel('user-onboarding-dialog-title').should('contain', 'Create Bank Account');
  }

  createBankAccount(bankName: string) {
    cy.intercept('POST', '**graphql**', (req) => {
      if (req.body.operationName === 'CreateBankAccount') req.alias = 'gqlCreateBankAccountMutation';
    });
    
    cy.getBySelLike('bankName-input').type(bankName);
    cy.getBySelLike('accountNumber-input').type('123456789');
    cy.getBySelLike('routingNumber-input').type('987654321');
    cy.getBySelLike('submit').click();
    cy.wait('@gqlCreateBankAccountMutation');
  }

  assertFinished() {
    cy.getBySel('user-onboarding-dialog-title').should('contain', 'Finished');
    cy.getBySel('user-onboarding-dialog-content').should('contain', "You're all set!");
  }

  complete() {
    cy.getBySel('user-onboarding-next').click();
  }

  assertTransactionList() {
    cy.getBySel('transaction-list').should('be.visible');
  }
}
