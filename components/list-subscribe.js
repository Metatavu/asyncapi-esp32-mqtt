import { Subscribe } from './subscribe';

/**
 * Component for rendering list of subscribe channels
 * 
 * @param {object} component props
 * @returns rendered list of subscribe channels
 */
export function ListSubscribe({ channels, headerOnly }) {
  return Object.entries(channels)
    .filter(([_channelName, channel]) => channel.hasSubscribe())
    .map(([channelName, channel]) => {
      return  (
        <Subscribe channelName={channelName} channel={ channel } headerOnly={ headerOnly }/>
      );
    })
    .filter(Boolean);
}
