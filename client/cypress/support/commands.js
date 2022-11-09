// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

const addUser = (email, firstName, lastName, userType) => {
  cy.intercept('POST', 'sign_up').as('signUp');

  cy.visit('/#/sign-up');
  cy.get('input#username').type(email);
  cy.get('input#firstName').type(firstName);
  cy.get('input#lastName').type(lastName);
  cy.get('input#password').type('pAssw0rd', { log: false });
  cy.get('select#group').select(userType);

  // Handle file upload
  cy.get('input#photo').attachFile('images/photo.jpg');

  cy.get('button').contains('Sign up').click();
  cy.wait('@signUp');
  cy.hash().should('eq', '#/log-in');
};

const logIn = (email) => {
  cy.intercept('POST', 'log_in').as('logIn');

  // Log into the app.
  cy.visit('/#/log-in');
  cy.get('input#username').type(email);
  cy.get('input#password').type('pAssw0rd', { log: false });
  cy.get('button').contains('Log in').click();
  cy.wait('@logIn');
};

Cypress.Commands.add('addUser', addUser);
Cypress.Commands.add('logIn', logIn);
