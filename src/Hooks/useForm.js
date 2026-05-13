import { useState } from "react";
export const useForm = (initialValues) => {
    const [values, setValues] = useState(initialValues);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues({ ...values, [name]: value });
    };

    const reset = (newValues) => {
        setValues(newValues || initialValues);
    };

    const setFieldValue = (name, value) => {
        setValues({ ...values, [name]: value });
    };

    return { values, handleChange, reset, setFieldValue };
};