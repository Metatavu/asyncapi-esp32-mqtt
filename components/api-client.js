import { ListPublish } from './list-publish';
import { ListSubscribe } from './list-subscribe';
import { Includes } from './includes';

/**
 * Renders api client file contents
 * 
 * @param {object} component props
 * @returns rendered api client file contents
 */
export function ApiClient({ asyncapi }) {
  const channels = asyncapi.channels();

  return (
    <>
      <Includes />
      <ListPublish channels={channels} headerOnly={ false }/>
      <ListSubscribe channels={channels} headerOnly={ false }/>
    </>
  );
}