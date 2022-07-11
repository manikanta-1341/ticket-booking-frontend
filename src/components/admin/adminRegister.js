import React, { useState } from 'react';
import {
    Avatar,
    Button,
    CssBaseline,
    TextField,
    Link,
    Grid,
    Box,
    Typography,
    Container
} from '@mui/material'
import { LockOutlined } from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Formik } from 'formik'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
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

export default function AdminSignUp() {
    const [user] = useState({
        username: "",
        email: "",
        firstname: "",
        lastname: "",
        password: "",
        confirm_password: ""
    })
    const nav = useNavigate()
    const handleSubmit = async (e, onSubmitProps) => {
        try {
            if (e.password === e.confirm_password) {

                let dummyState = { ...e, name: e.firstname + e.lastname }
                delete dummyState["lastname"]
                delete dummyState["firstname"]
                delete dummyState["confirm_password"]
                let response = await axios.post(`${url}/admin/signup`, {
                    admin: dummyState
                })
                if (!response.data.msg && response.status === 200) {
                    onSubmitProps.resetForm()
                    nav('/admin/login')
                }
                else {
                    alert(response.data.msg)
                }

            }
            else {
                alert("password not matched")
            }
        }
        catch (err) {
            console.log(err)
        }
    }

    const Validate = (value) => {
        let error = {}
        if (value.firstname === "") {
            error.firstname = "Firstname is Required"
        }
        if (value.lastname === "") {
            error.lastname = "Lastname is Required"
        }
        if (value.username === "") {
            error.username = "Username is Required"
        }
        if (value.email === "" || !value.email.includes("@") || !value.email.includes(".com")) {
            error.email = "Email is not valid"
        }
        if (value.password === "") {
            error.password = "Password is Required"
        }
        return error
    }

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlined />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign up
                    </Typography>

                    <Formik
                        initialValues={user}
                        validate={(value) => Validate(value)}
                        onSubmit={(e, onSubmitProps) => handleSubmit(e, onSubmitProps)}
                    >
                        {({
                            values,
                            errors,
                            touched,
                            handleChange,
                            handleBlur,
                            handleSubmit,
                        }) => (
                            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            autoComplete="given-name"
                                            name="firstname"
                                            required
                                            fullWidth
                                            id="firstname"
                                            label="First Name"
                                            autoFocus
                                            value={values.firstname}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        <Typography color="red">{touched.firstname && errors.firstname}</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            id="lastname"
                                            label="Last Name"
                                            name="lastname"
                                            autoComplete="family-name"
                                            value={values.lastname}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        <Typography color="red">{touched.lastname && errors.lastname}</Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            id="username"
                                            label="Username"
                                            name="username"
                                            autoComplete="username"
                                            value={values.username}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        <Typography color="red">{touched.username && errors.username}</Typography>

                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            id="email"
                                            label="Email"
                                            name="email"
                                            autoComplete="email"
                                            value={values.email}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        <Typography color="red">{touched.email && errors.email}</Typography>

                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            name="password"
                                            label="Password"
                                            type="password"
                                            id="password"
                                            autoComplete="new-password"
                                            value={values.password}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        <Typography color="red">{touched.password && errors.password}</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            name="confirm_password"
                                            label="Confirm Password"
                                            type="password"
                                            id="confirm_password"
                                            autoComplete="new-password"
                                            value={values.confirm_password}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        <Typography color="red">{touched.confirm_password && errors.confirm_password}</Typography>
                                    </Grid>
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        sx={{ mt: 3, mb: 2 }}
                                    >
                                        Sign Up
                                    </Button>
                                    <Grid container justifyContent="flex-end">
                                        <Grid item>
                                            <Link href="/" variant="body2">
                                                Already have an account? Sign in
                                            </Link>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Box>

                        )}
                    </Formik>
                </Box>
                <Copyright sx={{ mt: 5 }} />
            </Container>
        </ThemeProvider>
    );
}