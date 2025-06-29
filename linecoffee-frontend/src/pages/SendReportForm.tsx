import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ENCRYPTION_KEY, TOKEN_KEY } from "../utils/authUtils";

function getDecryptedToken() {
    const encrypted = localStorage.getItem(TOKEN_KEY);
    if (!encrypted) return null;
    const bytes = CryptoJS.AES.decrypt(encrypted, ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
}
export default function SendReportForm() {
 const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!subject || !message) return toast.error("Please fill in all fields");

        const token = getDecryptedToken();
        if (!token) return toast.error("User not logged in");

        try {
            await axios.post("https://line-coffee.onrender.com/reports/createReport", {
                subject,
                message,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            toast.success("Report sent to admin ✅");
            setSubject("");
            setMessage("");
        } catch (err) {
            console.error(err);
            toast.error("Failed to send report");
        }
    };

    return (
        <div>
            <h4>📝 Send Report to Admin</h4>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Subject</label>
                    <input className="form-control" value={subject} onChange={(e) => setSubject(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Message</label>
                    <textarea className="form-control" rows={4} value={message} onChange={(e) => setMessage(e.target.value)} />
                </div>
                <button type="submit" className="btn btn-primary">Send</button>
            </form>
        </div>
    );
}
