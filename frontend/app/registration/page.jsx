'use client'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { Button, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import { apiCall } from '../apiservices/ApiServices'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'

function Registration() {
    const navigate = useRouter()
    const initialState = {
        first_name: '',
        last_name: '',
        email_id: '',
        password: '',
        confirm_password: ''
    }
    const [formData, setFormData] = useState(initialState)
    const onChangeHandle = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const onSubmitHandle = async (e) => {
        e.preventDefault()
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if(formData.first_name === ''){
            toast.error('First name is required!')
            return
        }
        if(formData.last_name === ''){
            toast.error('Last name is required!')
            return
        }
        if(formData.email_id === ''){
            toast.error('Email ID is required!')
            return
        }
        if(!formData.email_id.match(emailRegex)){
            toast.error('Invalid email id!')
            return
        }
        if(formData.password === ''){
            toast.error('Password is required!')
            return
        }
        if(formData.confirm_password === ''){
            toast.error('Confirm Password is required!')
            return
        }
        if(formData.confirm_password !== formData.password){
            toast.error('Password & Confirm Password is mismatch!')
            return
        }
        console.log(formData);
        let dataObject = {
            first_name: formData.first_name,
            last_name: formData.last_name,
            email_id: formData.email_id,
            password: formData.password
        }
        await apiCall('/create_users', '', dataObject, 'POST').then(res => {
            if(res.data){
                toast.success(res.data)
                setFormData(initialState)
                navigate.push('/login')
            }else{
                toast.error(res.error)
            }
        }).catch(err => {
            console.log(err);
        })
    }

    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);



    return (
        <main>
            <div className='container'>
                <div className='row m-0'>

                    <div className='my-3 mx-auto col-md-4 col-12 offset-md-4 offset-0 border p-3 rounded'>
                        <div className='fs-3 mb-3'>
                            <Typography variant='h5'>
                                Registration
                            </Typography>
                        </div>
                        <form autoComplete='off' onSubmit={onSubmitHandle}>
                            <div className='mb-3'>
                                <TextField type='text'
                                    onChange={onChangeHandle}
                                    name="first_name"
                                    value={formData.first_name}
                                    variant='outlined'
                                    label='First Name'
                                    fullWidth
                                />
                            </div>
                            <div className='mb-3'>
                                <TextField type='text'
                                    onChange={onChangeHandle}
                                    name="last_name"
                                    value={formData.last_name}
                                    variant='outlined'
                                    label='Last Name'
                                    fullWidth
                                />
                            </div>
                            <div className='mb-3'>
                                <TextField type='text'
                                    onChange={onChangeHandle}
                                    name="email_id"
                                    value={formData.email_id}
                                    variant='outlined'
                                    label='Email ID'
                                    fullWidth
                                />
                            </div>
                            <div className='mb-3'>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                                    <OutlinedInput
                                        type={showPassword ? 'text' : 'password'}
                                        onChange={onChangeHandle}
                                        name="password"
                                        value={formData.password}
                                        variant='outlined'
                                        endAdornment={
                                            <InputAdornment position="end" >
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        label="Password"
                                    />
                                </FormControl>
                            </div>
                            <div className='mb-3'>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel htmlFor="outlined-adornment-cpassword">Confirm Password</InputLabel>
                                    <OutlinedInput
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        onChange={onChangeHandle}
                                        name="confirm_password"
                                        value={formData.confirm_password}
                                        variant='outlined'
                                        endAdornment={
                                            <InputAdornment position="end" >
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowConfirmPassword}
                                                    edge="end"
                                                >
                                                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        label="Confirm Password"
                                    />
                                </FormControl>
                            </div>
                            <div className='mb-3'>
                                <Button type='submit' variant='contained'>Login</Button>
                            </div>
                        </form>
                        <Button onClick={()=> navigate.push('/login')}>Already have an account?</Button>
                    </div>

                </div>
            </div>
        </main>
    )
}

export default Registration