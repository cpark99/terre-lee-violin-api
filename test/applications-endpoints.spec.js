const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Applications Endpoints', function() {
  let db;

  const { testApplications } = helpers.makeApplicationsFixtures();

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('cleanup', () => helpers.cleanTables(db));

  afterEach('cleanup', () => helpers.cleanTables(db));

  describe(`POST /api/applications`, () => {
    context(`Application Validation`, () => {
      beforeEach('insert applications', () => helpers.seedApplications(db, testApplications));

      const requiredFields = ['email', 'name', 'phone'];

      requiredFields.forEach(field => {
        const registerAttemptBody = {
          email: 'test@email',
          name: 'test name',
          phone: '8888888888'
        };

        it(`responds with 400 required error when '${field}' is missing`, () => {
          delete registerAttemptBody[field];

          return supertest(app)
            .post('/api/applications')
            .send(registerAttemptBody)
            .expect(400, {
              error: `Missing '${field}' in request body`
            });
        });
      });

      context(`Happy path`, () => {
        it(`responds 201, serialized application`, () => {
          const newApplication = {
            email: 'test@test.com',
            name: 'test name',
            phone: '8888888888',
            message: 'message'
          };

          return supertest(app)
            .post('/api/applications')
            .send(newApplication)
            .expect(201)
            .expect(res => {
              expect(res.body).to.have.property('id');
              expect(res.body.email).to.eql(newApplication.email);
              expect(res.body.name).to.eql(newApplication.name);
              expect(res.body.phone).to.eql(newApplication.phone);
              expect(res.body.message).to.eql(newApplication.message);
              expect(res.headers.location).to.eql(`/api/applications/${res.body.id}`);
              const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC' });
              const actualDate = new Date(res.body.date_created).toLocaleString();
              expect(actualDate).to.eql(expectedDate);
            })
            .expect(
              res =>
                db
                  .from('tlv_applications')
                  .select('*')
                  .where({ id: res.body.id })
                  .first()
                  .then(row => {
                    expect(row.email).to.eql(newApplication.email);
                    expect(row.name).to.eql(newApplication.name);
                    expect(row.phone).to.eql(newApplication.phone);
                    expect(row.message).to.eql(newApplication.message);
                    const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC' });
                    const actualDate = new Date(row.date_created).toLocaleString();
                    expect(actualDate).to.eql(expectedDate);

                    // return bcrypt.compare(newApplication.password, row.password);
                  })
              // .then(compareMatch => {
              //   expect(compareMatch).to.be.true;
              // })
            );
        });
      });
    });
  });
});
