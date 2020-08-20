const faker = require('faker');

const email = faker.internet.email();
const firstName = faker.name.firstName();
const lastName = faker.name.lastName();

describe('Authentication', function () {
  it('Can sign up.', function () {
    cy.addUser(email, firstName, lastName, 'rider');
  });

  it('Cannot visit the sign up page when logged in.', function () {
    cy.logIn(email);  // changed
    cy.visit('/#/sign-up');
    cy.hash().should('eq', '#/');
  });

  it('Can log out.', function () {
    cy.logIn(email);  // changed
    cy.get('button').contains('Log out').click().should(() => {
      expect(window.localStorage.getItem('taxi.auth')).to.be.null;
    });
    cy.get('button').contains('Log out').should('not.exist');
  });

  it('Show invalid fields on sign up error.', function () {
    cy.server();
    cy.route({
      method: 'POST',
      url: '**/api/sign_up/**',
      status: 400,
      response: {
        'username': [
          'A user with that username already exists.'
        ]
      }
    }).as('signUp');
    cy.visit('/#/sign-up');
    cy.get('input#username').type(email);
    cy.get('input#firstName').type('Gary');
    cy.get('input#lastName').type('Cole');
    cy.get('input#password').type('pAssw0rd', { log: false });
    cy.get('select#group').select('driver');

    // Handle file upload
    cy.get('input#photo').attachFile('images/photo.jpg');
    cy.get('button').contains('Sign up').click();
    cy.wait('@signUp');
    cy.get('div.invalid-feedback').contains(
      'A user with that username already exists'
    );
    cy.hash().should('eq', '#/sign-up');
  });

  it('Can log in.', function () {
    cy.logIn(email);  // changed
    cy.hash().should('eq', '#/');
    cy.get('button').contains('Log out');
  });

  it('Cannot visit the login page when logged in.', function () {
    cy.logIn(email);  // changed
    cy.visit('/#/log-in');
    cy.hash().should('eq', '#/');
  });

  it('Cannot see links when logged in.', function () {
    cy.logIn(email);  // changed
    cy.get('button#signUp').should('not.exist');
    cy.get('button#logIn').should('not.exist');
  });

  it('Shows an alert on login error.', function () {
    cy.server();
    cy.route({
      method: 'POST',
      url: '**/api/log_in/**',
      status: 400,
      response: {
        '__all__': [
          'Please enter a correct username and password. ' +
          'Note that both fields may be case-sensitive.'
        ]
      }
    }).as('logIn');
    cy.visit('/#/log-in');
    cy.get('input#username').type(email);
    cy.get('input#password').type('pAssw0rd', { log: false });
    cy.get('button').contains('Log in').click();
    cy.wait('@logIn');
    cy.get('div.alert').contains(
      'Please enter a correct username and password. ' +
      'Note that both fields may be case-sensitive.'
    );
    cy.hash().should('eq', '#/log-in');
  });
});
