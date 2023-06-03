import useTypeyText from '../utils/hooks/useTypyText'
import headshotPic from "../public/headshot.webp"
import { CrazyImage } from '../components/CrazyImage'
import Image from "next/legacy/image";
import API, { CurrentSong } from '../services/api'
import { NowPlaying } from '../components/NowPlaying'
import { SplashBackground } from '../components/SpashBackground'
import Link from "next/link"
import { useEffect, useState, ButtonHTMLAttributes } from 'react';

const Subtitle = () => {
  const { typedText, cursor } = useTypeyText("Full Stack Developer");

  return <div>
    <p className="h-8 text-xl text-center text-white">
      {typedText}
      {cursor && <span className="w-0"> | </span>}
    </p>
  </div>
}

const HomButton = (props: ButtonHTMLAttributes<HTMLButtonElement> & { href: string, iconSrc: string, iconAlt: string }) => {
  return <Link href={props.href} passHref>
    <button
      {...props}
      className="flex items-center justify-center px-4 py-2 font-semibold text-white bg-gray-400 border-2 border-white rounded-lg shadow-md  bg-opacity-70 transform scale-100 duration-150 hover:scale-110 hover:bg-opacity-90"
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
  const showProjectsButton = true;

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
    <div className="flex flex-col items-center justify-center w-full h-screen bg-black">
          src={headshotPic}
          alt="Tyler's headshot"
          width={225}
      <div className="z-0 md:flex md:items-center">
        />
        <div>
          <h1 className="text-6xl text-white text-center"> Hi, I'm Tyler </h1>
          <Subtitle />
          {!!currentSong && <NowPlaying currentSong={currentSong} />}
        </div>
      </div>
          <h1 className="text-6xl text-center text-white"> Hi, I'm Tyler </h1>
        {showAboutButton &&
          <HomButton
            iconAlt='Github logo'
            iconSrc='/resume.svg'
      <div className="flex w-full pt-20 justify-evenly space-x-0">
          > About </HomButton>
        }

        <HomButton
          iconAlt='Github logo'
          iconSrc='/resume.svg'
          href={"https://cloud.tylertracy.com/index.php/s/L79yp5wcqXSdKML"}
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
