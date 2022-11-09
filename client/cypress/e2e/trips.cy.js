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
  before(function () {
    cy.addUser(riderEmail, riderFirstName, riderLastName, 'rider');
    cy.addUser(driverEmail, driverFirstName, driverLastName, 'driver');
  });

  it('Can receive trip status updates', function () {
    cy.intercept('trip').as('getTrips');

    cy.logIn(riderEmail);
    cy.get('[data-cy=request-trip]').click();
    cy.get('[data-cy=pick-up-address]').type(addressA);
    cy.get('[data-cy=drop-off-address]').type(addressB);
    cy.get('[data-cy=submit]').click();
    cy.wait('@getTrips');
    cy.hash().should('eq', '#/rider');
    cy.contains('button', 'Log out').click();

    cy.logIn(driverEmail);
    cy.get('[data-cy=dashboard]').click();
    cy.wait('@getTrips');
    cy.contains('h5', riderFirstName)
      .parent()
      .parent()
      .parent()
      .find('a')
      .contains('Detail')
      .click();
    cy.get('div.card-footer > div > button').click();
    cy.contains('button', 'Log out').click();

    cy.logIn(riderEmail);
    cy.get('[data-cy=dashboard]').click();
    cy.wait('@getTrips');
    cy.get('[data-cy=trip-card]')
      .eq(0)
      .contains('STARTED');
  });
});
