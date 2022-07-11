import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Card, CardContent, CardActions, Button, Typography, Box, TextField, Grid,Stack,
    InputAdornment, IconButton
} from "@mui/material"
import { Formik, Form, FieldArray, } from "formik"
import * as Yup from 'yup';
import { Delete } from '@mui/icons-material'
import styled from "@emotion/styled";
import { url } from "../../api/api";
import axios from 'axios'
import AdminNavBar from "./adminNavbar";


export default function CreateMovieCheck() {
    const [tokencheck] = useState(window.sessionStorage.getItem('authtoken'))
    const nav = useNavigate()
    if (tokencheck) {
        window.history.pushState(null, null, window.location.href);
        window.onpopstate = function (event) {
            window.history.go(1);
        };
    }
    return (
        tokencheck ? <>
            <CreateMovie />
        </>
            :
            <>
                <Card sx={{ width: '100%', maxWidth: "40%", mx: "auto", mt: "12%", p: "2%", backgroundColor: "#e9e9e9" }} variant="outlined">
                    <CardContent>
                        <Typography sx={{ textAlign: "center" }} variant="h5" color="dark">Please Login To Access The Content</Typography>
                    </CardContent>
                    <CardActions>
                        <Button sx={{ mx: "auto", fontSize: "1.5rem" }} onClick={() => nav('/admin/login')}>Login</Button>
                    </CardActions>
                </Card>
            </>
    );
}


