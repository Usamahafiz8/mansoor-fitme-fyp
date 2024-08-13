import React from 'react'
import clsx from "clsx"
import { useRouter } from 'next/navigation'

export default function Card({ imgSrc, children, className, link }) {
	const router= useRouter()
	return (
		<div className={clsx(
			"max-w-72 relative overflow-hidden group",
			"bg-white",
			"shadow-md",
			"hover:shadow-lg",
			className,
		)}
		>
		  <img 
		  	className={clsx(
		  		" object-contain",
		  		"transition duration-500 ease-out transform w-72 h-60 ",
		  		"group-hover:(scale-110) cursor-pointer",
		  	)} 
		  	src={imgSrc} 
		  	alt="" 
			onClick={()=>{router.push(link)}}
		  />
	  	{children}
		</div>
	)
}