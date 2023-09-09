import { Config } from "../app/config";
import { Vibe } from "../pages/vibage";

export const SERVER_URL = Config.apiUrl;

export type CurrentSong = {
	state: string;
	name: string;
	artistName: string;
	imageUrl: string;
}

export type Creation = {
	name: string;
	description: string;
	link: string;
	type: string;
	img: string;
}


export type SearchTrack = {
	trackName: string,
	imgUrl: string,
	artist: string,
	id: string;
}

export type Blog = {
	id: string;
	title: string;
	content: string;
}

class ApiClass {
	async getCurrentSong(): Promise<CurrentSong> {
		const res = await fetch(`${SERVER_URL}/me/listening-to`)
		const data = await res.json();
		return data;
	}

	async getBlog(id: string): Promise<Blog> {
		const res = await fetch(`${SERVER_URL}/blog/${id}`)
		const data = await res.json();
		return data;
	}

	async getAllBlogs(): Promise<Blog[]> {
		const res = await fetch(`${SERVER_URL}/blog`)
		const data = await res.json();
		return data;
	}

	async getCreations(): Promise<Creation[]> {
		const res = await fetch(`${SERVER_URL}/me/creations`)
		const data = await res.json();
		return data;
	}

	async getLights(): Promise<any[]> {
		const res = await fetch(`${SERVER_URL}/lights`);
		return res.json();
	}

	async getVibe(): Promise<Vibe> {
		const res = await fetch(`${SERVER_URL}/vibage`);
		return res.json();
	}

	async searchTracks(query: string): Promise<SearchTrack[]> {
		const res = await fetch(`${SERVER_URL}/vibage/search?q=${query}`);
		return res.json();
	}

	async addSong(trackId: string): Promise<Vibe> {
		const res = await fetch(`${SERVER_URL}/vibage/track/`, {
			method: "POST",
			body: JSON.stringify({
				trackId
			}),
			headers: {
				"Content-Type": "application/json"
			}
		});
		return res.json();
	}

	async likeTrack(trackId: string): Promise<Vibe> {
		const res = await fetch(`${SERVER_URL}/vibage/track/${trackId}/like`, {
			method: 'POST',
		});
		return res.json();
	}
}

const API = new ApiClass();
export default API;
