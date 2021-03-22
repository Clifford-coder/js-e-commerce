const fs = require('fs'); //This is to help us to save some data to our harddrive
const crypto = require('crypto');

module.exports = class Repository {
	constructor(filename) {
		//NB: Constructors should never be async
		if (!filename) {
			throw new Error('Create a repository requires a filename');
		}
		//save the filename to an instance variable of this class
		this.filename = filename;
		try {
			//access the file if it  exist.
			fs.accessSync(this.filename);
		} catch (err) {
			//Else create a new file with that name provided
			fs.writeFileSync(this.filename, '[]');
		}
	}

	async create(attributes) {
		attributes.id = this.randomId();

		const records = await this.getAll();
		records.push(attributes);
		await this.writeAlltoHDD(records);

		return attributes;
	}

	async getAll() {
		//the top code in a single line
		return JSON.parse(await fs.promises.readFile(this.filename, { encoding: 'utf-8' }));
	}

	async writeAlltoHDD(records) {
		await fs.promises.writeFile(this.filename, JSON.stringify(records, null, 2));
	}

	randomId() {
		return crypto.randomBytes(4).toString('hex');
	}

	async getOne(id) {
		const records = await this.getAll();
		return records.find((record) => record.id === id);
	}

	async delete(id) {
		console.log(id);
		const records = await this.getAll();
		const filteredRecords = records.filter((record) => record.id !== id);
		await this.writeAlltoHDD(filteredRecords);
	}

	async update(id, attributes) {
		const records = await this.getAll();
		const record = records.find((record) => record.id === id);
		if (!record) {
			throw new Error(`User with id ${id} does not exist`);
		}
		Object.assign(record, attributes);
		await this.writeAlltoHDD(records);
	}

	async getOneBy(filters) {
		const records = await this.getAll();
		for (let record of records) {
			//record is an obj
			let found = true;
			for (let key in filters) {
				if (record[key] !== filters[key]) found = false;
			}
			//if we find what we are looking for, return it.
			if (found) return record;
		}
	}
	// async getOneBy(filters) {
	// 	const records = await this.getAll();

	// 	for (let record of records) {
	// 		let found = true;

	// 		for (let key in filters) {
	// 			if (record[key] !== filters[key]) {
	// 				found = false;
	// 			}
	// 		}

	// 		if (found) {
	// 			return record;
	// 		}
	// 	}
	// }
};
