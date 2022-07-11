import {
    Box, Card, CardContent,  Button,
    IconButton, TextField, InputAdornment, Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Fetch_Movies } from "../../redux/actions/action";
import { MovieDetails } from '../../redux/reducer/reducer'
import {  Search } from "@mui/icons-material";
import { SEARCHTERM } from '../../redux/reducer/reducer'


export default function SearchResults() {
    const movie = useSelector(state => state.search_term)
    
    const dispatch = useDispatch()
    const fetch_movies_apiStatus = useSelector(state => state.fetch_movies_apiStatus)
    const nav = useNavigate()
    const [search_term, setSearch_term] = useState('')
    useEffect(() => {
        dispatch(Fetch_Movies())       
    }, [dispatch])


    const inputProps_styles = {
        style: {
            padding: "0.5rem",
            paddingLeft: 0,
            color: "red",
            "&:focus": {
                borderColor: "white !important"
            }
        }
    }


    const handleChange = (event) => {
        setSearch_term(event.target.value)
        dispatch(SEARCHTERM(event.target.value))
    }



    return (
        fetch_movies_apiStatus === "success" ?

            <Box >
                <Button sx={{ml:"5%",mt:"2%"}} color="error" variant="outlined" size="large" onClick={()=>nav('/movies')}>Back</Button>
                <Box sx={{ width: 500, mx: "auto", mt: "3%" }}>

                <TextField
                    fullWidth
                    InputProps={{
                        startAdornment: <InputAdornment position="start">
                            <IconButton disableRipple sx={{ padding: "5px" }}><Search sx={{ color: "red" }} /></IconButton>
                        </InputAdornment>,
                        style: { paddingLeft: "2px" }
                    }}
                    value={search_term}
                    inputProps={inputProps_styles}
                    onChange={(event) => handleChange(event)}
                />
                <Card>
                    <CardContent>
                        {
                            search_term !== "" ? <Button  size="large" onClick={() => {
                                dispatch(MovieDetails(movie)) ;
                                nav(`/movies/${movie.title.replace(' ', '-')}`);
                        }} fullWidth color="error" variant="h4" sx={{ color: "red", textTransform: "capitalize" }}>{movie.title}&nbsp;({movie.releaseDate})</Button>
                                : <Typography color="error">Start Searching....</Typography>
                        }
                    </CardContent>
                </Card>
                </Box>
            </Box>


            : null
    );
}