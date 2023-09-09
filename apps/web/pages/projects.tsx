import { NextPage } from "next";
import API, { Creation } from "../services/api";
import Image from "next/legacy/image";
import HeaderPage from "../views/HeaderPage";

interface IProjectProps {
	creation: Creation;
}

// convert creation name to kebab case, remove special characters
const kebabCase = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]/g, "-");
}

const Project = ({ creation }: IProjectProps) => {
	return <div
		onClick={() => {
			window.open(creation.link, "_blank")
		}}
		className="
			relative w-fit m-auto
			shadow-lg bg-orange-800 rounded
			transition ease-in-out
			hover:shadow-2xl hover:cursor-pointer
			hover:transform hover:scale-125 hover:z-10
		"
	>
		<div className="relative">
			<Image
				src={"/thumbnails/" + kebabCase(creation.name) + ".png"}
				alt={creation.name}
				width={256 * 1.2}
				height={144 * 1.2}
			/>
		</div>
		<div className="px-4 py-6 text-center">
			<p> {creation.name} </p>
		</div>
	</div>
}

interface Props {
	creations: Creation[];
}

const Projects: NextPage<Props> = (props) => {
	return (
		<HeaderPage>
			<div className="grid grid-cols-4 gap-6 mt-10 mx-[30px]">
				{props.creations.map(creation => <Project key={creation.name} creation={creation} />)}
			</div>
		</HeaderPage>
	)
}

export async function getStaticProps() {
	const data = await API.getCreations();
	return {
		props: {
			creations: data,
		},
		revalidate: 60.
	}
}

export default Projects;


