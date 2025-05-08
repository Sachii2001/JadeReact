import { Toaster } from 'react-hot-toast';

const CustomToastContainer = () => {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        style: {
          background: '#333',
          color: '#fff',
          borderRadius: '8px',
          padding: '16px',
        },
      }}
    />
  );
};

export default CustomToastContainer;
