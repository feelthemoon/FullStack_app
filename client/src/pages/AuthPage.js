import React, { useEffect, useState, useContext } from 'react';
import { useHttp } from '../hooks/http.hook';
import { useMessage } from '../hooks/message.hook';
import { AuthContext } from '../context/AuthContext';
export const AuthPage = () => {
    const auth = useContext(AuthContext);
    const message = useMessage();
    const { loading, error, request, clearError } = useHttp();
    const [form, setForm] = useState(
        {
            email: '',
            password: ''
        }
    )
    useEffect(() => {
        message(error);
        clearError();
    }, [error, message, clearError])
    useEffect(() => {
        window.M.updateTextFields();
    }, [])
    const changeHandler = event => {
        setForm({...form, [event.target.name]:event.target.value})
    }
    const registerHandler = async () => {
        try {
            const data = request('/api/auth/register', 'POST', { ...form });
            data.then((val) => auth.login(val.token, val.userId)).catch((e)=>{});
        } catch (e) {
        }
    }
    const loginHandler = async () => {
        try {
            const data = request('/api/auth/login', 'POST', { ...form });
            data.then((val) => auth.login(val.token, val.userId)).catch((e)=>{});
        } catch (e) {
            
        }
    }
    return (
        <div className="row"
            style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
            <div className="col-3" style={{backgroundColor:"#CFFFF5", padding:40, borderRadius:10}}>
                <h1>Cut your link!</h1>
                <form method="POST">
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email address</label>
                        <input
                            type="email"
                            placeholder="for@example.com"
                            className="form-control"
                            name="email"
                            id="email"
                            value={form.email}
                            onChange={changeHandler}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Your password"
                            className="form-control"
                            id="password"
                            value={form.password}
                            onChange={changeHandler}
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                        onClick={loginHandler}
                    >Sign In</button>
                    <button
                        type="submit"
                        className="btn btn-outline-primary"
                        style={{ marginLeft: 10 }}
                        onClick={registerHandler}
                        disabled={loading}
                    >Sign Up</button>
                </form>
            </div>
        </div>
    )
}