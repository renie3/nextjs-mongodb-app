const Loading = () => {
  return (
    <div className="bg-bgSoft p-5 rounded-xl animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-6 bg-bg rounded-md w-55"></div>
        <div className="h-6 bg-bg rounded-md w-16"></div>
      </div>
      {[...Array(10)].map((_, index) => (
        <div
          key={index}
          className="flex items-center justify-between mb-4 py-2 mt-4"
        >
          <div className="h-8 bg-bg rounded-md w-1/6"></div>
          <div className="h-8 bg-bg rounded-md w-1/6"></div>
          <div className="h-8 bg-bg rounded-md w-1/6"></div>
          <div className="h-8 bg-bg rounded-md w-1/6"></div>
        </div>
      ))}
      <div className="flex items-center justify-between mt-17">
        <div className="h-6 bg-bg rounded-md w-12"></div>
        <div className="h-6 bg-bg rounded-md w-40"></div>
        <div className="h-6 bg-bg rounded-md w-12"></div>
      </div>
    </div>
  );
};

export default Loading;
