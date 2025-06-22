// import React from "react";

type Order = {
    id: string;
    createdAt: string;
    totalAmount: number;
    finalAmount: number;
    status: string;
    coupon?: boolean;
    discount?: number;
    usedWallet?: boolean;
    walletAmount?: number;
    items: {
        product?: {
            productsName: string;
        } | string;
        quantity: number;
      }[];
};
  
interface OrdersListProps {
    orders: Order[];
}

function getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
        case "delivered":
            return "bg-success";
        case "on the way":
            return "bg-warning text-dark";
        case "pending":
            return "bg-secondary";
        default:
            return "bg-light text-dark";
    }
}

function OrdersList({ orders }: OrdersListProps) {
    return (
        <div className="orders-list">
            <h3 className="mb-4">Your Orders</h3>

            {orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                <div className="row">
                        {orders.map((order) => (
                            <div key={order.id} className="col-12 col-md-6 col-lg-4 mb-4">
                                <div className="card shadow-sm h-100">
                                    <div className="card-body d-flex flex-column justify-content-between">
                                        <div>
                                            <h5 className="card-title">Order #{order.id}</h5>
                                            <p className="text-muted mb-1">
                                                📅 {new Date(order.createdAt).toLocaleDateString()}
                                            </p>

                                            <div className="mb-2">
                                                <strong>Products:</strong>
                                                <div className="mb-2 ps-3">
                                                    {order.items.map((item, i) => (
                                                        <div key={`${order.id}-${i}`}>
                                                            {(typeof item.product === "object" &&
                                                                "productsName" in item.product
                                                                ? item.product.productsName
                                                                : "Unnamed Product")}{" "}
                                                            × {item.quantity}
                                                        </div>
                                                    ))}
                                                </div>

                                                <strong>Subtotal:</strong> {order.totalAmount} EGP
                                                <br />
                                                <strong>Final:</strong> {order.finalAmount} EGP
                                                <br />
                                                <strong>Coupon:</strong>{" "}
                                                {order.coupon ? `${order.discount || 0} EGP` : "Not used"}
                                                <br />
                                                <strong>Wallet:</strong>{" "}
                                                {order.walletAmount && order.walletAmount > 0
                                                    ? `${order.walletAmount} EGP`
                                                    : "Not used"}
                                                <br />
                                            </div>
                                        </div>

                                        <div className="mt-auto">
                                            <span
                                                className={`badge ${getStatusClass(order.status)} w-100`}
                                            >
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                </div>
            )}
        </div>
    );
}

export default OrdersList;
