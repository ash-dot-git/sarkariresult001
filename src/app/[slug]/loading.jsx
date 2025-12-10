import React from 'react';
import SkeletonLoader from '@/components/ui/SkeletonLoader';

const Loading = () => {
  return (
    <div className="p-8">
      <SkeletonLoader />
    </div>
  );
};

export default Loading;
// import React from 'react';

// const Loading = () => {
//   return (
//     <div className="flex justify-center items-center h-screen">
//       <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-red-500"></div>
//     </div>
//   );
// };

// export default Loading;