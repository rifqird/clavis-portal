const { useEffect, useState } = React;

function PurchaseOutstandingDetail() {

    const [data, setData] = useState(null);

    // 🔥 ambil id dari query param
    const getIdFromUrl = () => {
        const params = new URLSearchParams(window.location.search);
        return params.get("id");
    };
    
    useEffect(() => {
        const id = getIdFromUrl();

        if (!id) return;

        axios
            .get(`${__API_URL__}/purchase_outstanding/detail/${id}`)
            .then(res => setData(res.data))
            .catch(console.error);
    }, []);
    const formatDateTime = (dateStr) => {
        if (!dateStr) return "-";

        const d = new Date(dateStr);

        const day = String(d.getUTCDate()).padStart(2, "0");
        const month = String(d.getUTCMonth() + 1).padStart(2, "0");
        const year = d.getUTCFullYear();

        const hours = String(d.getUTCHours()).padStart(2, "0");
        const minutes = String(d.getUTCMinutes()).padStart(2, "0");
        const seconds = String(d.getUTCSeconds()).padStart(2, "0");

        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    };
    const formatDecimal = (val) => {
        if (val === null || val === undefined || val === "") return "0.00";
        return Number(val).toFixed(2);
    };
    const formatNumber = (val) => {
        if (val === null || val === undefined || val === "") return "0.00";

        return Number(val).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };
    const formatCurrency = (value, currency = "IDR") => {
        if (value == null) return "-";

        // mapping locale biar format sesuai negara
        const localeMap = {
            IDR: "id-ID",
            EUR: "de-DE",
            USD: "en-US"
        };

        const locale = localeMap[currency] || "en-US";

        return new Intl.NumberFormat(locale, {
            style: "currency",
            currency: currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    };
    
    console.log(data);
    if (!data) return <div>Loading...</div>;
    const currency =
    (data.currency_id && data.currency_id[1])
        ? data.currency_id[1]
        : "IDR";
    const amountUntaxed = data.lines.reduce((sum, l) => {
        return sum + (Number(l.subtotal) || 0);
    }, 0);
    const taxes = amountUntaxed * 0.11; // ✅ 11%
    const total = amountUntaxed + taxes;
    return (
        <div className="space-y-2">
            <button
                onClick={() => window.history.back()}
                className="mb-3 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm"
            >
                ← Back
            </button>
            <h2 className="text-sm font-bold">
                Purchase Order
            </h2>

            <h2 className="text-xl font-bold mb-5">
                {data.name}
            </h2>
            <div className="grid grid-cols-4 ">
                <b>Vendor</b>
                <span>{data.partner_id && data.partner_id[1] ? data.partner_id[1] : '-'}</span>
                <b>Confirmation Date </b>
                <span>{data.date_approve ? formatDateTime(data.date_approve) : '-'}</span>


                <b>Delivery Address </b>
                <span>{data.x_studio_delivery_address && data.x_studio_delivery_address[1] ? data.x_studio_delivery_address[1] : '-'}</span>

                <b>Expected Arrival </b>
                <span>{data.date_planned ? formatDateTime(data.date_planned) : '-'}</span>


                <b>Vendor Reference </b>
                <span>{data.partner_ref !== 'false' && data.partner_ref ? data.partner_ref : '-'}</span>

                <b>Deliver To </b>
                <span>{data.picking_type_id && data.picking_type_id[1] ? data.picking_type_id[1] : '-'}</span>


                <b>Currency </b>
                <span>{data.currency_id && data.currency_id[1] ? data.currency_id[1] : '-'}</span>

                <b>Arrival </b>
                <span>{data.effective_date ? new Date(data.effective_date).toLocaleString() : '-'}</span>

            </div>

            <div className="mt-5">
                <h3 className="font-semibold mb-2">Items</h3>

                <table className="w-full border overflow-auto">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2 border">Product</th>
                            <th className="p-2 border">Analytic Distribution</th>
                            <th className="p-2 border">Quantity</th>
                            <th className="p-2 border">Received</th>
                            <th className="p-2 border">Billed</th>
                            <th className="p-2 border">Price</th>
                            <th className="p-2 border">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.lines
                            .filter(l => Number(l.subtotal) !== 0)
                            .map((l, i) => (
                                <tr key={i}>
                                    <td className="whitespace-pre-line align-top text-sm">{l.name}</td>
                                    <td className="border p-2 align-top">
                                        {l.analytic_distribution.length === 1 ? l.analytic_distribution[0].name : '-'}
                                    </td>
                                    <td className="border p-2 align-top text-right">{formatDecimal(l.po_qty)}</td>
                                    <td className="border p-2 align-top text-right">{formatDecimal(l.gr_qty)}</td>
                                    <td className="border p-2 align-top text-right">{formatDecimal(l.qty_invoiced)}</td>
                                    <td className="border p-2 align-top text-right">{formatNumber(l.price_unit)}</td>
                                    <td className="border p-2 align-top text-right">{formatNumber(l.subtotal)}</td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-end mt-6">
                <div className="w-[420px] flex-none space-y-2">

                    <div className="flex justify-between">
                        <span>Untaxed Amount :</span>
                        <span className="font-bold">{formatCurrency(amountUntaxed, currency)}</span>
                    </div>

                    <div className="flex justify-between">
                        <span>Taxes :</span>
                        <span>{formatCurrency(taxes, currency)}</span>
                    </div>

                    <div className="flex justify-between font-bold text-base border-t pt-2">
                        <span>Total :</span>
                        <span>{formatCurrency(total, currency)}</span>
                    </div>

                </div>
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(
    document.getElementById("purchaseOrderOutstandingDetailTable")
);

root.render(<PurchaseOutstandingDetail />);
