const faker = require('faker');

const driverEmail = faker.internet.email();
const driverFirstName = faker.name.firstName();
const driverLastName = faker.name.lastName();
const riderEmail = faker.internet.email();
const riderFirstName = faker.name.firstName();
const riderLastName = faker.name.lastName();
const addressA = faker.address.streetAddress();
const addressB = faker.address.streetAddress();

describe('Trips', function () {
  before(function() {
    cy.addUser(riderEmail, riderFirstName, riderLastName, 'rider');
    cy.addUser(driverEmail, driverFirstName, driverLastName, 'driver');
  })

  it('Can receive trip status updates', function () {
    cy.intercept('trip').as('getTrips');

    cy.logIn(riderEmail);
    cy.visit('/#/rider/request');
    cy.get('[data-cy=pick-up-address]').type(addressA);
    cy.get('[data-cy=drop-off-address]').type(addressB);
    cy.get('[data-cy=submit]').click();
    cy.wait('@getTrips');
    cy.hash().should('eq', '#/rider');
    cy.get('button').contains('Log out').click();

    cy.logIn(driverEmail);
    cy.visit('/#/driver');
    cy.hash().should('eq', '#/driver');
    cy.get('h5')
      .contains(riderFirstName)
      .parent()
      .find('a')
      .contains('Detail')
      .click();
    cy.get('div.card-footer > button').click();
    cy.get('button').contains('Log out').click();

    cy.logIn(riderEmail);
    cy.visit('/#/rider');
    cy.get('[data-cy=trip-card]')
      .eq(0)
      .contains('STARTED');
  });
});
