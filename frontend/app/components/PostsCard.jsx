'use client'
import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Close, CommentRounded, MoreVert as MoreVertIcon, SendOutlined } from '@mui/icons-material';
import { Avatar, Box, Drawer, FormControl, InputAdornment, InputLabel, Menu, MenuItem, OutlinedInput, TextField } from '@mui/material';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import { apiCall } from '../apiservices/ApiServices';
import { toast } from 'react-toastify';

function PostsCard(props) {
    const socket = props.socket
    // const [anchorEl, setAnchorEl] = useState(null);
    const [postData, setPostData] = useState(props.postData);
    const [postImages, setPostImages] = useState([]);
    const [postCommentsArr, setPostCommentsArr] = useState([]);
    const [postCreateDate, setpostCreateDate] = useState(null)

    useEffect(() => {
        let imgArr = props.postData?.images && JSON.parse(props.postData.images) || [];
        setPostData(props.postData || {});
        setPostImages(imgArr || []);
        setpostCreateDate(new Date(postData?.createDate).toLocaleString())
        socket.on('updatePost', () => {
            getCommentsByPostsId()
        });

    }, [props.postData]);

    const onClickLikeBtn = async () => {
        let token = localStorage.getItem('userToken')
        let userData = props.userData
        let dataObject = {
            post_id: postData.idcode,
            user_id: userData.idcode
        }
        console.log(dataObject);
        await apiCall('/create_likes_posts', token, dataObject, 'POST').then(res => {
            if (res.data) {
                console.log('Liked');
                props.getPost()
                socket.emit("updatePost", 'Call data')
            } else {
                console.log(res.error)
                toast.error('Something went to wrong')
            }
        }).catch(err => {
            console.log(err);
        })
    }


    // const handleMenu = (event) => {
    //     setAnchorEl(event.currentTarget);
    // };

    // const handleClose = () => {
    //     setAnchorEl(null);
    // };
    const [open, setOpen] = useState(false);
    const [comments, setComments] = useState('');

    const toggleDrawer = () => {
        setOpen(open ? false : true);
        getCommentsByPostsId()
    };
    const getCommentsByPostsId = async () => {
        let token = localStorage.getItem('userToken')
        let dataObject = {
            post_id: postData.idcode
        }
        await apiCall('/get_by_post_id_comments', token, dataObject, 'POST').then(res => {
            if (res.data) {
                setPostCommentsArr(res.data)
                setComments('')
            } else {
                console.log(res.error);
                toast.error('Something went to wrong!')
            }
        }).catch(err => {
            console.log(err);
        })
    }

    const onSubmitComment = async () => {
        let token = localStorage.getItem('userToken')
        let userData = props.userData
        let dataObject = {
            post_id: postData.idcode,
            user_id: userData.idcode,
            message: comments
        }
        console.log(dataObject);
        await apiCall('/create_comments', token, dataObject, 'POST').then(res => {
            if (res.data) {
                console.log(res);
                console.log('comments');
                getCommentsByPostsId()
                props.getPost()
                socket.emit("updatePost", 'Call data')
            } else {
                console.log(res.error)
                toast.error('Something went to wrong')
            }
        }).catch(err => {
            console.log(err);
        })

    }

    return (
        <main>
            <Drawer anchor='bottom' open={open} >
                <div className='container'>
                    <div className='p-3'>
                        <div className='text-end mb-3'><Close color='error' onClick={() => setOpen(false)} /></div>
                        <div style={{ height: 'calc(100vh - 250px)', overflow: 'auto' }}>

                            {postCommentsArr.length > 0 ?
                                <div className='mb-3'>
                                    {postCommentsArr.map((data, i) =>
                                        <Card key={i} sx={{ maxWidth: '100%' }} className='shadow mt-3'>
                                            <CardHeader
                                                avatar={
                                                    <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                                                        {data.userDetails?.image}
                                                    </Avatar>
                                                }
                                                title={data.userDetails?.name}
                                            />
                                            <CardContent>
                                                <Typography variant="body2" color="text.secondary">
                                                    {data.message}
                                                </Typography>
                                            </CardContent>

                                        </Card>
                                    )}
                                </div> : <div className='py-5 text-center text-danger fs-3'>no comments yet!</div>}

                        </div>
                        <div className='mb-3'>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel htmlFor="outlined-adornment-password">Comments</InputLabel>
                                <OutlinedInput
                                    type={'text'}
                                    onChange={e => setComments(e.target.value)}
                                    name="comments"
                                    value={comments}
                                    variant='outlined'
                                    endAdornment={
                                        <InputAdornment position="end" >
                                            <IconButton
                                                onClick={onSubmitComment}
                                                edge="end"
                                            >
                                                <SendOutlined />
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    label="Password"
                                />
                            </FormControl>
                        </div>
                    </div>
                </div>
            </Drawer>
            <Card sx={{ maxWidth: '100%' }} className='shadow mt-3'>
                <CardHeader
                    avatar={
                        <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                            {postData.userDetails?.image}
                        </Avatar>
                    }
                    // action={
                    //     <div>
                    //         <IconButton
                    //             size="large"
                    //             aria-label="account of current user"
                    //             aria-controls="menu-appbar"
                    //             aria-haspopup="true"
                    //             onClick={handleMenu}
                    //             color="inherit"
                    //         >
                    //             <MoreVertIcon />
                    //         </IconButton>
                    //         <Menu
                    //             id="menu-appbar"
                    //             anchorEl={anchorEl}
                    //             anchorOrigin={{
                    //                 vertical: 'bottom',
                    //                 horizontal: 'right',
                    //             }}
                    //             keepMounted
                    //             transformOrigin={{
                    //                 vertical: 'top',
                    //                 horizontal: 'right',
                    //             }}
                    //             open={Boolean(anchorEl)}
                    //             onClose={handleClose}
                    //         >
                    //             <MenuItem onClick={handleClose}>Edit</MenuItem>
                    //             <MenuItem onClick={handleClose}>Delete</MenuItem>
                    //         </Menu>
                    //     </div>
                    // }
                    title={postData.userDetails?.name}
                    subheader={postCreateDate}
                />
                <Carousel autoPlay={false} swipeable emulateTouch showArrows={false} showThumbs={false}>
                    {postImages.map((imageUrl, i) => (
                        <div key={i}>
                            <img src={`http://172.20.10.4:3001/images/${imageUrl}`} alt={`Image ${i}`} />
                        </div>
                    ))}
                </Carousel>
                <CardContent>
                    <Typography variant="body2" color="text.secondary">
                        {postData.description}
                    </Typography>
                </CardContent>
                <CardActions disableSpacing>
                    <IconButton aria-label="add to favorites" onClick={postData.is_liked === 0 ? onClickLikeBtn : null}>
                        {postData.is_liked === 0 ? <FavoriteIcon /> : <FavoriteIcon color='error' />}<small className='ms-2'>{postData.likes_count}</small>
                    </IconButton>
                    <IconButton aria-label="comment" onClick={toggleDrawer}>
                        <CommentRounded /> <small className='ms-2'>{postData.comments_count}</small>
                    </IconButton>
                </CardActions>
            </Card>


        </main>
    );
}

export default PostsCard;
