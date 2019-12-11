import { webSocket } from 'rxjs/webSocket';

const logIn = () => {
  const { username, password } = Cypress.env('rider');
  cy.server();
  cy.route('POST', '**/api/log_in/').as('logIn');
  cy.visit('/#/log-in');
  cy.get('input#username').type(username);
  cy.get('input#password').type(password, { log: false });
  cy.get('button').contains('Log in').click();
  cy.wait('@logIn');
};

describe('The rider dashboard', function () {
  before(function () {
    cy.loadUserData();
  });

  it('Cannot be visited if the user is not a rider', function () {
    const { username, password } = Cypress.env('driver')

    // Capture API calls.
    cy.server()
    cy.route('POST', '**/api/log_in/').as('logIn')

    // Log in.
    cy.visit('/#/log-in')
    cy.get('input#username').type(username)
    cy.get('input#password').type(password, { log: false })
    cy.get('button').contains('Log in').click()
    cy.hash().should('eq', '#/')
    cy.get('button').contains('Log out')
    cy.wait('@logIn')

    cy.visit('/#/rider')
    cy.hash().should('eq', '#/')
  })

  it('Can be visited if the user is a rider', function () {
    logIn();
    cy.visit('/#/rider');
    cy.hash().should('eq', '#/rider');
  });

  context('When there are no trips', function () {
    before(function () {
      cy.task('tableTruncate', {
        table: 'trips_trip'
      });
    });
  
    it('Displays messages for no trips', function () {
      cy.server();
      cy.route('GET', '**/api/trip/').as('getTrips');
  
      logIn();
  
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
  });

  context('When there are trips', function () {
    before(function () {
      cy.loadTripData();
    });
  
    it('Displays current and completed trips', function () {
      cy.server();
      cy.route('GET', '**/api/trip/').as('getTrips');
  
      logIn();
  
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

    it('Shows details about a trip', () => {
      const tripId = '676cb20b-d51d-44b5-951a-3e3c72a42668';
    
      cy.server();
      cy.route('GET', '**/api/trip/*/').as('getTrip');
    
      logIn();
    
      cy.visit(`/#/rider/${tripId}`);
      cy.wait('@getTrip');
    
      cy.get('[data-cy=trip-card]')
        .should('have.length', 1)
        .and('contain.text', 'Gary Cole')
        .and('contain.text', 'STARTED');
    });

    it('Can request a new trip', function () {
      cy.server();
      cy.route('GET', '**/api/trip/').as('getTrips');
    
      logIn();
    
      cy.visit('/#/rider/request');
    
      cy.get('[data-cy=pick-up-address]').type('123 Main Street');
      cy.get('[data-cy=drop-off-address]').type('456 South Street');
      cy.get('[data-cy=submit]').click();
    
      cy.wait('@getTrips');
      cy.hash().should('eq', '#/rider');
    });

    it('Can receive trip status updates', function () {
      cy.server();
      cy.route('GET', '**/api/trip/').as('getTrips');
    
      logIn();
    
      cy.visit('/#/rider');
      cy.wait('@getTrips');
    
      // Current trips.
      cy.get('[data-cy=trip-card]')
        .eq(0)
        .contains('STARTED');
    
      // Make trip request as rider.
      cy.request({
        method: 'POST',
        url: '/api/log_in/',
        body: Cypress.env('rider')
      }).then((response) => {
        const token = response.body.access;
        const ws = webSocket(`ws://localhost:8080/taxi/?token=${token}`);
        ws.subscribe();
        ws.next({
          type: 'update.trip',
          data: {
            id: "676cb20b-d51d-44b5-951a-3e3c72a42668",
            pick_up_address: "231 Oak Ridge Ln",
            drop_off_address: "8746 Spring Hill Rd",
            status: "IN_PROGRESS",
            rider_id: 2,
            driver_id: 1
          }
        });
      });
    
      // Current trips.
      cy.get('[data-cy=trip-card]')
        .eq(0)
        .contains('IN_PROGRESS');
    });
  });
})