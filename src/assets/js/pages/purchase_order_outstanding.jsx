const {useEffect,useState,useRef}=React;
function PurchaseOutstandingCard(){
    const tableRef = useRef(null);
    const [purchaseOutstanding,setPurchaseOutstanding]=useState([]);
    useEffect(()=>{
        axios.get(`${__API_URL__}/purchase_outstanding/master`)
        .then(res=>setPurchaseOutstanding(res.data))
        .catch(err=>console.error(err));
    },[]);
    console.log(purchaseOutstanding)
    const formatDate = (dateStr) => {
        if (!dateStr) return "-";
        const d = new Date(dateStr);
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
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

    const renderStatusBadge = (status) => {
        const baseClass =
            "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold";

        switch (status) {
            case "purchase":
                return `<span class="${baseClass} bg-green-500 text-white">Purchase Order</span>`;

            case "draft":
                return `<span class="${baseClass} bg-yellow-400 text-black">Draft</span>`;

            default:
                return `<span class="${baseClass} bg-gray-100 text-gray-700">${status}</span>`;
        }
    };
    useEffect(() => {
        if (!purchaseOutstanding.length) return;

        if ($.fn.DataTable.isDataTable(tableRef.current)) {
            $(tableRef.current).DataTable().destroy();
        }

        const table = $(tableRef.current).DataTable({
            destroy: true,
            scrollX: true,
            autoWidth: false,
            data: purchaseOutstanding.map(p => {
                const currency =
                (p.currency_id && p.currency_id[1]) ? p.currency_id[1] : "IDR";

                return [
                    p.origin,
                    `<strong>${p.name}</strong>`,
                    (p.partner_id && p.partner_id[1]) ? p.partner_id[1] : "-",
                    (p.company_id && p.company_id[1]) ? p.company_id[1] : "-",
                    formatDate(p.date_order),
                    (p.user_id && p.user_id[1]) ? p.user_id[1] : "-",
                    p.origin,
                    `<strong>${formatCurrency(p.amount_total, currency)}</strong>`,
                    renderStatusBadge(p.state),
                    p.id
                ];
            }),
            columns: [
                { title: "Reference No" },
                { title: "Reference" },
                { title: "Vendor" },
                { title: "Company_id" },
                { title: "Order Deadline" },
                { title: "Buyer" },
                { title: "Source Document" },
                { title: "Total" },
                { title: "Status" },
                { visible: false }
            ],
            createdRow: function(row) {
                $(row).addClass('clickable-row');
            }
        });
        $(tableRef.current).on('click', 'tbody tr', function () {
            const rowData = table.row(this).data();
            console.log(rowData);
            const id = rowData[9];

            window.location.href = `purchase_order_outstanding_detail.html?id=${id}`;
        });

        setTimeout(() => table.columns.adjust(), 100);

    }, [purchaseOutstanding]);

    return (
        <table
            ref={tableRef}
            className="min-w-[640px] w-full"
        />
    );
}
const root = ReactDOM.createRoot(
    document.getElementById("purchaseOrderOutstandingTable")
);
root.render(<PurchaseOutstandingCard />);