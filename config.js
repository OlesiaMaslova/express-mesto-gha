const { PORT = 3000 } = process.env;
const { JWT_SECRET = 'some-secret-key' } = process.env;
const { DB_ADDRESS = 'mongodb://localhost:27017/mestodb' } = process.env;

module.exports = {
  PORT,
  JWT_SECRET,
  DB_ADDRESS,
};
