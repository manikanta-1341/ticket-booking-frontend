import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Card, CardContent, CardActions, Button, Typography, Box, CircularProgress, Grid, IconButton
} from "@mui/material"
import { useDispatch, useSelector } from "react-redux";
import { Fetch_CustomMovies, Fetch_Movies } from "../../redux/actions/action";
import { MovieDetails, LANGUAGE_OPTIONS, SEGMENT_OPTIONS,
    UNSELECT_LANGUAGE_OPTIONS,UNSELECT_SEGMENT_OPTIONS
 } from '../../redux/reducer/reducer'
import { ArrowDropDown, ArrowDropUp, Favorite } from '@mui/icons-material'
import NavBar from "./navBar";
import AccDetails from "./accDetails";


export default function DashboardCheck() {
    const [tokencheck] = useState(window.sessionStorage.getItem('token'))
    const nav = useNavigate()
    if (tokencheck) {
        window.history.pushState(null, null, window.location.href);
        window.onpopstate = function (event) {
            window.history.go(1);
        };
    }
    return (
        tokencheck ? <>
            <Dashboard />
        </>
            :
            <>
                <Card sx={{ width: '100%', maxWidth: "40%", mx: "auto", mt: "12%", p: "2%", backgroundColor: "#e9e9e9" }} variant="outlined">
                    <CardContent>
                        <Typography sx={{ textAlign: "center" }} variant="h5" color="dark">Please Login To Access The Content</Typography>
                    </CardContent>
                    <CardActions>
                        <Button sx={{ mx: "auto", fontSize: "1.5rem" }} onClick={() => nav('/user/login')}>Login</Button>
                    </CardActions>
                </Card>
            </>
    );
}


