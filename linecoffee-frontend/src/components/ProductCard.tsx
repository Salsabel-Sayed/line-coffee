type ProductCardProps = {
    image: string;
    name: string;
    price: number;
    quantity: number;
    onRemove: () => void;
    onQuantityChange: (value: number) => void;
};

export default function ProductCard({
    image,
    name,
    price,
    quantity,
    onRemove,
    onQuantityChange,
}: ProductCardProps) {
    return (
        <div
            className="d-flex flex-row-reverse justify-content-between align-items-center border rounded p-3 mb-3 shadow-sm"
            dir="rtl"
        >
            <img
                src={image}
                alt={name}
                style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    marginLeft: "20px",
                }}
            />
            <div className="flex-grow-1">
                <h6 className="fw-bold mb-1">{name}</h6>
                <p className="text-muted mb-2">{price} جنيه</p>

                <div className="d-flex align-items-center gap-2">
                    <select
                        className="form-select form-select-sm w-auto"
                        value={quantity}
                        onChange={(e) => onQuantityChange(Number(e.target.value))}
                    >
                        {[...Array(10)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>
                                {i + 1}
                            </option>
                        ))}
                    </select>
                    <span className="small text-muted">الكمية</span>
                    <button
                        className="btn btn-sm btn-outline-danger ms-2"
                        onClick={onRemove}
                    >
                        🗑️ إزالة
                    </button>
                </div>
            </div>
        </div>
    );
}
  