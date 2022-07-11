import { Delete } from "@mui/icons-material";
import {
    Box, TextField, Button, Grid, Card, CardContent, Stack, Typography, MenuItem, Select, Divider, CardHeader,
    CardActions
} from "@mui/material";
import axios from "axios";
import { Form, Formik, FieldArray } from "formik";
import { useState,useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from 'yup'
import { url } from '../../api/api'
import { Fetch_Movies } from "../../redux/actions/action";
import { TheaterCompOpen, CreateMovieCompOpen } from '../../redux/reducer/reducer'
import _ from 'lodash'
import AdminNavBar from "./adminNavbar";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";


export default function TheaterCompCheck() {
    const [tokencheck] = useState(window.sessionStorage.getItem('authtoken'))
    const nav = useNavigate()
    // if (tokencheck) {
    //     window.history.pushState(null, null, window.location.href);
    //     window.onpopstate = function (event) {
    //         window.history.go(1);
    //     };
    // }
    return (
        tokencheck ? <>
            <TheaterComp />
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



const TheaterComp = () => {
    const dispatch = useDispatch()
    const movies = useSelector(state => state.movies)
    const nav = useNavigate()
    useEffect(() => {
        dispatch(Fetch_Movies())
    },[dispatch])


    let initialValues = {
        name: "apsara",
        city: "vijayawada",
        location: "vijayawada",
        soundSystem: "dts",
        cinemas: [
            {
                name: "pakka commerial",
                showTimes: "9:30,11:30",
                screens: "1,2",
                capacity: "150,100",
                availabilityTickets: "150,100",
                ticketRanges: "70,90,110",
                rowRanges: "2,5,8;3,3,4",
                rowNames: "a,a,a;a,a,a",
                rowCapacity: "10,10",
                cancellation: "no",
                ticketName: "second-class,first-class,balcony",
            }
        ]
    }


    let helperText = {
        showTimes: "Ex: 9:30,11:30",
        screens: "Ex:1,2",
        capacity: "Ex:100,200",
        availabilityTickets: "Ex:110,150",
        ticketRanges: "Ex:50,100",
        rowRanges: "Ex:5,5;2,5",
        rowNames: "a,m,h",
        ticketName: "Ex:Balcony,first-class",
        rowCapacity: "Ex:10,20",

    }

    let placeholderText = {
        showTimes: "Show Timings",
        screens: "Screen No's",
        capacity: "Screen Capacity",
        availabilityTickets: "Avaliable Seat's",
        ticketRanges: "Ticket Ranges",
        rowRanges: "No's of Row's/Price",
        rowNames: "Row Starting Name",
        ticketName: "Ticket Name",
        rowCapacity: "Capacity/Row",
    }

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Required'),
        city: Yup.string().required('Required'),
        location: Yup.string().required('Required'),
        soundSystem: Yup.string().required('Required'),
        cinemas: Yup.array().of(
            Yup.object().shape({
                name: Yup.string().test('name',
                    'details not found',
                    (str) => movies.map((e) => e.title === str).filter((e) => e).length > 0,
                ),
                showTimes: Yup.string().test(
                    (value, { createError }) => {
                        return value !== undefined ?
                            (
                                value.includes(',') ?
                                    (
                                        value.split(',').filter((e) => !e.includes('am') && !e.includes('pm')).length > 0 ?
                                            createError({ message: "provide am / pm in lowercase" }) :
                                            true
                                    )
                                    : !value.includes('am') && !value.includes('pm') ?
                                        createError({ message: "provide am / pm in lowercase" }) : true

                            )
                            : true
                    }
                ).required('Required'),
                screens: Yup.string().test(
                    (value, { parent, createError, }) => {
                        if ((typeof value === typeof parent.showTimes) && (value !== undefined && parent.showTimes !== undefined)) {

                            if (value.split(',').filter((e) => e).length !== parent.showTimes.split(',').filter((e) => e).length) {
                                return createError({
                                    message: "no of screens and no of shows should be equal"
                                })
                            }

                        }
                        return true;
                    }).required('Required'),
                capacity: Yup.string().test(
                    (value, { parent, createError, }) => {
                        if ((typeof value === typeof parent.screens) && (value !== undefined && parent.screens !== undefined)) {
                            if (value.split(',').filter((e) => e).length !== parent.screens.split(',').filter((e) => e).length) {
                                return createError({
                                    message: "no of Capacity's and no of Screens should be equal"
                                })
                            }
                        }
                        return true
                    }).required('Required'),
                availabilityTickets: Yup.string().test(
                    (value, { parent, createError, }) => {
                        if ((typeof value === typeof parent.capacity) && (value !== undefined && parent.capacity !== undefined)) {
                            // if(value.includes(',') && parent.capacity.includes(',')){

                            if (value.split(',').filter((e) => e).length !== parent.capacity.split(',').filter((e) => e).length) {
                                return createError({
                                    message: "no of screen Capacity's  and no of Tickets Available should be equal"
                                })
                            }
                            return value.split(',').filter((e, i) => parseInt(e) > parseInt(parent.capacity.split(',')[i])).length > 0 ?
                                createError({
                                    message: "Available seats should be less than screen capacity"
                                })
                                : true
                            // }
                            // return value.includes(',') && parent.availabilityTickets.includes(',') &&
                            //     parseInt(value)>parseInt(parent.availabilityTickets)?
                            //     createError({
                            //         message: "Available seats should less than screen capacity"
                            //     })
                            // :createError({
                            //     message: " no of Available seats must equal to no of screen capacity"
                            // })
                        }
                        return true
                    }).required('Required'),
                ticketRanges: Yup.string().required('Required'),
                rowRanges: Yup.string().test(
                    (value, { parent, createError }) => {
                        return value !== undefined && parent.availabilityTickets !== undefined && parent.ticketRanges !== undefined ?
                            (
                                value.split(';').filter((e) => e).length !== parent.availabilityTickets.split(',').length ?
                                    (
                                        createError({ message: "RowRanges Length not equal to Available Tickets Length" })
                                    )
                                    : value.split(';').filter((e) => e.split(',').filter((e) => e).length !== parent.ticketRanges.split(',').filter((e) => e).length).length > 0 ?
                                        createError({ message: "RowRanges/show Length not equal to Tickets Ranges Length" }) : true
                            )
                            : true


                    }
                ).required('Required'),
                rowNames: Yup.string().test(
                    (value, { parent, createError }) => {
                        if (value !== undefined && parent.rowRanges !== undefined) {
                            return value.split(';').filter((e) => e).length !== parent.rowRanges.split(';').length ?
                                (
                                    createError({ message: "RowNames Length not equal to RowRanges Length" })
                                )
                                : value.split(';').filter((e, i) => e.split(',').filter((e) => e).length !==
                                    parent.rowRanges.split(';')[i].split(",").filter((e) => e).length).length > 0 ?
                                    createError({ message: "RowNames/show Length not equal to RowRanges/show Length" }) : true
                        }
                        return true
                    }
                ).required('Required'),
                rowCapacity: Yup.string().test(
                    (value, { parent, createError }) => {
                        return value !== undefined && parent.rowNames !== undefined ?
                            value.split(',').filter((e) => e).length !== parent.rowNames.split(';').filter((e) => e).length ?
                                createError({ message: "RowCapacity length not equal to rowNames length" })
                                :
                                (

                                    parent.availabilityTickets.split(',').map(Number).filter((e, avi) => e < parseInt(parent.rowRanges.split(';').map((rr, i) => {
                                        return rr.split(',').map(Number).map((rre) => {
                                            return rre * value.split(',').map(Number)[i]
                                        }).reduce((acc, cv) => acc + cv)
                                    })[avi])
                                    ).length > 0
                                        ?
                                        createError({ message: "combined value of RowRanges/show not equal to Available Tickets/show" })
                                        : true
                                )
                            : true
                    }
                ).required('Required'),
                ticketName: Yup.string().test(
                    (value, { parent, createError }) => {
                        return value !== undefined && parent.ticketRanges !== undefined ?
                            (
                                value.split(',').filter((e) => e).length
                                    !== parent.ticketRanges.split(',').filter((e) => e).length ?
                                    createError({ message: "Ticket Names length not equal to Ticket Ranges" })
                                    : true
                            )
                            : true
                    }
                ).required('Required'),
                cancellation: Yup.string().required('Required'),
            })
        )
    })

    const handleMovieComp = () => {
        dispatch(TheaterCompOpen())
        dispatch(CreateMovieCompOpen())
    }

    const handleSubmit = async (e, onSubmitprops) => {

        let dummyVar = e
        dummyVar.cinemas.map((obj) => Object.keys(obj).map((key) => {
            return key !== "rowRanges" && key !== "rowNames" ?
                obj[key] = obj[key].includes(',') ? obj[key].split(',') : obj[key]
                : obj[key] = obj[key].includes(';') ? obj[key].split(';').map((e) => e = e.split(','))
                    : obj[key].split(',')
        }))


        
        try {
            let response = await axios.post(`${url}/theater/create`, {
                theater: e
            })
            if (!response.data.error) {
                alert(response.data.msg)
                onSubmitprops.resetForm()
            }
            else if (response.data.error) {
                alert(response.data.error)
            }
        }
        catch (err) {
            alert(JSON.stringify(err, null, 2))
        }
    }

    const BodyStyling = styled('div')({
        backgroundImage: "url(https://cdn.pixabay.com/photo/2019/04/24/21/55/cinema-4153289__480.jpg)",
        backgroundPosition: "center",
        minHeight: "695px",
        height: "100%",
        backgroundSize: "cover"
    })

    return (
        <BodyStyling >
            <Stack spacing={2}>
                <AdminNavBar />
                <Grid container alignItems="flex-start">
                    <Grid item xs={3} sx={{ textAlign: "center" }} >
                        <Button color="error" variant="contained"
                            onClick={() => nav('/admin/dashboard')}
                        >Back</Button>
                    </Grid>
                    <Grid item xs={8}>

                        <Box sx={{ display: "flex", justifyContent: "space-evenly", alignItems: "center" }}>

                            <Stack spacing={4} direction="row" alignItems="center">
                                <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={(e, onSubmitprops) => handleSubmit(e, onSubmitprops)}>
                                    {
                                        (props) => {
                                            return (
                                                <Form>
                                                    <Card sx={{ maxWidth: 650 }} >
                                                        <CardContent>
                                                            <Box sx={{ mb: "1rem" }}>
                                                                <Typography variant="h5" sx={{ textAlign: "center" }}>Theater&nbsp;Details</Typography>
                                                            </Box>
                                                            <Grid container spacing={4} sx={{ mb: "1rem" }}>
                                                                <Grid item xs={6}>
                                                                    <TextField fullWidth onBlur={props.handleBlur} error={props.touched.name && props.errors.name && (true)} name="name" value={props.values.name} placeholder="Name" onChange={props.handleChange} />
                                                                    {props.touched.name && props.errors.name && (

                                                                        <Typography color="red">{props.errors.name}</Typography>
                                                                    )}
                                                                </Grid>
                                                                <Grid item xs={6}>
                                                                    <TextField fullWidth onBlur={props.handleBlur} error={props.touched.city && props.errors.city && (true)} name="city" value={props.values.city} placeholder="City" onChange={props.handleChange} />
                                                                    {props.touched.city && props.errors.city && (

                                                                        <Typography color="red">{props.errors.city}</Typography>
                                                                    )}
                                                                </Grid>
                                                                <Grid item xs={6}>
                                                                    <TextField fullWidth onBlur={props.handleBlur} error={props.touched.location && props.errors.location && (true)} name="location" value={props.values.location} placeholder="Location" onChange={props.handleChange} />
                                                                    {props.touched.location && props.errors.location && (

                                                                        <Typography color="red">{props.errors.location}</Typography>
                                                                    )}
                                                                </Grid>
                                                                <Grid item xs={6}>
                                                                    <TextField fullWidth onBlur={props.handleBlur} error={props.touched.soundSystem && props.errors.soundSystem && (true)} name="soundSystem" value={props.values.soundSystem} placeholder="Sound System" onChange={props.handleChange} />
                                                                    {props.touched.soundSystem && props.errors.soundSystem && (

                                                                        <Typography color="red">{props.errors.soundSystem}</Typography>
                                                                    )}
                                                                </Grid>
                                                            </Grid>
                                                            <Box>
                                                                <Typography variant="h5" sx={{ textAlign: "center" }}>Cinema&nbsp;Details</Typography>
                                                            </Box>

                                                            <FieldArray name="cinemas">
                                                                {
                                                                    (arrayHelpers) => {
                                                                        return (
                                                                            <Grid>
                                                                                <Button onClick={() => arrayHelpers.push(
                                                                                    {
                                                                                        name: "",
                                                                                        showTimes: "",
                                                                                        screens: "",
                                                                                        capacity: "",
                                                                                        availabilityTickets: "",
                                                                                        ticketRanges: "",
                                                                                        rowRanges: "",
                                                                                        rowNames: "",
                                                                                        rowCapacity: "",
                                                                                        cancellation: "",
                                                                                        ticketName: "",
                                                                                    }
                                                                                )}>Add&nbsp;Cinema&nbsp;Details</Button>
                                                                                {props.values.cinemas.map((obj, i) => {
                                                                                    return (
                                                                                        <Grid container spacing={3} key={`obj${i}`} sx={{ mb: "1rem" }}>
                                                                                            
                                                                                            <Grid item xs={12} alignItems="center">
                                                                                                <Divider sx={{ "&.MuiDivider-root:before,&.MuiDivider-root:after": { borderTop: "2px solid grey" } }}>
                                                                                                    Cinema&nbsp;Details&nbsp;{i + 1}
                                                                                                    {i > 0 && (<Button sx={{ p: 0 }} onClick={() => arrayHelpers.remove(i)}><Delete sx={{ color: "red" }} /></Button>)}
                                                                                                </Divider>

                                                                                            </Grid>
                                                                                            <Grid item xs={12}>
                                                                                                <TextField error={
                                                                                                    props.touched.cinemas && props.errors.cinemas && (
                                                                                                        props.touched.cinemas[i] && props.errors.cinemas[i]) && (
                                                                                                        props.touched.cinemas[i].name && props.errors.cinemas[i].name) &&
                                                                                                    (true)
                                                                                                }
                                                                                                    fullWidth name={`cinemas[${i}].name`} value={obj.name} placeholder="Cinema Name" onChange={props.handleChange} onBlur={props.handleBlur} />
                                                                                                {props.touched.cinemas && props.errors.cinemas && (
                                                                                                    props.touched.cinemas[i] && props.errors.cinemas[i]) && (
                                                                                                        props.touched.cinemas[i].name && props.errors.cinemas[i].name) &&
                                                                                                    (
                                                                                                        <Button sx={{ color: "red", textDecoration: "underline" }} onClick={() => handleMovieComp()}>Add&nbsp;Movie&nbsp;Details</Button>

                                                                                                    )}
                                                                                            </Grid>
                                                                                            <Grid item xs={12}>
                                                                                                <Typography sx={{ textTransform: "capitalize" }}>Seperate multiple timings,screens,capacity,priceRanges with (,)</Typography>

                                                                                            </Grid>
                                                                                            {
                                                                                                Object.keys(obj).map((key) => {
                                                                                                    return (
                                                                                                        key !== "cancellation" && key !== "name" ?
                                                                                                            <Grid item key={key} xs={key === "ticketName" ? 12 : 4}>
                                                                                                                <TextField fullWidth
                                                                                                                    disabled={
                                                                                                                        movies.map((e) => e.title === obj.name).filter((e) => e).length > 0 ? false : true
                                                                                                                    }
                                                                                                                    onBlur={props.handleBlur}
                                                                                                                    error={
                                                                                                                        props.touched.cinemas && props.errors.cinemas && (
                                                                                                                            props.touched.cinemas[i] && props.errors.cinemas[i]) && (
                                                                                                                            props.touched.cinemas[i][key] && props.errors.cinemas[i][key]) &&
                                                                                                                        (true)
                                                                                                                    }

                                                                                                                    helperText={helperText[key]} name={`cinemas[${i}][${key}]`} value={obj[key]} placeholder={placeholderText[key]} onChange={props.handleChange} />
                                                                                                                {props.touched.cinemas && props.errors.cinemas && (
                                                                                                                    props.touched.cinemas[i] && props.errors.cinemas[i]) && (
                                                                                                                        props.touched.cinemas[i][key] && props.errors.cinemas[i][key]) &&
                                                                                                                    (

                                                                                                                        <Typography color="red">{props.errors.cinemas[i][key]}</Typography>
                                                                                                                    )}
                                                                                                            </Grid> : <></>
                                                                                                    )
                                                                                                })
                                                                                            }
                                                                                            <Grid item xs={12}>
                                                                                                <Select
                                                                                                    disabled={
                                                                                                        movies.map((e) => e.title === obj.name).filter((e) => e).length > 0 ? false : true
                                                                                                    }
                                                                                                    fullWidth name={`cinemas[${i}].cancellation`} value={obj.cancellation} onChange={props.handleChange} >
                                                                                                    <MenuItem disabled selected value="">--Cancellation--</MenuItem>
                                                                                                    <MenuItem value="yes">Yes</MenuItem>
                                                                                                    <MenuItem value="no">No</MenuItem>
                                                                                                </Select>
                                                                                            </Grid>

                                                                                        </Grid>
                                                                                    )
                                                                                })}
                                                                            </Grid>

                                                                        );
                                                                    }
                                                                }
                                                            </FieldArray>

                                                            <Box sx={{ mt: "1rem", textAlign: "center" }}>
                                                                <Button
                                                                    // disabled={props.values?false:true}
                                                                    type="submit" variant="contained">Add</Button>
                                                            </Box>
                                                        </CardContent>
                                                    </Card>
                                                </Form>
                                            )
                                        }
                                    }
                                </Formik>
                                <Card sx={{ width: 300 }}>
                                    <CardHeader
                                        title="Instructions"
                                    >
                                    </CardHeader>
                                    <CardContent>
                                        <Typography sx={{ fontWeight: "bold" }}>RowRanges:</Typography>
                                        <Typography>
                                            Seperate Ranges with comma(,) for single show
                                            and semiColon(;) for different show timings
                                        </Typography>
                                        <Typography sx={{ fontWeight: "bold" }}>RowNames:</Typography>
                                        <Typography>
                                            Seperate Names with comma(,) for single show
                                            and semiColon(;) for different show timings
                                        </Typography>

                                    </CardContent>
                                </Card>
                            </Stack>
                        </Box>

                    </Grid>
                </Grid>
            </Stack>
        </BodyStyling>

    );
}