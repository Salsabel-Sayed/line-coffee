import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { registerSchema } from "./Schema/registerValidation";

export default function Register() {

    type ErrorResponse = {
        message: string | string[];
    };
      
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userPhone, setUserPhone] = useState("");
    const [errors, setErrors] = useState<{ [key: string]: string }>({}); 
    const [isLoading, setIsLoading] = useState(false);


    const navigate = useNavigate();

    {/*validation feild */ }
    const validateField = (name: string, value: string) => {
        const fieldSchema = registerSchema.extract(name);
        const { error } = fieldSchema.validate(value);

        setErrors((prev) => ({
            ...prev,
            [name]: error ? error.message : "",
        }));
    };
    useEffect(() => {
        document.body.style.overflow = isLoading ? "hidden" : "auto";
    }, [isLoading]);
      

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({}); 
        
        setIsLoading(true); 

        try {
            await axios.post("https://line-coffee.onrender.com/users/addUser", {
                userName,
                email,
                password,
                userPhone,
            });

            toast.success("Account created successfully!");
            setTimeout(() => {
               
                navigate("/login");
              }, 5000);
        } catch (err: unknown) {
            const error = err as AxiosError<ErrorResponse>;

            console.error(error);

            // لو الرسالة راجعة من Joi وفيها تفاصيل
            if (Array.isArray(error.response?.data?.message)) {
                const joiErrors: { [key: string]: string } = {};
                error.response?.data?.message.forEach((msg: string) => {
                    const field = msg.toLowerCase().includes("username")
                        ? "userName"
                        : msg.toLowerCase().includes("email")
                        ? "email"
                        : msg.toLowerCase().includes("password")
                        ? "password"
                        : msg.toLowerCase().includes("phone")
                        ? "userPhone"
                        : "general";

                    joiErrors[field] = msg;
                });
                setErrors(joiErrors);
                toast.error("Please fix the highlighted errors.");
            } else {
                toast.error(error.response?.data?.message || "Registration failed");
            }
            // هنا بس نوقف التحميل
            setIsLoading(false);
        } 
       
    };

    return (
       <>
            {isLoading && (
                <div className="page-loader">
                    <div className="loader-content">
                        ⏳ Loading...
                    </div>
                </div>
            )}

            <div className="container mt-5">
                <h2 className="mb-4">📝 Register</h2>
                <form onSubmit={handleRegister} className="shadow p-4 rounded bg-light">
                    <div className="mb-3">
                        <label>Name:</label>
                        <input
                            type="text"
                            className={`form-control ${errors.userName ? "is-invalid" : ""}`}
                            required
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            onBlur={(e) => validateField("userName", e.target.value)}
                        />
                        {errors.userName && <div className="text-danger mt-1">{errors.userName}</div>}
                    </div>

                    <div className="mb-3">
                        <label>Email:</label>
                        <input
                            type="email"
                            className={`form-control ${errors.email ? "is-invalid" : ""}`}
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onBlur={(e) => validateField("email", e.target.value)} />
                        {errors.email && <div className="text-danger mt-1">{errors.email}</div>}
                    </div>

                    <div className="mb-3">
                        <label>Phone:</label>
                        <input
                            type="text"
                            className={`form-control ${errors.userPhone ? "is-invalid" : ""}`}
                            required
                            value={userPhone}
                            onChange={(e) => setUserPhone(e.target.value)}
                            onBlur={(e) => validateField("userPhone", e.target.value)}
                            placeholder="01xxxxxxxxx"
                        />
                        {errors.userPhone && <div className="text-danger mt-1">{errors.userPhone}</div>}
                    </div>

                    <div className="mb-3">
                        <label>Password:</label>
                        <input
                            type="password"
                            className={`form-control ${errors.password ? "is-invalid" : ""}`}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onBlur={(e) => validateField("password", e.target.value)}
                        />
                        {errors.password && <div className="text-danger mt-1">{errors.password}</div>}
                    </div>

                    <button type="submit" className="btn btn-success w-100">Register</button>
                </form>
            </div>
       
       </>
    );
}
