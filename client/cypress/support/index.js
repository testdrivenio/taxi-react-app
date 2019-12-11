import 'cypress-file-upload';

const loadUserData = () => {
  cy.fixture('data/users.json').then((users) => {
    cy.task('tableInsert', {
      table: 'trips_user', rows: users, truncate: true
    })
  });
  cy.fixture('data/groups.json').then((groups) => {
    cy.task('tableInsert', {
      table: 'auth_group', rows: groups, truncate: true
    })
  });
  cy.fixture('data/user_groups.json').then((groups) => {
    cy.task('tableInsert', {
      table: 'trips_user_groups', rows: groups, truncate: true
    })
  });
}

Cypress.Commands.add('loadUserData', loadUserData);

const loadTripData = () => {
  cy.fixture('data/trips.json').then((trips) => {
    cy.task('tableInsert', {
      table: 'trips_trip', rows: trips, truncate: true
    });
  });
};

Cypress.Commands.add('loadTripData', loadTripData);
