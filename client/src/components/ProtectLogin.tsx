import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../Hooks/useAuth';
import Loader from './Loader';


function ProtectLogin({ children }: { children: JSX.Element }) {
    const navigate = useNavigate()
    const { loading, user } = useAuth();

    useEffect(() => {
        if (loading || !user) return;
        if (user.logined) {
            navigate("/");
        }
    }, [loading, user, navigate])

    if (loading || !user) return <Loader />;
    return (
        <>{children}</>
    );
}

export default ProtectLogin;