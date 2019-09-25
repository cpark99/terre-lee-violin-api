const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function makeUsersArray() {
  return [
    {
      id: 1,
      date_created: '2029-01-22T16:28:32.615Z',
      email: 'test@tester.com',
      password: 'password',
      name: 'tester',
      next_lesson: '1/20',
      amount_due: '20'
    },
    {
      id: 2,
      date_created: '2029-01-22T16:28:32.615Z',
      email: 'test2@tester.com',
      password: 'password',
      name: 'tester2',
      next_lesson: '2/20',
      amount_due: '30'
    },
    {
      id: 3,
      date_created: '2029-01-22T16:28:32.615Z',
      email: 'test3@tester.com',
      password: 'password',
      name: 'tester3',
      next_lesson: '3/20',
      amount_due: '40'
    },
    {
      id: 4,
      date_created: '2029-01-22T16:28:32.615Z',
      email: 'test4@tester.com',
      password: 'password',
      name: 'tester4',
      next_lesson: '4/20',
      amount_due: '50'
    }
  ];
}

function makeApplicationsArray() {
  return [
    {
      id: 1,
      date_created: '2029-01-22T16:28:32.615Z',
      email: 'test@tester.com',
      name: 'tester',
      phone: '8888888888',
      message: 'I love violin'
    },
    {
      id: 2,
      date_created: '2029-01-22T16:28:32.615Z',
      email: 'test2@tester.com',
      name: 'tester2',
      phone: '8888888888',
      message: 'I love violin'
    },
    {
      id: 3,
      date_created: '2029-01-22T16:28:32.615Z',
      email: 'test3@tester.com',
      name: 'tester3',
      phone: '8888888888',
      message: 'I love violin'
    },
    {
      id: 4,
      date_created: '2029-01-22T16:28:32.615Z',
      email: 'test4@tester.com',
      name: 'tester4',
      phone: '8888888888',
      message: 'I love violin'
    }
  ];
}

function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }));
  return db
    .into('tlv_users')
    .insert(preppedUsers)
    .then(() => {
      // update the auto sequence to stay in sync
      db.raw(`SELECT setval('tlv_users_id_seq', ?)`, [users[users.length - 1].id]);
    });
}

function seedApplications(db, applications) {
  const preppedApplications = applications.map(application => ({
    ...application
  }));
  return db
    .into('tlv_applications')
    .insert(preppedApplications)
    .then(() => {
      // update the auto sequence to stay in sync
      db.raw(`SELECT setval('tlv_applications_id_seq', ?)`, [
        applications[applications.length - 1].id
      ]);
    });
}

function makeExpectedUser(users, profile) {
  const user = users.find(user => user.id === profile.id);

  return {
    id: profile.id,
    date_created: profile.date_created,
    email: profile.email,
    name: profile.name,
    next_lesson: profile.next_lesson,
    amount_due: profile.amount_due
  };
}

function makeExpectedApplication(applications, profile) {
  const application = applications.find(application => application.id === profile.id);

  return {
    id: profile.id,
    date_created: profile.date_created,
    email: profile.email,
    name: profile.name,
    phone: profile.phone,
    message: profile.message
  };
}

function makeMaliciousApplication(user) {
  const maliciousApplication = {
    id: 911,
    date_created: new Date().toISOString(),
    name: 'Naughty naughty very naughty <script>alert("xss");</script>',
    email: 'xss@email.com',
    phone: '9999999999',
    message: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`
  };
  const expectedApplication = {
    ...makeExpectedApplication([application], maliciousApplication),
    name: 'Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;',
    message: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`
  };
  return {
    maliciousApplication,
    expectedApplication
  };
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ email: user.email }, secret, {
    subject: user.email,
    algorithm: 'HS256'
  });
  return `Bearer ${token}`;
}

function makeUsersFixtures() {
  const testUsers = makeUsersArray();
  return { testUsers };
}

function makeApplicationsFixtures() {
  const testApplications = makeApplicationsArray();
  return { testApplications };
}

function cleanTables(db) {
  return db.raw(
    `TRUNCATE
      tlv_users,
      tlv_applications
      RESTART IDENTITY CASCADE`
  );
}

function seedMaliciousApplication(db, profile) {
  return db.into('tlv_applications').insert([profile]);
}

module.exports = {
  makeUsersArray,
  makeApplicationsArray,
  makeExpectedUser,
  makeExpectedApplication,
  makeMaliciousApplication,
  makeAuthHeader,
  makeUsersFixtures,
  makeApplicationsFixtures,
  cleanTables,
  seedMaliciousApplication,
  seedUsers,
  seedApplications
};
