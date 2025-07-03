// ClientForm.tsx
import React, { useState } from 'react';

// Define una interfaz para tus datos del formulario
interface FormData {
    DBServerName: string;
    DBName: string;
    DBUsername: string;
    DBPassword: string;
}

// Define una interfaz para los estados de "tocado" de cada campo
interface TouchedFields {
    DBServerName: boolean;
    DBName: boolean;
    DBUsername: boolean;
    DBPassword: boolean;
}

export function DBForm() {
    const [formData, setFormData] = useState<FormData>({
        DBServerName: "",
        DBName: "",
        DBUsername: "",
        DBPassword: "",
    });

    // Nuevo estado para controlar si un campo ha sido tocado
    const [touched, setTouched] = useState<TouchedFields>({
        DBServerName: false,
        DBName: false,
        DBUsername: false,
        DBPassword: false,
    });

    // Función para manejar el cambio en los inputs
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
        // Al escribir, marca el campo como tocado
        setTouched(prevTouched => ({
            ...prevTouched,
            [name]: true,
        }));
    };

    // Función para manejar cuando un input pierde el foco (blur)
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name } = e.target;
        setTouched(prevTouched => ({
            ...prevTouched,
            [name]: true, // Marca el campo como tocado cuando pierde el foco
        }));
    };

    // Función para enviar las credenciales
    const sendDBCredentials = async (e: React.FormEvent) => {
        e.preventDefault(); // Evita el comportamiento por defecto del formulario (recarga de página)

        // Marcar todos los campos como tocados al intentar enviar el formulario
        setTouched({
            DBServerName: true,
            DBName: true,
            DBUsername: true,
            DBPassword: true,
        });

        // Simple validación: verificar si algún campo está vacío
        const isFormValid = Object.values(formData).every(value => value.trim() !== "");

        if (!isFormValid) {
            console.error("Por favor, rellena todos los campos.");
            // Aquí puedes mostrar un mensaje al usuario directamente en la UI si lo deseas
            return; // Detiene el envío si el formulario no es válido
        }
        
        try {
            console.log('data al srv', formData);
            const response = await fetch("https://localhost:5867", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Error HTTP! estado: ${response.status}, mensaje: ${errorData.message || response.statusText}`);
            }

            const result = await response.json();
            console.log("Éxito:", result);
            alert("Credenciales enviadas con éxito!"); // Mensaje de éxito al usuario

            // Opcional: limpiar el formulario después de un envío exitoso
            setFormData({
                DBServerName: "",
                DBName: "",
                DBUsername: "",
                DBPassword: "",
            });
            setTouched({ // Resetear también el estado de "tocado"
                DBServerName: false,
                DBName: false,
                DBUsername: false,
                DBPassword: false,
            });

        } catch (error) {
            console.error("Error al enviar credenciales DB:", error);
            alert(`Error al enviar las credenciales: ${error instanceof Error ? error.message : "Error desconocido"}`); // Mensaje de error al usuario
        }
    };

    return (
        // Contenedor principal para centrar el formulario en la pantalla
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            {/* Formulario con estilos responsive, sombra y esquinas redondeadas */}
            <form
                onSubmit={sendDBCredentials}
                className="
                    bg-white p-8 rounded-lg shadow-xl w-full max-w-md
                    mx-auto text-xl md:text-xl
                    space-y-6 md:space-y-8
                    border border-gray-200
                "
            >
                <h2 className="text-3xl md:text-2xl font-bold text-center text-indigo-700 mb-8">
                    Configuración de Base de Datos
                </h2>

                {/* Campo DB Server Name */}
                <div className="space-y-2">
                    <label
                        htmlFor="DBServerName"
                        className="block text-gray-700 font-semibold"
                    >
                        Nombre del Servidor DB:
                    </label>
                    <input
                        type="text"
                        name="DBServerName"
                        id="DBServerName"
                        value={formData.DBServerName}
                        onChange={handleChange}
                        onBlur={handleBlur} // Agrega el manejador de blur
                        required
                        className={`
                            w-full p-3 border rounded-lg focus:outline-none focus:ring-2
                            focus:ring-indigo-500 transition duration-200 ease-in-out
                            ${(touched.DBServerName && formData.DBServerName.trim() === "")
                                ? "border-red-500 ring-red-300" // Clases para borde rojo si está vacío y tocado
                                : "border-gray-300"
                            }
                        `}
                        placeholder="ej. SRV-LYO"
                    />
                    {(touched.DBServerName && formData.DBServerName.trim() === "") && (
                        <p className="text-red-500 text-sm mt-1">Este campo es obligatorio.</p>
                    )}
                </div>

                {/* Campo DB Name */}
                <div className="space-y-2">
                    <label
                        htmlFor="DBName"
                        className="block text-gray-700 font-semibold"
                    >
                        Nombre de la DB:
                    </label>
                    <input
                        type="text"
                        name="DBName"
                        id="DBName"
                        value={formData.DBName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        className={`
                            w-full p-3 border rounded-lg focus:outline-none focus:ring-2
                            focus:ring-indigo-500 transition duration-200 ease-in-out
                            ${(touched.DBName && formData.DBName.trim() === "")
                                ? "border-red-500 ring-red-300"
                                : "border-gray-300"
                            }
                        `}
                        placeholder="ej. DATA_9061"
                    />
                     {(touched.DBName && formData.DBName.trim() === "") && (
                        <p className="text-red-500 text-sm mt-1">Este campo es obligatorio.</p>
                    )}
                </div>

                {/* Campo DB Username */}
                <div className="space-y-2">
                    <label
                        htmlFor="DBUsername"
                        className="block text-gray-700 font-semibold"
                    >
                        Usuario DB:
                    </label>
                    <input
                        type="text"
                        name="DBUsername"
                        id="DBUsername"
                        value={formData.DBUsername}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        className={`
                            w-full p-3 border rounded-lg focus:outline-none focus:ring-2
                            focus:ring-indigo-500 transition duration-200 ease-in-out
                            ${(touched.DBUsername && formData.DBUsername.trim() === "")
                                ? "border-red-500 ring-red-300"
                                : "border-gray-300"
                            }
                        `}
                        placeholder="ej. sa"
                    />
                     {(touched.DBUsername && formData.DBUsername.trim() === "") && (
                        <p className="text-red-500 text-sm mt-1">Este campo es obligatorio.</p>
                    )}
                </div>

                {/* Campo DB Password */}
                <div className="space-y-2">
                    <label
                        htmlFor="DBPassword"
                        className="block text-gray-700 font-semibold"
                    >
                        Contraseña DB:
                    </label>
                    <input
                        type="password"
                        name="DBPassword"
                        id="DBPassword"
                        value={formData.DBPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        className={`
                            w-full p-3 border rounded-lg focus:outline-none focus:ring-2
                            focus:ring-indigo-500 transition duration-200 ease-in-out
                            ${(touched.DBPassword && formData.DBPassword.trim() === "")
                                ? "border-red-500 ring-red-300"
                                : "border-gray-300"
                            }
                        `}
                        placeholder="••••••••"
                    />
                     {(touched.DBPassword && formData.DBPassword.trim() === "") && (
                        <p className="text-red-500 text-sm mt-1">Este campo es obligatorio.</p>
                    )}
                </div>

                {/* Botón de envío */}
                <button
                    type="submit"
                    className="
                        w-full bg-indigo-600 text-white p-3 rounded-lg font-semibold
                        hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500
                        focus:ring-opacity-50 transition duration-300 ease-in-out
                        text-xl mt-6
                    "
                >
                    Enviar Credenciales
                </button>
            </form>
        </div>
    );
}