const CreateMovie = () => {
    const nav = useNavigate()
    const initialValues = useState({
        title: "",
        image: "",
        coverImage: "",
        releaseDate: "",
        cast: [
            { name: "", role: "", image: "" },
            { name: "", role: "", image: "" },
        ],
        crew: [
            { name: "", role: "", image: "" },
            { name: "", role: "", image: "" }
        ],
        segment: "",
        hr: "",
        min: "",
        certificate: "",
        cinemaType: "",
        about: "",
        language: ""

    })

    const ValidationSchema = Yup.object().shape({
        title: Yup.string().required('Required'),
        movieImage: Yup.string().matches(/(https|http|www.)/, "Invalid url"),
        releaseDate: Yup.date()
            .typeError("Date must be Today or Future one")
            .min(new Date().toISOString().split("").splice(0, 10).join("").split("-").reverse().join("-"),
                "Date must be Today or Future one")
            .required('Required'),
        cast: Yup.array().of(
            Yup.object().shape({
                name: Yup.string().required("Required"),
                role: Yup.string().required("Required"),
                image: Yup.string().matches(/(https|http|www.)/, "Invalid url")
            })
        ),
        crew: Yup.array().of(
            Yup.object().shape({
                name: Yup.string().required("Required"),
                role: Yup.string().required("Required"),
                image: Yup.string().matches(/(https|http|www.)/, "Invalid url")
            })
        ),
        segment: Yup.string().required('Required'),
        hr: Yup.number().required('Required'),
        min: Yup.number().required('Required'),
        certificate: Yup.string().required('Required'),
        about: Yup.string().required('Required'),
        language: Yup.string().required('Required'),
        cinemaType: Yup.mixed().oneOf(['3D', '2D', '2d', '3d'])
            .required('Required'),

    })

    const handleSubmit = async (event, onSubmitprops) => {
        let dummyVar = event
        dummyVar.time = dummyVar.hr + "," + dummyVar.min
        dummyVar.cinemaType = dummyVar.cinemaType.toUpperCase()
        delete dummyVar.hr
        delete dummyVar.min
        try {
            let response = await axios.post(`${url}/movies/create`, {
                movie: dummyVar
            })
            if (response.data.msg) {
                alert(response.data.msg)
                onSubmitprops.resetForm()
            }
            else if (response.data.error) {
                alert(JSON.stringify(response.data.error, null, 2))
            }
        } catch (err) {
            alert({
                error: JSON.stringify(err, null, 2)
            })
        }
    }

    const BodyStyling = styled('div')({
        backgroundImage: "url(https://www.lambesc.fr/fileadmin/user_upload/cinema.jpg)",
        // : createTheaterCompOpen === true ? "url(https://cdn.pixabay.com/photo/2019/04/24/21/55/cinema-4153289__480.jpg)" : "",
        backgroundPosition: "center",
        minHeight: "695px",
        height: "100%",
        backgroundSize: "cover"
    })

    return (
        <BodyStyling >
            <Stack spacing={2}>
                <AdminNavBar />
                <Grid container  alignItems="flex-start">
                    <Grid item xs={3} sx={{ textAlign: "center" }} >
                        <Button color="error" variant="contained"
                            onClick={() => nav('/admin/dashboard')}
                        >Back</Button>
                    </Grid>
                    <Grid item xs={4}>

                        <Formik
                            initialValues={initialValues[0]}
                            validationSchema={ValidationSchema}
                            onSubmit={(event, onSubmitprops) => handleSubmit(event, onSubmitprops)}

                        >
                            {(props) => {
                                return (
                                    <Form>
                                        <Card sx={{
                                            width: 550,
                                            mx: "auto",
                                        }}
                                            elevation={4}>
                                            <CardContent>
                                                <Grid container rowGap={2} sx={{ textAlign: "center", justifyContent: "center" }}>
                                                    {

                                                        Object.keys(props.values).map((key, i) => {
                                                            return (
                                                                key !== "crew" && key !== "cast" && key !== "hr" && key !== "min" &&
                                                                (
                                                                    <Grid item xs={6} key={i}>
                                                                        <Typography sx={{ fontWeight: "bold", textTransform: "capitalize" }}>{key}</Typography>
                                                                        <TextField
                                                                            name={key}
                                                                            value={key === "certificate" || key === "cinemaType" ? props.values[key].toUpperCase() : props.values[key]}
                                                                            placeholder={
                                                                                key === "releaseDate" ? "dd/mm/yyyy"
                                                                                    : key === "segment" ? "horror,comdey,action" : key
                                                                            }
                                                                            helperText={key === "segment" ? "seperate with (,)comma" : ""}
                                                                            onChange={props.handleChange}
                                                                            error={props.touched[key] && props.errors[key] && true}
                                                                        />
                                                                        <Typography sx={{ color: "red" }}>{
                                                                            props.touched[key] && props.errors[key] ? props.errors[key] : ""
                                                                        }</Typography>
                                                                    </Grid>
                                                                )
                                                            )
                                                        })
                                                    }
                                                    <Grid item xs={6} sx={{ textAlign: "center", my: "1rem" }} >
                                                        <Typography sx={{ fontWeight: "bold", textTransform: "capitalize" }}>duration</Typography>
                                                        < Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                            <TextField
                                                                error={props.touched.hr && props.errors.hr && true}
                                                                name="hr"
                                                                value={props.values.hr}
                                                                onChange={props.handleChange}
                                                                sx={{
                                                                    "& .MuiOutlinedInput-input": {
                                                                        width: "3rem",
                                                                        p: "5px",
                                                                        textAlign: "center",
                                                                    },
                                                                }}
                                                            />&nbsp;
                                                            <Typography >Hr</Typography>&nbsp;
                                                            <TextField
                                                                error={props.touched.min && props.errors.min && true}
                                                                name="min"
                                                                value={props.values.min}
                                                                onChange={props.handleChange}

                                                                sx={{
                                                                    "& .MuiOutlinedInput-input": {
                                                                        width: "3rem",
                                                                        p: "5px",
                                                                        textAlign: "center",
                                                                    },
                                                                }}
                                                            />&nbsp;
                                                            <Typography>Min</Typography>
                                                        </Box>
                                                    </Grid>

                                                    <FieldArray name="cast">
                                                        {
                                                            (arrayHelpers) => {
                                                                return (
                                                                    <Grid item xs={12} rowGap={4}>
                                                                        <Typography sx={{ fontWeight: "bold" }}>Cast:
                                                                            <Button onClick={() =>
                                                                                arrayHelpers.push({ name: "", image: "" })
                                                                            }>Add Actor</Button>
                                                                        </Typography>
                                                                        {
                                                                            props.values.cast.map((obj, i) => {
                                                                                return (
                                                                                    <Grid container key={i} justifyContent="space-around" sx={{ mb: "1rem" }}>
                                                                                        <Grid item xs={12} display="flex" justifyContent="space-around" sx={{ mb: "1rem" }}>
                                                                                            <Grid item >

                                                                                                <TextField

                                                                                                    name={`cast[${i}].name`}
                                                                                                    value={obj.name}
                                                                                                    placeholder="Actor Name"
                                                                                                    onChange={props.handleChange}
                                                                                                    onBlur={props.handleBlur}
                                                                                                    error={(props.errors.cast && props.touched.cast) &&
                                                                                                        (props.errors.cast[i] && props.touched.cast[i]) &&
                                                                                                        (props.errors.cast[i].name && props.touched.cast[i].name) &&
                                                                                                        (true)
                                                                                                    }
                                                                                                />
                                                                                                <Typography sx={{ color: "red" }}>{
                                                                                                    (props.errors.cast && props.touched.cast) &&
                                                                                                    (props.errors.cast[i] && props.touched.cast[i]) &&
                                                                                                    props.errors.cast[i].name
                                                                                                }</Typography>
                                                                                            </Grid>
                                                                                            <Grid item >

                                                                                                <TextField

                                                                                                    name={`cast[${i}].role`}
                                                                                                    value={obj.role}
                                                                                                    placeholder="Actor Role"
                                                                                                    onChange={props.handleChange}
                                                                                                    onBlur={props.handleBlur}
                                                                                                    error={(props.errors.cast && props.touched.cast) &&
                                                                                                        (props.errors.cast[i] && props.touched.cast[i]) &&
                                                                                                        (props.errors.cast[i].role && props.touched.cast[i].role) &&
                                                                                                        (true)
                                                                                                    }
                                                                                                />
                                                                                                <Typography sx={{ color: "red" }}>{
                                                                                                    (props.errors.cast && props.touched.cast) &&
                                                                                                    (props.errors.cast[i] && props.touched.cast[i]) &&
                                                                                                    props.errors.cast[i].role
                                                                                                }</Typography>
                                                                                            </Grid>
                                                                                        </Grid>
                                                                                        <Grid item xs={10}>

                                                                                            <TextField
                                                                                                fullWidth
                                                                                                name={`cast[${i}].image`}
                                                                                                value={obj.image}
                                                                                                placeholder="Actor Image"
                                                                                                onChange={props.handleChange}
                                                                                                onBlur={props.handleBlur}
                                                                                                error={(props.errors.cast && props.touched.cast) &&
                                                                                                    (props.errors.cast[i] && props.touched.cast[i]) &&
                                                                                                    (props.errors.cast[i].image && props.touched.cast[i].image) &&
                                                                                                    (true)
                                                                                                }
                                                                                                sx={{ pr: 0, }}
                                                                                                InputProps={{
                                                                                                    endAdornment: (
                                                                                                        i > 0 && (<IconButton onClick={() => arrayHelpers.remove(i)}>
                                                                                                            <InputAdornment position="end">
                                                                                                                <Delete fontSize="small" />
                                                                                                            </InputAdornment>
                                                                                                        </IconButton>)
                                                                                                    )
                                                                                                }

                                                                                                }
                                                                                            />
                                                                                            <Typography sx={{ color: "red" }}>{
                                                                                                (props.errors.cast && props.touched.cast) &&
                                                                                                (props.errors.cast[i] && props.touched.cast[i]) &&
                                                                                                props.errors.cast[i].image
                                                                                            }</Typography>
                                                                                        </Grid>

                                                                                    </Grid>
                                                                                )
                                                                            })}

                                                                    </Grid>
                                                                )
                                                            }
                                                        }
                                                    </FieldArray>

                                                    <FieldArray name="crew">
                                                        {
                                                            (arrayHelpers) => {
                                                                return (
                                                                    <Grid container justifyContent="center" spacing={2}>
                                                                        <Typography sx={{ fontWeight: "bold" }}>Crew:
                                                                            <Button onClick={() =>
                                                                                arrayHelpers.push({ name: "", image: "" })
                                                                            }>Add</Button>
                                                                        </Typography>
                                                                        {
                                                                            props.values.crew.map((obj, i) => {
                                                                                return (
                                                                                    <Grid container key={i} justifyContent="center" sx={{ mb: "1rem" }}>
                                                                                        <Grid item xs={12} display="flex" justifyContent="space-around" sx={{ mb: "1rem" }} >

                                                                                            <Grid item >

                                                                                                <TextField

                                                                                                    name={`crew[${i}].name`}
                                                                                                    value={obj.name}
                                                                                                    placeholder="Crew Name"
                                                                                                    onChange={props.handleChange}
                                                                                                    onBlur={props.handleBlur}
                                                                                                    error={(props.errors.crew && props.touched.crew) &&
                                                                                                        (props.errors.crew[i] && props.touched.crew[i]) &&
                                                                                                        (props.errors.crew[i].name && props.touched.crew[i].name) &&
                                                                                                        (true)
                                                                                                    }
                                                                                                />
                                                                                                <Typography sx={{ color: "red" }}>{
                                                                                                    (props.errors.crew && props.touched.crew) &&
                                                                                                    (props.errors.crew[i] && props.touched.crew[i]) &&
                                                                                                    props.errors.crew[i].name
                                                                                                }</Typography>
                                                                                            </Grid>
                                                                                            <Grid item >

                                                                                                <TextField

                                                                                                    name={`crew[${i}].role`}
                                                                                                    value={obj.role}
                                                                                                    placeholder="Crew Role"
                                                                                                    onChange={props.handleChange}
                                                                                                    onBlur={props.handleBlur}
                                                                                                    error={(props.errors.crew && props.touched.crew) &&
                                                                                                        (props.errors.crew[i] && props.touched.crew[i]) &&
                                                                                                        (props.errors.crew[i].role && props.touched.crew[i].role) &&
                                                                                                        (true)
                                                                                                    }
                                                                                                />
                                                                                                <Typography sx={{ color: "red" }}>{
                                                                                                    (props.errors.crew && props.touched.crew) &&
                                                                                                    (props.errors.crew[i] && props.touched.crew[i]) &&
                                                                                                    props.errors.crew[i].role
                                                                                                }</Typography>
                                                                                            </Grid>
                                                                                        </Grid>

                                                                                        <Grid item xs={10}>

                                                                                            <TextField
                                                                                                fullWidth
                                                                                                name={`crew[${i}].image`}
                                                                                                value={obj.image}
                                                                                                placeholder="Crew Image"
                                                                                                onChange={props.handleChange}
                                                                                                onBlur={props.handleBlur}
                                                                                                error={(props.errors.crew && props.touched.crew) &&
                                                                                                    (props.errors.crew[i] && props.touched.crew[i]) &&
                                                                                                    (props.errors.crew[i].image && props.touched.crew[i].image) &&
                                                                                                    (true)
                                                                                                }
                                                                                                sx={{ pr: 0 }}
                                                                                                InputProps={{
                                                                                                    endAdornment: (
                                                                                                        i > 0 && (<IconButton onClick={() => arrayHelpers.remove(i)}>
                                                                                                            <InputAdornment position="end">
                                                                                                                <Delete fontSize="small" />
                                                                                                            </InputAdornment>
                                                                                                        </IconButton>)
                                                                                                    )
                                                                                                }

                                                                                                }
                                                                                            />
                                                                                            <Typography sx={{ color: "red" }}>{
                                                                                                (props.errors.crew && props.touched.crew) &&
                                                                                                (props.errors.crew[i] && props.touched.crew[i]) &&
                                                                                                props.errors.crew[i].image
                                                                                            }</Typography>
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                )
                                                                            })}

                                                                    </Grid>
                                                                )
                                                            }
                                                        }
                                                    </FieldArray>

                                                </Grid>
                                                <Box sx={{ textAlign: "center" }}>
                                                    <Button type="submit" variant="contained" sx={{ fontSize: "1rem" }}>Create</Button>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Form>
                                )
                            }}
                        </Formik >
                        
                    </Grid>
                </Grid>
            </Stack>
        </BodyStyling >
    )



}