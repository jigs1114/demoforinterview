const express = require('express');
const router = express.Router();
const userRouter = require('../controllers/users')
const postsRouter = require('../controllers/posts')
const likesPostsRouter = require('../controllers/likes_posts')
const commentsRouter = require('../controllers/comments');
const verifyToken = require('../auth/authentication');

const path = require('path')

function MainRouter(io) {
    // socket connection and routes
    io.on('connection', (socket) => {
        console.log(socket.id);
        
        socket.on("updatePost", (data) => {
            io.emit("updatePost", 'hi Client')
        })
      
        socket.on('disconnect', () => {
          console.log('User Disconnected', socket.id);
        });
      });
    
    // static image path
    router.use('/images', express.static(path.join('assets')))
    //user routes
    router.get('/get_all_users', userRouter.users_all)
    router.post('/create_users', userRouter.users_create)
    router.post('/update_users', userRouter.users_update)
    router.post('/delete_users', userRouter.users_delete)
    router.post('/get_by_id_users', userRouter.users_by_id_code)
    router.post('/login_users', userRouter.users_login)
    router.get('/loginuserdatabytoken', verifyToken, userRouter.login_user_data_by_token)
    //posts routes
    router.post('/get_all_posts', verifyToken, postsRouter.posts_all)
    router.post('/create_posts', verifyToken, postsRouter.posts_create)
    router.post('/update_posts', verifyToken, postsRouter.posts_update)
    router.post('/delete_posts', verifyToken, postsRouter.posts_delete)
    router.post('/get_by_id_posts', verifyToken, postsRouter.posts_by_id_code)
    router.post('/get_by_user_id_posts', verifyToken, postsRouter.posts_by_user_id)
    // likes routes
    router.get('/get_all_likes_posts', verifyToken, likesPostsRouter.likes_posts_all)
    router.post('/create_likes_posts', verifyToken, likesPostsRouter.likes_posts_create)
    router.post('/update_likes_posts', verifyToken, likesPostsRouter.likes_posts_update)
    router.post('/delete_likes_posts', verifyToken, likesPostsRouter.likes_posts_delete)
    router.post('/get_by_id_likes_posts', verifyToken, likesPostsRouter.likes_posts_by_id_code)
    router.post('/get_by_user_id_likes_posts', verifyToken, likesPostsRouter.likes_posts_by_user_id)
    // comments routes
    router.get('/get_all_comments', verifyToken, commentsRouter.comments_all)
    router.post('/create_comments', verifyToken, commentsRouter.comments_create)
    router.post('/update_comments', verifyToken, commentsRouter.comments_update)
    router.post('/delete_comments', verifyToken, commentsRouter.comments_delete)
    router.post('/get_by_id_comments', verifyToken, commentsRouter.comments_by_id_code)
    router.post('/get_by_post_id_comments', verifyToken, commentsRouter.comments_by_post_id)

    return router;
}

module.exports = MainRouter;
