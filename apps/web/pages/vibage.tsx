import { NextPage } from "next";
import { forwardRef, useEffect, useState } from "react";
import API, { SearchTrack } from "../services/api";
import styles from "../styles/Vibage.module.css";
import FullHeaderPage from "../views/FullHeaderPage";
import Image from "next/legacy/image";
import { motion } from "framer-motion";
import FlipMove from 'react-flip-move';



export interface VibageTrack {
	name: string;
	trackId: string;
	artist: string;
	imageUrl: string;
	likes: any[];
}

export interface SpotifyCredentials {
	accessToken: string;
	refreshToken: string;
}

export interface Vibe {
	tracks: VibageTrack[];
	_id: string;
	spotifyCredentials: SpotifyCredentials;
	__v: number;
	playlistId: string;
}


interface TrackProps {
	track: VibageTrack;
	onLike: () => void;
}

const Track = ({ track, onLike }: TrackProps) => {
	return <div className={`w-full mb-2 py-1 px-5 flex border-b-2 border-gray-200
													justify-between items-center content-center text-vibage`}>
		<Image
			src={track.imageUrl}
			width={70}
			height={70}
			alt="track"
		/>
		<div className="flex-grow ml-4">
			<p className="text-2xl"> {track.name} </p>
			<p> {track.artist} </p>
		</div>
		<div>
			<button className={styles.btn} onClick={onLike}> Like </button>
			<p> Likes: {track.likes.length} </p>
		</div>
		<br />
	</div>
};

interface SearchTrackProps {
	track: SearchTrack;
	onClick: () => void;
}

const SearchTrack = ({ track, onClick }: SearchTrackProps) => {
	return <div onClick={onClick} className={`flex bg-vibage border-black border-2 mt-3 rounded-xl overflow-hidden
													hover:bg-vibageDark shadow-xl cursor-pointer`}>
		<Image
			src={track.imgUrl}
			width={70}
			height={70}
			alt="track"
		/>
		<div className="ml-2">
			<p className="text-xl"> {track.trackName} </p>
			<p> {track.artist}</p>
		</div>
	</div>
}

interface SearchModalProps {
	isOpen: boolean;
	onSelectTrack: (track: SearchTrack) => void;
	onClose: () => void;
}

const SearchModal = (props: SearchModalProps) => {
	const [query, setQuery] = useState("");
	const [tracks, setTracks] = useState<SearchTrack[]>([]);
	const [loading, setLoading] = useState(false);
	const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout>();

	const searchTracks = () => {
		setLoading(true);
		API.searchTracks(query).then(tracks => {
			setTracks(tracks);
			setLoading(false);
		});
	}

	const onQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const q = e.target.value;
		setQuery(q);
		if (debounceTimeout) {
			clearTimeout(debounceTimeout);
		}
		const timeout = setTimeout(searchTracks, 300);
		setDebounceTimeout(timeout);
	}

	useEffect(() => {
		return () => {
			if (debounceTimeout) {
				clearTimeout(debounceTimeout)
			}
		}
	}, [])

	const selectTrack = (track: SearchTrack) => {
		props.onSelectTrack(track);
		props.onClose();
	}

	return <div className={"fixed overflow-y-auto inset-0 p-10 z-10 " + (props.isOpen ? "block" : "hidden")} onClick={props.onClose}>
		<div className="fixed inset-0 backdrop-filter backdrop-blur-sm -z-1"></div>
		<div
			onClick={event => event.stopPropagation()}
			className={"border-white min-h-full border-2 bg-black z-20 p-20 rounded-xl"}
		>
			<h1 className="text-vibage  text-4xl text-center mb-4"> Search Spotify </h1>
			<div className="flex flex-col justify-items-stretch">
				<div className="relative">
					<div className="absolute h-full flex flex-col justify-center pl-2">
						<svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"
							className="w-8 h-8 text-vibage"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
					</div>
					<input
						value={query}
						onChange={onQueryChange}
						placeholder="Search"
						className="w-full border-2 bg-black text-white border-vibage rounded-xl
											 py-6 px-12 text-2xl "
					/>
				</div>
				{/* <FlipMove> */}
				{
					tracks.map((track, index) => <SearchTrack onClick={() => selectTrack(track)} track={track} key={index} />)
				}
				{/* </FlipMove> */}
			</div>
		</div>
	</div>
}

interface Props {
	vibe: Vibe;
}

const Vibage: NextPage<Props> = (props) => {
	const [vibe, setVibe] = useState(props.vibe);
	const [searchModalOpen, setSearchModalOpen] = useState(false);

	const likeTrack = async (trackId: string) => {
		const vibe = await API.likeTrack(trackId);
		setVibe(vibe);
	}

	const addTrack = async (track: SearchTrack) => {
		const vibe = await API.addSong(track.id);
		setVibe(vibe);
	}

	return <FullHeaderPage>
		<div className="pt-10 flex flex-col px-12 bg-black h-full">
			<h1 className={`text-vibage text-9xl text-center mb-4 ${styles.retroGlow}`}> Vibage </h1>
			{vibe.tracks.map(track => <Track track={track} onLike={() => likeTrack(track.trackId)} key={track.trackId} />)}
			<button className="bg-vibage rounded-full p-4 text-white" onClick={() => setSearchModalOpen(true)}> Add Song </button>
		</div>
		<SearchModal
			isOpen={searchModalOpen}
			onClose={() => setSearchModalOpen(false)}
			onSelectTrack={addTrack}
		/>
	</FullHeaderPage>
}

export async function getServerSideProps() {
	const data = await API.getVibe();
	return {
		props: {
			vibe: data,
		}
	}
}

export default Vibage;