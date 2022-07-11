import {
    Card, CardContent, Typography, Grid, CardActions,
    Button,
    Box,
    AppBar,
    Toolbar, Avatar
} from "@mui/material";
import {  useSelector } from "react-redux";
import jwtDecode from "jwt-decode";
import { url, frontend_url } from '../../api/api'
import axios from 'axios'



export default function Payment() {
    window.history.pushState(null, null, window.location.href);
    window.onpopstate = function (event) {
        window.location.assign(`${frontend_url}/movies`);
    };
    const user_data = jwtDecode(window.sessionStorage.getItem('token'))
    const selected_seats = useSelector(state => state.selected_seats)
    const movie_Details = useSelector(state => state.movieDetails)[0]


    let script = document.createElement('script')
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    document.body.append(script)
    var options = {
        "key": "rzp_test_VowM3OfZOHOMjn", // Enter the Key ID generated from the Dashboard
        "amount": "50000", // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        "currency": "INR",
        "name": movie_Details.title ? movie_Details.title : "",
        "description": "Movie Ticket",
        "image": movie_Details.image ? movie_Details.image : "",
        "order_id": "order_9A33XWu170gUtm", //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        "callback_url": `${url}/payment`,
        "prefill": {
            "name": user_data.user.name,
            "email": user_data.user.email,
            "contact": "9999999999"
        },
        "notes": {
            "address": "Razorpay Corporate Office"
        },
        "theme": {
            "color": "#3399cc"
        }
    };

    const OrderCreation = async () => {
        try {
            let response = await axios.post(`${url}/order/create`, {
                amount: selected_seats[0].totalPrice * 100,
                _id: user_data.user._id,
                user_ticket: selected_seats,
            })
            if (response.data.id) {
                options.amount = selected_seats[0].totalPrice * 100
                options.order_id = response.data.id
                PaymentWindow()
            }
        } catch (error) {
            alert("Payment Failed")
        }
    }                   
    const PaymentWindow = () => {
        var rzp1 = new window.Razorpay(options);
        rzp1.open();
        rzp1.on('payment.failed', function (response) {
            alert(response.error.code);
            alert(response.error.description);
            alert(response.error.source);
            alert(response.error.step);
            alert(response.error.reason);
            alert(response.error.metadata.order_id);
            alert(response.error.metadata.payment_id);
        });
    }



    return (
        <Box>
            <Box>
                <AppBar sx={{ position: "static", zIndex: 0, bgcolor: "#333545" }}>
                    <Toolbar>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Typography variant="h6">BookTicket</Typography>
                            <Avatar sx={{ color: "red", bgcolor: "transparent" }}>BT</Avatar>
                        </Box>
                    </Toolbar>
                </AppBar>
            </Box>
            <Box sx={{textAlign:"center",mt: "3%"}}>
                <Typography variant="h4" sx={{textTransform:"capitalize"}}>Payment GateWay</Typography>
            </Box>
            <Card elevation={4} sx={{ width: 500, mx: "auto", mt: "3%" }}>
                <CardContent>

                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={6}>
                            <Box
                                component="img"
                                src={movie_Details.image}
                                width={200}
                                height={300}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            {
                                selected_seats.map((obj, i) => {
                                    return (
                                        <Box key={i}>
                                            <Typography variant="h5" sx={{ fontWeight: "bold", textTransform: "capitalize" }}>{obj.movie_name}</Typography>
                                            <Typography>Time:&nbsp;{obj.show_time}</Typography>
                                            <Typography variant="body1" sx={{ fontWeight: "bold", textTransform: "capitalize" }}>SeatNo's:&nbsp;{obj.seatNo}</Typography>
                                            <Typography sx={{ textTransform: "capitalize" }}>{obj.theater_name}</Typography>
                                            <Typography sx={{ textTransform: "capitalize" }}>{obj.date.slice(5, 16)}</Typography>
                                            <Typography sx={{ textTransform: "capitalize", fontWeight: "bold" }}>Total:&nbsp;{obj.totalPrice}</Typography>
                                        </Box>
                                    )
                                })
                            }
                        </Grid>
                    </Grid>
                </CardContent>
                <CardActions>
                    <Button fullWidth disableRipple variant="contained" color="error" onClick={() => OrderCreation()}>Pay</Button>
                </CardActions>
            </Card>
        </Box>
    );
}