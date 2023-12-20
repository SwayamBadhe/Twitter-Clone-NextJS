import useLoginModal from '@/hooks/useLoginModal';
import { useState, useCallback } from 'react';
import Input from '../Input';
import Modal from '../Modal';
import useRegisterModal from '@/hooks/useRegisterModal';
import axios from 'axios';
import toast from 'react-hot-toast';
import { signIn } from 'next-auth/react';

const RegisterModal = () => {
  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [username, setUserName] = useState('');
  const [isLoding, setIsLoading] = useState(false);

  const onSubmit = useCallback(async () => {
    try {
      setIsLoading(true);

      await axios.post('/api/register', {
        email,
        password,
        name,
        username,
        // defined in register.ts
      });

      toast.success('Account Created Successfully');

      signIn('credentials', { email, password });

      registerModal.onClose();
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }, [registerModal, email, password, name, username]);

  const onToggle = useCallback(() => {
    if (isLoding) return;
    registerModal.onClose();
    loginModal.onOpen();
  }, [isLoding, loginModal, registerModal]);

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        disabled={isLoding}
      />
      <Input
        placeholder="Name"
        onChange={(e) => setName(e.target.value)}
        value={name}
        disabled={isLoding}
      />
      <Input
        placeholder="Username"
        onChange={(e) => setUserName(e.target.value)}
        value={username}
        disabled={isLoding}
      />
      <Input
        placeholder="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        disabled={isLoding}
      />
    </div>
  );

  const fotterContent = (
    <div className="text-neutral-400 text-center mt-4">
      <p>
        Already have an Account? &nbsp;
        <span
          className="text-white cursor-pointer hover:underline"
          onClick={onToggle}
        >
          Log In
        </span>
      </p>
    </div>
  );

  return (
    <Modal
      disabled={isLoding}
      isOpen={registerModal.isOpen}
      title="Create An Account"
      actionLabel="Register"
      onClose={registerModal.onClose}
      onSubmit={onSubmit}
      body={bodyContent}
      footer={fotterContent}
    />
  );
};
export default RegisterModal;
