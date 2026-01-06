import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import TextInput from '../components/TextInput';
import Button from '../components/Button';
import Logo from '../components/Logo';
import { ArrowRight } from 'flowbite-react-icons/outline';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const { login, loading, error, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            setShowSuccess(true);
            setTimeout(() => {
                navigate('/');
            }, 1500);
        }
    }, [user, navigate]);

    const handleLogin = async () => {
        if (!email || !password) {
            return;
        }

        await login(email, password);
    };

    return (
        <div className="flex h-full w-full items-center justify-center rounded-xl bg-[var(--surface)]">
            <div className="flex w-full max-w-md flex-col items-center gap-8 bg-white p-8">
                <div className="flex flex-col items-center gap-4">
                    <Logo variant="logotype" />
                    <h1 className="text-label-medium">Iniciar Sesión</h1>
                </div>

                {error && (
                    <div className="w-full rounded-lg bg-red-50 p-3 text-red-600 text-sm">
                        {error}
                    </div>
                )}

                {showSuccess && (
                    <div className="w-full rounded-lg bg-green-50 p-3 text-green-600 text-sm">
                        ¡Inicio de sesión exitoso! Redirigiendo...
                    </div>
                )}

                <div className="flex w-full flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-label-small">Correo Electrónico</label>
                        <TextInput 
                            placeholder="correo@ucab.edu.ve" 
                            onChangeText={setEmail}
                            type="email"
                        />
                    </div>
                    
                    <div className="flex flex-col gap-2">
                        <label className="text-label-small">Contraseña</label>
                        <TextInput 
                            placeholder="••••••••" 
                            onChangeText={setPassword}
                            type="password"
                        />
                    </div>
                </div>

                <Button 
                    variant="outlined" 
                    className="w-full justify-center bg-[var(--primary)] text-[var(--onPrimary)] hover:bg-[var(--primary)]/90"
                    onClick={handleLogin}
                    icon={<ArrowRight />}
                    disabled={loading}
                >
                    {loading ? 'Ingresando...' : 'Ingresar'}
                </Button>
            </div>
        </div>
    );
}
