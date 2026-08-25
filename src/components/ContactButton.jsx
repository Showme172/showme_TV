import { useContact } from '../context/ContactContext';

export default function ContactButton({ message, className, children }) {
  const { openContact } = useContact();
  return (
    <button type="button" className={className} onClick={() => openContact(message)}>
      {children}
    </button>
  );
}