const Dashboard = () => {
    const dispatch = useDispatch()
    
    const movies = useSelector(state => state.movies)
    let languages = movies.map((obj) => { return obj.language }).map((e) => e.includes(",") ? e.split(',') : e)
    languages = Array.from(new Set([].concat.apply([], languages)))
    let segments = movies.map((obj) => { return obj.segment }).map((e) => e.includes(",") ? e.split(',') : e)
    segments = Array.from(new Set([].concat.apply([], segments)))
    const fetch_movies_apiStatus = useSelector(state => state.fetch_movies_apiStatus)
    const accCompOpen = useSelector(state => state.accCompOpen)
    const nav = useNavigate()
    const [segmentDropDown, setSegmentDropDown] = useState(false)
    const [languageDropDown, setLanguageDropDown] = useState(false)
    const languageOptions = useSelector(state => state.languageOptions)
    const segmentOptions = useSelector(state => state.segmentOptions)

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
    const filter_btn_style = {
        borderColor: "red",
        color: "red",
        fontSize: "13px",
        borderRadius: 10,
        textTransform: "capitalize",
        "&:hover": {
            borderColor: "red",
            fontWeight: "bold"
        }
    }
    useEffect(() => {
        dispatch(Fetch_Movies()) 
    }, [dispatch])
    return (
        <Box>
            {fetch_movies_apiStatus === "loading" ?
                <Box
                    sx={{
                        mt: "20%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <CircularProgress />
                    <Typography>...Loading Please Wait</Typography>
                </Box>
                : fetch_movies_apiStatus === "success" ?
                    <Box >
                        <NavBar />
                        <Grid container spacing={4} sx={{mt:"2rem"}}>
                            <Grid item xs={4}>
                                <Box sx={{ maxWidth: 250, mx: "auto" }}>
                                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>Filter&nbsp;By</Typography>
                                    {/* <Divider /> */}
                                    <Box>
                                        <Box>
                                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                                <IconButton
                                                    onClick={() => setLanguageDropDown(!languageDropDown)}
                                                    disableRipple
                                                    sx={{ width: "100%", display: "flex", justifyContent: "flex-start" }}>

                                                    {languageDropDown ? <ArrowDropUp /> : <ArrowDropDown />}
                                                    <Typography sx={{ fontWeight: "bold" }}>Language</Typography>

                                                </IconButton>
                                                <Button disableRipple sx={{color:"text.secondary"}}  onClick={() => dispatch(UNSELECT_LANGUAGE_OPTIONS())}>Clear</Button>
                                            </Box>
                                            {languageDropDown ?
                                                <Grid container>
                                                    {
                                                        languages.map((e, i) => {
                                                            return (
                                                                <Grid item key={e} xs={4}>
                                                                    <Button
                                                                        onClick={() => {
                                                                            dispatch(Fetch_CustomMovies({ params: "language", query: e }));
                                                                            dispatch(LANGUAGE_OPTIONS({ id: e }));
                                                                        }}
                                                                        disableRipple
                                                                        sx={[filter_btn_style, {
                                                                            bgcolor: languageOptions[i]?.selected && "red",
                                                                            color: languageOptions[i]?.selected && "white",
                                                                            "&:hover": {
                                                                                bgcolor: languageOptions[i]?.selected && "transparent",
                                                                                color: languageOptions[i]?.selected && "red"
                                                                            }
                                                                        }]} variant="outlined">
                                                                        {e}
                                                                    </Button>
                                                                </Grid>
                                                            )
                                                        })
                                                    }
                                                </Grid>
                                                : null
                                            }
                                        </Box>
                                        <Box>
                                            <Box sx={{display:"flex",justifyContent:"space-between"}}>
                                                <IconButton
                                                    onClick={() => setSegmentDropDown(!segmentDropDown)}
                                                    disableRipple
                                                    sx={{
                                                        width: "100%", display: "flex", justifyContent: "flex-start",
                                                    }}>
                                                    {segmentDropDown ? <ArrowDropUp /> : <ArrowDropDown />}
                                                    <Typography sx={{ fontWeight: "bold" }}>Genre</Typography>
                                                </IconButton>
                                                <Button disableRipple sx={{color:"text.secondary"}} onClick={()=>dispatch(UNSELECT_SEGMENT_OPTIONS())}>Clear</Button>
                                            </Box>
                                            {segmentDropDown ?
                                                <Grid container spacing={2}>
                                                    {
                                                        segments.map((e, i) => {
                                                            return (
                                                                <Grid item key={e} xs={4}>
                                                                    <Button onClick={() =>
                                                                    {
                                                                        dispatch(Fetch_CustomMovies({ params: "segment", query: e }));
                                                                        dispatch(SEGMENT_OPTIONS({ id: e }));
                                                                    }
                                                                    }

                                                                        disableRipple sx={[filter_btn_style,
                                                                            {
                                                                                bgcolor: segmentOptions[i]?.selected && "red",
                                                                                color: segmentOptions[i]?.selected && "white",
                                                                                "&:hover": {
                                                                                    bgcolor: segmentOptions[i]?.selected && "transparent",
                                                                                    color: segmentOptions[i]?.selected && "red",

                                                                                }
                                                                            }
                                                                        ]} variant="outlined">{e}</Button>
                                                                </Grid>
                                                            )
                                                        })
                                                    }
                                                </Grid>
                                                : null
                                            }
                                        </Box>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={8}>
                                <Grid container >
                                    {movies?.map((obj) => {
                                        return (
                                            <Grid item key={obj._id} sx={{ textAlign: "center", position: "static" }}>
                                                <IconButton
                                                    disableRipple={true}
                                                    onClick={() => {
                                                        dispatch(MovieDetails(obj));
                                                        nav(`/movies/${obj.title.replace(' ', '-')}`);
                                                    }}
                                                    sx={{ flexDirection: "column" }}
                                                >
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
                                                    <Box sx={likes_style}>
                                                        <Favorite sx={{ color: "red" }} />
                                                        <Typography sx={{ color: "white" }}>
                                                            {obj.like ? obj.like : "60%"}
                                                        </Typography >
                                                        <Box>
                                                            <Typography>{obj.votes ? obj.votes : "5K votes"}</Typography>
                                                        </Box>
                                                    </Box>
                                                    <Box sx={{ width: 200, textAlign: "left", pl: "1rem" }}>
                                                        <Typography sx={title_style}>{obj.title}</Typography>
                                                        <Typography sx={{ textTransform: "uppercase" }}>{obj.certificate.replace("/", "")}</Typography>
                                                        <Typography sx={{ textTransform: "capitalize" }}>{obj.language}</Typography>
                                                    </Box>
                                                </IconButton>
                                            </Grid>
                                        )
                                    })}
                                </Grid >
                            </Grid>
                        </Grid>
                    </Box>
                    : fetch_movies_apiStatus === "failed" ?
                        <Box
                            sx={{
                                textAlign: "center",
                                mt: "5%"
                            }}
                        >
                            <Typography variant="h1">Data Not Found</Typography>
                        </Box>
                        : null}
            {accCompOpen ? <AccDetails /> : null}
        </Box >
    );
}