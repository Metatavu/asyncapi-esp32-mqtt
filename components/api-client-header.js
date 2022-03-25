import { ListPublish } from './list-publish';

/**
 * Renders api client header file contents
 * 
 * @param {object} component props
 * @returns rendered api client header file contents
 */
export function ApiClientHeader({ asyncapi }) {
  const channels = asyncapi.channels();

  return (
    <>
      <ListPublish channels={channels} headerOnly={ true }/>
    </>
  );
}