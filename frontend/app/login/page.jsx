'use client'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { Button, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { apiCall } from '../apiservices/ApiServices'
import { useRouter } from 'next/navigation'

function Login() {
    const navigate = useRouter()

    const initialState = {
        email_id: '',
        password: ''
    }
    const [formData, setFormData] = useState(initialState)
    const onChangeHandle = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const onSubmitHandle = async (e) => {
        e.preventDefault()
        if (formData.email_id === '') {
            toast.error('Email ID is required!')
            return
        }
        if (formData.password === '') {
            toast.error('Password is required!')
            return
        }
        let dataObject = {
            email_id: formData.email_id,
            password: formData.password
        }
        await apiCall('/login_users', '', dataObject, 'POST').then(res => {
            if (res.data) {
                let token = res.data
                localStorage.setItem('userToken', token)
                toast.success('Successfully login!')
                navigate.push('/dashboard')
            } else {
                toast.error(res.error)
            }
        }).catch(err => {
            console.log(err);
        })

    }

    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);



    return (
        <main>
            <div className='container'>
                <div className='row m-0'>

                    <div className='my-3 mx-auto col-md-4 col-12 offset-md-4 offset-0 border p-3 rounded'>
                        <div className='fs-3 mb-3'>
                            <Typography variant='h5'>
                                Login
                            </Typography>
                        </div>
                        <form autoComplete='off' onSubmit={onSubmitHandle}>
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
                                <Button type='submit' variant='contained'>Login</Button>
                            </div>
                        </form>
                        <Button onClick={()=> navigate.push('/registration')}>Create a new account?</Button>
                    </div>
                </div>
            </div>

        </main>
    )
}

export default Login