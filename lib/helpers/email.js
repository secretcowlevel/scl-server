const mandrill = require('node-mandrill')(global.Config.mandrill.key);

exports.sendEmail = (email, name, subject, text) => {
    const data = {
        message: {
            to: [{email, name}],
            from_email: global.Config.mandrill.from,
            subject,
            text
        }
    };
    return new Promise((resolve, reject) => {
        mandrill('/messages/send', data, (error, response) => {
            if (error) {
                return reject(`Problem with Mandrill! Response: ${response} Error: ${error}`);
            }
            return resolve();
        });
    });
};

exports.sendVerificationEmail = (email, name, code) => {
    const subject = 'Please Verify your Email Address!';
    const text = `Thanks for registering with ${global.Config.name}. \n
    Please visit the following URL to verify your email address! ${global.Config.url}/verify?email=${email}&v=${code}`;
    return exports.sendEmail(email, name, subject, text);
};
