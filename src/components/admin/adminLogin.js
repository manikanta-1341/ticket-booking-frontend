import React, { useState } from 'react';
import { Formik } from 'formik'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {url} from '../../api/api'
function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="#">
                Your Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const theme = createTheme();

export default function AdminSignIn() {
    const nav = useNavigate()
    
    const [passwordDiv, setPasswordDiv] = useState(true)
    let initialvalues = {
        username: "",
        password: ""
    }
    const handleSubmit = async (e) => {
        
        try {
            let response = await axios.post(`${url}/admin/login`, {
                username: e.username,
                password: e.password
            })
            
            if (!response.data.msg) {
                window.sessionStorage.setItem('authtoken', response.data)
                nav('/admin/dashboard')
            }
            else {
                alert(response.data.msg)
            }
        }
        catch (err) {
            alert(err.msg)
        }
    };
    const Validate = (value) => {
        let error = {}
        if (value.username === "") {
            error.username = "Username is Required"
        }
        if (value.password === "") {
            error.password = "Password is Required"
        }
        return error
    }

    window.history.pushState(null, null, window.location.href);
    window.onpopstate = function (event) {
        window.history.go(1);
    }

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 10,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'error.main' }}>
                        M
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Admin Login
                    </Typography>
                    <Formik
                        initialValues={initialvalues}
                        validate={(value) => Validate(value)}
                        onSubmit={(e) => handleSubmit(e)}
                    >
                        {({
                            values,
                            errors,
                            touched,
                            handleChange,
                            handleBlur,
                            handleSubmit,
                        }) => (

                            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: "100%", maxWidth: "40rem" }}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="username"
                                    label="Username"
                                    name="username"
                                    autoComplete="username"
                                    // autoFocus
                                    value={values.username}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                <Typography color="red">{touched.username && errors.username}</Typography>
                                {passwordDiv === true ? <Button
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                    onClick={() => {

                                        if (values.username !== "") {

                                            setPasswordDiv(false)
                                        }
                                        else {
                                            alert("Username is not valid")
                                        }
                                    }}
                                >
                                    next
                                </Button>
                                    :
                                    <>
                                        <TextField
                                            margin="normal"
                                            required
                                            fullWidth
                                            name="password"
                                            label="Password"
                                            type="password"
                                            id="password"
                                            autoComplete="current-password"
                                            value={values.password}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        <Typography color="red">{touched.password && errors.password}</Typography>

                                        <Button
                                            type="submit"
                                            fullWidth
                                            variant="contained"
                                            sx={{ mt: 3, mb: 2 }}
                                        >
                                            Sign In
                                        </Button>
                                    </>
                                }
                                <Grid container>
                                    <Grid item xs>
                                        <Link href="/admin/forgetpassword" variant="body2">
                                            Forgot password?
                                        </Link>
                                    </Grid>
                                    <Grid item>
                                        <Link href="/admin/register" variant="body2">
                                            {"Don't have an account? Sign Up"}
                                        </Link>
                                    </Grid>
                                </Grid>
                            </Box>
                        )}
                    </Formik>
                </Box>
                <Copyright sx={{ mt: 8, mb: 4 }} />
            </Container>
        </ThemeProvider>
    );
}