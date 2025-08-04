exports.sendMockEmail = (post) => {
  console.log(`[EMAIL MOCK] New post "${post.title}" by user ID: ${post.author}`);
};
