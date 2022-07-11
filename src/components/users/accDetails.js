import { Box, Typography,  Card, CardContent, Button , Grid} from '@mui/material'

import jwt_decode from 'jwt-decode'
import { useNavigate } from 'react-router-dom'


export default function AccDetails() {
    const nav = useNavigate()
    const user_info = jwt_decode(window.sessionStorage.getItem('token')).user
    const btn_style = {
        width: "100%",
        mx: "auto",
        color: "inherit",
        fontSize: "1rem",
        "&:hover":{
            fontWeight:"bold",
            color:"black"
        }
    }
    const Logout = () => {
        window.sessionStorage.removeItem('token')
        nav("/")
    }
    return (
        <>
            <Box sx={[
                {
                    position: "fixed",
                    right: 40, top: 60,
                    minWidth: "15rem",
                    overflow: "auto",
                    height: "100%"
                }
            ]}>
                <Card elevation={3}>     
                    <CardContent>
                        <Grid container alignItems="center" justifyContent="center" gap={1}>
                            <Grid item >
                                <Typography variant="h6">Hi</Typography>

                            </Grid>
                            <Grid item >
                                <Typography variant='h5' sx={{ textTransform: "capitalize", textAlign: "center" }}>
                                    {user_info.name}</Typography>
                            </Grid>
                        </Grid>
                        <Typography sx={{ textAlign: "center" }}>{user_info.username}</Typography>
                        <Button sx={btn_style} onClick={()=>nav('/ticket')}>Orders</Button>
                        <Button sx={btn_style} onClick={() => Logout()}>Logout</Button>  
                    </CardContent> 
                </Card>
            </Box>
        </>
    );
}



