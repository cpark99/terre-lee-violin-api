const xss = require('xss');
// const bcrypt = require('bcryptjs');

const UsersService = {
  hasUserWithEmail(db, email) {
    return db('tlv_users')
      .where({ email })
      .first()
      .then(user => !!user);
  },
  getById(db, id) {
    return db
      .from('tlv_users AS u')
      .select('u.id', 'u.name', 'u.email', 'u.next_lesson', 'u.amount_due', 'u.date_created')
      .where('u.id', id)
      .first();
  },
  serializeUser(user) {
    return {
      id: user.id,
      name: xss(user.name),
      email: xss(user.email),
      next_lesson: xss(user.next_lesson),
      amount_due: xss(user.amount_due),
      date_created: new Date(user.date_created)
    };
  }
};

module.exports = UsersService;
