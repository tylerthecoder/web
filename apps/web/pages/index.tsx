import useTypeyText from '../utils/hooks/useTypyText'
import headshotPic from "../public/headshot.webp"
import { CrazyImage } from '../components/CrazyImage'
import Image from "next/image";
import API, { CurrentSong } from '../services/api'
import { NowPlaying } from '../components/NowPlaying'
import { SplashBackground } from '../components/SpashBackground'
import Link from "next/link"
import { useEffect, useState, ButtonHTMLAttributes } from 'react';


const RESUME_URL = "https://cloud.tylertracy.com/index.php/apps/files/?dir=/docs&openfile=448";
const YOUTUBE_URL = "https://www.youtube.com/channel/UCUdKa40A3qNa1cN2gK9Qb8g";
const GITHUB_URL = "https://www.youtube.com/watch?v=QH2-TGUlwu4"


const Subtitle = () => {
  const { typedText, cursor } = useTypeyText("Full Stack Developer");

  return <div>
    <p className="text-white text-center text-xl h-8">
      {typedText}
      {cursor && <span className="w-0"> | </span>}
    </p>
  </div>
}

const HomButton = (props: ButtonHTMLAttributes<HTMLButtonElement> & { href: string, iconSrc: string, iconAlt: string }) => {
  return <Link href={props.href} passHref>
    <button
      className="
        py-2 px-4 font-semibold border-2 border-white
        rounded-lg shadow-md text-white bg-gray-400 bg-opacity-70
        transform scale-100 duration-150 hover:scale-110 hover:bg-opacity-90
        flex items-center justify-center
      "
    >
      <div
        className='mr-1'
      >
        <Image
          src={props.iconSrc}
          width={32}
          height={32}
          alt={props.iconAlt}
        />
      </div>
      {props.children}
    </button>
  </Link>
}

const Home = () => {
  const showAboutButton = false;
  const showProjectsButton = false;

  const [currentSong, setCurrentSong] = useState<CurrentSong | null>(null);

  const fetchData = async () => {
    const song = await API.getCurrentSong();
    setCurrentSong(song);
  }

  useEffect(() => {
    fetchData();
  }, [])


  return <div>
    <div className="w-full h-screen flex flex-col justify-center items-center bg-black">
      <div className="absolute top-0 bottom-0 left-0 right-0 pointer-events-none">
        <SplashBackground />
      </div>
      <div className="md:flex md:items-center z-0">
        <CrazyImage
          src={headshotPic}
          alt="Tyler's headshot"
          width={225}
          height={300}
        />
        <div>
          <h1 className="text-6xl text-white text-center"> Hi, I'm Tyler </h1>
          <Subtitle />
          {!!currentSong && <NowPlaying currentSong={currentSong} />}
        </div>
      </div>
      <div className="pt-20 flex justify-evenly w-full space-x-0">
        {showAboutButton &&
          <HomButton
            iconAlt=''
            iconSrc='/resume.svg'
            href={"about"}
          > About </HomButton>
        }

        <HomButton
          iconAlt='Github logo'
          iconSrc='/resume.svg'
          href={RESUME_URL}
        >
          Resume
        </HomButton>


        <HomButton
          href={"https://github.com/tylerthecoder"}
          iconSrc="/github.png"
          iconAlt="Github logo"
        >
          Github
        </HomButton>

        {showProjectsButton &&
          <HomButton
            iconSrc='/code.svg'
            iconAlt='Code symbol'
            href={"projects"}
          >
            Projects
          </HomButton>
        }
      </div>
    </div>
  </div>
}



export default Home