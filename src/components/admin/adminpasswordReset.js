import React,{useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Typography, TextField, Button } from '@mui/material';
import { url } from '../../api/api';


export default function AdminPasswordreset() {
    const [email, setEmail] = useState('')
    const nav = useNavigate()
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.put(`${url}/admin/forgetpassword`, {
                email: email
            })
            if (response.status === 200) {
                nav('/admin/login')
                alert("Reset link sent to registerd Email")
            }
        }
        catch (err) {
            alert('Email Not Registered')
        }
    }
    return (
        <>
            <div style={{ margin: '5%' }}>
                <Typography variant="h4" component="div"> Password Reset  </Typography> <br /> <br />
                <form onSubmit={handleSubmit}>
                    <div>
                        <TextField type="email" name="Email" label="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} />
                    </div> <br />
                    <Button variant="contained" type="submit" > Submit </Button>
                </form>
            </div>
        </>
    );
}