'use client';

import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react';
import Dialog from 'rc-dialog';
import 'rc-dialog/assets/index.css';

type DialogContextType = {
  showDialog: (title: string, message: string) => void;
};
type Props = {
  children: ReactNode;
};

const DialogContext = createContext<DialogContextType | undefined>(undefined);

function DialogProvider({ children }: Props) {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [visible, setVisible] = useState(false);

  const showDialog = useCallback((title: string, message: string) => {
    setTitle(title);
    setMessage(message);
    setVisible(true);
  }, []);

  return (
    <DialogContext.Provider value={{ showDialog }}>
      {children}
      <Dialog
        title={title}
        onClose={() => {
          setTitle('');
          setMessage('');
          setVisible(false);
        }}
        visible={visible}
      >
        <p>{message}</p>
      </Dialog>
    </DialogContext.Provider>
  );
}

export default DialogProvider;

export const useDialog = () => {
  const context = useContext(DialogContext);
  if (context === undefined) {
    throw new Error('useDialog must be used within a DialogProvider');
  }
  return context;
};
