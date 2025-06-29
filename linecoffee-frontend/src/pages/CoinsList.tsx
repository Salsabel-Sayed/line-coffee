import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import CryptoJS from "crypto-js";
import { ENCRYPTION_KEY, TOKEN_KEY } from "../utils/authUtils";

type CoinLog = {
    _id?: string;
    action: string;
    amount?: number;
    description?: string;
    createdAt: string;
};

type CoinsProps = {
    coins: {
        coins: number;
        logs?: CoinLog[];
    };
    onRedeemSuccess?: () => void;
};

function CoinsList({ coins, onRedeemSuccess }: CoinsProps) {
    const [redeemAmount, setRedeemAmount] = useState(0);

    const getDecryptedToken = () => {
        const encrypted = localStorage.getItem(TOKEN_KEY);
        if (!encrypted) return null;
        try {
            const bytes = CryptoJS.AES.decrypt(encrypted, ENCRYPTION_KEY);
            return bytes.toString(CryptoJS.enc.Utf8);
        } catch (err) {
            console.error("Failed to decrypt token:", err);
            return null;
        }
    };

    const handleRedeem = async () => {
        const token = getDecryptedToken();
        const userId = localStorage.getItem("userId");

        if (!token || !userId) return toast.error("User not logged in");

        try {
            const res = await axios.put(
                `https://line-coffee.onrender.com/coins/redeemCoins/${userId}`,
                {
                    coinsToRedeem: redeemAmount,
                    reason: "User Redeemed Coins",
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toast.success(res.data.message);
            if (onRedeemSuccess) onRedeemSuccess();
        } catch (err: unknown) {
            console.error(err);
            if (axios.isAxiosError(err)) {
                toast.error(err.response?.data?.message || "Redemption failed");
            } else {
                toast.error("An unexpected error occurred");
            }
        }
    };

    return (
        <div>
            <h3>💰 Your Coins: {coins.coins}</h3>
            <div className="mt-3">
                <input
                    type="number"
                    className="form-control mb-2"
                    placeholder="Enter coins to redeem"
                    value={redeemAmount}
                    onChange={(e) => setRedeemAmount(Number(e.target.value))}
                />
                <button
                    className="btn btn-success"
                    onClick={handleRedeem}
                    disabled={redeemAmount <= 0}
                >
                    Redeem Coins for EGP
                </button>
            </div>

            <div className="mt-4">
                <h5>🧾 Transaction Logs</h5>
                <table className="table table-striped mt-2">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Action</th>
                            <th>Amount</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {coins.logs?.map((log) => (
                            <tr
                                key={log._id}
                                style={{
                                    backgroundColor: log.action === "deduct" ? "#ffe6e6" : "transparent",
                                }}
                            >
                                <td>{new Date(log.createdAt).toLocaleDateString()}</td>
                                <td>{log.action}</td>
                                <td>{log.amount ?? "-"}</td>
                                <td>{log.description}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default CoinsList;
