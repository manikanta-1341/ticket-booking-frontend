import React, { useEffect , useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Typography, TextField, Button } from '@mui/material';
import jwtDecode from 'jwt-decode'
import { url } from '../../api/api';
export default function ResetForm() {
    const [password, setPassword] = useState('')
    const [conpassword, setConPassword] = useState('')
    const token = jwtDecode(window.location.search.split("?")[1].split("=")[1])
    const nav = useNavigate()
   

    useEffect(() => {
        if (token.exp * 1000 <= Date.now()) {
            alert('Link Expired')
            nav('/forgetpassword')
        }
    })
    const handleSubmit = async (e, token) => {
        e.preventDefault()
        let id = window.location.pathname.split('/')[2]

        if(token.exp * 1000 >= Date.now()){
            if (password === conpassword ) {
                try {
                    let response = await axios.post(`${url}/user/savepassword/${id}`, {
                        password: password
                    })
                    if(response.status === 200)
                    {
                        nav('/success')
                    }
                }
                catch (err) {
                    console.log("err::", err)
                }
            }
            else {
                alert('Password Not Matched')
            }          
        }
        else {
            alert('Token Expired')
        }
        



    }
    return (
        <>

            <div style={{ margin: '5%' }}>
                <Typography variant="h4" component="div"> Reset Password  </Typography> <br /> <br />
                <form className="form" onSubmit={(e) => handleSubmit(e, token)}>
                    <div>
                        <TextField type="password" name="Password" label="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} />
                    </div> <br />
                    <div>
                        <TextField label="Confirm Password" type="password" name="ConPassword" value={conpassword}
                            onChange={(e) => setConPassword(e.target.value)} />
                    </div> <br />
                    <Button variant="contained" type="submit"> Submit </Button>
                </form>
            </div>

        </>
    );
} 