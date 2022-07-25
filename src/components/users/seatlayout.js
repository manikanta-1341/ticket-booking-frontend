import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
    Button,
    Grid,
    TableBody,
    Table,
    TableRow,
    TableCell,
    Typography,
    Box,
    CardContent,
    Stack,
    Card,
    Divider,
    TableHead,
} from "@mui/material";
import { CheckBoxOutlineBlank } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { selectedSeats } from "../../redux/reducer/reducer";
import SeatLayoutNavBar from "./seatlayoutNavbar";

export default function SeatLayoutComp() {
    window.onload = () => {
        return window.location.assign("/movies");
    };
    const nav = useNavigate();

    const theaterDetails = useSelector((state) => state.theaterDetails)[0];
    const movie_name = theaterDetails.movie_details.name;
    const occupiedSeats = theaterDetails.theater_details.cinemas.filter(
        (obj) => obj.name === movie_name
    )[0].selected;
    const movie_time = theaterDetails.time;
    const date = theaterDetails.date_time;
    const theater_details = theaterDetails.theater_details.cinemas[0];
    const reverse_ticketRanges = [...theater_details.ticketRanges];
    const reverse_ticketName = [...theater_details.ticketName];
    const [global_row_capacity, setGlobal_row_capacity] = useState(0);
    const alphas = "abcdefghijklmnopqrstuvwxyz";
    const [seats, setSeats] = useState([]);
    const [selected_seats, setSelected_seats] = useState([]);
    const [screen_num, setScreen_num] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const dispatch = useDispatch();

    useEffect(() => {
        let id = theater_details.showTimes.indexOf(movie_time);
        let row_capacity = parseInt(theater_details.rowCapacity[id]);
        setGlobal_row_capacity(row_capacity);
        let no_of_seats = parseInt(theater_details.availabilityTickets[id]);
        let row_range_index = 0;
        let row_range = parseInt(theater_details.rowRanges[id][row_range_index]);
        let ticket_index = 0;
        let row_starting_letter = theater_details.rowNames[id];
        let row_starting_letter_index = 0;
        let alphas_index = alphas.indexOf(
            row_starting_letter[row_starting_letter_index]
        );
        let dummyVar = [];
        let res = [];
        for (var i = 0; i <= no_of_seats; i++) {
            if (dummyVar.length === row_range * row_capacity) {
                let dummyRes = [];
                dummyVar.map((e) => {
                    if (dummyVar.length > 0) {
                        dummyRes.push(dummyVar.splice(0, row_capacity));
                    }
                    return e;
                });
                res.push(dummyRes);
                if (res.length === row_starting_letter.length) {
                    break;
                }
                ticket_index++;
            }
            if (i === row_capacity) {
                alphas_index++;
                i = 0;
                if (res.length > 0 && dummyVar.length === 0) {
                    row_range_index++;
                    row_range = parseInt(theater_details.rowRanges[id][row_range_index]);
                    row_starting_letter_index++;
                    alphas_index = alphas.indexOf(
                        row_starting_letter[row_starting_letter_index]
                    );
                }
            }
            dummyVar.push({
                id: i,
                seatNo: alphas.split("")[alphas_index] + (i + 1),
                price: theater_details.ticketRanges[ticket_index],
                selected: false,
                disabled: false,
                hover: false,
            });
        }
        [...res].reverse().map((main_arr) =>
            main_arr.map((sub_arr) =>
                sub_arr.map((e) => {
                    occupiedSeats.map((occ_obj) => {
                        if (
                            occ_obj.prices.includes(parseInt(e.price)) &&
                            occ_obj.seats.includes(e.seatNo)
                        ) {
                            e.disabled = true;
                        }
                    });
                })
            )
        );
        setSeats([...res].reverse());
        setScreen_num(theater_details.screens[id]);
    }, [
        movie_time,
        theater_details.availabilityTickets,
        theater_details.rowCapacity,
        theater_details.rowNames,
        theater_details.rowRanges,
        theater_details.screens,
        theater_details.showTimes,
        theater_details.ticketRanges,
    ]);

    const handleMouseOver = (i, sub_i, e_i) => {
        let dummyVar = [...seats];
        dummyVar[i][sub_i][e_i].hover = true;
        setSeats([...dummyVar]);
    };
    const handleMouseOut = (i, sub_i, e_i) => {
        let dummyVar = [...seats];
        dummyVar[i][sub_i][e_i].hover = false;
        setSeats([...dummyVar]);
    };

    const handleChange = (i, sub_i, e_i) => {
        let dummyVar = [...seats];
        let dummySelected = [];
        dummyVar[i][sub_i][e_i].selected = !dummyVar[i][sub_i][e_i].selected;
        dummyVar.map((e, i) => {
            return e.map((obj) => {
                return obj.map((el) => {
                    if (el.selected) {
                        dummySelected.push(el);
                    }
                    return el;
                });
            });
        });

        setSelected_seats([...dummySelected]);
        let total_value =
            dummySelected.length > 0 &&
            dummySelected
                .map((e) => {
                    return e.price;
                })
                .reduce((acc, cv) => parseInt(acc) + parseInt(cv));
        setTotalPrice(total_value);
        setSeats([...dummyVar]);
    };

    const handleCheckout = () => {
        // let ticketName_obj = {}
        // reverse_ticketName.map((tn,i)=>ticketName_obj[tn] = reverse_ticketRanges[i])
        // console.log(ticketName_obj) 
        let dummySelected = [
            {
                date: date,
                movie_id: theaterDetails.movie_details._id,
                movie_name: movie_name,
                theater_id: theaterDetails.theater_details._id,
                theater_name: theaterDetails.theater_details.name,
                theater_location: theaterDetails.theater_details.location,
                show_time: movie_time,
                screen: screen_num,
                seatNo: "",
                price: [],
                ticketName:[],
                totalPrice: totalPrice,
            },
        ];
        selected_seats.map((obj) => {
            dummySelected[0].seatNo += obj.seatNo + ",";
            dummySelected[0].price.push(parseInt(obj.price));
            return obj;
        });
        // dummySelected.ticketName = fromArray(new Set(prices))
        dispatch(selectedSeats(dummySelected));
        nav(`/payment/${movie_name.replace(" ", "-")}`);
    };

    return (
        <Box>
            <SeatLayoutNavBar />
            <Grid container justifyContent="center">
                <Grid item xs={12}>
                    {seats.map((arr, i) => {
                        return (
                            <Box key={i}>
                                <Table
                                    size="small"
                                    padding="none"
                                    sx={{
                                        "&.MuiTable-root": { width: 480, mt: "2%", mx: "auto" },
                                    }}
                                >
                                    <TableHead>
                                        <TableRow>
                                            <TableCell
                                                colSpan={global_row_capacity}
                                                sx={{ "&.MuiTableCell-root": { borderBottom: "none" } }}
                                            >
                                                <Stack direction="row" color="text.secondary">
                                                    <Typography sx={{ textTransform: "capitalize" }}>
                                                        {reverse_ticketName.reverse()[i]}-Rs&nbsp;
                                                    </Typography>
                                                    <Typography>
                                                        {reverse_ticketRanges.reverse()[i]}
                                                    </Typography>
                                                </Stack>
                                                <Divider />
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {arr.map((sub_arr, sub_i) => {
                                            return (
                                                <TableRow key={sub_i}>
                                                    {sub_arr.map((e, e_i) => {
                                                        return (
                                                            <TableCell
                                                                key={e.seatNo}
                                                                sx={{
                                                                    "&.MuiTableCell-root": {
                                                                        borderBottom: "none",
                                                                        p: "3px",
                                                                    },
                                                                }}
                                                            >
                                                                {e_i === 0 ? (
                                                                    <Typography
                                                                        sx={{
                                                                            display: "inline-flex",
                                                                            gap: "20px",
                                                                            alignItems: "center",
                                                                            textTransform: "capitalize",
                                                                            color: "text.secondary",
                                                                        }}
                                                                    >
                                                                        {e.seatNo.replace(new RegExp(/\d/g), "")}
                                                                        <Button
                                                                            variant={"outlined"}
                                                                            disabled={e.disabled}
                                                                            disableRipple
                                                                            onMouseOver={() =>
                                                                                handleMouseOver(i, sub_i, e_i)
                                                                            }
                                                                            onMouseOut={() =>
                                                                                handleMouseOut(i, sub_i, e_i)
                                                                            }
                                                                            onClick={() =>
                                                                                handleChange(i, sub_i, e_i)
                                                                            }
                                                                            color="success"
                                                                            sx={{
                                                                                minWidth: "1rem",
                                                                                px: "10px",
                                                                                py: "2px",
                                                                                textTransform: "capitalize",
                                                                                backgroundColor: e.selected
                                                                                    ? "#2e7d32"
                                                                                    : "transparent",
                                                                                color:
                                                                                    e.selected || e.hover ? "white" : "",
                                                                                "&:hover": {
                                                                                    backgroundColor:
                                                                                        e.selected || e.hover
                                                                                            ? "#2e7d32"
                                                                                            : "inherit",
                                                                                },
                                                                            }}
                                                                        >
                                                                            {e.seatNo.replace(new RegExp(/\D/g), "")}
                                                                        </Button>
                                                                    </Typography>
                                                                ) : e_i === 1 ? (
                                                                    <Box
                                                                        sx={{
                                                                            display: "flex",
                                                                            justifyContent: "space-between",
                                                                            borderBottom: 0,
                                                                        }}
                                                                    >
                                                                        <Button
                                                                            variant={"outlined"}
                                                                            disabled={e.disabled}
                                                                            disableRipple
                                                                            onMouseOver={() =>
                                                                                handleMouseOver(i, sub_i, e_i)
                                                                            }
                                                                            onMouseOut={() =>
                                                                                handleMouseOut(i, sub_i, e_i)
                                                                            }
                                                                            onClick={() =>
                                                                                handleChange(i, sub_i, e_i)
                                                                            }
                                                                            color="success"
                                                                            sx={{
                                                                                minWidth: "1rem",
                                                                                px: "10px",
                                                                                py: "2px",
                                                                                textTransform: "capitalize",
                                                                                backgroundColor: e.selected
                                                                                    ? "#2e7d32"
                                                                                    : "transparent",
                                                                                color:
                                                                                    e.selected || e.hover ? "white" : "",
                                                                                "&:hover": {
                                                                                    backgroundColor:
                                                                                        e.selected || e.hover
                                                                                            ? "#2e7d32"
                                                                                            : "inherit",
                                                                                },
                                                                            }}
                                                                        >
                                                                            {e.seatNo.replace(new RegExp(/\D/g), "")}
                                                                        </Button>
                                                                        <Box>
                                                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                                        </Box>
                                                                    </Box>
                                                                ) : e_i === 7 ? (
                                                                    <Box
                                                                        sx={{
                                                                            display: "flex",
                                                                            justifyContent: "space-between",
                                                                            borderBottom: 0,
                                                                        }}
                                                                    >
                                                                        <Button
                                                                            variant={"outlined"}
                                                                            disabled={e.disabled}
                                                                            disableRipple
                                                                            onMouseOver={() =>
                                                                                handleMouseOver(i, sub_i, e_i)
                                                                            }
                                                                            onMouseOut={() =>
                                                                                handleMouseOut(i, sub_i, e_i)
                                                                            }
                                                                            onClick={() =>
                                                                                handleChange(i, sub_i, e_i)
                                                                            }
                                                                            color="success"
                                                                            sx={{
                                                                                minWidth: "1rem",
                                                                                px: "10px",
                                                                                py: "2px",
                                                                                textTransform: "capitalize",
                                                                                backgroundColor: e.selected
                                                                                    ? "#2e7d32"
                                                                                    : "transparent",
                                                                                color:
                                                                                    e.selected || e.hover ? "white" : "",
                                                                                "&:hover": {
                                                                                    backgroundColor:
                                                                                        e.selected || e.hover
                                                                                            ? "#2e7d32"
                                                                                            : "inherit",
                                                                                },
                                                                            }}
                                                                        >
                                                                            {e.seatNo.replace(new RegExp(/\D/g), "")}
                                                                        </Button>
                                                                        <Box>
                                                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                                        </Box>
                                                                    </Box>
                                                                ) : (
                                                                    <Button
                                                                        variant={"outlined"}
                                                                        disabled={e.disabled}
                                                                        disableRipple
                                                                        onMouseOver={() =>
                                                                            handleMouseOver(i, sub_i, e_i)
                                                                        }
                                                                        onMouseOut={() =>
                                                                            handleMouseOut(i, sub_i, e_i)
                                                                        }
                                                                        onClick={() => handleChange(i, sub_i, e_i)}
                                                                        color="success"
                                                                        sx={{
                                                                            minWidth: "1rem",
                                                                            px: "10px",
                                                                            py: "2px",

                                                                            textTransform: "capitalize",
                                                                            backgroundColor: e.selected
                                                                                ? "#2e7d32"
                                                                                : "transparent",
                                                                            color:
                                                                                e.selected || e.hover ? "white" : "",
                                                                            "&:hover": {
                                                                                backgroundColor:
                                                                                    e.selected || e.hover
                                                                                        ? "#2e7d32"
                                                                                        : "inherit",
                                                                            },
                                                                        }}
                                                                    >
                                                                        {e.seatNo.replace(new RegExp(/\D/g), "")}
                                                                    </Button>
                                                                )}
                                                            </TableCell>
                                                        );
                                                    })}
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </Box>
                        );
                    })}
                    <Box sx={{ mt: 4, width: "100%", mx: "auto", textAlign: "center" }}>
                        <Typography>All eyes this way please</Typography>
                        <Box
                            width={350}
                            sx={{
                                mt: 1,
                                mx: "auto",
                                boxShadow: "0px 0px 4px 2px #009eff7d",
                                transform: "matrix(1, 0, 1, 1, 20, 4)",
                            }}
                        ></Box>
                    </Box>
                </Grid>
            </Grid>
            {selected_seats.length === 0 ? (
                <Card elevation={4} sx={{ mt: 2, position: "sticky", bottom: 0 }}>
                    <CardContent>
                        <Grid
                            container
                            spacing={4}
                            justifyContent="center"
                            alignItems="center"
                        >
                            <Grid item sx={{ display: "flex", alignItems: "center" }}>
                                <CheckBoxOutlineBlank
                                    color="disabled"
                                    sx={{ display: "inline-flex" }}
                                ></CheckBoxOutlineBlank>
                                <Typography>Sold</Typography>
                            </Grid>
                            <Grid item sx={{ display: "flex", alignItems: "center" }}>
                                <Box
                                    sx={{
                                        display: "inline-flex",
                                        width: 20,
                                        height: 20,
                                        bgcolor: "green",
                                        borderRadius: "3px",
                                    }}
                                />
                                <Typography>Selected</Typography>
                            </Grid>
                            <Grid item sx={{ display: "flex", alignItems: "center" }}>
                                <CheckBoxOutlineBlank
                                    color="success"
                                    sx={{ display: "inline-flex" }}
                                ></CheckBoxOutlineBlank>
                                <Typography>Available</Typography>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            ) : (
                <Box sx={{ textAlign: "right", mt: "6%" }}>
                    <Button
                        fullWidth
                        sx={{ position: "sticky", bottom: 0 }}
                        onClick={() => handleCheckout()}
                        variant="contained"
                        color="error"
                    >
                        Proceed&nbsp;To&nbsp;Pay
                    </Button>
                </Box>
            )}
        </Box>
    );
}
