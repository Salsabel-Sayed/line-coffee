import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

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

    const handleRedeem = async () => {
        const token = localStorage.getItem("linecoffeeToken");
        const userId = localStorage.getItem("userId");

        console.log("token before request:", token);
        console.log("userId before request:", userId);

        if (!token) return toast.error("User not logged in");

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

            console.log("Request sent!");
            console.log("Response:", res.data);

            toast.success(res.data.message);

            // ✅ هنا بندي أمر بإعادة تحميل البيانات من السيرفر
            if (onRedeemSuccess) onRedeemSuccess();

            console.log("redeemAmount:", redeemAmount);
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
                                    backgroundColor:
                                        log.action === "deduct" ? "#ffe6e6" : "transparent",
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
