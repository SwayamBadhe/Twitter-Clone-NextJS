import { useRouter } from 'next/router';
import { BsTwitter } from 'react-icons/bs';

const SidebarLogo = () => {
  const router = useRouter();
  return (
    <div
      className="rounded-full h-14 w-14 p-4 flex items-center justify-center hower:bg-blue-300 hower:bg-opacity-10 cursor-pointer transition"
      onClick={() => router.push('/')}
    >
      <BsTwitter size={24} color="white" />
    </div>
  );
};
export default SidebarLogo;
