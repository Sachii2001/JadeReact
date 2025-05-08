import { useNavigate } from 'react-router-dom';
import TicketForm from '../components/tickets/TicketForm';

const TicketRaise = () => {
    const navigate = useNavigate();

    const handleSubmitSuccess = () => {
        navigate('/ticket-status');
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
            <TicketForm onSubmitSuccess={handleSubmitSuccess} />
        </div>
    );
};

export default TicketRaise;