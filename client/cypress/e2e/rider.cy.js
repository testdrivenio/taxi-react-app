const faker = require('faker');

const driverEmail = faker.internet.email();
const driverFirstName = faker.name.firstName();
const driverLastName = faker.name.lastName();
const riderEmail = faker.internet.email();
const riderFirstName = faker.name.firstName();
const riderLastName = faker.name.lastName();

const tripResponse = [
  {
    id: '23033964-f2ca-4150-bb8c-4a1182c3737d',
    created: '2020-08-18T21:41:08.112946Z',
    updated: '2020-08-18T21:41:08.112986Z',
    pick_up_address: 'A',
    drop_off_address: 'B',
    status: 'STARTED',
    driver: {
      id: 113,
      first_name: driverFirstName,
      last_name: driverLastName,
      photo: 'http://localhost:8003/media/photos/photo_QI0TTYh.jpg',
    },
    rider: {
      id: 112,
      first_name: riderFirstName,
      last_name: riderLastName,
      photo: 'http://localhost:8003/media/photos/photo_r3XrvgH.jpg',
    }
  },
  {
    id: '2ee84fb5-f3c4-4aff-9677-b6476156d3bf',
    created: '2020-08-18T21:41:08.112946Z',
    updated: '2020-08-18T21:41:08.112986Z',
    pick_up_address: 'A',
    drop_off_address: 'B',
    status: 'COMPLETED',
    driver: {
      id: 113,
      first_name: driverFirstName,
      last_name: driverLastName,
      photo: 'http://localhost:8003/media/photos/photo_QI0TTYh.jpg',
    },
    rider: {
      id: 112,
      first_name: riderFirstName,
      last_name: riderLastName,
      photo: 'http://localhost:8003/media/photos/photo_r3XrvgH.jpg',
    }
  }
];

describe('The rider dashboard', function () {
  before(function () {
    cy.addUser(riderEmail, riderFirstName, riderLastName, 'rider');
    cy.addUser(driverEmail, driverFirstName, driverLastName, 'driver');
  });

  it('Displays current and completed trips', function () {
    cy.intercept('trip', {
      statusCode: 200,
      body: tripResponse
    }).as('getTrips');
  
    cy.logIn(riderEmail);
  
    cy.visit('/#/rider');
    cy.wait('@getTrips');
  
    // Current trips.
    cy.get('[data-cy=trip-card]')
      .eq(0)
      .contains('STARTED');
  
    // Completed trips.
    cy.get('[data-cy=trip-card]')
      .eq(1)
      .contains('COMPLETED');
  });

  it('Cannot be visited if the user is not a rider', function () {
    cy.intercept('POST', 'log_in').as('logIn');

    cy.logIn(driverEmail);

    cy.visit('/#/rider');
    cy.hash().should('eq', '#/');
  });

  it('Can be visited if the user is a rider', function () {
    cy.intercept('POST', 'log_in').as('logIn');

    cy.logIn(riderEmail);

    cy.visit('/#/rider');
    cy.hash().should('eq', '#/rider');
  });

  it('Displays messages for no trips', function () {
    cy.intercept('trip', {
      statusCode: 200,
      body: []
    }).as('getTrips');
  
    cy.logIn(riderEmail);
  
    cy.visit('/#/rider');
    cy.wait('@getTrips');
  
    // Current trips.
    cy.get('[data-cy=trip-card]')
      .eq(0)
      .contains('No trips.');
  
    // Completed trips.
    cy.get('[data-cy=trip-card]')
      .eq(1)
      .contains('No trips.');
  });

  it('Shows details about a trip', () => {
    cy.intercept('/api/trip/*', {
      statusCode: 200,
      body: tripResponse[0]
    }).as('getTrip');
  
    cy.logIn(riderEmail);
  
    cy.visit(`/#/rider/${tripResponse[0].id}`);
    cy.wait('@getTrip');
  
    cy.get('[data-cy=trip-card]')
      .should('have.length', 1)
      .and('contain.text', 'STARTED');
  });

  it('Can request a new trip', function () {
    cy.intercept('trip').as('getTrips');
  
    cy.logIn(riderEmail);
  
    cy.visit('/#/rider/request');
  
    cy.get('[data-cy=pick-up-address]').type('123 Main Street');
    cy.get('[data-cy=drop-off-address]').type('456 South Street');
    cy.get('[data-cy=submit]').click();
  
    cy.wait('@getTrips');
    cy.hash().should('eq', '#/rider');
  });
});
