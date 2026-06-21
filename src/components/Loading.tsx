import { Loader } from "lucide-react";


const Loading = () => {
  return (
    <div className="flex items-center justify-center mx-auto my-24">
      <Loader className="animate-spin" size={24} />
    </div>
  );
};

export default Loading;
