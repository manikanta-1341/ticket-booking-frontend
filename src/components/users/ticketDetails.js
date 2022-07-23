import jwtDecode from "jwt-decode"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Fetch_Movies, Fetch_User } from "../../redux/actions/action"
import { accountCompOpen } from "../../redux/reducer/reducer"
import {
    Box, AppBar, Toolbar, Avatar, IconButton,
    CircularProgress, Typography, Grid, Card, CardContent, Stack, Button
} from "@mui/material"
import { AccountCircle } from "@mui/icons-material"
import AccDetails from "./accDetails"
import { useNavigate } from "react-router-dom"






export default function Ticket() {
    window.history.pushState(null, null, window.location.href);
    window.onpopstate = function (event) {
        window.history.go(1);
    };
    const user_details = jwtDecode(window.sessionStorage.getItem('token')).user
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(Fetch_User(user_details._id))
        dispatch(Fetch_Movies())
    }, [dispatch, user_details._id])

    const user = useSelector(state => state.user)
    const movies = useSelector(state => state.movies)
    let movie_image = {}
    movies.map((obj) =>  movie_image[obj.title] = obj.image )
    const fetch_user_apiStatus = useSelector(state => state.fetch_user_apiStatus)
    const accCompOpen = useSelector(state => state.accCompOpen)
    const nav = useNavigate()

    return (

        fetch_user_apiStatus === "loading" ?
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

            : fetch_user_apiStatus === "success" ?
                <Box>
                    <Box>
                        <AppBar sx={{ position: "static", zIndex: 0, bgcolor: "#333545" }}>
                            <Toolbar>
                                <Grid container justifyContent="space-between" >
                                    <Grid item xs={4} sx={{ display: "flex", alignItems: "center", gap: "2rem" }}>
                                        <Box sx={{ display: "flex", alignItems: "center" }}>
                                            <Typography variant="h6">BookTicket</Typography>
                                            <Avatar sx={{ color: "red", bgcolor: "transparent" }}>BT</Avatar>
                                        </Box>
                                        <Box>
                                            <Button sx={{ color: "white" }} onClick={() => nav('/movies')}><Typography>Home</Typography></Button>
                                        </Box>
                                    </Grid>
                                    <Grid item sx={{ pr: 10 }}>
                                        <IconButton disableRipple onClick={() => dispatch(accountCompOpen())}>
                                            <AccountCircle sx={{ fontSize: "2.3rem", color: "white" }} />&nbsp;
                                            <Typography sx={{ color: "white", fontSize: "20px", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", width: "50px" }}>
                                                Hi,&nbsp;{user_details.name}
                                            </Typography>
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            </Toolbar>
                        </AppBar>
                    </Box>
                    <Grid container justifyContent="center" spacing={4} sx={{ mt: 2 }}>
                        {
                            user[0].tickets.map((obj, i) => {
                                return (
                                    new Date(obj.order.date).getDate() >= new Date().getDate() &&
                                    (

                                        <Grid item key={i}>
                                            <Card elevation={24}     >
                                                <CardContent>
                                                    <Grid container spacing={4} direction="row" alignItems="center">
                                                        <Grid item>
                                                            <Box
                                                                component="img"
                                                                src={movie_image[obj.order.movie_name]}
                                                                width={100}
                                                                height={150}
                                                            />
                                                        </Grid>
                                                        <Grid item >
                                                            {
                                                                <Stack spacing={1}>
                                                                    <Typography variant="h5" sx={{ fontWeight: "bold", textTransform: "capitalize" }}>{obj.order.movie_name}</Typography>
                                                                    <Typography>Time:&nbsp;{obj.order.show_time}</Typography>
                                                                    <Typography variant="body1" sx={{ fontWeight: "bold", textTransform: "capitalize" }}>SeatNo's:&nbsp;{obj.order.seatNo}</Typography>
                                                                    <Typography sx={{ textTransform: "capitalize" }}>{obj.order.theater_name}</Typography>
                                                                    <Typography sx={{ textTransform: "capitalize" }}>{obj.order.date.slice(5, 16)}</Typography>

                                                                </Stack>
                                                            }
                                                        </Grid>
                                                    </Grid>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    )
                                )
                            })
                        }
                    </Grid>
                    {accCompOpen ? <AccDetails /> : null}
                </Box>

                : null
    )
}