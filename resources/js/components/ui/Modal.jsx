import { useEffect } from 'react';

const sizeClasses = {
    sm: 'sm:max-w-lg',
    md: 'sm:max-w-2xl',
    lg: 'sm:max-w-4xl',
};

export default function Modal({ isOpen, title, onClose, children, footer = null, size = 'md' }) {
    useEffect(() => {
        if (!isOpen) return;

        const { style } = document.body;
        const previousOverflow = style.overflow;
        style.overflow = 'hidden';

        return () => {
            style.overflow = previousOverflow;
        };
    }, [isOpen]);

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div
                    className="fixed inset-0 z-0 transition-opacity bg-gray-500 bg-opacity-75"
                    onClick={onClose}
                ></div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                    &#8203;
                </span>

                <div
                    className={`relative z-10 inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-full ${
                        sizeClasses[size] || sizeClasses.md
                    }`}
                >
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="flex items-center justify-between">
                            {title && (
                                <h3 className="text-lg font-medium text-gray-900">{title}</h3>
                            )}
                            {onClose && (
                                <button
                                    onClick={onClose}
                                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                                >
                                    <span className="sr-only">Cerrar</span>
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>
                        <div className="mt-4">
                            {children}
                        </div>
                    </div>
                    {footer && (
                        <div className="bg-gray-50 px-4 py-3 sm:px-6">
                            {footer}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

