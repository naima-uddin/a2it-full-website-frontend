import { useState } from "react";

export default function loginExercise() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError("");

        

        

    }

    return(
        <>
           <h1>Login Here</h1>
           <form onSubmit={handleSubmit}>
            <input 
                type="email" 
                placeholder="enter email" 
                autoComplete="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input 
                type="password" 
                placeholder="enter password" 
                autoComplete="current-password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Login</button>

           </form>
        </>
    )
}