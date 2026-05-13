import React,{ useState } from "react";
import { Eye } from "lucide-react";
import List from "./List";
import Toast from '../../Utils/Toast';
import MenuForm from './MenuForm';
import { useMenuManager } from "../../Hooks/useManagerMenu";

export default function Menu() {
    const { state, data, actions } = useMenuManager();
    const [editingItem, setEditingItem] = useState(null);

    const handleEditClick = (item) => {

        console.log("item", item);

        setEditingItem(item); // Cargamos el item en el estado
        actions.setIsListVisible(false); // Cerramos la lista para ver el form
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Subimos al formulario
    };

    const handleCancelEdit = () => {
        setEditingItem(null);
    };

    return (
        <section className="bg-[#1A1A1A] border border-white/5 p-6 rounded-2xl shadow-2xl mb-6 relative overflow-hidden">

            <button
                onClick={() => actions.setIsListVisible(true)}
                className="absolute top-6 right-6 flex items-center gap-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-dorado px-4 py-2 rounded-xl border border-white/10 transition-all text-xs font-bold"
            >
                <Eye size={16} /> VER LISTA
            </button>

            <div className="flex items-center gap-2 mb-6">
                <span className="text-dorado text-xl">📋</span>
                <h2 className="font-bold text-xl text-white tracking-tight">Cargar menú</h2>
            </div>

            <MenuForm
                onSubmit={editingItem ? actions.handleUpdate : actions.handleAdd}
                initialData={editingItem}
                onCancel={handleCancelEdit}
                burgersAvailable={data.burgers}
                extrasAvailable={data.extras}
            />

            <List
                visible={state.isListVisible}
                onHide={() => actions.setIsListVisible(false)}
                items={data.menuData}
                onDelete={actions.handleDelete}
                onEdit={handleEditClick}
            />

            {state.toast && (
                <Toast
                    message={state.toast.message}
                    type={state.toast.type}
                    onClose={() => actions.setToast(null)}
                />
            )}
        </section>
    );
}