import {
    BrowserRouter,
    Routes,
    Route,

} from 'react-router-dom'
import SignIn from '../components/users/login';
import SignUp from '../components/users/signup';
import Passwordreset from "../components/users/forgetpassword"
import ResetForm from "../components/users/resetpassword"
import DashboardCheck from "../components/users/movies";
import MovieDetailsCheck from "../components/users/movieDetails";
import SuccessCard from "../components/users/success"
import ActivationCard from "../components/users/activated";
import BookingComp from '../components/users/booking'
import SeatLayoutComp from '../components/users/seatlayout'
import  SearchResults from '../components/users/searchResults'

import AdminDashboardCheck from "../components/admin/adminDashboard";
import AdminSignIn from '../components/admin/adminLogin'
import AdminSignUp from '../components/admin/adminRegister'
import AdminPasswordreset from '../components/admin/adminpasswordReset'
import AdminResetForm from '../components/admin/adminnewPassword'
import Payment from '../components/users/checkout';
import Ticket from '../components/users/ticketDetails';
import DeleteMovieCheck from '../components/admin/deleteMovies';
import CreateMovieCheck from '../components/admin/createMovie'
import TheaterCompCheck from '../components/admin/createTheater'



export default function Routing() {
    return (
        <BrowserRouter>
            <Routes>
                
                <Route path="/" element={<SignIn />}></Route>
                <Route path='/user/login' element={<SignIn />}></Route>
                <Route path='/user/register' element={<SignUp />}></Route>
                <Route path="/user/forgetpassword/:id" element={<Passwordreset />}></Route>
                <Route path="/user/resetpassword/:id" element={<ResetForm />}></Route>
                <Route path="/movies" element={<DashboardCheck />}></Route>
                <Route path='/movies/:string' element={<MovieDetailsCheck />}></Route>
                <Route path='/buytickets/:string' element={<BookingComp />}></Route>
                <Route path='/seatlayout/:string' element={<SeatLayoutComp />}></Route>
                <Route path='/payment/:string'element={<Payment/>}></Route>
                <Route path='/ticket' element={<Ticket/>}></Route>
                <Route path='/search' element={<SearchResults/>}></Route>

                <Route path="/admin/dashboard" element={<AdminDashboardCheck />}></Route>
                <Route path='/admin/login' element={<AdminSignIn />}></Route>
                <Route path="/admin/register" element={<AdminSignUp />}></Route>
                <Route path="/admin/forgetpassword" element={<AdminPasswordreset />}></Route>
                <Route path="/admin/resetpassword/:id" element={<AdminResetForm />}></Route>
                <Route path="/admin/create/movie" element={<CreateMovieCheck />}></Route>
                <Route path="/admin/create/theater" element={<TheaterCompCheck />}></Route>
                <Route path="/admin/delete/movie" element={<DeleteMovieCheck />}></Route>


                <Route path="/success" element={<SuccessCard />}></Route>
                <Route path="/activated" element={<ActivationCard />}></Route>
            </Routes>
        </BrowserRouter>

    );
}