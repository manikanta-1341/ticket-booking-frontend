import { createSlice } from '@reduxjs/toolkit'
import { Fetch_Movies, Fetch_theaters, Fetch_CustomMovies,UpdateReview,Fetch_User ,
    Delete_Movie

} from '../actions/action'
const initialState = {
    user:[],
    movies: [],
    theaters: [],
    movieDetails: [],
    theaterDetails: [],
    selected_seats: [],
    languageOptions: [],
    segmentOptions: [],
    fetch_user_apiStatus: "",
    fetch_movies_apiStatus: "",
    fetch_theaters_apiStatus: "",
    currentOpenComp: "",
    search_term :"",
    createMovieCompOpen: false,
    createTheaterCompOpen: false,
    accCompOpen: false,
    AdminaccCompOpen: false,
    searchCompOpen: false,
}

const Reducer = createSlice({
    name: "reducer1",
    initialState,
    reducers: {
        CreateMovieCompOpen: (state, { payload }) => {
            state.createMovieCompOpen = !state.createMovieCompOpen
        },
        MovieDetails: (state, { payload }) => {
            state.movieDetails = [payload]
            state.currentOpenComp = "MovieDetails"
        },
        TheaterDetails: (state, { payload }) => {
            state.theaterDetails = [payload]
            state.currentOpenComp = "TheaterDetails" 
        },
        TheaterCompOpen: (state, { payload }) => {
            state.createTheaterCompOpen = !state.createTheaterCompOpen
            state.currentOpenComp = "TheaterCompOpen"
        },
        selectedSeats: (state, { payload }) => {
            state.selected_seats = payload
        },
        accountCompOpen: (state, { payload }) => {
            state.accCompOpen = !state.accCompOpen
        },
        AdminaccountCompOpen: (state, { payload }) => {
            state.AdminaccCompOpen = !state.AdminaccCompOpen
        },
        LANGUAGE_OPTIONS: (state, { payload }) => {
            state.languageOptions.map((e)=>e.id === payload.id?e.selected = true:e.selected = false) 
        },
        SEGMENT_OPTIONS: (state, { payload }) => {
            state.segmentOptions.map((e)=>e.id === payload.id?e.selected = true:e.selected = false) 
        },
        UNSELECT_LANGUAGE_OPTIONS:(state,{ payload})=>{
            state.languageOptions.map((e)=>e.selected = false)
        },
        UNSELECT_SEGMENT_OPTIONS:(state,{ payload})=>{
            state.segmentOptions.map((e)=>e.selected = false)
        },
        SEARCHTERM:(state,{ payload })=>{
            if(payload === ""){
                state.search_term = payload
            }
            else{
                state.movies.map((obj)=>obj.title.includes(payload) && (state.search_term = obj))
            }
            
        },
        SEARCH_COMP_OPEN:(state,{ payload })=>{
            state.searchCompOpen = payload
        }

    },
    extraReducers: (builder) => {
        builder
            .addCase(Fetch_Movies.pending, (state) => {
                state.fetch_movies_apiStatus = "loading"
            })
            .addCase(Fetch_Movies.fulfilled, (state, { payload }) => {
                state.movies = payload
                state.fetch_movies_apiStatus = "success"
                if (state.movies.length > 0 && state.languageOptions.length === 0 && state.segmentOptions.length ===0) {
                    let languages = payload.map((obj) => { return obj.language }).map((e) => e.includes(",") ? e.split(',') : e)
                    languages = Array.from(new Set([].concat.apply([], languages)))
                    let segments = payload.map((obj) => { return obj.segment }).map((e) => e.includes(",") ? e.split(',') : e)
                    segments = Array.from(new Set([].concat.apply([], segments)))
                    let dummylanguageOptions = []
                    languages.map((obj) => dummylanguageOptions.push({
                        id: obj,
                        selected: false
                    }))
                    let dummysegmentOptions = []
                    segments.map((obj) => dummysegmentOptions.push({
                        id: obj,
                        selected: false
                    }))
                    state.languageOptions = dummylanguageOptions
                    state.segmentOptions = dummysegmentOptions
                }
            })
            .addCase(Fetch_Movies.rejected, (state) => {
                state.fetch_movies_apiStatus = "failed"
            })

            .addCase(Fetch_theaters.pending, (state) => {
                state.fetch_theaters_apiStatus = "loading"
            })
            .addCase(Fetch_theaters.fulfilled, (state, { payload }) => {
                state.theaters = payload
                state.fetch_theaters_apiStatus = "success"
            })
            .addCase(Fetch_theaters.rejected, (state) => {
                state.fetch_theaters_apiStatus = "failed"
            })

            .addCase(Fetch_CustomMovies.pending, (state) => {
                state.fetch_movies_apiStatus = "loading"
            })
            .addCase(Fetch_CustomMovies.fulfilled, (state, { payload }) => {
                state.movies = payload
                state.fetch_movies_apiStatus = "success"

            })
            .addCase(Fetch_CustomMovies.rejected, (state) => {
                state.fetch_movies_apiStatus = "failed"

            })


            .addCase(Fetch_User.pending, (state) => {
                state.fetch_user_apiStatus = "loading"
            })
            .addCase(Fetch_User.fulfilled, (state, { payload }) => {
                state.user = payload
                state.fetch_user_apiStatus = "success"

            })
            .addCase(Fetch_User.rejected, (state) => {
                state.fetch_user_apiStatus = "failed"
            })


            .addCase(UpdateReview.fulfilled, (state, { payload }) => {
                state.user = payload
            })

            .addCase(Delete_Movie.fulfilled, (state, { payload }) => {
                state.movies = payload
            })
    }
})

export const {
    CreateMovieCompOpen,
    MovieDetails,
    TheaterDetails,
    TheaterCompOpen,
    selectedSeats,
    accountCompOpen,
    AdminaccountCompOpen,
    LANGUAGE_OPTIONS,
    SEGMENT_OPTIONS,
    UNSELECT_LANGUAGE_OPTIONS,
    UNSELECT_SEGMENT_OPTIONS,
    SEARCHTERM,
    SEARCH_COMP_OPEN
} = Reducer.actions

export default Reducer.reducer

