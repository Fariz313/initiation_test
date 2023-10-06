const bcrypt = require('bcrypt');
// Function to hash the user's password
const hashPassword = async (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            const saltRounds = 10;
            const hashed =  await bcrypt.hash(password, saltRounds);
            resolve(hashed);
        } catch (error) {
            reject(error)
        }
    });
};
// Function to compare a plain password with a hashed password
const comparePassword = async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
};


module.exports = {
    hashPassword,
    comparePassword
};