import { AppBar, Divider, Stack, Toolbar, Typography } from "@mui/material";
import { useSelector } from "react-redux";




export default function SeatLayoutNavBar() {
    const movie_details = useSelector(state => state.movieDetails)
    const theaterDetails = useSelector(state => state.theaterDetails)[0]
    return (
        <AppBar sx={{ position:"static",zIndex: 0, bgcolor: "#1f2533" }}>
            <Toolbar>
                <Stack>
                <Typography variant="h6" sx={{ textTransform: "capitalize" }}>{movie_details[0].title}</Typography>
                    <Stack direction = "row" spacing={1}>
                        <Typography variant="body1" sx={{ textTransform: "capitalize" }}>{theaterDetails.theater_details.name}:</Typography>
                        <Typography  sx={{ textTransform: "capitalize" }}>{theaterDetails.theater_details.location}</Typography>
                        <Divider orientation="vertical" color="white" flexItem/>
                        <Typography  sx={{ textTransform: "capitalize" }}>{theaterDetails.date_time.slice(0,16)}</Typography>
                        <Typography  sx={{ textTransform: "capitalize" }}>{theaterDetails.time}</Typography>
                    </Stack>
                </Stack>
            </Toolbar>
        </AppBar>        
    )
}