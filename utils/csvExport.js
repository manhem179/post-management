const fs = require('fs');
const path = require('path');
const { Parser } = require('json2csv');

exports.writePostsToCSV = async (posts) => {
  const parser = new Parser({ fields: ['title', 'category', 'author.username', 'createdAt'] });
  const csv = parser.parse(posts);
  const filePath = path.join(__dirname, '../uploads/posts.csv');
  fs.writeFileSync(filePath, csv);
  return filePath;
};
