type WalletProps = {
    balance: number;
    transactions: {
        id?: string;
        type: "deposit" | "withdrawal";
        amount: number;
        date: string;
        reason?: string;
    }[];
};

function Wallet({ balance, transactions }: WalletProps) {
    return (
        <div className="walletPage">
            <h2 className="mb-4">👜 My Wallet</h2>
            <div className="mb-3">
                <h4>Current Balance: <span className="text-success">{balance} EGP</span></h4>
            </div>

            <h5 className="mt-4 mb-2">Transaction History:</h5>
            <ul className="list-group">
                {transactions.map((tx, index) => (
                    <li
                        key={tx.id || index}
                        className="list-group-item d-flex justify-content-between align-items-center"
                    >
                        <div>
                            <strong>{tx.type.toUpperCase()}</strong> - {tx.reason || "No reason"}
                            <br />
                            <small className="text-muted">{new Date(tx.date).toLocaleString()}</small>
                        </div>
                        <span
                            className={`badge ${tx.reason?.includes("coin") ? "bg-warning" :tx.type === 'deposit' ? 'bg-success' :'bg-danger'} rounded-pill`}>
                            {tx.type === 'withdrawal' ? '-' : '+'}{tx.amount} EGP
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Wallet;
  
