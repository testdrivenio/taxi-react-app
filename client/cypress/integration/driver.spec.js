import { webSocket } from 'rxjs/webSocket';

const logIn = () => {
  const { username, password } = Cypress.env('driver');
  cy.server();
  cy.route('POST', '**/api/log_in/').as('logIn');
  cy.visit('/#/log-in');
  cy.get('input#username').type(username);
  cy.get('input#password').type(password, { log: false });
  cy.get('button').contains('Log in').click();
  cy.wait('@logIn');
};

describe('The driver dashboard', function () {
  before(function () {
    cy.loadUserData();
  });

  it('Cannot be visited if the user is not a driver', function () {
    const { username, password } = Cypress.env('rider')

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

    cy.visit('/#/driver')
    cy.hash().should('eq', '#/')
  })

  it('Can be visited if the user is a driver', function () {
    logIn();
    cy.visit('/#/driver');
    cy.hash().should('eq', '#/driver');
  })

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
  
      cy.visit('/#/driver');
      cy.wait('@getTrips');
  
      // Current trips.
      cy.get('[data-cy=trip-card]')
        .eq(0)
        .contains('No trips.');
  
      // Requested trips.
      cy.get('[data-cy=trip-card]')
        .eq(1)
        .contains('No trips.');
  
      // Completed trips.
      cy.get('[data-cy=trip-card]')
        .eq(2)
        .contains('No trips.');
    });

    it('Can receive a ride request', function () {
      cy.server();
      cy.route('GET', '**/api/trip/').as('getTrips');
    
      logIn();
    
      cy.visit('/#/driver');
      cy.wait('@getTrips');
    
      // Requested trips.
      cy.get('[data-cy=trip-card]')
        .eq(1)
        .contains('No trips.');
    
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
          type: 'create.trip',
          data: {
            pick_up_address: '123 Main Street',
            drop_off_address: '456 Elm Street',
            rider: 2
          }
        });
      });
    
      // Requested trips.
      cy.get('[data-cy=trip-card]')
        .eq(1)
        .contains('REQUESTED');
    });
  });

  context('When there are trips', function () {
    before(function () {
      cy.loadTripData();
    });
  
    it('Displays current, requested, and completed trips', function () {
      cy.server();
      cy.route('GET', '**/api/trip/').as('getTrips');
  
      logIn();
  
      cy.visit('/#/driver');
      cy.wait('@getTrips');
  
      // Current trips.
      cy.get('[data-cy=trip-card]')
        .eq(0)
        .contains('STARTED');
  
      // Requested trips.
      cy.get('[data-cy=trip-card]')
        .eq(1)
        .contains('REQUESTED');
  
      // Completed trips.
      cy.get('[data-cy=trip-card]')
        .eq(2)
        .contains('COMPLETED');
    });

    it('Shows details about a trip', () => {
      const tripId = '676cb20b-d51d-44b5-951a-3e3c72a42668';
    
      cy.server();
      cy.route('GET', '**/api/trip/*/').as('getTrip');
    
      logIn();
    
      cy.visit(`/#/driver/${tripId}`);
      cy.wait('@getTrip');
    
      cy.get('[data-cy=trip-card]')
        .should('have.length', 1)
        .and('contain.text', 'Hugh Wells')
        .and('contain.text', 'STARTED');
    });

    it('Can update a trip', function () {
      const tripId = '676cb20b-d51d-44b5-951a-3e3c72a42668';
    
      cy.server();
      cy.route('GET', '**/api/trip/*/').as('getTrip');
    
      logIn();
    
      cy.visit(`/#/driver/${tripId}`);
      cy.wait('@getTrip');
    
      cy.get('[data-cy=trip-card]')
        .should('have.length', 1)
        .and('contain.text', 'Hugh Wells')
        .and('contain.text', 'STARTED');
    
      cy.get('[data-cy=status-button]').click();
    
      cy.get('[data-cy=trip-card]')
        .should('have.length', 1)
        .and('contain.text', 'Hugh Wells')
        .and('contain.text', 'IN_PROGRESS');
    });
  });
})