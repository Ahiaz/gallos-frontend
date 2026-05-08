/*
Componente: LoadingButton.jsx
Descripción: Componente que construye un boton con loading interno.
Autor: Jose Ahias Vargas
Fecha: 2025-07-08
*/

const LoadingButton = ({
    onClick,
    isLoading = false,
    className = "",
    children,
    spinnerSize = "sm",
    loadingText = "",
    disabled = false,
    ...props 
}) => {

    return (
        <button
            {...props}
            className={`btn ${className}`}
            onClick={onClick}
            disabled={isLoading || disabled} 
        >
            {isLoading ? (
                <>
                    <span
                        className={`spinner-border spinner-border-${spinnerSize} me-2`}
                        role="status"
                        aria-hidden="true"
                    ></span>
                    {loadingText && <span>{loadingText}</span>}
                </>
            ) : (
                children
            )}
        </button>
    );
};

export default LoadingButton;