const xss = require('xss');

const ApplicationsService = {
  insertApplication(db, newApplication) {
    return db
      .insert(newApplication)
      .into('tlv_applications')
      .returning('*')
      .then(([application]) => application);
  },
  serializeApplication(application) {
    return {
      id: application.id,
      name: xss(application.name),
      email: xss(application.email),
      phone: xss(application.phone),
      message: xss(application.message),
      date_created: new Date(application.date_created)
    };
  }
};

module.exports = ApplicationsService;
