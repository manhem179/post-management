const EventEmitter = require('events');
const postEvents = new EventEmitter();

postEvents.on('post:created', (post) => {
  console.log(`[POST CREATED] "${post.title}" by user ${post.author} at ${new Date()}`);
});

module.exports = postEvents;
