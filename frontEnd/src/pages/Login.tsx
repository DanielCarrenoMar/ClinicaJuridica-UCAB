import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import TextInput from '../components/TextInput';
import Button from '../components/Button';
import Logo from '../components/Logo';
import { ArrowRight } from 'flowbite-react-icons/outline';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!email || !password) {
            console.error('Email y contraseña son requeridos');
            return;
        }

        setIsLoading(true);
        try {
            await login(email, password);
            navigate('/');
        } catch (error) {
            console.error('Error en login:', error);
            // Aquí podríamos mostrar un mensaje de error al usuario
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-full w-full items-center justify-center rounded-xl bg-surface">
            <div className="flex w-full max-w-md flex-col items-center gap-8 bg-white p-8">
                <div className="flex flex-col items-center gap-4">
                    <Logo variant="logotype" />
                    <h1 className="text-label-medium">Iniciar Sesión</h1>
                </div>

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
                    className="w-full justify-center bg-primary text-onPrimary hover:bg-primary/90"
                    onClick={handleLogin}
                    icon={<ArrowRight />}
                    disabled={isLoading}
                >
                    {isLoading ? 'Ingresando...' : 'Ingresar'}
                </Button>
            </div>
        </div>
    );
}
