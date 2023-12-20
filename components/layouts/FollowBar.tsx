const FollowBar = () => {
  return (
    <div className="px-6 py-4 hidden lg:block">
      <div className="bg-neutral-800 rounded-xl p-4">
        <h2 className="text-white text-xl fonr-semibold capitalize">
          who to follow
        </h2>
        <div className="flex felx-col gap-6 mt-4">User List</div>
      </div>
    </div>
  );
};
export default FollowBar;