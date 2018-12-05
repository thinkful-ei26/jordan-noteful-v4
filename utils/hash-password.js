const bcrypt = require('bcryptjs');
const password = 'BETTY-BOOP';

bcrypt.hash(password, 10)
    .then (digest => {
        console.log('digest = ', digest);
        return digest; 
    }) //question about digest vs payload
    .catch(err => {
        console.error('error', err)
    });
