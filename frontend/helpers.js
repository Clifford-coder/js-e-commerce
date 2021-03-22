module.exports = {
	getErrors(errors, props) {
		//use the try-catch synthanx so that even error or props is undefnied, the catch block would run instead of the catch block
		try {
			/*
		props === 'email' || 'password' || 'passwordConfirmation'
		errors.mapped() === {
			 email:{msg:'Invalid email'}, 
			 password:{msg:'Incorrect password'},
			 passwordConfimation:{msg:'Incorrect password'}}
		*/
			return errors.mapped()[props].msg;
		} catch (err) {
			return '';
		}
	},
};
