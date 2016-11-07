const Twit = require('twit');

const T = new Twit(global.Config.twitter);


module.exports = (server) => {
    server.route({
        method: 'GET',
        path: '/api/twitter',
        handler: (request, reply) => {
            // @TODO - cache tweets in memory/redis
            T.get('statuses/user_timeline', {screen_name: 'framerate', count: 5}, (err, data) => {
                if (err) {
                    reply({
                        success: false,
                        message: 'Something went wrong communicating with Twitter!'
                    });
                } else {
                    reply({
                        success: true,
                        tweets: data
                    });
                }
            });
        }
    });
};
