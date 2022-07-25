import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Fetch_theaters, Fetch_Movies } from "../../redux/actions/action";
import { useNavigate} from "react-router-dom";
import { Grid, Typography, Button, Stack, Box, Avatar, Tooltip } from "@mui/material";
import NavBar from "./navBar";
import AccDetails from "./accDetails";
import { Favorite } from "@mui/icons-material";
import { TheaterDetails , MovieDetails } from '../../redux/reducer/reducer'



export default function BookingComp() {
    window.onload = ()=>{
        return window.location.assign('/movies')
    }
    const dispatch = useDispatch()
    const movie_Details = useSelector(state => state.movieDetails)
    useEffect(() => {
        dispatch(Fetch_theaters())
        dispatch(Fetch_Movies())
        dispatch(MovieDetails(movie_Details[0]))
    }, [dispatch])   
    const movie_name = movie_Details[0].title
    const theaters = useSelector(state => state.theaters)
    const movie_theaters = []
    theaters.map((obj) => obj.cinemas.map((el) => el.name === movie_name ? movie_theaters.push(obj) : null))
    
    const fetch_movies_apiStatus = useSelector(state => state.fetch_movies_apiStatus)
    const fetch_theaters_apiStatus = useSelector(state => state.fetch_theaters_apiStatus)
    const accCompOpen = useSelector(state => state.accCompOpen)
    const nav = useNavigate()            
    


    return (

        fetch_theaters_apiStatus === "success" && fetch_movies_apiStatus === "success" ?
            <Box>
                <NavBar />
                <Stack spacing={4} >
                    <Grid container spacing={4}>
                        {movie_Details.map((e) => {
                            return (
                                <Grid item key={e._id} xs={12}>
                                    <Box sx={{ p: 3, backgroundColor: "#333545", color: "white", textTransform: "capitalize" }}>
                                        <Typography variant="h4">{e.title}</Typography>
                                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                                            <Stack rowGap={4} spacing={2} direction="row" sx={{ display: "flex" }}>
                                                <Typography sx={{ textTransform: "uppercase" }}>{e.certificate.replace('/', "")}</Typography>
                                                <Box>
                                                    <Typography sx={{ fontWeight: "bold", display: "inline-flex", alignItems: "center" }}><Favorite color="error" />{e.like > 0 ? e.like : 60}%</Typography>
                                                    <Box sx={{ textAlign: "center" }}>
                                                        <Typography variant="caption">{e.votes > 0 ? e.votes : 10000}Votes</Typography>
                                                    </Box>
                                                </Box>
                                                <Typography sx={{ textTransform: "capitalize" }}>{e.segment}</Typography>
                                                <Typography sx={{ textTransform: "capitalize" }}>{new Date(e.releaseDate).toUTCString().slice(5, 16)}</Typography>
                                                <Typography sx={{ textTransform: "capitalize" }}>{e.language}</Typography>
                                                <Typography>{e.time.replace(',', "hrs ")}min</Typography>
                                            </Stack>
                                            <Stack direction="row" spacing={2}>
                                                {
                                                    e.cast.map((el) => {
                                                        return (
                                                            <Avatar
                                                                key={el.name}
                                                                sx={{ width: 50, height: 50 }}
                                                                src={el.image}
                                                            />
                                                        )
                                                    })
                                                }
                                            </Stack>
                                        </Stack>
                                    </Box>
                                </Grid>
                            )
                        })
                        }
                    </Grid>
                    {
                        movie_theaters.map((obj) => {
                            return (
                                obj.cinemas.map((c_obj,c_obj_i) => {
                                    return (
                                        c_obj.name === movie_name ?
                                            <Grid container key={c_obj_i} spacing={4} sx={{ mt: "1rem" }} justifyContent="center" alignItems="center">
                                                <Grid item xs={4}>
                                                    <Typography variant="h5" sx={{ textTransform: "capitalize", }}>{obj.name}</Typography>
                                                </Grid>
                                                <Grid container item justifyContent="flex-start" columnSpacing={4} xs={8}>
                                                    {
                                                        c_obj.showTimes.map((time, time_i) => {
                                                            return (
                                                                new Date(`${new Date().toISOString().slice(0, 10) + " " + time}`).getHours() >= new Date().getHours() ?
                                                                <Grid item key={time_i}>
                                                                        {console.log(new Date(`${new Date().toISOString().slice(0, 10) + " " + time}`).getHours() , new Date().getHours()) }
                                                                        <Tooltip arrow placement="top" title={
                                                                            <Stack display="flex" direction="row" alignItems="center" spacing={2}>
                                                                                {
                                                                                    c_obj.ticketRanges.map((tr, i) => {
                                                                                        return (
                                                                                            <Box key={tr} sx={{ textAlign: "center" }}>
                                                                                                <Typography>{tr}</Typography>
                                                                                                <Typography>{c_obj.ticketName[i]}</Typography>
                                                                                            </Box>
                                                                                        )
                                                                                    })
                                                                                }
                                                                            </Stack>
                                                                        }>

                                                                            <Button onClick={() => {
                                                                                dispatch(TheaterDetails(
                                                                                    { time: time, movie_details: c_obj, date_time: new Date().toUTCString(), theater_details: obj }
                                                                                ));
                                                                                nav(`/seatlayout/${movie_name.replace(' ', '-')}`);
                                                        }} 
                                                                                disableRipple variant="outlined" color="success" >
                                                                                <Typography sx={{ borderColor: "green", fontSize: "16px", color: "green" }}>
                                                                                    {time}
                                                                                </Typography>
                                                                            </Button>
                                                                        </Tooltip>
                                                                    </Grid>
                                                                    : null
                                                            )
                                                        })
                                                    }
                                                </Grid>
                                            </Grid>
                                            : null
                                    )
                                })

                            )
                        })
                    }
                </Stack>
                {accCompOpen ? <AccDetails /> : null}
            </Box >
            :
            <></>

    );
}


