import useLoginModal from '@/hooks/useLoginModal';
import { useState, useCallback } from 'react';
import Input from '../Input';
import Modal from '../Modal';
import useRegisterModal from '@/hooks/useRegisterModal';

const LoginModal = () => {
  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoding, setIsLoading] = useState(false);

  const onSubmit = useCallback(async () => {
    try {
      setIsLoading(true);
      loginModal.onClose();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [loginModal]);

  const onToggle = useCallback(() => {
    if (isLoding) return;
    registerModal.onOpen();
    loginModal.onClose();
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
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        disabled={isLoding}
      />
    </div>
  );

  const fotterContent = (
    <div className="text-neutral-400 text-center mt-4">
      <p>
        First Time Using Twitter? &nbsp;
        <span
          className="text-white cursor-pointer hover:underline"
          onClick={onToggle}
        >
          Create An Account
        </span>
      </p>
    </div>
  );

  return (
    <Modal
      disabled={isLoding}
      isOpen={loginModal.isOpen}
      title="Login"
      actionLabel="Sign-up"
      onClose={loginModal.onClose}
      onSubmit={onSubmit}
      body={bodyContent}
      footer={fotterContent}
    />
  );
};
export default LoginModal;
