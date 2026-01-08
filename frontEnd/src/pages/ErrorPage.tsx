import Box from '#components/Box.tsx';
import Button from '#components/Button.tsx';
import { AngleLeft, Home } from 'flowbite-react-icons/outline';
import { isRouteErrorResponse, useNavigate, useRouteError } from 'react-router';

export default function ErrorPage() {
    const error = useRouteError();
    const navigate = useNavigate();

    const title = isRouteErrorResponse(error)
        ? `Error ${error.status}`
        : 'Ocurrió un error inesperado';

    const message = isRouteErrorResponse(error)
        ? (error.data?.message ?? error.statusText ?? 'No se pudo completar la solicitud.')
        : (error instanceof Error ? error.message : 'Intenta nuevamente.');

    const debugDetails = (() => {
        if (isRouteErrorResponse(error)) {
            try {
                return typeof error.data === 'string' ? error.data : JSON.stringify(error.data, null, 2);
            } catch {
                return String(error.data);
            }
        }

        if (error instanceof Error) {
            return error.stack ?? error.message;
        }

        try {
            return JSON.stringify(error, null, 2);
        } catch {
            return String(error);
        }
    })();

    return (
        <div className="flex h-full w-full items-center justify-center">
            <Box className="w-full max-w-2xl flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-label-large text-onSurface">{title}</h1>
                    <p className="text-body-medium text-onSurface/70">{message}</p>
                </div>

                <div className="flex gap-3 justify-end">
                    <Button
                        variant="resalted"
                        icon={<AngleLeft />}
                        onClick={() => navigate(-1)}
                    >
                        Volver
                    </Button>
                    <Button
                        variant="outlined"
                        icon={<Home />}
                        onClick={() => navigate('/', { replace: true })}
                    >
                        Ir al inicio
                    </Button>
                </div>

                {import.meta.env.DEV && debugDetails && (
                    <details className="rounded-xl border border-onSurface/10 bg-surface/70 p-3">
                        <summary className="cursor-pointer text-body-small text-onSurface/70">
                            Ver detalles técnicos
                        </summary>
                        <pre className="mt-3 whitespace-pre-wrap wrap-break-word text-body-small text-onSurface/70">
                            {debugDetails}
                        </pre>
                    </details>
                )}
            </Box>
        </div>
    );
}
