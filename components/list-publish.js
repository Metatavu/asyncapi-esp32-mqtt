import { Publish } from './publish';

/**
 * Component for rendering list of publish channels
 * 
 * @param {object} component props
 * @returns rendered list of publish channels
 */
export function ListPublish({ channels, headerOnly }) {
  return Object.entries(channels)
    .filter(([_channelName, channel]) => channel.hasPublish())
    .map(([channelName, channel]) => {
      return  (
        <Publish channelName={ channelName } channel={ channel } headerOnly={ headerOnly }/>
      );
    })
    .filter(Boolean);
}
