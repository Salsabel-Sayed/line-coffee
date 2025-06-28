// pages/Login.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";

  
export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
             await axios.post("https://line-coffee.onrender.com/users/logIn", {
                email,
                password,
            }, { withCredentials: true, });

            

            toast.success("Logged in successfully!");
            setTimeout(() => {
                navigate("/");
                window.location.reload();
            }, 2000);

        } catch (error: unknown) {
            const err = error as AxiosError<{ message: string }>;
            toast.error(err.response?.data?.message || "Login failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {isLoading && (
                <div className="page-loader">
                    <div className="loader-content">🔐 Logging in...</div>
                </div>
            )}

            <div className="container mt-5">
                <h2 className="mb-4">🔐 Login</h2>
                <form onSubmit={handleLogin} className="shadow p-4 rounded bg-light">
                    <div className="mb-3">
                        <label>Email:</label>
                        <input
                            type="email"
                            className="form-control"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label>Password:</label>
                        <input
                            type="password"
                            className="form-control"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Login</button>
                </form>
            </div>
        </>
    );
}
