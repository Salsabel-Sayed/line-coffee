import { useEffect, useState } from "react";
import axios from "axios";

type User = {
    _id: string;
    email: string;
    coins?: { coins: number };
    wallet?: { balance: number };
};

type Wallet = {
    userId: string;
    user: string;
    coins: number;
    balance: number;
};

export default function WalletsSection() {
    const [wallets, setWallets] = useState<Wallet[]>([]);
    const token = localStorage.getItem("linecoffeeToken");

    const [modal, setModal] = useState<{
        type: "coins" | "addBalance" | "deductBalance" | null;
        userId: string | null;
        open: boolean;
    }>({ type: null, userId: null, open: false });

    const [amountInput, setAmountInput] = useState("");

    const fetchWallets = async () => {
        const { data } = await axios.get("https://line-coffee.onrender.com/users/getAllUsers", {
            headers: { Authorization: `Bearer ${token}` },
        });

        const formattedWallets = data.users.map((u: User) => ({
            userId: u._id,
            user: u.email,
            coins: u.coins?.coins ?? 0,
            balance: u.wallet?.balance ?? 0,
        }));
        console.log("formattedWallets",formattedWallets);


        setWallets(formattedWallets);
    };

    const handleSubmitModal = async () => {
        if (!modal.userId || !amountInput) return;

        const amount = Number(amountInput);
        if (isNaN(amount) || amount <= 0) return;

        try {
            if (modal.type === "coins") {
                // مفيش توكن هنا
                await axios.post("https://line-coffee.onrender.com/coins/addCoinsToUser", {
                    userId: modal.userId,
                    coins: amount,
                });
            } else if (modal.type === "addBalance") {
                await axios.post(
                    "https://line-coffee.onrender.com/wallets/addBalance",
                    { userId: modal.userId, amount },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } else if (modal.type === "deductBalance") {
                await axios.put(
                    `https://line-coffee.onrender.com/wallets/updateWalletBalance/${modal.userId}`,
                    { userId: modal.userId, amount },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }
            console.log("TYPE:", modal.type);
            console.log("USER ID:", modal.userId);
            console.log("AMOUNT:", amount);


            fetchWallets();
        } catch (err) {
            console.error(err);
        } finally {
            setModal({ type: null, userId: null, open: false });
            setAmountInput("");
        }
    };

    useEffect(() => {
        fetchWallets();
    }, []);

    return (
        <div>
            <h3 className="mb-4">💰 Wallets & Coins</h3>
            <div className="table-responsive">
                <table className="table table-bordered text-center">
                    <thead className="table-dark">
                        <tr>
                            <th>#</th>
                            <th>User</th>
                            <th>Coins</th>
                            <th>Balance (EGP)</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {wallets.map((wallet, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{wallet.user}</td>
                                <td>{wallet.coins}</td>
                                <td>{wallet.balance}</td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-outline-success me-2"
                                        onClick={() =>
                                            setModal({ type: "coins", userId: wallet.userId, open: true })
                                        }
                                    >
                                        ➕ Add Coins
                                    </button>
                                    <button
                                        className="btn btn-sm btn-outline-primary me-2"
                                        onClick={() =>
                                            setModal({ type: "addBalance", userId: wallet.userId, open: true })
                                        }
                                    >
                                        💵 Add Balance
                                    </button>
                                    <button
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() =>
                                            setModal({ type: "deductBalance", userId: wallet.userId, open: true })
                                        }
                                    >
                                        🗑 Deduct Balance
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ✅ Modal */}
            {modal.open && (
                <div className="modal d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {modal.type === "coins"
                                        ? "Add Coins"
                                        : modal.type === "addBalance"
                                            ? "Add Balance"
                                            : "Deduct Balance"}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setModal({ type: null, userId: null, open: false })}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Enter amount"
                                    value={amountInput}
                                    onChange={(e) => setAmountInput(e.target.value)}
                                />
                            </div>
                            <div className="modal-footer">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setModal({ type: null, userId: null, open: false })}
                                >
                                    Cancel
                                </button>
                                <button className="btn btn-primary" onClick={handleSubmitModal}>
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
