import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Card, CardContent, CardActions, Button, Typography,
    Box, CircularProgress, Grid, IconButton, Slider, Dialog,
    DialogContent, TextField, DialogActions, Stack, Divider,
    Avatar
} from "@mui/material"
import { useDispatch, useSelector } from "react-redux";
import { Fetch_User, UpdateReview } from "../../redux/actions/action";
import { Circle, Favorite } from '@mui/icons-material'
import NavBar from './navBar'
import AccDetails from './accDetails'
import jwtDecode from "jwt-decode";
import timediff from 'timediff'


export default function MovieDetailsCheck() {
    const [tokencheck] = useState(window.sessionStorage.getItem('token'))
    const nav = useNavigate()
    window.onload = () => {
        return window.location.assign(`/movies`);
    }
    return (
        tokencheck ? <>
            <MovieDetailsComp />
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


const MovieDetailsComp = () => {
    const user_details = jwtDecode(window.sessionStorage.getItem('token'))?.user
    const movie_Details = useSelector(state => state.movieDetails)
    const accCompOpen = useSelector(state => state.accCompOpen)
    const user_apiStatus = useSelector(state => state.fetch_user_apiStatus)
    const user = useSelector(state => state.user)[0]
    const user_rating = user && user.reviews.filter((e) => e.name === movie_Details[0].title)
    const rating_time = user_rating !== undefined && user_rating.length > 0 && timediff(user_rating[0].time, new Date().getTime(), 'YDHms')
    const dispatch = useDispatch()
    const nav = useNavigate()
    const likes_style = {
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex start",
        gap: 1

    }
    const [dialogOpen, setDialogOpen] = useState(false)
    const [sliderValue, setSliderValue] = useState(0)
    const [review, setReview] = useState('')

    useEffect(() => {
        dispatch(Fetch_User(user_details._id))
    }, [dispatch, user_details._id])

    return (
        <Box>
            {user_apiStatus === "loading" ?
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
                : user_apiStatus === "success" ?
                    <Box>
                        <NavBar />
                        <Stack spacing={5} sx={{ mb: "2rem" }}>
                            <Grid container>
                                {movie_Details.map((obj) => {

                                    return (
                                        <Grid container columnGap={3} key={obj._id} sx={{ px: 6, py: 2, backgroundPosition: "right", backgroundImage: `linear-gradient(90deg, rgb(26, 26, 26) 24.97%, rgb(26, 26, 26) 38.3%, rgba(26, 26, 26, 0.04) 97.47%, rgb(26, 26, 26) 100%),url(${obj.coverImage})` }}>
                                            <Grid item >
                                                <IconButton disableRipple={true} sx={{ display: "flex", flexDirection: "column" }}>
                                                    <Box
                                                        component="img"
                                                        width={250}
                                                        src={obj.image}
                                                        alt="movie_image"
                                                        sx={{
                                                            borderTopRightRadius: "10px",
                                                            borderTopLeftRadius: "10px"
                                                        }}
                                                    />
                                                    <Box sx={{
                                                        width: 250,
                                                        borderBottomRightRadius: "10px",
                                                        borderBottomLeftRadius: "10px",
                                                        backgroundColor: "black",
                                                        color: "white"
                                                    }}>
                                                        <Typography>In&nbsp;cinemas</Typography>
                                                    </Box>
                                                </IconButton>
                                            </Grid>
                                            <Grid item sx={{ mt: 4 }}>
                                                <Grid container rowSpacing={2} flexDirection="column">
                                                    <Grid item>
                                                        <Typography
                                                            variant="h4"
                                                            sx={{
                                                                color: "white",
                                                                fontWeight: "bold",

                                                                textTransform: "capitalize"
                                                            }}
                                                        >{obj.title}</Typography>
                                                    </Grid>
                                                    <Grid item>
                                                        <Box sx={[likes_style]}>
                                                            <Box sx={likes_style}>
                                                                <Favorite sx={{ color: "red", fontSize: "30px" }} />
                                                                <Typography sx={{ color: "white", fontSize: "30px" }}>
                                                                    {obj.like ? obj.like : "60%"}
                                                                </Typography >
                                                            </Box>
                                                            <Box>
                                                                <Typography sx={{ fontSize: "16px" }}>{obj.votes ? obj.votes : "5K votes"}</Typography>
                                                            </Box>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item>
                                                        {user_rating.length === 0 ?
                                                            <Box sx={{ width: 400, py: 1, px: 3, borderRadius: "10px", bgcolor: "#333333", color: "white", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                                                <Box>
                                                                    <Typography variant="h6">Add Your Rating</Typography>
                                                                    <Typography variant="caption">Your Rating Matters</Typography>
                                                                </Box>
                                                                <Button
                                                                    variant="contained"
                                                                    disableRipple
                                                                    onClick={() => setDialogOpen(true)}
                                                                    sx={{
                                                                        borderRadius: "10px",
                                                                        p: 0, px: 2, height: "2.5rem", bgcolor: "white", color: "black", fontWeight: "bold",
                                                                        "&:hover": {
                                                                            bgcolor: "white",
                                                                            color: "black"
                                                                        }
                                                                    }}
                                                                >
                                                                    Rate&nbsp;Now
                                                                </Button>
                                                                <Dialog open={dialogOpen}>
                                                                    <DialogContent sx={{ p: 4, width: 500 }}>
                                                                        <Typography variant="h6" sx={{ mb: "0.5rem" }}>Rating & Review</Typography>
                                                                        <Slider
                                                                            value={sliderValue}
                                                                            onChange={(e) => setSliderValue(e.target.value)}
                                                                            valueLabelDisplay="auto"
                                                                            step={10}
                                                                            color="error"
                                                                            min={0}
                                                                            max={100}
                                                                            sx={{
                                                                                '& .MuiSlider-thumb': {
                                                                                    width: "15px",
                                                                                    height: "15px"
                                                                                },
                                                                                '&.MuiSlider-root': {
                                                                                    height: "2px"
                                                                                },
                                                                            }}
                                                                        />
                                                                        {sliderValue > 0 ? <Box sx={{ mt: "1rem" }}>
                                                                            <Typography>Your Rating & Review Matters</Typography>
                                                                            <TextField value={review} onChange={(e) => setReview(e.target.value)} fullWidth placeholder="Write a Review" minRows={4} multiline />
                                                                        </Box> : null}
                                                                    </DialogContent>
                                                                    <DialogActions sx={{ display: "flex", justifyContent: "space-around", alignItems: "center" }}>
                                                                        <Button color="error" variant="contained" onClick={() => setDialogOpen(false)}>Cancel</Button>
                                                                        <Button color="error" variant="contained"
                                                                            onClick={() => {
                                                                                dispatch(UpdateReview({
                                                                                    id: user_details._id,
                                                                                    obj: {
                                                                                        name: movie_Details[0].title,
                                                                                        rating: sliderValue,
                                                                                        review: review,
                                                                                        date: new Date().toLocaleDateString(),
                                                                                        time: new Date().getTime()
                                                                                    }
                                                                                })); setDialogOpen(false);
                                                                            }
                                                                            } >Post</Button>
                                                                    </DialogActions>
                                                                </Dialog>
                                                            </Box>
                                                            :
                                                            <Box sx={{ width: 400, py: 1, px: 3, borderRadius: "10px", bgcolor: "#333333", color: "white", display: "flex", alignItems: "center", justifyContent: "space-between" }}>

                                                                <Box>
                                                                    <Typography variant="h6">Your Rating</Typography>

                                                                    <Typography>Rated&nbsp;
                                                                        {
                                                                        rating_time.days > 0? `${rating_time.days}Days` :rating_time.hours > 0 ?
                                                                            `${rating_time.hours}hr` : rating_time.minutes > 0 ?
                                                                                `${rating_time.minutes}min` : `Few seconds`
                                                                        }
                                                                        &nbsp;ago</Typography>
                                                                </Box>
                                                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                                                    <Favorite color="error" />
                                                                    <Typography>{user_rating[0].rating}%</Typography>
                                                                </Box>
                                                            </Box>
                                                        }
                                                    </Grid>
                                                    <Grid item>
                                                        <Box sx={{ pl: 1, display: "flex", textTransform: "capitalize", color: "white", gap: "1rem" }}>
                                                            <Typography>{obj.cinemaType}</Typography>
                                                            <Typography>{obj.language}</Typography>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item>
                                                        <Box component="ul" sx={{ pl: 1, display: "flex", justifyContent: "space-between", color: "white", textTransform: "capitalize", }}>
                                                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                                                <Circle sx={{ fontSize: "0.5rem", p: 0, mr: 1 }} />
                                                                <Typography>{obj.time.replace(',', 'hr ')}min</Typography>
                                                            </Box>
                                                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                                                <Circle sx={{ fontSize: "0.5rem", p: 0, mr: 1 }} />
                                                                <Typography>{obj.segment}</Typography>

                                                            </Box>
                                                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                                                <Circle sx={{ fontSize: "0.5rem", p: 0, mr: 1 }} />
                                                                <Typography sx={{ textTransform: "uppercase" }}>{obj.certificate.replace('/', "")}</Typography>

                                                            </Box>
                                                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                                                <Circle sx={{ fontSize: "0.5rem", p: 0, mr: 1 }} />
                                                                <Typography>{new Date(obj.releaseDate).toUTCString().slice(5, 16)}</Typography>
                                                            </Box>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item sx={{ textAlign: "center" }}>
                                                        <Button onClick={() => nav(`/buytickets/${movie_Details[0].title.replace(' ', '-')}`)}
                                                            sx={{ backgroundColor: "red" }} variant="contained">Book&nbsp;Tickets</Button>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    )
                                })}
                            </Grid>
                            <Box sx={{ px: 6 }}>
                                <Stack spacing={6} divider={<Divider flexItem />}>
                                    <Box>
                                        <Typography variant="h5" sx={{ fontWeight: "bold" }}>About the movie</Typography>
                                        <Typography variant="body1" >{movie_Details[0].about}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="h5" sx={{ fontWeight: "bold", mb: "1rem" }}>Cast</Typography>
                                        <Grid container spacing={3}>
                                            {
                                                movie_Details[0].cast.map((obj) => {
                                                    return (
                                                        <Grid item key={obj.name} >
                                                            <Avatar
                                                                sx={{ width: 120, height: 120 }}
                                                                src={obj.image}
                                                            />
                                                            <Box sx={{ textAlign: "center" }}>
                                                                <Typography variant="body1" sx={{ textTransform: "capitalize", }}>{obj.name}</Typography>
                                                            </Box>
                                                        </Grid>
                                                    )
                                                })
                                            }
                                        </Grid>
                                    </Box>
                                    <Box>
                                        <Typography variant="h5" sx={{ fontWeight: "bold", mb: "1rem" }}>Crew</Typography>
                                        <Grid container spacing={3}>
                                            {
                                                movie_Details[0].crew.map((obj) => {
                                                    return (
                                                        <Grid item key={obj.name}>
                                                            <Avatar
                                                                sx={{ width: 120, height: 120 }}
                                                                src={obj.image}
                                                            />
                                                            <Box sx={{ textAlign: "center" }}>
                                                                <Typography variant="body" sx={{ textTransform: "capitalize" }}>{obj.name}</Typography>
                                                            </Box>
                                                        </Grid>
                                                    )
                                                })
                                            }
                                        </Grid>
                                    </Box>
                                </Stack>
                            </Box>
                        </Stack>
                        {accCompOpen ? <AccDetails /> : null}
                    </Box> : null
            }
        </Box>
    );
}
