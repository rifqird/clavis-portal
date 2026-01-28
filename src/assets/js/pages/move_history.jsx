const {useEffect,useState}=React;
function MoveHistoryCard(){
    const [moveHistory,setMoveHistory]=useState([]);
    useEffect(()=>{
        axios.get(`${__API_URL__}/move_history/master`)
        .then(res=>setMoveHistory(res.data))
        .catch(err=>console.error(err));
    },[]);
    const formatDate = (dateStr) => {
        if (!dateStr) return "-";
        const d = new Date(dateStr);
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();
        const hours = String(d.getHours()).padStart(2, "0");
        const minutes = String(d.getMinutes()).padStart(2, "0");
        const seconds = String(d.getSeconds()).padStart(2, "0");
        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    };
    const formatCurrency = (value) => {
        if (value == null) return "-";
        return "Rp." + new Intl.NumberFormat("en-US", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        }).format(value);
    };
    const StatusBadge = ({ status }) => {
        const baseClass =
            "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold";

        switch (status) {
            case "done":
                return (
                    <span className={`${baseClass} bg-green-500 text-white`}>
                        Done
                    </span>
                );
            case "waiting":
                return (
                    <span className={`${baseClass} bg-gray-100 text-white`}>
                        Waiting
                    </span>
                );
            case "draft":
                return (
                    <span className={`${baseClass} bg-yellow-400 text-black`}>
                        Draft
                    </span>
                );
            case "assigned":
                return (
                    <span className={`${baseClass} bg-red-100 text-black`}>
                        Assigned
                    </span>
                );
            case "confirmed":
                return (
                    <span className={`${baseClass} bg-yellow-400 text-black`}>
                        Confirmed
                    </span>
                );
            case "cancel":
                return (
                    <span className={`${baseClass} bg-red-500 text-black`}>
                        Cancelled
                    </span>
                );
            default:
                return (
                    <span className={`${baseClass} bg-gray-100 text-gray-700`}>
                        {status}
                    </span>
                );
        }
    };
    return(
        <div class="col-span-12 2xl:col-span-12 order-[17] card">
            <div className="overflow-x-auto w-full">
                <table className="border min-w-max">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Reference</th>
                            <th>Product</th>
                            <th>Lot/serial</th>
                            <th>From</th>
                            <th>To</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {moveHistory.map((p, i) => (
                            <tr key={i}>
                                <td>{formatDate(p.date)}</td>
                                <td>{p.name}</td>
                                <td>{p.product_id}</td>
                                <td>{p.lot_id}</td>
                                <td>{p.location_id[1]?p.location_id[1]:'-'}</td>
                                <td>{p.location_dest_id[1]?p.location_dest_id[1]:'-'}</td>
                                <td className="text-center align-middle">
                                    <StatusBadge status={p.state} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
const root = ReactDOM.createRoot(
    document.getElementById("moveHistoryTable")
);
root.render(<MoveHistoryCard />);