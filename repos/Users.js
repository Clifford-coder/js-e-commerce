const fs = require('fs');
const crypto = require('crypto');
const util = require('util');
const Repository = require('./Repository');
//convert the callback scrypt to a promise to be able to use async/await on it.
const promisifiedScrypt = util.promisify(crypto.scrypt);

class UsersRepo extends Repository {
	async create(attributes) {
		//attributes = {email:'',password:''}

		//give each user a unique random id
		attributes.id = this.randomId();

		//generate the random string(salt) to be attached to the user's provided password
		const salt = crypto.randomBytes(10).toString('hex');
		const buffer = await promisifiedScrypt(attributes.password, salt, 64);

		//get the existing data or records
		const records = await this.getAll();
		const record = { ...attributes, password: `${buffer.toString('hex')}-${salt}` };
		//push the new ones to it then.
		records.push(record);
		//save the data in a form of string to the server(in this case our harddrive)
		await this.writeAlltoHDD(records);

		return record;
	}

	async comparePasswords(saved, supplied) {
		//saved is password saved in our database i.e hashed-salt
		//supplied is the password provided by the user.

		//get the hashed and salt from saved
		const [hashed, salt] = saved.split('-');

		//hash the supplied and the salt
		const hashedSuppliedBuffer = await promisifiedScrypt(supplied, salt, 64);

		//now return a boolean from the comparison of the hashedSupplied and the origin hashed in our database
		return hashedSuppliedBuffer.toString('hex') === hashed;
	}
}

module.exports = new UsersRepo('users.json');
