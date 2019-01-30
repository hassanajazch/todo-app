module.exports = {
    connections:{
        mongodb: {
            host: process.env.MONOG_DB_HOST,
            port: process.env.MONOG_DB_PORT,
            database: process.env.MONOG_DATABASE_NAME,
            username: '',
            password: ''
        },
        mysql:{
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'tododb-dev'
        }
    }
};
