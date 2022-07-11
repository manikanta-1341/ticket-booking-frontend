import AdminNavBar from "./adminNavbar";
import {
    Box, Select, CircularProgress, Button, Card, CardContent, CardActions, Stack,
    Typography, MenuItem, TextField, Grid, IconButton, InputAdornment
} from "@mui/material";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Fetch_Movies, Delete_Movie, Fetch_theaters } from "../../redux/actions/action";
import { useNavigate } from "react-router-dom";
import { Check, Clear, Delete, Favorite } from "@mui/icons-material";


export default function DeleteMovieCheck() {
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
            <DeleteMovie />
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



const DeleteMovie = () => {
    const dispatch = useDispatch()
    const movies = useSelector(state => state.movies)
    const theaters = useSelector(state => state.theaters)
    const nav = useNavigate()
    useEffect(() => {
        dispatch(Fetch_Movies())
        dispatch(Fetch_theaters())
    }, [dispatch])
    const movie_apiStatus = useSelector(state => state.fetch_movies_apiStatus)
    const [selectedMovie, setSelectedMovie] = useState('')
    const [movie_in_theater, setMovie_in_theater] = useState('')
    const [movieValue, setMovieValue] = useState('')
    const [theaterValue, setTheaterValue] = useState('')


    const likes_style = {
        height: "30px",
        width: "188px",
        backgroundColor: "black",
        color: "white",
        borderBottomLeftRadius: "10px",
        borderBottomRightRadius: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex start",
        pl: 1.5,
        gap: 1

    }

    const title_style = {
        color: "black",
        textTransform: "capitalize",
        fontWeight: "bold",
    }

    const handleFilter = (type, e) => {
        
        if (e.target.value !== "") {
            let dummyFilter = type === "movie" ? movies.filter((obj) => e.target.value === obj.title.substring(0, e.target.value.length)) : ""
            let dummytheater = ""
            if (type === "theater") {
                theaters.map((obj) => type === "theater" && obj.cinemas.map((c_obj) => {
                    if (movieValue === c_obj.name.substring(0, movieValue.length) && theaterValue === obj.name.substring(0, theaterValue.length)) {

                        dummytheater = true
                        dummyFilter = movies.filter((obj) => obj.title.includes(movieValue))
                    }
                    return obj
                }))
            }
            setSelectedMovie(dummyFilter)
            setMovie_in_theater(dummytheater)
            type === "movie" ? setMovieValue(e.target.value) : setTheaterValue(e.target.value)
        }
        else {
            setSelectedMovie("")
            setMovie_in_theater("")
            type === "movie" ? setMovieValue('') : setTheaterValue('')
        }
    }


    const handleDelete = () => {
        let movie_id = ""
        let theater_id = ""
        selectedMovie.map((obj) => obj._id && (movie_id = obj._id))
        theaters.map((obj) => theaterValue === obj.name.substring(0, theaterValue.length) && (theater_id = obj._id))
        
        if (selectedMovie !== "") {
            dispatch(Delete_Movie({movie : movie_id , theater : theater_id}))
            nav('/admin/dashboard')
        }
        else if (theaterValue !== "") {
            dispatch(Delete_Movie({movie : movie_id , theater : theater_id}))
            nav('/admin/dashboard')
        }
    }

    return (
        movie_apiStatus === "success" ?
            <Box >
                <AdminNavBar />
                <Stack width={600} spacing={2} direction="row" mx="auto" mt={10}>
                    <TextField
                        sx={{ minWidth: 300 }}

                        value={movieValue}
                        onChange={(e) => handleFilter("movie", e)}
                    />
                    <Stack justifyContent="flex-end">
                        <TextField
                            sx={{ minWidth: 300 }}
                            color="error"
                            value={theaterValue}
                            disabled={movieValue === "" ? true : false}
                            onChange={(e) => handleFilter("theater", e)}
                            InputProps={
                                movie_in_theater ? {
                                    endAdornment: <InputAdornment position="end">
                                        <Check sx={{ color: "green" }} />

                                    </InputAdornment>,
                                    style: { paddingLeft: "2px" }
                                } : movie_in_theater === false ? {
                                    endAdornment: <InputAdornment position="end">
                                        <Clear sx={{ color: "red" }} />
                                    </InputAdornment>,
                                    style: { paddingLeft: "2px" }
                                } : {}
                            }
                        >
                            {
                                movies.map((obj) => {
                                    return (
                                        <MenuItem key={obj._id} value={obj._id}>{obj.title}</MenuItem>
                                    )
                                })
                            }
                        </TextField>
                        <Box sx={{ textAlign: "right" }}>
                            <Button

                                color="error"
                                onClick={() =>
                                (setMovieValue(''),
                                    setSelectedMovie(''),
                                    setTheaterValue(''))} >
                                Clear Results</Button>
                        </Box>
                    </Stack>
                </Stack>
                {movieValue !== "" && theaterValue !== "" && movie_in_theater !== "" && selectedMovie !== "" ?
                    <Grid container justifyContent="center" >
                        {selectedMovie?.map((obj) => {
                            return (
                                <Grid item key={obj._id} sx={{ textAlign: "center", position: "static" }}>
                                    <Stack sx={{ position: "relative" }} >
                                        <Box
                                            component="img"
                                            width="200px"
                                            src={obj.image}
                                            alt="movie_image"
                                            sx={{
                                                borderTopRightRadius: "10px",
                                                borderTopLeftRadius: "10px"
                                            }}
                                        />
                                        {movieValue && theaterValue &&
                                            <Button
                                                onClick={() => handleDelete()}
                                                disableRipple
                                                sx={{ position: "absolute", top: 10, right: 10 }}>
                                                <Delete sx={{ fontSize: "3rem" }} color="error" />
                                            </Button>}
                                        <Box sx={likes_style}>
                                            <Favorite sx={{ color: "red" }} />
                                            <Typography sx={{ color: "white" }}>
                                                {obj.like ? obj.like : "60%"}
                                            </Typography >
                                            <Box>
                                                <Typography>{obj.votes ? obj.votes : "5K votes"}</Typography>
                                            </Box>
                                        </Box>
                                    </Stack>
                                    <Box sx={{ width: 200, textAlign: "left", pl: "1rem" }}>
                                        <Typography sx={title_style}>{obj.title}</Typography>
                                        <Typography sx={{ textTransform: "uppercase" }}>{obj.certificate.replace("/", "")}</Typography>
                                        <Typography sx={{ textTransform: "capitalize" }}>{obj.language}</Typography>
                                    </Box>
                                </Grid>
                            )
                        })}
                    </Grid >
                    : null
                }
            </Box>
            :
            <Box sx={{ mt: "5%" }}>
                <CircularProgress />
                <Typography>...Loding Please Wait</Typography>
            </Box>
    );
}