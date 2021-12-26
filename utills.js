module.exports = {
    EmailValidation: function (email)
    {
      let re = /\S+@\S+\.\S+/;
			return re.test(email);
    }
  }