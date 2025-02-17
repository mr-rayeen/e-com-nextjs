import { Skeleton } from '@heroui/skeleton';
import React from 'react'

const CartItemSkeleton = () => {
  return (
		<>
			<div className="flex flex-col p-4 gap-4">
				{/* <Loader className="animate-spin h-10 text-gray-400 w-10" />
							<span>Loading your cart...</span> */}
				<div className="flex gap-3">
					<Skeleton className=" size-20 rounded-lg flex-shrink-0 " />
					<div className="flex-1 flex flex-col gap-3 w-80">
						<Skeleton className="h-6 w-4/5 mt-2 rounded-lg" />
						<Skeleton className="h-8 w-3/5 rounded-lg" />
					</div>
				</div>
				<div className="flex gap-3">
					<Skeleton className=" size-20 rounded-lg flex-shrink-0 " />
					<div className="flex-1 flex flex-col gap-3 w-80">
						<Skeleton className="h-6 w-4/5 mt-2 rounded-lg" />
						<Skeleton className="h-8 w-3/5 rounded-lg" />
					</div>
				</div>
				<div className="flex gap-3">
					<Skeleton className=" size-20 rounded-lg flex-shrink-0 " />
					<div className="flex-1 flex flex-col gap-3 w-80">
						<Skeleton className="h-6 w-4/5 mt-2 rounded-lg" />
						<Skeleton className="h-8 w-3/5 rounded-lg" />
					</div>
				</div>
			</div>
		</>
  );
}

export default CartItemSkeleton