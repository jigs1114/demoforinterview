'use client'
import { Box, Button, TextField, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import AddIcon from '@mui/icons-material/Add';
import { Modal, ModalBody } from 'react-bootstrap';

import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import { Close } from '@mui/icons-material';
import { apiCall } from '../apiservices/ApiServices';
import { toast } from 'react-toastify';
import { LoginUserData } from '../apiservices/LoginUserData';

function CreateNewPostBtn(props) {
    const socket = props.socket
    socket.on("updatePost", () => {
        props.getPost()
    })
    const fileSelectRef = useRef()
    const [openForm, setOpenForm] = useState(false)
    const [imagesFilesArr, setImagesFilesArr] = useState([])
    const [imagesUrlsArr, setImagesUrlsArr] = useState([])
    const [description, setDescription] = useState('')
    const [userData, setUserData] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    useEffect(() => {
        return async () => {
            let uData = await LoginUserData()
            setUserData(uData)
        }
    }, [])
    const onSelectFiles = (e) => {
        const files = e.target.files;
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
        const maxSize = 5 * 1024 * 1024;

        let tempArr = [];
        let validFiles = [];
        for (let index = 0; index < files.length; index++) {
            const file = files[index];
            if (allowedTypes.includes(file.type) && file.size <= maxSize) {
                validFiles.push(file);
                let url = URL.createObjectURL(file);
                tempArr.push(url);
            } else {
                toast.error(`File "${file.name}" is not a valid type or exceeds the size limit.`)
            }
        }

        if (validFiles.length > 0) {
            console.log(validFiles);
            setImagesFilesArr(validFiles);
            setOpenForm(true);
            setImagesUrlsArr(tempArr);
        } else {
            toast.error("No valid files were selected.")
        }
    }

    const onClickClose = () => {
        setImagesFilesArr([])
        setImagesUrlsArr([])
        setOpenForm(false)
    }
    const onSubmitHandle = async (e) => {
        e.preventDefault();
        setIsLoading(true)
        let token = localStorage.getItem('userToken');
        let formData = new FormData();
        for (let i = 0; i < imagesFilesArr.length; i++) {
            formData.append('images', imagesFilesArr[i]);
        }
        formData.append('description', description);
        formData.append('user_id', userData.idcode);

        try {
            const response = await apiCall('/create_posts', token, formData, 'POST');
            console.log(response);
            if (response.data) {
                toast.success(response.data);
                props.getPost()
                socket.emit("updatePost", 'Call data')
                setIsLoading(false)
                onClickClose()
            } else {
                toast.error(response.error);
                setIsLoading(false)
            }
        } catch (error) {
            setIsLoading(false)
            console.error(error);
        }
    };

    return (
        <main>
            <input className='d-none' type='file' ref={fileSelectRef} onChange={onSelectFiles} multiple />
            <Button variant='contained' className='rounded-circle py-3' onClick={() => fileSelectRef.current.click()}>
                <AddIcon />
            </Button>

            <Modal show={openForm}>
                <Box className="d-flex justify-between p-3">
                    <Typography variant='h5'>Create New Post</Typography>
                    <Close className='text-danger' onClick={onClickClose} />
                </Box>
                <ModalBody>
                    <form onSubmit={onSubmitHandle}>

                        <Carousel autoPlay={false} swipeable emulateTouch showArrows={false} showThumbs={false}>
                            {imagesUrlsArr.map((imageUrl, i) => (
                                <div key={i}>
                                    <img src={imageUrl} alt={`Image ${i}`} />
                                </div>
                            ))}
                        </Carousel>

                        <div className='mt-3'>
                            <TextField
                                variant='outlined'
                                label="Description"
                                fullWidth
                                multiline
                                rows={3}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                        <div className='my-3'>
                            <Button type='submit' variant='contained' disabled={isLoading}>{isLoading?'Loading...':'Submit'}</Button>
                        </div>
                    </form>
                </ModalBody>
            </Modal>
        </main>
    )
}

export default CreateNewPostBtn