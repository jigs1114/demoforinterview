const knex = require('../mysql_db_schema')
const path = require('path')
const fs = require('fs');
exports.posts_all = async (req, res) => {
    const userid = req.body.user_id
    try {
        const postsData = await knex.select('*').from('posts');
        const likesArr = await knex.select('*').from('likes_posts');
        const postsWithUserDetails = await Promise.all(postsData.map(async (post) => {
            try {
                const likesCount = await knex('likes_posts').count().where('post_id', post.idcode).first();
                const commentsCount = await knex('comments').count().where('post_id', post.idcode).first();
                const userDetails = await knex('users').where('idcode', post.user_id).first();

                if (userDetails) {
                    const isLiked = likesArr.some(e => e.post_id === post.idcode && e.user_id === userid)
                    const userName = `${userDetails.first_name} ${userDetails.last_name}`;
                    const firstLetter = userName.charAt(0).toUpperCase();

                    return {
                        ...post,
                        userDetails: { name: userName, image: firstLetter },
                        likes_count: parseInt(likesCount['count(*)']),
                        comments_count: parseInt(commentsCount['count(*)']),
                        is_liked: isLiked ? 1 : 0
                    };
                } else {
                    return post;
                }
            } catch (error) {
                console.error("Error processing post:", error);
                throw error; // Rethrow the error to stop Promise.all if needed
            }
        }));

        res.json({ data: postsWithUserDetails.reverse() });
    } catch (err) {
        console.error("Error retrieving posts:", err);
        res.status(500).json({ error: `There was an error retrieving posts: ${err.message}` });
    }
};


exports.posts_create = async (req, res) => {
    let imageArr = req.files.images
    console.log(imageArr);
    isarray = Array.isArray(imageArr)
    let filenames = []
    uploadPath = `assets/`;
    console.log(imageArr);
    if (isarray) {
        for (let i = 0; i < imageArr.length; i++) {
            var datafiles = imageArr[i]
            var fileExt = path.extname(datafiles.name)
            var newName = `${Math.round(Math.random() * 1E9)}${fileExt}`
            filenames.push(newName)
            fileuploadPath = uploadPath + newName;

            datafiles.mv(fileuploadPath, function (err) {
                if (err) {
                    return res.json({ error: err })
                }
            });
        }
    } else {
        var datafiles = imageArr
        var fileExt = path.extname(datafiles.name)
        var newName = `${Math.round(Math.random() * 1E9)}${fileExt}`
        filenames.push(newName)
        fileuploadPath = uploadPath + newName;

        datafiles.mv(fileuploadPath, function (err) {
            if (err) {
                return res.json({ error: err })
            }
        });
    }
    knex('posts')
        .insert({
            'idcode': Date.now(),
            'user_id': req.body.user_id,
            'images': JSON.stringify(filenames),
            'description': req.body.description,
            'createDate': new Date(),
            'likes_count': 0,
            'comments_count': 0,
            'is_liked': false
        })
        .then(() => {
            res.json({ data: `posts created by ${req.body.user_id} .` })
        })
        .catch(err => {
            res.json({ error: `There was an error creating ${req.body.user_idcode} posts: ${err}` })
        })
}

exports.posts_update = async (req, res) => {
    knex('posts')
        .where('idcode', req.body.idcode)
        .update({
            'user_id': req.body.user_id,
            'images': JSON.stringify(filenames),
            'description': req.body.description,
            'createDate': new Date(),
            'likes_count': 0,
            'comments_count': 0,
            'is_liked': false
        })
        .then(() => {
            res.json({ data: `posts ${req.body.idcode} update.` })
        })
        .catch(err => {
            res.json({ error: `There was an error deleting ${req.body.idcode} posts: ${err}` })
        })
}

exports.posts_delete = async (req, res) => {
    knex('posts')
        .where('idcode', req.body.idcode)
        .del()
        .then(() => {
            res.json({ data: `posts ${req.body.idcode} deleted.` })
        })
        .catch(err => {
            res.json({ error: `There was an error deleting ${req.body.id} posts: ${err}` })
        })
}


exports.posts_by_id_code = async (req, res) => {
    try {
        knex('posts')
            .where('idcode', req.body.idcode)
            .select('*')
            .then(messageData => {
                // console.log(messageData.length);
                if (messageData.length > 0) {

                    res.json({ data: messageData[0] })
                } else {
                    res.json({ error: 'invalid idcode' })

                }
            })
            .catch(err => {
                res.json({ error: `There was an error creating ${req.body.idcode} posts: ${err}` })
            })
    } catch (error) {
        console.log(error);
    }
}

exports.posts_by_user_id = async (req, res) => {
    try {
        knex('posts')
            .where('user_id', req.body.user_id)
            .select('*')
            .then(messageData => {
                res.json({ data: messageData })
            })
            .catch(err => {
                res.json({ error: `There was an error creating ${req.body.idcode} posts: ${err}` })
            })
    } catch (error) {
        console.log(error);
    }
}
