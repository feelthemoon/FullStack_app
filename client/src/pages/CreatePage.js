import { useState, useEffect, useContext } from "react"
import { AuthContext } from "../context/AuthContext";
import { useHttp } from "../hooks/http.hook";
import {useHistory} from "react-router-dom"
export const CreatePage = () => {
    const history = useHistory();
    const auth = useContext(AuthContext);
    const [link, setLink] = useState('');
    const { request } = useHttp();
    useEffect(() => {
        window.M.updateTextFields();
    }, [])
    const pressHandler = async event => {
        if (event.key === 'Enter') {
            try {
                const data = await request('/api/link/generate', 'POST', { from: link }, {
                    Authorization: `Bearer ${auth.token}`
                });
                history.push(`/detail/${data.link._id}`);
            } catch (e) {
                console.log('helo');
            }
        }
    }
    return (
        <div className="row">
            <div className="col s8 offset-s2" style={{ paddingTop: "2rem" }}>
                <div className="mb-3">
                        <label htmlFor="link" className="form-label">Your link</label>
                    <input
                        placeholder="Put your link"
                        id="link"
                        type="text"
                        value={link}
                        onChange={e => setLink(e.target.value)}
                        onKeyPress={pressHandler}
                        />
                </div>
           </div>
        </div>
    )
}