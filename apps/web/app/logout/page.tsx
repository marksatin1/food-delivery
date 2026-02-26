import Image from "next/image";


export default function LogoutPage() {
  return (
    <div className="relative w-full h-128 border">
      <Image src='/photos/pakistani-food.jpg' alt='Food spread out on a table' layout='fill' objectFit="cover"/>
      <div className='absolute inset-0 flex justify-center items-center border'>
        <p className='text-white text-shadow-lg text-5xl font-bold'>You have successfully logged out!</p>
      </div>
    </div>
  )
}