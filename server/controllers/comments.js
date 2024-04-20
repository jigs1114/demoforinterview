const knex = require('../mysql_db_schema')

exports.comments_all = async (req, res) => {
    knex
    try {
        const postsData = await knex.select('*').from('comments');
        const commentsWithUserDetails = await Promise.all(postsData.map(async (post) => {
            const userDetails = await knex('users').where('idcode', post.user_id).first();
            if (userDetails) {
                const userName = `${userDetails.first_name} ${userDetails.last_name}`;
                firstLetter = userName.charAt(0).toUpperCase()
                return { ...post, userDetails: { name: userName, image: firstLetter }};
            } else {
                return post;
            }
        }));

        res.json({ data: commentsWithUserDetails.reverse() });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: `There was an error retrieving posts: ${err.message}` });
    }
}

exports.comments_create = async (req, res) => {
    knex('comments')
        .insert({
            'idcode': Date.now(),
            'post_id': req.body.post_id,
            'user_id': req.body.user_id,
            'message': req.body.message,
        })
        .then(() => {
            res.json({ data: `comments created by ${req.body.user_id} .` })
        })
        .catch(err => {
            res.json({ error: `There was an error creating ${req.body.user_idcode} comments: ${err}` })
        })
}

exports.comments_update = async (req, res) => {
    knex('comments')
        .where('idcode', req.body.idcode)
        .update({
            'post_id': req.body.post_id,
            'user_id': req.body.user_id,
            'message': req.body.message,
        })
        .then(() => {
            res.json({ data: `comments ${req.body.idcode} update.` })
        })
        .catch(err => {
            res.json({ error: `There was an error deleting ${req.body.idcode} comments: ${err}` })
        })
}

exports.comments_delete = async (req, res) => {
    knex('comments')
        .where('idcode', req.body.idcode)
        .del()
        .then(() => {
            res.json({ data: `comments ${req.body.idcode} deleted.` })
        })
        .catch(err => {
            res.json({ error: `There was an error deleting ${req.body.id} comments: ${err}` })
        })
}


exports.comments_by_id_code = async (req, res) => {
    try {
        knex('comments')
            .where('idcode', req.body.idcode)
            .select('*')
            .then(messageData => {
                // console.log(messageData.length);
                if(messageData.length > 0){

                    res.json({ data: messageData[0] })
                }else{
                    res.json({ error: 'invalid idcode' })
                    
                }
            })
            .catch(err => {
                res.json({ error: `There was an error creating ${req.body.idcode} comments: ${err}` })
            })
    } catch (error) {
        console.log(error);
    }
}

exports.comments_by_post_id = async (req, res) => {
    try {
        knex('comments')
            .where('post_id', req.body.post_id)
            .select('*')
            .then( async messageData => {
                const commentsWithUserDetails = await Promise.all(messageData.map(async (post) => {
                    const userDetails = await knex('users').where('idcode', post.user_id).first();
                    if (userDetails) {
                        const userName = `${userDetails.first_name} ${userDetails.last_name}`;
                        firstLetter = userName.charAt(0).toUpperCase()
                        return { ...post, userDetails: { name: userName, image: firstLetter }};
                    } else {
                        return post;
                    }
                }));
        
                res.json({ data: commentsWithUserDetails.reverse() });
            })
            .catch(err => {
                res.json({ error: `There was an error creating ${req.body.idcode} comments: ${err}` })
            })
    } catch (error) {
        console.log(error);
    }
}


