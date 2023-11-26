"use client";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Slider,
} from "@nextui-org/react";
import { useAddress } from "@thirdweb-dev/react";
import { useEffect, useState } from "react";
import { FaPause, FaPlay } from "react-icons/fa";
import { FaEthereum } from "react-icons/fa";

export default function NftCard({
  nft,
  onPressFunction,
  buttonText,
  actionDisabled,
}) {
  const [audio] = useState(new Audio(nft.audio));
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    audio.addEventListener("loadedmetadata", () => {
      setDuration(audio.duration);
    });

    audio.addEventListener("timeupdate", () => {
      setCurrentTime(audio.currentTime);
    });
  }, [audio]);

  function togglePlayPause() {
    const toggle = !isPlaying;
    setIsPlaying(toggle);
    toggle ? audio.play() : audio.pause();
  }

  function onSliderChange(value) {
    audio.currentTime = value;
    setCurrentTime(value);
  }

  function formatTime(timeInSeconds) {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);

    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

    return `${formattedMinutes}:${formattedSeconds}`;
  }

  return (
    <Card className="w-full" shadow="sm">
      <CardHeader className="font-semibold">{nft.name}</CardHeader>
      <Divider />
      <CardBody>
        <h1 className="opacity-70">Description:</h1>
        <p>{nft.description}</p>
      </CardBody>
      <CardFooter className="flex justify-between">
        <div className="flex w-full items-center">
          <Button
            isIconOnly
            radius="full"
            onClick={togglePlayPause}
            aria-label="play"
          >
            {isPlaying ? <FaPause /> : <FaPlay />}
          </Button>

          <Slider
            startContent={formatTime(audio.currentTime.toLocaleString())}
            endContent={formatTime(audio.duration)}
            size="sm"
            color="foreground"
            min={0}
            max={duration}
            value={currentTime}
            onChange={onSliderChange}
            className="px-4 w-11/12"
            aria-label="slider"
          />
        </div>
        <Button
          isDisabled={actionDisabled}
          color="secondary"
          className="text-white"
          onClick={() => onPressFunction(nft)}
          aria-label="buy-button"
        >
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
}
