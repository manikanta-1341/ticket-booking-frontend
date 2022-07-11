import { Alert } from "@mui/material";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { url } from '../../api/api'



export const Fetch_Movies = createAsyncThunk(
    'reducer1/Fetch_Movies',
    async()=>{
        try {
            let response = await axios.get(`${url}/movies`)
            if(!response.data.msg && !response.data.error){
                return response.data
            }
            else{
                alert(JSON.stringify(response.data,null,2))
            }
        } catch (error) {
            alert(error)
        }
    }
)


export const Fetch_CustomMovies = createAsyncThunk(
    'reducer1/Fetch_CustomMovies',
    async({params,query})=>{
        try {
            let response = await axios.get(`${url}/movies/${params}?s=${query}`)
            if(!response.data.msg && !response.data.error){
                return response.data
            }
            else{
                alert(JSON.stringify(response.data,null,2))
            }
        } catch (error) {
            alert(error)
        }
    }
)


export const Fetch_theaters = createAsyncThunk(
    'reducer1/Fetch_theaters',
    async()=>{
        try{
            let response = await axios.get(`${url}/theater`)
            if(!response.data.msg){
                return response.data
            }
        }
        catch(error){
            alert("Fetch theaters failed")
        }
        
    }
)

export const UpdateReview = createAsyncThunk(
    'reducer1/USER_RATING',
    async({id,obj})=>{
        try{
            let response = await axios.patch(`${url}/user/review/${id}`,{
                obj : obj
            })
            
            if(!response.data.error){
                <Alert severity="success">Rating Posted SuccessFully</Alert>
                return [response.data]
            }
        }
        catch(error){
            alert(
                error
            )
        }
    }
)

export const Fetch_User = createAsyncThunk(
    'reducer1/Fetch_User',
    async(id)=>{
        try {
            let response = await axios.get(`${url}/user/${id}`)
            if(!response.data.error){
                return response.data
            }
        } catch (error) {
            alert(error)
        }
    }
)

export const  Delete_Movie = createAsyncThunk(
    'reducer1/Delete_Movie',
    async({movie,theater})=>{
        try{
            let response = await axios.delete(`${url}/movies/delete/${theater}?m=${movie}`)
            if(!response.data.error){
                return response.data
            }
            else{
                alert(response.data.error)
            }
        }
        catch(error){
            alert(error)
        }
    }
)