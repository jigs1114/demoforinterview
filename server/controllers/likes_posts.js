const knex = require('../mysql_db_schema')

exports.likes_posts_all = async (req, res) => {
    knex
        .select('*')
        .from('likes_posts')
        .then(likes_postsData => {
            res.json({ data: likes_postsData })
        })
        .catch(err => {
            res.json({ error: `There was an error retrieving likes_posts: ${err}` })
        })
}

exports.likes_posts_create = async (req, res) => {
    knex('likes_posts')
        .insert({
            'idcode': Date.now(),
            'user_id': req.body.user_id,
            'post_id': req.body.post_id,
        })
        .then(() => {
            res.json({ data: `likes_posts created by ${req.body.room} .` })
        })
        .catch(err => {
            res.json({ error: `There was an error creating ${req.body.user_idcode} likes_posts: ${err}` })
        })
}

exports.likes_posts_update = async (req, res) => {
    knex('likes_posts')
        .where('idcode', req.body.idcode)
        .update({
            'user_id': req.body.user_id,
            'post_id': req.body.post_id,
        })
        .then(() => {
            res.json({ data: `likes_posts ${req.body.idcode} update.` })
        })
        .catch(err => {
            res.json({ error: `There was an error deleting ${req.body.idcode} likes_posts: ${err}` })
        })
}

exports.likes_posts_delete = async (req, res) => {
    knex('likes_posts')
        .where({ 'user_id': req.body.user_id, 'post_id': req.body.post_id })
        .del()
        .then(() => {
            res.json({ data: `likes_posts ${req.body.post_id} deleted.` })
        })
        .catch(err => {
            res.json({ error: `There was an error deleting ${req.body.id} likes_posts: ${err}` })
        })
}


exports.likes_posts_by_id_code = async (req, res) => {
    try {
        knex('likes_posts')
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
                res.json({ error: `There was an error creating ${req.body.idcode} likes_posts: ${err}` })
            })
    } catch (error) {
        console.log(error);
    }
}

exports.likes_posts_by_user_id = async (req, res) => {
    try {
        knex('likes_posts')
            .where('user_id', req.body.user_id)
            .select('*')
            .then(messageData => {
                res.json({ data: messageData })
            })
            .catch(err => {
                res.json({ error: `There was an error creating ${req.body.idcode} likes_posts: ${err}` })
            })
    } catch (error) {
        console.log(error);
    }
}
