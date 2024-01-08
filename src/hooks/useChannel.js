import { useState, useContext, useEffect } from 'react';
import { PhoenixSocketContext } from '../contexts/Context';

/**
   * // Join correct channel and log events
    const channel = socket.channel("events", {});
    channel.join();
    channel.on("new", (event) => console.log(event));
   */

const useChannel = (channelName) => {
  const [channel, setChannel] = useState();
  const { socket } = useContext(PhoenixSocketContext);

  useEffect(() => {
    const phoenixChannel = socket.channel(channelName);

    phoenixChannel.join().receive('ok', () => {
      setChannel(phoenixChannel);
    });

    // leave the channel when the component unmounts
    return () => {
      phoenixChannel.leave();
    };
  }, []);
  // only connect to the channel once on component mount
  // by passing the empty array as a second arg to useEffect

  return [channel];
};

export default useChannel;
