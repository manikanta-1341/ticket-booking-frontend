import { AccountCircle, Search } from "@mui/icons-material";
import {
    AppBar, Grid, IconButton, InputAdornment, TextField, Toolbar, Typography,
    Button, Box, Avatar

} from "@mui/material";
import jwtDecode from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { accountCompOpen,} from '../../redux/reducer/reducer'
import { useState } from "react";




export default function NavBar() {
    const user_details = jwtDecode(window.sessionStorage.getItem('token'))?.user
    const inputProps_styles = {
        style: {
            padding: "0.5rem",
            paddingLeft: 0,
            color: "white",
            "&:focus": {
                borderColor: "white !important"
            }
        }
    }
    const min_bar = {
        bgcolor: "#222539",
        height: "2rem",
        px: "24px"
    }
    const nav = useNavigate()
    const dispatch = useDispatch()
    const searchCompOpen = useSelector(state => state.searchCompOpen)
    const [search_term] =useState('')

    return (

        <AppBar sx={{ position: "static", bgcolor: "#333545", color: "white", zIndex: 0 }}>
            <Toolbar>
                <Grid container justifyContent="space-between" >
                    <Grid item xs={8} sx={{ display: "flex", alignItems: "center", gap: "2rem" }}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Typography variant="h6">BookTicket</Typography>
                            <Avatar sx={{ color: "red", bgcolor: "transparent" }}>BT</Avatar>
                        </Box>
                            <TextField
                                fullWidth
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">
                                        <IconButton disableRipple sx={{ padding: "5px" }}><Search sx={{ color: "white" }} /></IconButton>
                                    </InputAdornment>,
                                    style: { paddingLeft: "2px" }
                                }}
                                value={search_term}
                                autoFocus={searchCompOpen === true ?true:false}
                                inputProps={inputProps_styles}
                                onChange={() =>  nav('/search')}         
                            />
                    </Grid>
                    <Grid item sx={{ pr: 5 }}>
                       { user_details? <IconButton disableRipple onClick={() => dispatch(accountCompOpen())}>
                            <AccountCircle sx={{ fontSize: "2.3rem", color: "white" }} />&nbsp;
                            <Typography sx={{ color: "white", fontSize: "20px", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", width: "50px" }}>
                                Hi,&nbsp;{user_details.name}
                            </Typography>
                        </IconButton> : 
                            <Button onClick={()=>nav('/user/login')}>Login</Button>
                        }
                    </Grid>
                </Grid>
            </Toolbar>
            <Box sx={min_bar}>
                <Button onClick={() => nav('/movies')} sx={{ color: "white", pl: 0 }}>Movies</Button>
            </Box>
        </AppBar>

    )
} 

 
 
 
 

 
 