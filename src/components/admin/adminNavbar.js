import {
    AppBar, Toolbar, Grid, Box, Typography, Avatar,
    IconButton,
    Button
} from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AdminaccountCompOpen } from "../../redux/reducer/reducer"


export default function AdminNavBar() {
    const nav = useNavigate()
    const dispatch = useDispatch()
    const admin_details = jwtDecode(window.sessionStorage.getItem('authtoken')).admin
    return (
        <AppBar sx={{ position: "static", zIndex: 0, bgcolor: "error.main" }}>
            <Toolbar>
                <Grid container justifyContent="space-between" alignItems="center" >
                    <Grid item xs={4} sx={{ display: "flex", alignItems: "center", gap: "2rem" }}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Typography variant="h6">BookTicket</Typography>
                            <Avatar sx={{ color: "black", bgcolor: "transparent" }}>BT</Avatar>
                        </Box>
                        <Box>
                            <Button disableRipple onClick={()=>nav('/admin/dashboard')} fontSize="large" sx={{color:"white"}}>Home</Button>
                        </Box>
                    </Grid>
                    <Grid item xs={4} sx={{ transform: "translate(-10%)" }}>
                        <Typography variant="h4">Admin Board</Typography>
                    </Grid>
                    <Grid item sx={{ pr: 5 }}>
                        <IconButton disableRipple onClick={() => dispatch(AdminaccountCompOpen())}>
                            <AccountCircle sx={{ fontSize: "2.3rem", color: "white" }} />&nbsp;
                            <Typography sx={{ color: "white", fontSize: "20px", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", width: "50px" }}>
                                Hi,&nbsp;{admin_details.name}
                            </Typography>
                        </IconButton>
                    </Grid>
                </Grid>
            </Toolbar>
        </AppBar>
    );
}