const User = require('./user');
const Post = require('./post');
const Comment = require('./comment');


//Associations in the Model

//Post to Comment relationshios
Post.hasMany(Comment, {
    foreignKey: "post_id",
    onDelete: "CASCADE",
});

Comment.belongsTo(Post, {
    foreignKey: "post_id",
    onDelete: "CASCADE"
});

//Post to User relationshios

Post.belongsTo(User, {
    foreignKey: "user_id",
    onDelete: "CASCADE",
});

User.hasMany(Post, {
    foreignKey: "user_id",
    onDelete: "CASCADE",
});

//Comment to User relationshios

Comment.belongsTo(User, {
    foreignKey: "user_id",
    onDelete: "CASCADE"
});

User.hasMany(Comment, {
    foreignKey: "user_id",
});





module.exports = { User, Post, Comment };
