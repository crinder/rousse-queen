import { useState, useMemo } from "react";
import { useMenuQueries } from "./useMenu";

export const useMenuManager = () => {
    const { menuData, addMenuItem, updateMenuItem, isLoading } = useMenuQueries();

    const [isListVisible, setIsListVisible] = useState(false);
    const [toast, setToast] = useState(null);
    const burgers = useMemo(() => {


        if (!menuData) return [];

        menuData.filter((m) => m.type === "BURGER"), [menuData]
        }
    );

    const extras = useMemo(() => {
        if (!menuData) return [];

        menuData.filter((m) => m.type === "ITEM"), [menuData]
    }
    );

    const handleAdd = async (formData) => {
        try {
            await addMenuItem(formData);
            setToast({ message: "Guardado con éxito", type: "success" });
        } catch (error) {
            setToast({ message: "Error al guardar", type: "error" });
        }
    };

    const handleUpdate = async (formData) => {
        try {
            await updateMenuItem(formData);
            setToast({ message: "Guardado con éxito", type: "success" });
        } catch (error) {
            console.log("error", error);
            setToast({ message: "Error al guardar", type: "error" });
        }
    };

    return {
        state: { isListVisible, toast, isLoading },
        data: { burgers, extras, menuData },
        actions: {
            setIsListVisible,
            setToast,
            handleAdd,
            handleUpdate
        }
    };
};