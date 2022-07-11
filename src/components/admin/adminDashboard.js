import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Card, CardContent, CardActions, Button, Typography, Box, Stack, Grid
} from "@mui/material"
import AdminNavBar from "./adminNavbar";
import { Fetch_Movies } from "../../redux/actions/action";
import { useDispatch, useSelector } from "react-redux";
import { Favorite } from "@mui/icons-material";
import AdminAccDetails  from './AdminaccDetails' 


export default function AdminDashboardCheck() {
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
            <AdminDashboard />
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



const AdminDashboard = () => {
    const nav = useNavigate()
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(Fetch_Movies())
    }, [dispatch])
    const movies = useSelector(state => state.movies)
    const fetch_movies_apiStatus = useSelector(state => state.fetch_movies_apiStatus)
    const AdminaccCompOpen = useSelector(state=>state.AdminaccCompOpen)

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

    return (
        <Box >
            <Stack spacing={4}>

                <Stack spacing={4} direction="column">
                    <AdminNavBar />
                    <Stack spacing={4} justifyContent="center" direction="row">
                        <Button variant="contained" color="error" onClick={() => nav('/admin/create/movie')} >Create&nbsp;Movie</Button>
                        <Button variant="contained" color="error" onClick={() => nav('/admin/delete/movie')} >Delete&nbsp;Movie</Button>
                        <Button variant="contained" color="error" onClick={() => nav('/admin/create/theater')}>Add&nbsp;Theater</Button>
                    </Stack>
                </Stack>
                <Box sx={{textAlign:"center"}}>

                <Typography variant="h5" sx={{color:"red",fontWeight:"bold"}}>Currently Running</Typography>
                </Box>
                {
                    fetch_movies_apiStatus === "success" ?
                        <Stack>
                            <Grid container justifyContent="center">
                                {
                                    movies?.map((obj) => {
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
                                    })
                                }
                            </Grid >
                        </Stack>
                        : null
                }
            </Stack>
            {AdminaccCompOpen?<AdminAccDetails/>:null}   
        </Box>
    )
}