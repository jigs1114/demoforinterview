'use client'
import React, { useEffect, useState } from 'react'
import PostsCard from '../components/PostsCard'
import { apiCall } from '../apiservices/ApiServices'
import { toast } from 'react-toastify'
import { LoginUserData } from '../apiservices/LoginUserData'
import CreateNewPostBtn from '../components/CreateNewPostBtn'
import SocketConnection from '../apiservices/SocketConnection'

const socket = SocketConnection();
function PostPage(props) {
    const [postArr, setPostArr] = useState([])
    const [userData, setUserData] = useState(null)
    useEffect(() => {


        return async () => {
            const uData = await LoginUserData();
            await getPostData();
            setUserData(uData);
        };
    }, []);

    socket.on('updatePost', () => {
        getPostData();
    });
    socket.off('updatePost');

    const getPostData = async () => {
        try {
            const token = localStorage.getItem('userToken');
            const uData = await LoginUserData();
            const dataObject = { user_id: uData?.idcode };
            const res = await apiCall('/get_all_posts', token, dataObject, 'POST');
            if (res.data) {
                setPostArr(res.data);
            } else {
                console.log(res.error);
                // toast.error('Something went wrong, please try again!');
            }
        } catch (err) {
            console.error('Error getting post data:', err);
            toast.error('Failed to load posts!');
        }
    };

    return (
        <main>
            <div className="position-fixed bottom-0 end-0 p-3 z-50">
                <CreateNewPostBtn getPost={getPostData} socket={socket} />
            </div>
            <div className='container'>
                {postArr.length > 0 ?
                    <div className='row'>
                        {postArr.map((data, index) =>
                            <div key={index} className='col-md-3 col-12'>
                                <PostsCard postData={data} userData={userData} getPost={getPostData} socket={socket} />
                            </div>
                        )}
                    </div> :
                    <div>
                        <div className='text-center py-5 text-danger'>Posts not found!</div>
                    </div>
                }
            </div>
        </main>
    );
}

export default PostPage;
