import Link from "next/link"



interface NavItemProps {
	label: string;
	href: string;
}

const NavItem = (props: NavItemProps) => {
	return <Link href={props.href}>
		<li className="p-5 cursor-pointer hover:bg-red-500">
			{props.label}
		</li>
	</Link>
}


const NavBar = () => {
	return <nav className="flex z-10 bg-gray-100">
		<ul className="flex border-b-2 border-black w-full">
			<NavItem label="Home" href="/" />
			<NavItem label="About" href="/about" />
			<NavItem label="Projects" href="/projects" />
			<NavItem label="Blog" href="/blog" />
		</ul>
	</nav>
}


export default NavBar
