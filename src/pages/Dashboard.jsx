import { DollarSign, ShoppingBag, CreditCard } from "lucide-react";
import StatCard from "../components/StatCard";

export default function Dashboard() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
                title="Ventas Bs"
                value="Bs 1.250"
                subtitle="Día operativo"
                icon={CreditCard}
                color="text-green-400"
            />

            <StatCard
                title="Ventas USD"
                value="$180"
                subtitle="Día operativo"
                icon={DollarSign}
                color="text-blue-400"
            />

            <StatCard
                title="Órdenes"
                value="32"
                subtitle="Totales"
                icon={ShoppingBag}
                color="text-orange-400"
            />
        </div>
    );
}